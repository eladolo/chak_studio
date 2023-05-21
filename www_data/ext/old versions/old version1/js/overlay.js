window.pupface = (function(){
    var twitch = window.Twitch.ext;
    var root = this;
    var alert_interval = undefined;
    var debug = true;

    var ejecuta_alert = function(alertIndex){
        var tmp_conf = alerts[alertIndex];

        $('.content_img img').prop("src", "");
        $('.content_img .spin, .content_img .static, #content-preview, #content-send, .tabs').addClass('hide');
        $('.content_img').removeClass('top').removeClass('center').removeClass('bottom').removeClass('right').removeClass('left').removeClass('parent_overlap');
        $('.content_img img, .content_img .alert_body').removeClass('round').removeClass('overlap').removeClass('transparent');
        $('.content_img').hide();
        if(typeof alert_interval != "undefined") clearInterval(alert_interval);

        if(tmp_conf.alert_status == "0") return true;

        if($("#alert_css").length > 0) $("#alert_css").remove();

        var alert_reset = function(end_conf){
            if(end_conf.type_img == "static") {
                $('.content_img .static').addClass('hide');
            }
            if(end_conf.type_img == "spin") {
                $('.content_img .spin').addClass('hide');
            }
            if($('#audioAlert').length > 0) {
                audioElement.pause();
                $('#audioAlert').remove();
            }
            if($('#videoAlert').length > 0) {
                $('#videoAlert').remove();
            }
            $('.overlay_custom').css('z-index', '-1');
            $('#content-preview, #content-send, .tabs').removeClass('hide');
            $('.alert_body').html('');
        };

        var alert_end = function(){
            var end_conf = tmp_conf;
            alert_interval = setInterval(function(){
                if(end_conf.alert_fadeout == "fadeout") {
                    $('.content_img').fadeOut('fast', function(){
                        alert_reset(end_conf);
                    });
                }
                if(end_conf.alert_fadeout == "slideup") {
                    $('.content_img').slideUp('fast', function(){
                        alert_reset(end_conf);
                    });
                }
                clearInterval(alert_interval);
            }, end_conf.timer_time * 1000);
        };

        $('.alert_body').html('');

        $("<style type='text/css' id='alert_css'> @-webkit-keyframes glow {from {text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_light + ", 0 0 40px " + tmp_conf.glow_light + ", 0 0 50px " + tmp_conf.glow_light + ", 0 0 60px " + tmp_conf.glow_light + ", 0 0 70px " + tmp_conf.glow_light + ";}to {text-shadow: 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_hard + ", 0 0 40px " + tmp_conf.glow_hard + ", 0 0 50px " + tmp_conf.glow_hard + ", 0 0 60px " + tmp_conf.glow_hard + ", 0 0 70px " + tmp_conf.glow_hard + ", 0 0 80px " + tmp_conf.glow_hard + ";}} @-webkit-keyframes glow_img {from {box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_light + ", 0 0 40px " + tmp_conf.glow_light + ", 0 0 50px " + tmp_conf.glow_light + ", 0 0 60px " + tmp_conf.glow_light + ", 0 0 70px " + tmp_conf.glow_light + ";}to {box-shadow: 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_hard + ", 0 0 40px " + tmp_conf.glow_hard + ", 0 0 50px " + tmp_conf.glow_hard + ", 0 0 60px " + tmp_conf.glow_hard + ", 0 0 70px " + tmp_conf.glow_hard + ", 0 0 80px " + tmp_conf.glow_hard + ";}} .spin_img {box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_light + ", 0 0 40px " + tmp_conf.glow_light + ", 0 0 50px " + tmp_conf.glow_light + ", 0 0 60px " + tmp_conf.glow_light + ", 0 0 70px " + tmp_conf.glow_light + ";} .spin_img:hover {box-shadow: 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_hard + ", 0 0 40px " + tmp_conf.glow_hard + ", 0 0 50px " + tmp_conf.glow_hard + ", 0 0 60px " + tmp_conf.glow_hard + ", 0 0 70px " + tmp_conf.glow_hard + ", 0 0 80px " + tmp_conf.glow_hard + ";} </style>").appendTo("head");

        if(tmp_conf.body !== ""){
            var tmp_body = decodeURI(tmp_conf.body);
            $('.alert_body').html(tmp_body);
        }
        if(typeof tmp_conf.audio_url != "undefined" && tmp_conf.audio_url !== ""){
            if($('#audioAlert').length > 0) $('#audioAlert').remove();
            window.audioElement = document.createElement('audio');
            audioElement.id = "audioAlert";
            audioElement.setAttribute('src', tmp_conf.audio_url);

            audioElement.addEventListener('canplay', function() {
                this.play();
            }, false);
            document.body.appendChild(audioElement);
        }
        if(typeof tmp_conf.img_url != "undefined" && tmp_conf.img_url !== ""){
            $('.content_img img').prop("src", tmp_conf.img_url);
        }
        if(typeof tmp_conf.video_url != "undefined" && tmp_conf.video_url !== ""){
            if($('#videoAlert').length > 0) $('#videoAlert').remove();
            $('<iframe>', {
                src: 'https://www.youtube.com/embed/' + tmp_conf.video_url + '?autoplay=1&controls=0',
                id:  'videoAlert',
                frameborder: 0,
                scrolling: 'no',
                allow: 'autoplay; encrypted-media',
                allowfullscreen: true
            }).appendTo('.alert_body');
        }

        if(tmp_conf.alert_position == "center") {
            $('.content_img').addClass('center');
        }
        if(tmp_conf.alert_position == "tleft") {
            $('.content_img').addClass('top').addClass('left');
        }
        if(tmp_conf.alert_position == "tright") {
            $('.content_img').addClass('top').addClass('right');
        }
        if(tmp_conf.alert_position == "bleft") {
            $('.content_img').addClass('bottom').addClass('left');
        }
        if(tmp_conf.alert_position == "bright") {
            $('.content_img').addClass('bottom').addClass('right');
        }
        if(tmp_conf.type_img == "static") {
            $('.content_img .static').removeClass('hide');
        }
        if(tmp_conf.type_img == "spin") {
            $('.content_img .spin').removeClass('hide');
        }
        if(tmp_conf.shape_img == "round") {
            $('.content_img img').addClass('round');
        }

        if(typeof tmp_conf.video_url != "undefined" && tmp_conf.video_url !== "" && typeof tmp_conf.body != "undefined" && tmp_conf.body !== ""){
            $('.content_img').removeClass('top').removeClass('center').removeClass('bottom').removeClass('right').removeClass('left').removeClass('parent_overlap');
            $('.content_img').addClass('center').addClass('parent_overlap');
            $('.content_img img, .content_img .alert_body').addClass('overlap').addClass('transparent');
        }

        if(tmp_conf.alert_fadein == "fadein") {
            $('.content_img').fadeIn('slow', alert_end);
        }
        if(tmp_conf.alert_fadein == "slidedown") {
            $('.content_img').slideDown('slow', alert_end);
        }

        $('.overlay_custom').css('z-index', '10');

        return false;
    };

    var send_text = function(msg){
        $.ajax({
            url: 'https://obss.amznws.access.ly/',
            type: 'POST',
            data: {
                'm': 'sendText',
                'version': 'pupface',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'msg': msg,
                'appv': '0.0.1'
            },
            dataType: 'json',
            success: function(res){
            }
        });
    };

    var buildButtons = function(){
        $('#content-preview, #content-send').html('');
        $.each(alerts, function(index, val) {
            var tmp_button = "<img class='btnPreview circle' style='width: 128px; height: 128px; cursor: pointer;' data-index='" + index + "' src='" + alerts[index].img_url + "' />";
            $('#content-preview').append(tmp_button);

            tmp_button = "<img class='btnSend circle' style='width: 128px; height: 128px; cursor: pointer;' data-index='" + index + "' src='" + alerts[index].img_url + "' />";
            $('#content-send').append(tmp_button);
        });
    };

    var _init = function(){
        $(document.body).addClass('on').addClass('cursor').removeClass('hide').off('click', '.btnDecline').on('click', '.btnSend', function(){
            var bitsValue = ['1','10','100','1000','5000','10,000'];
            Materialize.toast('<p>You are gonna send this pupface for <b class="red-text">' + bitsValue[$(this).attr('data-index')] + '</b> bits<br> Are u sure? <img src="' + alerts[$(this).attr('data-index')].img_url + '" style="width:48px; height: 48px;" class="circle"/><br><br><a class="btnAccept green white-text btn">Yes</a> &nbsp;&nbsp; <a class="btnDecline red white-text btn">No</a></p>', 6000);
            $('.btnAccept').off('click').on('click', function(){
                twitch.bits.useBits($(this).attr('data-index'));
                $(this).parent().parent().remove();
            });

            $('.btnDecline').off('click').on('click', function(){
                $(this).parent().parent().remove();
            });
        }).off('mouseover', '.btnDecline').on('mouseover', '.btnDecline', function(){
            $(this).stop().animate({
                'width': '132px',
                'height': '132px'
            }, 'fast');
        }).off('mouseout', '.btnDecline').on('mouseout', '.btnDecline', function(){
            $(this).stop().animate({
                'width': '128px',
                'height': '128px'
            }, 'fast');
        });

        $(document.body).addClass('on').addClass('cursor').removeClass('hide').off('click', '.btnPreview').on('click', '.btnPreview', function(){
            ejecuta_alert($(this).attr('data-index'));
            if(debug) twitch.send("broadcast", "application/json", JSON.stringify({"msg" : "sendText", "data" : "thanks for that pup OhMyDog "}));
        }).off('mouseover', '.btnPreview').on('mouseover', '.btnPreview', function(){
            $(this).stop().animate({
                'width': 132,
                'height': 132
            }, 'fast');
        }).off('mouseout', '.btnPreview').on('mouseout', '.btnPreview', function(){
            $(this).stop().animate({
                'width': 128,
                'height': 128
            }, 'fast');
        });

        $(document.body).off('mouseover').on('mouseover', function(){
            $('.form_view').stop().animate({
                'opacity': 1
            }, 'fast');
        }).off('mouseout').on('mouseout', function(){
            $('.form_view').stop().animate({
                'opacity': 0.1
            }, 'fast');
        });

        $('.tooltiped').tooltip();
        $('ul.tabs').tabs();

        //Twitch helpers
        twitch.onAuthorized(function(auth) {
            root.auth = auth;
            if(debug) console.log(auth);
            var tmp_content = twitch.configuration.broadcaster;
            if(typeof  tmp_content != "undefined"){
                if(debug) console.log(tmp_content);
                tmp_content = tmp_content.content;

                if(verifyJWT(tmp_content)){
                    tmp_content = decodeJWT(tmp_content);
                    $.each(alerts, function(index, val) {
                        var tmp_index = index + 1;
                        alerts[index].img_url = tmp_content["tier" + tmp_index + "_img"];
                        alerts[index].body = tmp_content["tier" + tmp_index + "_body"];
                        alerts[index].glow_light = tmp_content["tier" + tmp_index + "_glow_light"];
                        alerts[index].glow_hard = tmp_content["tier" + tmp_index + "_glow_hard"];
                        alerts[index].alert_position = tmp_content["tier" + tmp_index + "_position"];
                        alerts[index].alert_fadein = tmp_content["tier" + tmp_index + "_fadein"];
                        alerts[index].alert_fadeout = tmp_content["tier" + tmp_index + "_fadeout"];
                        alerts[index].type_img = tmp_content["tier" + tmp_index + "_type_img"];
                        alerts[index].shape_img = tmp_content["tier" + tmp_index + "_shape_img"];
                        alerts[index].audio_url = tmp_content["tier" + tmp_index + "_audio_url"];
                        alerts[index].video_url = tmp_content["tier" + tmp_index + "_video_url"];
                        alerts[index].timer_time = tmp_content["tier" + tmp_index + "_timer_time"];
                    });

                    twitch.bits.getProducts().then(function(products){
                        root.products = products;
                    });

                    buildButtons();
                }
            }
        });

        twitch.onContext(function(context, attr) {
            if(context.mode == "viewer"){
                $('html,body').addClass('overlay-font-s');
                $('.btn, .btn-large:not(.toast)').addClass('overlay-btns');
            }
        });

        twitch.bits.onTransactionCancelled(function() {
            Materialize.toast('<p><img src="img/TopHamBTTV.png" class="tooltiped" data-tooltip="Thxs" data-position="top" alt="TopHam" />??</p>', 3000);
            Materialize.toast('<p> Something wrong happends, please try again.</p>', 5000);
        });

        twitch.bits.onTransactionComplete(function(TransactionObject) {
            var tmp_tier = TransactionObject.product.sku;

            twitch.send("broadcast", "application/json", JSON.stringify({"msg" : "bitdone", "data" : tmp_tier}));
            twitch.send("broadcast", "application/json", JSON.stringify({"msg" : "sendText", "data" : "@" + TransactionObject.displayName + " thanks for that pup OhMyDog"}));
        });

        twitch.listen("broadcast", function(target, contentType, object) {
            object = JSON.parse(object);
            if(object.msg == "updateConfig"){
                if(debug) console.log(object.data);
                var tmp_content = object.data;
                if(verifyJWT(tmp_content)){
                    tmp_content = decodeJWT(tmp_content);

                    $.each(alerts, function(index, val) {
                        var tmp_index = index + 1;
                        alerts[index].img_url = tmp_content["tier" + tmp_index + "_img"];
                        alerts[index].body = decodeURI(tmp_content["tier" + tmp_index + "_body"]);
                        alerts[index].glow_light = tmp_content["tier" + tmp_index + "_glow_light"];
                        alerts[index].glow_hard = tmp_content["tier" + tmp_index + "_glow_hard"];
                        alerts[index].alert_position = tmp_content["tier" + tmp_index + "_position"];
                        alerts[index].alert_fadein = tmp_content["tier" + tmp_index + "_fadein"];
                        alerts[index].alert_fadeout = tmp_content["tier" + tmp_index + "_fadeout"];
                        alerts[index].type_img = tmp_content["tier" + tmp_index + "_type_img"];
                        alerts[index].shape_img = tmp_content["tier" + tmp_index + "_shape_img"];
                        alerts[index].audio_url = tmp_content["tier" + tmp_index + "_audio_url"];
                        alerts[index].video_url = tmp_content["tier" + tmp_index + "_video_url"];
                        alerts[index].timer_time = tmp_content["tier" + tmp_index + "_timer_time"];
                    });

                    twitch.bits.getProducts().then(function(products){
                        root.products = products;
                    });

                    buildButtons();
                }
            }
            if(object.msg == "bitdone"){
                ejecuta_alert(object.data);
            }
            if(object.msg == "sendText" && twitch.viewer.role == "broadcaster"){
                send_text(object.data);
            }
        });
    };

    return {
        'init': _init,
        'puplert': ejecuta_alert
    }
})();

$(function(){
    pupface.init();
});