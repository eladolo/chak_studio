window.pupface = (function() {
    var twitch = window.Twitch.ext;
    var root = this;
    var debug = true;
    var endpoint = 'https://api.amznws.access.ly/';

    var _buildLeaderboard = function(data){
        if(debug) console.log(data);
        var tmp_users10 = data.top10users;
        var tmp_imgs10 = data.top10img;
        var tmp_bits10 = data.top10bits;

        $('.tb_views tbody, .tb_pups tbody, .tb_bits tbody').html('');

        $.each(tmp_users10, function(index, val) {
            var tmp_tr = '<tr><td>' + val.username + '</td><td>' + val.bits + '</td></tr>';
            $('.tb_views tbody').append(tmp_tr);
        });

        $.each(tmp_imgs10, function(index, val) {
            tmp_tr = '<tr><td><div><img class="circle spin_img" style="width: 32px; height: 32px;" alt="' + val.img + '" src="' + val.img + '" /></div></td><td>' + val.times + '</td><td>' + val.spend + '</td></tr>';
            $('.tb_pups tbody').append(tmp_tr);
        });

        $.each(tmp_bits10, function(index, val) {
            tmp_tr = '<tr><td>' + val.bits + '</td><td>' + val.times + '</td></tr>';
            $('.tb_bits tbody').append(tmp_tr);
        });

        $(".content_overflow").niceScroll().resize();
    };

    var _set_lang = function() {
        $.each(window.lang[lang_code], function(index, val) {
            if (index.indexOf("_select_") > -1) {
                $("." + index).attr("data-tooltip", val);
                $("." + index + " option[value=\"\"]").html(val);
            } else if (index.indexOf("config_timeout") > -1) {
                $("." + index).attr("data-tooltip", val);
            } else {
                $("." + index).html(val);
            }
        });
    };

    var _init = function() {
        $(".content_overflow").niceScroll({
            cursorcolor:"pink",
            cursorwidth:"16px",
            cursorborderradius:2,
            autohidemode:'leave'
        });

        $('.tooltiped').tooltip();
        $('ul.tabs').tabs();
        $('.modal').modal();

        $('.tab a').on('click', function(){
            var tmp_val = $(this).attr('href');
            if(debug) console.log(tmp_val + " table");
            setTimeout(function(){
                if(debug) console.log($(tmp_val + " table").css("height"));
                //$(".content_overflow").css("height", $(tmp_val + " table").css("height"));
                $(".content_overflow").niceScroll().resize();
            }, 800);
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
                    'm': 'getLeaderboard',
                    'version': 'pupface',
                    'channel': auth.channelId,
                    'token': auth.token
                },
                dataType: 'json',
                success: function(res) {
                    if (res.response.success) {
                        var tmp_content = res.response;
                        _buildLeaderboard(tmp_content);
                    }
                }
            });
        });

        twitch.onContext(function(context, attr) {
            if (context.mode == "viewer") {
                $('html,body').addClass('overlay-font-s');
                $('.btn, .btn-large:not(.toast)').addClass('overlay-btns');
            }
            if(context.theme == "dark"){
                $("body").addClass('dark_theme');
            } else {
                $("body").removeClass('dark_theme');
            }
        });

        $(window).resize(function() {
            $(".content_overflow").niceScroll().resize();
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
        pupface.setLang();
    }
    pupface.init();
});