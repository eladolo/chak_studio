window.pianoon = (function() {
    var twitch = window.Twitch.ext;
    var root = this;
    var debug = false;
    var check_command = [];
    var endpoint = 'https://apiext.chakstudio.com/';

    var send_text = function(msg) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'sendText',
                'version': 'pianoon',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'msg': msg,
                'appv': '0.02'
            },
            dataType: 'json',
            success: function(res) {}
        });
    };

    var send_action = function(msg, data, target) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'transmitMessage',
                'version': 'pianoon',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'msg': msg,
                'data': data,
                'target': target,
                'appv': '0.02'
            },
            dataType: 'json',
            success: function(res) {
            }
        });
    };

    var scalenotes = function(scale) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'scalenotes',
                'version': 'pianoon',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'scale': encodeURI(scale),
                'appv': '0.0.1'
            },
            dataType: 'json',
            success: function(res) {
                if(debug) console.log(res);
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "playnotes", "data": res.response.data}));
                send_text(res.response.data);
            }
        });
    };

    var chordnotes = function(chord) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'chordnotes',
                'version': 'pianoon',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'scale': encodeURI(chord),
                'appv': '0.0.1'
            },
            dataType: 'json',
            success: function(res) {
                if(debug) console.log(res);
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "playchords", "data": res.response.data}));
                send_text(res.response.data);
            }
        });
    };

    var _set_lang = function() {
        $.each(window.lang[lang_code], function(index, val) {
            if (index.indexOf("_select_") > -1) {
                $("." + index).attr("data-tooltip", val);
                $("." + index + " option[value=\"\"]").html(val);
            } else if (index.indexOf("_tooltip") > -1) {
                $("." + index).attr("data-tooltip", val);
            } else {
                $("." + index).html(val);
            }
        });
    };

    var _init = function() {
        $('.tooltiped').tooltip({
            "html" : true
        });
        $('ul.tabs').tabs();
        $('.modal').modal();

        $('.tab a').on('click', function(){
            var tmp_val = $(this).attr('href');
            if(debug) console.log(tmp_val + " table");
            setTimeout(function(){
                if(debug) console.log($(tmp_val + " table").css("height"));
                $(".content_overflow").niceScroll().resize();
            }, 800);
        });

        $('.btnPlayScale').off('click').on('click', function(e) {
            var tmp_scale = $('#note_select').val() + $('#alterations_select').val() + " " + $('#mode_select').val();
            scalenotes(tmp_scale);
        });

        $('.btnPlayChord').off('click').on('click', function(e) {
            var tmp_chord = $('#note_select').val() + $('#alterations_select').val() + " " + $('#second_select').val() + "***" + $('#fourth_select').val() + "***" + $('#six_select').val() + "***" + $('#third_select').val() + "***" + $('#fith_select').val() + "***" + $('#seven_select').val() + "***" + $('#nine_select').val() + "***" + $('#eleven_select').val() + "***" + $('#thirteen_select').val();
            chordnotes(tmp_chord);
        });

        $('.btnPlayNotes').off('click').on('click', function(e) {
            if ($("#custom_notes").val() === "") {
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_custom_notes_empty : "Don´t let custom notes empty"), 3000);
                return;
            }
            var tmp_notes = runSanitizer($('#custom_notes').val());
            twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "playnotes", "data": tmp_notes}));
            send_text(tmp_notes);
        });

        //Twitch helpers
        twitch.onAuthorized(function(auth) {
            root.auth = auth;
            sessionStorage.twitchOAuthToken = auth.token;
            if (debug) console.log(auth);
            $.ajax({
                url: endpoint,
                type: 'POST',
                data: {
                    'm': 'getconfig',
                    'version': 'pianoon',
                    'client': auth.clientId,
                    'channel': auth.channelId,
                    'user': auth.userId,
                    'token': auth.token
                },
                dataType: 'json',
                success: function(res) {
                    if (typeof res.response["broadcaster:" + auth.channelId] != "undefined") {
                        var tmp_content = res.response["broadcaster:" + auth.channelId].record.content;
                        if (verifyJWT(tmp_content)) {
                            if (typeof tmp_content != "undefined") {
                            }
                        }
                    }


                }
            });
        });

        twitch.onContext(function(context, attr) {
            if(context.theme == "dark"){
                $("body").addClass('dark_theme');
            } else {
                $("body").removeClass('dark_theme');
            }
        });

        twitch.listen("broadcast", function(target, contentType, object) {
            object = JSON.parse(object);
            if (debug) console.log(object);
            if (object.msg == "sendText" && twitch.viewer.role == object.target && $.inArray(object.id, check_command) == -1) {
                send_text(object.data);
                check_command.push(object.id);
            }
        });
    };

    return {
        'setLang': _set_lang,
        'init': _init
    };
})();

$(function() {
    var url = new URL(window.location.href);
    window.lang_code = url.searchParams.get("language");

    if (typeof window.lang[lang_code] != "undefined") {
        pianoon.setLang();
    }
    pianoon.init();
});