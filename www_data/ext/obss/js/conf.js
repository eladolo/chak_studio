window.obss = (function(){
    var twitch = window.Twitch.ext;
    var root = this;
    var debug = false;
    var endpoint = 'https://apiext.chakstudio.com/';

    var _set_lang = function(){
        $.each(window.lang[lang_code], function(index, val) {
            if(index.indexOf("_select_") > -1){
                $("." + index).attr("data-tooltip", val);
                $("." + index + " option[value=\"\"]").html(val);
            } else if(index.indexOf("_tooltiped") > -1){
                $("." + index).attr("data-tooltip", val);
            } else {
                $("." + index).html(val);
            }
        });
    };
    var _init = function(){
        $('.tooltiped').tooltip({
            out: 3000,
            html: true
        });

        $('ul.tabs').tabs();

        $('.btnSave').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function(){
            if($('#obs_url').val() === '' || $('#obs_pass').val() === ''){
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_empty : "Don´t let any field empty"), 4000);
                return;
            }

            var jwt = signJWT({"url": runSanitizer($('#obs_url').val()),"password": runSanitizer($('#obs_pass').val())});
            window.Twitch.ext.configuration.set("broadcaster", "0.1", jwt);
            Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_config_save : "<p>Configuration <b class=\"green-text\">saved</b>!</p>"), 4000);
        });

        $('.btnSendFeedback').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function(){
            if($("#feedback_text").val() === ""){
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_empty : "Don´t let feedback empty"), 3000);
                return;
            }

            $.ajax({
                url: endpoint,
                type: 'POST',
                data: {
                    'm': 'feedback',
                    'version': 'obss',
                    'client': auth.clientId,
                    'channel': auth.channelId,
                    'user': auth.userId,
                    'msg': runSanitizer($("#feedback_text").val())
                },
                dataType: 'json',
                success: function(res){
                    if(res.success){
                        $("#feedback_text").val("");
                        Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_ok : "Thanks for your feedback. ASAP I will try to address your comments."), 3000);
                    } else {
                        Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_feedback_error : "Sorry, but something wrong happends and can´t send feedback in this moment."), 3000);
                    }
                }
            });
        });

        $('.checkURL').on('focusout', function() {
            var element = $(this);
            if (element.hasClass('checkURL')) {
                if (element.val() !== '' && element.val().indexOf('wss://') < 0) {
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_invalid_format : '<p>Invalid format<br>Please check your url</p>'), 3000);
                    element.val('wss://' + element.val());
                    return false;
                }
            }
        });

        twitch.onAuthorized(function(auth) {
            $.ajax({
                url: endpoint,
                type: 'POST',
                data: {
                    'm': 'getconfig',
                    'version': 'obss',
                    'client': auth.clientId,
                    'channel': auth.channelId,
                    'user': auth.userId,
                    'token': auth.token
                },
                dataType: 'json',
                success: function(res){
                    if(typeof res.response["broadcaster:" + auth.channelId] != "undefined"){
                        var tmp_content = res.response["broadcaster:" + auth.channelId].record.content;
                        if(verifyJWT(tmp_content)){
                            tmp_content = decodeJWT(tmp_content);
                            $('#obs_url').val(tmp_content.url);
                            $('#obs_pass').val(tmp_content.password);

                            root.auth = auth;
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
    };

    return {
        'setLang': _set_lang,
        'init': _init,
    };
})();

$(function(){
    var url = new URL(window.location.href);
    window.lang_code = url.searchParams.get("language");

    if(typeof window.lang[lang_code] != "undefined"){
        obss.setLang();
    }
    obss.init();
});