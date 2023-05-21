window.pianoon = (function() {
    var twitch = window.Twitch.ext;
    var root = this;
    var debug = false;
    var endpoint = 'https://apiext.chakstudio.com/';

    var update_settings = function(jwt, from) {
        if(typeof from != "undefined"){
            window.Twitch.ext.configuration.set("broadcaster", "0.1", jwt);
        } else {
            $.ajax({
                url: endpoint,
                type: 'POST',
                data: {
                    'm': 'updateconfig',
                    'version': 'pianoon',
                    'client': root.auth.clientId,
                    'channel': root.auth.channelId,
                    'user': root.auth.userId,
                    'token': root.auth.token,
                    'jwt': jwt,
                    'appv': '0.0.1'
                },
                dataType: 'json',
                success: function(res) {}
            });
        }
    };

    var refreshSetting = function() {
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
                        twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "updateConfig"}));
                        tmp_content = decodeJWT(tmp_content);
                        if (debug) console.log(tmp_content);

                        $("#pianoon_power").prop("checked", (tmp_content.poweron == "1" ? true : false));
                        $("#viewer_btn").val(tmp_content.viewerbtn);
                        $("#scale_notes_bits").val(tmp_content.scale_notes_bits);
                        $("#chord_notes_bits").val(tmp_content.chord_notes_bits);
                        $("#custom_notes_bits").val(tmp_content.custom_notes_bits);
                        $("#playnote_color").val(tmp_content.playnote_color);

                        $("#pianoon_power").trigger('change');
                        $('select').material_select('update');
                    }
                } else {
                    var tmp_config = {};
                    tmp_config.poweron = "1";
                    tmp_config.viewerbtn = 'tleft';
                    tmp_config.scale_notes_bits = "0";
                    tmp_config.chord_notes_bits = "0";
                    tmp_config.custom_notes_bits = "0";
                    tmp_config.playnote_color = "#FF1FF1";

                    $("#pianoon_power").prop("checked", true);
                    $("#viewer_btn").val('tleft');
                    $("#scale_notes_bits").val("0");
                    $("#chord_notes_bits").val("0");
                    $("#custom_notes_bits").val("0");
                    $("#playnote_color").val("#FF1FF1");

                    $("#pianoon_power").trigger('change');
                    $('select').material_select('update');

                    var jwt = signJWT(tmp_config);
                    update_settings(jwt);
                    setTimeout(refreshSetting, 800);
                }
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
        //Helpers
        $('.tooltiped').tooltip({
            html: true
        });
        $('select').material_select();
        $('ul.tabs').tabs();

        $('.btnSave').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function() {
            var tmp_config = {};

            tmp_config.poweron = ($("#pianoon_power").prop("checked") ? "1" : "0");
            tmp_config.viewerbtn = $("#viewer_btn").val();
            tmp_config.scale_notes_bits = $("#scale_notes_bits").val();
            tmp_config.chord_notes_bits = $("#chord_notes_bits").val();
            tmp_config.custom_notes_bits = $("#custom_notes_bits").val();
            tmp_config.playnote_color = runSanitizer($("#playnote_color").val());

            var jwt = signJWT(tmp_config);
            update_settings(jwt);
            twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "updateConfig"}));
            Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_config_save : '<p>Configuration <b class="green-text">Saved</b>!</p>'), 4000);
        });

        $('.btnSendFeedback').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function() {
            if ($("#feedback_text").val() === "") {
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_empty : "Don´t let feedback empty"), 3000);
                return;
            }

            $.ajax({
                url: endpoint,
                type: 'POST',
                data: {
                    'm': 'feedback',
                    'version': 'pianoon',
                    'client': auth.clientId,
                    'channel': auth.channelId,
                    'user': auth.userId,
                    'msg': runSanitizer($("#feedback_text").val())
                },
                dataType: 'json',
                success: function(res) {
                    if (res.success) {
                        $("#feedback_text").val("");
                        Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_ok : "Thanks for your feedback. ASAP I will try to address your comments."), 3000);
                    } else {
                        Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_error : "Sorry, but something wrong happends and can´t send feedback in this moment."), 3000);
                    }
                }
            });
        });

        $('#pianoon_power').off('change').on('change', function() {
            if ($(this).prop("checked")) {
                $('.pianoon_on, .pianoon_posicion').removeClass('hide');
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "pianoonOn"}));
            } else {
                $('.pianoon_on, .pianoon_posicion').addClass('hide');
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "pianoonOff"}));
            }
            $('.btnSave').trigger('click');
        });

        //color-picker.js
        var picker1 = new CP(document.querySelector('input[id="playnote_color"]'));
        picker1.on("change", function(color) {
            this.target.value = '#' + color;
        });

        //Twitch helpers
        twitch.onAuthorized(function(auth) {
            root.auth = auth;
            refreshSetting();
        });

        twitch.onContext(function(context, attr) {
            if(context.theme == "dark"){
                $("body").addClass('dark_theme');
            } else {
                $("body").removeClass('dark_theme');
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