window.alerts_tmp = [];
window.pupface = (function() {
    var twitch = window.Twitch.ext;
    var root = this;
    var debug = false;
    var ejecutando = false;
    var user_trigger = false;
    var alert_interval;
    var cleanToast;
    var check_command = [];
    var alerts_queue = [];
    var endpoint = 'https://apiext.chakstudio.com/';

    var popFromArray = function(arr) {
        var what, a = arguments,
            L = a.length,
            ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    };

    var ejecuta_alert = function(alertIndex) {
        if (ejecutando) {
            alerts_queue.push(alertIndex);
            if (debug) console.log("En ejecucion..");
            return false;
        }

        if (debug) console.log(alertIndex);
        if (debug) console.log(alerts_tmp);
        var tmp_conf = alerts_tmp[alertIndex];

        $(".form_view").hide();

        $('.content_img img').prop("src", "");
        $('.content_img .spin, .content_img .spin_wheel,.content_img .static, .content_img .magic, #content-preview, #content-send, .tabs, .btnShowModal').addClass('hide');
        $('.content_img').removeClass('top').removeClass('center').removeClass('bottom').removeClass('right').removeClass('left').removeClass('parent_overlap');
        $('.content_img img, .content_img .alert_body').removeClass('equis').removeClass('star').removeClass('crazy_star').removeClass('heart').removeClass('diamond').removeClass('trapezoid').removeClass('pentagon').removeClass('rectanglev').removeClass('rectangleh').removeClass('triangle').removeClass('circle').removeClass('round').removeClass('overlap').removeClass('transparent');
        $('.content_img').removeClass('magictime').removeClass('puffIn').removeClass('puffOut').removeClass('vanishIn').removeClass('vanishOut').removeClass('foolishIn').removeClass('holeOut').removeClass('swashIn').removeClass('swashOut').removeClass('swap').removeClass('twisterInDown').removeClass('twisterInUp').removeClass('magic').removeClass('openDownLeft').removeClass('openDownRight').removeClass('openUpLeft').removeClass('openUpRight').removeClass('openDownLeftReturn').removeClass('openDownRightReturn').removeClass('openUpLeftReturn').removeClass('openUpRightReturn').removeClass('bombRightOut').removeClass('bombLeftOut').removeClass('tinRightOut').removeClass('tinLeftOut').removeClass('tinUpOut').removeClass('tinDownOut').removeClass('tinRightIn').removeClass('tinLeftIn').removeClass('boingInUp').removeClass('tinDownIn').removeClass('tinDownIn').removeClass('boingOutDown').removeClass('spaceOutUp').removeClass('spaceOutRight').removeClass('spaceOutDown').removeClass('spaceOutLeft').removeClass('spaceInUp').removeClass('spaceInRight').removeClass('spaceInLeft').removeClass('rotateUp').removeClass('rotateUp').removeClass('rotateLeft').removeClass('rotateRight');
        $('.content_img').hide();
        if (typeof alert_interval != "undefined") clearInterval(alert_interval);

        ejecutando = true;

        if ($("#alert_css").length > 0) $("#alert_css").remove();

        var alert_reset = function(end_conf) {
            if (end_conf.type_img == "static") {
                $('.content_img .static').addClass('hide');
            }
            if (end_conf.type_img == "spin") {
                $('.content_img .spin').addClass('hide');
            }
            if (end_conf.type_img == "spin_wheel") {
                $('.content_img .spin_wheel').addClass('hide');
            }
            if (end_conf.type_img == "magic_type") {
                $('.content_img .magic_type').addClass('hide');
            }
            if ($('#audioAlert').length > 0) {
                audioElement.pause();
                $('#audioAlert').remove();
            }
            if ($('#videoAlert').length > 0) {
                $('#videoAlert').remove();
            }
            $('.overlay_custom').css('z-index', '-1');
            $('#content-preview, #content-send, .tabs, .btnShowModal').removeClass('hide');
            $('.alert_body').html('');
            set_end();
        };

        var alert_end = function() {
            var end_conf = tmp_conf;
            alert_interval = setInterval(function() {
                $('.content_img').removeClass('magictime').removeClass('puffIn').removeClass('puffOut').removeClass('vanishIn').removeClass('vanishOut').removeClass('foolishIn').removeClass('holeOut').removeClass('swashIn').removeClass('swashOut').removeClass('swap').removeClass('twisterInDown').removeClass('twisterInUp').removeClass('magic').removeClass('openDownLeft').removeClass('openDownRight').removeClass('openUpLeft').removeClass('openUpRight').removeClass('openDownLeftReturn').removeClass('openDownRightReturn').removeClass('openUpRightReturn').removeClass('openUpRight').removeClass('bombRightOut').removeClass('bombLeftOut').removeClass('tinRightOut').removeClass('tinLeftOut').removeClass('tinUpOut').removeClass('tinDownOut').removeClass('tinRightIn').removeClass('tinLeftIn').removeClass('tinUpIn').removeClass('tinDownIn').removeClass('boingInUp').removeClass('boingOutDown').removeClass('spaceOutUp').removeClass('spaceOutRight').removeClass('spaceOutDown').removeClass('spaceOutLeft').removeClass('spaceInUp').removeClass('spaceInRight').removeClass('spaceInDown').removeClass('spaceInLeft').removeClass('rotateDown').removeClass('rotateUp').removeClass('rotateLeft').removeClass('rotateRight');
                if (end_conf.alert_fadeout == "fadeout") {
                    $('.content_img').fadeOut('fast', function() {
                        alert_reset(end_conf);
                    });
                }
                if (end_conf.alert_fadeout == "slideup") {
                    $('.content_img').slideUp('fast', function() {
                        alert_reset(end_conf);
                    });
                }
                if (end_conf.alert_fadeout == "puffOut") {
                    $('.content_img').addClass('magictime puffOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "vanishOut") {
                    $('.content_img').addClass('magictime vanishOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "holeOut") {
                    $('.content_img').addClass('magictime holeOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "swashOut") {
                    $('.content_img').addClass('magictime swashOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "magic") {
                    $('.content_img').addClass('magictime magic');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "openDownLeft") {
                    $('.content_img').addClass('magictime openDownLeft');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "openDownRight") {
                    $('.content_img').addClass('magictime openDownRight');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "openUpLeft") {
                    $('.content_img').addClass('magictime openUpLeft');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "openUpRight") {
                    $('.content_img').addClass('magictime openUpRight');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "bombRightOut") {
                    $('.content_img').addClass('magictime bombRightOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "bombLeftOut") {
                    $('.content_img').addClass('magictime bombLeftOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "tinRightOut") {
                    $('.content_img').addClass('magictime tinRightOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "tinLeftOut") {
                    $('.content_img').addClass('magictime tinLeftOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "tinUpOut") {
                    $('.content_img').addClass('magictime tinUpOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "tinDownOut") {
                    $('.content_img').addClass('magictime tinDownOut');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "boingOutDown") {
                    $('.content_img').addClass('magictime boingOutDown');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "spaceOutUp") {
                    $('.content_img').addClass('magictime spaceOutUp');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "spaceOutRight") {
                    $('.content_img').addClass('magictime spaceOutRight');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "spaceOutDown") {
                    $('.content_img').addClass('magictime spaceOutDown');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "spaceOutLeft") {
                    $('.content_img').addClass('magictime spaceOutLeft');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "rotateDown") {
                    $('.content_img').addClass('magictime rotateDown');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "rotateUp") {
                    $('.content_img').addClass('magictime rotateUp');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "rotateLeft") {
                    $('.content_img').addClass('magictime rotateLeft');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                if (end_conf.alert_fadeout == "rotateRight") {
                    $('.content_img').addClass('magictime rotateRight');
                    setTimeout(function() {
                        alert_reset(end_conf);
                    }, 1100);
                }
                clearInterval(alert_interval);
            }, end_conf.timer_time * 1000);
        };

        var set_end = function() {
            if (debug) console.log("queue count: " + alerts_queue.length, alerts_queue);
            if (alerts_queue.length > 0) {
                var tmp_index = alerts_queue[0];
                popFromArray(alerts_queue, alerts_queue[0]);

                setTimeout(function() {
                    ejecutando = false;
                    ejecuta_alert(tmp_index);
                    $(".form_view").show();
                }, 2000);
            } else {
                ejecutando = false;
                $(".form_view").show();
            }
            if (tmp_conf.confetti == "1") confetti.stop();
        };

        if (tmp_conf.status == "0") {
            alert_reset(tmp_conf);
            return false;
        }

        if(debug) console.log(tmp_conf.img_url);
        if(tmp_conf.img_url === ""  && tmp_conf.body === "") {
            alert_reset(tmp_conf);
            return false;
        }

        $('.alert_body').html('');

        $("<style type='text/css' id='alert_css'> @-webkit-keyframes glow {from {text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_light + ", 0 0 40px " + tmp_conf.glow_light + ", 0 0 50px " + tmp_conf.glow_light + ", 0 0 60px " + tmp_conf.glow_light + ", 0 0 70px " + tmp_conf.glow_light + ";}to {text-shadow: 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_hard + ", 0 0 40px " + tmp_conf.glow_hard + ", 0 0 50px " + tmp_conf.glow_hard + ", 0 0 60px " + tmp_conf.glow_hard + ", 0 0 70px " + tmp_conf.glow_hard + ", 0 0 80px " + tmp_conf.glow_hard + ";}} @-webkit-keyframes glow_img {from {box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_light + ", 0 0 40px " + tmp_conf.glow_light + ", 0 0 50px " + tmp_conf.glow_light + ", 0 0 60px " + tmp_conf.glow_light + ", 0 0 70px " + tmp_conf.glow_light + ";}to {box-shadow: 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_hard + ", 0 0 40px " + tmp_conf.glow_hard + ", 0 0 50px " + tmp_conf.glow_hard + ", 0 0 60px " + tmp_conf.glow_hard + ", 0 0 70px " + tmp_conf.glow_hard + ", 0 0 80px " + tmp_conf.glow_hard + ";}} .spin_img {box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_light + ", 0 0 40px " + tmp_conf.glow_light + ", 0 0 50px " + tmp_conf.glow_light + ", 0 0 60px " + tmp_conf.glow_light + ", 0 0 70px " + tmp_conf.glow_light + ";} .spin_img:hover {box-shadow: 0 0 20px #fff, 0 0 30px " + tmp_conf.glow_hard + ", 0 0 40px " + tmp_conf.glow_hard + ", 0 0 50px " + tmp_conf.glow_hard + ", 0 0 60px " + tmp_conf.glow_hard + ", 0 0 70px " + tmp_conf.glow_hard + ", 0 0 80px " + tmp_conf.glow_hard + ";cursor:pointer} </style>").appendTo("head");

        if (tmp_conf.body !== "") {
            var tmp_body = decodeURI(tmp_conf.body);
            $('.alert_body').html(tmp_body).css("font-family", tmp_conf.font);
            if (debug) console.log(tmp_conf.font_color);
            $('.alert_body').html(tmp_body).css("color", tmp_conf.font_color);
        }
        if (typeof tmp_conf.audio_url != "undefined" && tmp_conf.audio_url !== "") {
            if ($('#audioAlert').length > 0) $('#audioAlert').remove();
            window.audioElement = document.createElement('audio');
            audioElement.id = "audioAlert";
            audioElement.setAttribute('src', tmp_conf.audio_url);

            audioElement.addEventListener('canplay', function() {
                this.volume = tmp_conf.audio_volumen;
            }, false);
            document.body.appendChild(audioElement);
        }
        if (typeof tmp_conf.video_url != "undefined" && tmp_conf.video_url !== "") {
            if ($('#videoAlert').length > 0) $('#videoAlert').remove();
            $('<iframe>', {
                src: 'https://www.youtube.com/embed/' + tmp_conf.video_url + '?autoplay=1&controls=0',
                id: 'videoAlert',
                frameborder: 0,
                scrolling: 'no',
                allow: 'autoplay; encrypted-media',
                allowfullscreen: true
            }).appendTo('.alert_body');
        }
        if (typeof tmp_conf.img_url != "undefined" && tmp_conf.img_url !== "") {
            $('.content_img img').prop("src", tmp_conf.img_url);
        }

        if (tmp_conf.alert_position == "center") {
            $('.content_img').addClass('center');
        }
        if (tmp_conf.alert_position == "tleft") {
            $('.content_img').addClass('top').addClass('left');
        }
        if (tmp_conf.alert_position == "tright") {
            $('.content_img').addClass('top').addClass('right');
        }
        if (tmp_conf.alert_position == "tcenter") {
            $('.content_img').addClass('top').addClass('center');
        }
        if (tmp_conf.alert_position == "bleft") {
            $('.content_img').addClass('bottom').addClass('left');
        }
        if (tmp_conf.alert_position == "bright") {
            $('.content_img').addClass('bottom').addClass('right');
        }
        if (tmp_conf.alert_position == "bcenter") {
            $('.content_img').addClass('bottom').addClass('center');
        }
        if (tmp_conf.type_img == "static" && tmp_conf.img_url !== "") {
            $('.content_img .static').removeClass('hide');
        }
        if (tmp_conf.type_img == "spin" && tmp_conf.img_url !== "") {
            $('.content_img .spin').removeClass('hide');
        }
        if (tmp_conf.type_img == "spin_wheel" && tmp_conf.img_url !== "") {
            $('.content_img .spin_wheel').removeClass('hide');
        }
        if (tmp_conf.type_img == "magic_type" && tmp_conf.img_url !== "") {
            $('.content_img .magic_type').removeClass('hide');
        }
        if (tmp_conf.shape_img == "round" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('round');
        }
        if (tmp_conf.shape_img == "circle" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('circle');
        }
        if (tmp_conf.shape_img == "triangle" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('triangle');
        }
        if (tmp_conf.shape_img == "rectangleh" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('rectangleh');
        }
        if (tmp_conf.shape_img == "rectanglev" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('rectanglev');
        }
        if (tmp_conf.shape_img == "trapezoid" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('trapezoid');
        }
        if (tmp_conf.shape_img == "pentagon" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('pentagon');
        }
        if (tmp_conf.shape_img == "diamond" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('diamond');
        }
        if (tmp_conf.shape_img == "heart" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('heart');
        }
        if (tmp_conf.shape_img == "equis" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('equis');
        }
        if (tmp_conf.shape_img == "star" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('star');
        }
        if (tmp_conf.shape_img == "crazy_star" && tmp_conf.img_url !== "") {
            $('.content_img img').addClass('crazy_star');
        }
        if (tmp_conf.shape_img == "magic" && tmp_conf.img_url !== "") {
            $('.content_img').addClass('magic_shape');
        }

        if (typeof tmp_conf.video_url != "undefined" && tmp_conf.video_url !== "" && typeof tmp_conf.body != "undefined" && tmp_conf.body !== "") {
            $('.content_img').removeClass('top').removeClass('center').removeClass('bottom').removeClass('right').removeClass('left').removeClass('parent_overlap');
            $('.content_img').addClass('center').addClass('parent_overlap');
            $('.content_img img, .content_img .alert_body').addClass('overlap').addClass('transparent');
        }

        if (tmp_conf.alert_fadein == "fadein") {
            $('.content_img').fadeIn('slow', alert_end);
        }
        if (tmp_conf.alert_fadein == "slidedown") {
            $('.content_img').slideDown('slow', alert_end);
        }
        if (tmp_conf.alert_fadein == "puffIn") {
            $('.content_img').addClass('magictime puffIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "vanishIn") {
            $('.content_img').addClass('magictime vanishIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "foolishIn") {
            $('.content_img').addClass('magictime foolishIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "swashIn") {
            $('.content_img').addClass('magictime swashIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "swap") {
            $('.content_img').addClass('magictime swap');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "twisterInDown") {
            $('.content_img').addClass('magictime twisterInDown');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "twisterInUp") {
            $('.content_img').addClass('magictime twisterInUp');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "openDownLeftReturn") {
            $('.content_img').addClass('magictime openDownLeftReturn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "openDownRightReturn") {
            $('.content_img').addClass('magictime openDownRightReturn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "openUpLeftReturn") {
            $('.content_img').addClass('magictime openUpLeftReturn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "openUpRightReturn") {
            $('.content_img').addClass('magictime openUpRightReturn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "tinRightIn") {
            $('.content_img').addClass('magictime tinRightIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "tinLeftIn") {
            $('.content_img').addClass('magictime tinLeftIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "tinUpIn") {
            $('.content_img').addClass('magictime tinUpIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "tinDownIn") {
            $('.content_img').addClass('magictime tinDownIn');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "boingInUp") {
            $('.content_img').addClass('magictime boingInUp');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "spaceInUp") {
            $('.content_img').addClass('magictime spaceInUp');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "spaceInRight") {
            $('.content_img').addClass('magictime spaceInRight');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "spaceInDown") {
            $('.content_img').addClass('magictime spaceInDown');
            $('.content_img').fadeIn(0, alert_end);
        }
        if (tmp_conf.alert_fadein == "spaceInLeft") {
            $('.content_img').addClass('magictime spaceInLeft');
            $('.content_img').fadeIn(0, alert_end);
        }

        $('.overlay_custom').css('z-index', '10');

        if (typeof tmp_conf.audio_url != "undefined" && tmp_conf.audio_url !== "") {
            audioElement.play();
        }

        var bits_val = ["1","5","10","50","100","500","900","1500","2500"];
        if (tmp_conf.confetti == "1") confetti.start(1100 * tmp_conf.timer_time, (50 * tmp_conf.bits), (bits_val[tmp_conf.bits] <= 50 ? 50 : bits_val[tmp_conf.bits]) );

        return true;
    };

    var update_settings = function(jwt, from) {
        if(typeof from != "undefined"){
            window.Twitch.ext.configuration.set("broadcaster", "0.1", jwt);
        } else {
            $.ajax({
                url: endpoint,
                type: 'POST',
                data: {
                    'm': 'updateconfig',
                    'version': 'pupface',
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
                'version': 'pupface',
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
                        twitch.bits.getProducts().then(function(products) {
                            root.products = products;
                            alerts_tmp = JSON.stringify(alerts);
                            alerts_tmp = JSON.parse(alerts_tmp);

                            if (typeof tmp_content["poweron"] != 'undefined' && tmp_content["poweron"] !== '') {
                                $("#pupface_power").prop("checked", Number(tmp_content["poweron"]));
                                alerts_tmp.poweron = tmp_content["poweron"];
                            } else {
                                $("#pupface_power").prop("checked", Number(alerts.poweron));
                                alerts_tmp.poweron = alerts.poweron;
                            }
                            setTimeout(function(){
                                $('#pupface_power').trigger('change');
                            }, 1000);

                            if (typeof tmp_content["viewerbtn"] != 'undefined' && tmp_content["viewerbtn"] !== '') {
                                $("#viewer_btn").val(tmp_content["viewerbtn"]);
                                alerts_tmp.viewerbtn = tmp_content["viewerbtn"];
                            } else {
                                $("#viewer_btn").val(alerts.viewerbtn);
                                alerts_tmp.viewerbtn = alerts.viewerbtn;
                            }

                            $.each(products, function(index, product) {
                                if (debug) console.log(product);
                                var tmp_index = index + 1;
                                $("select.label_config_bits option[value=" + tmp_index + "]").html(product.cost.amount + " " + product.cost.type);
                                if (typeof tmp_content["tier" + tmp_index + "_img"] != 'undefined' && tmp_content["tier" + tmp_index + "_img"] !== '') {
                                    if (tmp_content["tier" + tmp_index + "_img"].indexOf("img/pup") > -1) {
                                        $("#tier" + tmp_index + "_img_select").val(tmp_content["tier" + tmp_index + "_img"]);
                                    } else {
                                        $("#tier" + tmp_index + "_img_select").val("");
                                        $("#tier" + tmp_index + "_img").val(tmp_content["tier" + tmp_index + "_img"]).removeClass('hide');
                                    }
                                    $("#tier" + tmp_index + "_img").val(tmp_content["tier" + tmp_index + "_img"]);
                                    $(".tier" + tmp_index + "_preview").attr('src', tmp_content["tier" + tmp_index + "_img"]);
                                    alerts_tmp[index].img_url = tmp_content["tier" + tmp_index + "_img"];
                                } else {
                                    $("#tier" + tmp_index + "_img_select").val(alerts[index].img_url);
                                    $("#tier" + tmp_index + "_img").val(alerts[index].img_url);
                                    $(".tier" + tmp_index + "_preview").attr('src', alerts[index].img_url);
                                    alerts_tmp[index].img_url = alerts[index].img_url;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_confetti"] != 'undefined' && tmp_content["tier" + tmp_index + "_confetti"] !== '') {
                                    $("#tier" + tmp_index + "_confetti").prop("checked", Number(tmp_content["tier" + tmp_index + "_confetti"]));
                                    alerts_tmp[index].confetti = tmp_content["tier" + tmp_index + "_confetti"];
                                } else {
                                    $("#tier" + tmp_index + "_confetti").prop("checked", Number(alerts[index].confetti));
                                    alerts_tmp[index].confetti = alerts[index].confetti;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_body"] != 'undefined' && tmp_content["tier" + tmp_index + "_body"] !== '') {
                                    $("#tier" + tmp_index + "_body").val(decodeURI(tmp_content["tier" + tmp_index + "_body"]));
                                    alerts_tmp[index].body = decodeURI(tmp_content["tier" + tmp_index + "_body"]);
                                } else {
                                    $("#tier" + tmp_index + "_body").val(decodeURI(alerts[index].body));
                                    alerts_tmp[index].body = decodeURI(alerts[index].body);
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_bits"] != 'undefined' && tmp_content["tier" + tmp_index + "_bits"] !== '') {
                                    $("#tier" + tmp_index + "_bits").val(tmp_content["tier" + tmp_index + "_bits"]);
                                    alerts_tmp[index].bits = tmp_content["tier" + tmp_index + "_bits"];
                                } else {
                                    $("#tier" + tmp_index + "_bits").val(alerts[index].bits);
                                    alerts_tmp[index].bits = alerts[index].bits;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_iconres"] != 'undefined' && tmp_content["tier" + tmp_index + "_iconres"] !== '') {
                                    $("#tier" + tmp_index + "_iconres").val(decodeURI(tmp_content["tier" + tmp_index + "_iconres"]));
                                    alerts_tmp[index].iconres = decodeURI(tmp_content["tier" + tmp_index + "_iconres"]);
                                } else {
                                    $("#tier" + tmp_index + "_iconres").val(decodeURI(alerts[index].iconres));
                                    alerts_tmp[index].iconres = decodeURI(alerts[index].iconres);
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_font"] != 'undefined' && tmp_content["tier" + tmp_index + "_font"] !== '') {
                                    $("#tier" + tmp_index + "_font").val(decodeURI(tmp_content["tier" + tmp_index + "_font"]));
                                    alerts_tmp[index].font = tmp_content["tier" + tmp_index + "_font"];
                                } else {
                                    $("#tier" + tmp_index + "_font").val(decodeURI(alerts[index].font));
                                    alerts_tmp[index].font = alerts[index].font;
                                }
                                if (typeof tmp_content["tier" + tmp_index + "_font_color"] != 'undefined' && tmp_content["tier" + tmp_index + "_font_color"] !== '') {
                                    $("#tier" + tmp_index + "_font_color").val(decodeURI(tmp_content["tier" + tmp_index + "_font_color"]));
                                    alerts_tmp[index].font_color = tmp_content["tier" + tmp_index + "_font_color"];
                                } else {
                                    $("#tier" + tmp_index + "_font_color").val(decodeURI(alerts[index].font_color));
                                    alerts_tmp[index].font_color = alerts[index].font_color;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_glow_light"] != 'undefined' && tmp_content["tier" + tmp_index + "_glow_light"] !== '') {
                                    $("#tier" + tmp_index + "_glow_light").val(tmp_content["tier" + tmp_index + "_glow_light"]);
                                    alerts_tmp[index].glow_light = tmp_content["tier" + tmp_index + "_glow_light"];
                                } else {
                                    $("#tier" + tmp_index + "_glow_light").val(alerts[index].glow_light);
                                    alerts_tmp[index].glow_light = alerts[index].glow_light;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_glow_hard"] != 'undefined' && tmp_content["tier" + tmp_index + "_glow_hard"] !== '') {
                                    $("#tier" + tmp_index + "_glow_hard").val(tmp_content["tier" + tmp_index + "_glow_hard"]);
                                    alerts_tmp[index].glow_hard = tmp_content["tier" + tmp_index + "_glow_hard"];
                                } else {
                                    $("#tier" + tmp_index + "_glow_hard").val(alerts[index].glow_hard);
                                    alerts_tmp[index].glow_hard = alerts[index].glow_hard;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_position"] != 'undefined' && tmp_content["tier" + tmp_index + "_position"] !== '') {
                                    $("#tier" + tmp_index + "_position").val(tmp_content["tier" + tmp_index + "_position"]);
                                    alerts_tmp[index].alert_position = tmp_content["tier" + tmp_index + "_position"];
                                } else {
                                    $("#tier" + tmp_index + "_position").val(alerts[index].alert_position);
                                    alerts_tmp[index].alert_position = alerts[index].alert_position;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_fadein"] != 'undefined' && tmp_content["tier" + tmp_index + "_fadein"] !== '') {
                                    $("#tier" + tmp_index + "_fadein").val(tmp_content["tier" + tmp_index + "_fadein"]);
                                    alerts_tmp[index].alert_fadein = tmp_content["tier" + tmp_index + "_fadein"];
                                } else {
                                    $("#tier" + tmp_index + "_fadein").val(alerts[index].alert_fadein);
                                    alerts_tmp[index].alert_fadein = alerts[index].alert_fadein;
                                }
                                if (typeof tmp_content["tier" + tmp_index + "_fadeout"] != 'undefined' && tmp_content["tier" + tmp_index + "_fadeout"] !== '') {
                                    $("#tier" + tmp_index + "_fadeout").val(tmp_content["tier" + tmp_index + "_fadeout"]);
                                    alerts_tmp[index].alert_fadeout = tmp_content["tier" + tmp_index + "_fadeout"];
                                } else {
                                    $("#tier" + tmp_index + "_fadeout").val(alerts[index].alert_fadeout);
                                    alerts_tmp[index].alert_fadeout = alerts[index].alert_fadeout;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_type_img"] != 'undefined' && tmp_content["tier" + tmp_index + "_type_img"] !== '') {
                                    $("#tier" + tmp_index + "_type_img").val(tmp_content["tier" + tmp_index + "_type_img"]);
                                    alerts_tmp[index].type_img = tmp_content["tier" + tmp_index + "_type_img"];
                                } else {
                                    $("#tier" + tmp_index + "_type_img").val(alerts[index].type_img);
                                    alerts_tmp[index].type_img = alerts[index].type_img;
                                }
                                if (typeof tmp_content["tier" + tmp_index + "_shape_img"] != 'undefined' && tmp_content["tier" + tmp_index + "_shape_img"] !== '') {
                                    $("#tier" + tmp_index + "_shape_img").val(tmp_content["tier" + tmp_index + "_shape_img"]);
                                    alerts_tmp[index].shape_img = tmp_content["tier" + tmp_index + "_shape_img"];
                                } else {
                                    $("#tier" + tmp_index + "_shape_img").val(alerts[index].shape_img);
                                    alerts_tmp[index].shape_img = alerts[index].shape_img;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_audio_url"] != 'undefined' && tmp_content["tier" + tmp_index + "_audio_url"] !== '') {
                                    $("#tier" + tmp_index + "_audio_url").val(tmp_content["tier" + tmp_index + "_audio_url"]);
                                    $("#tier" + tmp_index + "_audio_select").val(tmp_content["tier" + tmp_index + "_audio_url"]);
                                    alerts_tmp[index].audio_url = tmp_content["tier" + tmp_index + "_audio_url"];
                                } else {
                                    $("#tier" + tmp_index + "_audio_url").val(alerts[index].audio_url);
                                    $("#tier" + tmp_index + "_audio_select").val(alerts[index].audio_url);
                                    alerts_tmp[index].audio_url = alerts[index].audio_url;
                                }
                                if (typeof tmp_content["tier" + tmp_index + "_audio_volumen"] != 'undefined' && tmp_content["tier" + tmp_index + "_audio_volumen"] !== '') {
                                    $("#tier" + tmp_index + "_audio_volumen").val(tmp_content["tier" + tmp_index + "_audio_volumen"]);
                                    alerts_tmp[index].audio_volumen = tmp_content["tier" + tmp_index + "_audio_volumen"];
                                } else {
                                    $("#tier" + tmp_index + "_audio_volumen").val(alerts[index].audio_volumen);
                                    alerts_tmp[index].audio_volumen = alerts[index].audio_volumen;
                                }
                                if (typeof tmp_content["tier" + tmp_index + "_video_url"] != 'undefined' && tmp_content["tier" + tmp_index + "_video_url"] !== '') {
                                    $("#tier" + tmp_index + "_video_url").val(tmp_content["tier" + tmp_index + "_video_url"]);
                                    alerts_tmp[index].video_url = tmp_content["tier" + tmp_index + "_video_url"];
                                } else {
                                    $("#tier" + tmp_index + "_video_url").val(alerts[index].video_url);
                                    alerts_tmp[index].video_url = alerts[index].video_url;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_timer_time"] != 'undefined' && tmp_content["tier" + tmp_index + "_timer_time"] !== '') {
                                    $("#tier" + tmp_index + "_timer_time").val(tmp_content["tier" + tmp_index + "_timer_time"]);
                                    alerts_tmp[index].timer_time = tmp_content["tier" + tmp_index + "_timer_time"];
                                } else {
                                    $("#tier" + tmp_index + "_timer_time").val(alerts[index].timer_time);
                                    alerts_tmp[index].timer_time = alerts[index].timer_time;
                                }

                                if (typeof tmp_content["tier" + tmp_index + "_status"] != 'undefined' && tmp_content["tier" + tmp_index + "_status"] !== '') {
                                    $("#tier" + tmp_index + "_status").prop("checked", Number(tmp_content["tier" + tmp_index + "_status"]));
                                    alerts_tmp[index].status = tmp_content["tier" + tmp_index + "_status"];
                                } else {
                                    $("#tier" + tmp_index + "_status").prop("checked", Number(alerts[index].status));
                                    alerts_tmp[index].status = alerts[index].status;
                                }
                            });

                            $('select').material_select('update');
                        });
                    }
                } else {
                    var tmp_config = {};
                    tmp_config.poweron = alerts.poweron;
                    tmp_config.viewerbtn = alerts.viewerbtn;
                    for (var i = 0; i < alerts.length; i++) {
                        tmp_config["tier" + (i + 1) + "_img"] = alerts[i].img_url;
                        tmp_config["tier" + (i + 1) + "_body"] = decodeURI(alerts[i].body);
                        tmp_config["tier" + (i + 1) + "_confetti"] = alerts[i].confetti;
                        tmp_config["tier" + (i + 1) + "_bits"] = alerts[i].bits;
                        tmp_config["tier" + (i + 1) + "_iconres"] = decodeURI(alerts[i].iconres);
                        tmp_config["tier" + (i + 1) + "_font"] = alerts[i].font;
                        tmp_config["tier" + (i + 1) + "_font_color"] = alerts[i].font_color;
                        tmp_config["tier" + (i + 1) + "_glow_light"] = alerts[i].glow_light;
                        tmp_config["tier" + (i + 1) + "_glow_hard"] = alerts[i].glow_hard;
                        tmp_config["tier" + (i + 1) + "_position"] = alerts[i].alert_position;
                        tmp_config["tier" + (i + 1) + "_fadein"] = alerts[i].alert_fadein;
                        tmp_config["tier" + (i + 1) + "_fadeout"] = alerts[i].alert_fadeout;
                        tmp_config["tier" + (i + 1) + "_type_img"] = alerts[i].type_img;
                        tmp_config["tier" + (i + 1) + "_shape_img"] = alerts[i].shape_img;
                        tmp_config["tier" + (i + 1) + "_audio_url"] = alerts[i].audio_url;
                        tmp_config["tier" + (i + 1) + "_audio_volumen"] = alerts[i].audio_volumen;
                        tmp_config["tier" + (i + 1) + "_video_url"] = alerts[i].video_url;
                        tmp_config["tier" + (i + 1) + "_timer_time"] = alerts[i].timer_time;
                        tmp_config["tier" + (i + 1) + "_status"] = alerts[i].status;
                    }

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
            } else if (index.indexOf("tooltiped") > -1) {
                $("." + index).attr("data-tooltip", val);
            } else {
                $("." + index).html(val);
            }
        });
    };

    var _init = function() {
        //Generate containers
        $('#tiers_content').html('');

        for (var i = 1; i <= alerts.length; i++) {
            var tmp_tier = "tier" + i;
            var tmp_clon = $('#tierClon').clone();
            var tmp_buffer = '';

            if (i == 1) tmp_clon.removeClass('hide');
            tmp_clon.attr('id', tmp_tier);
            tmp_buffer = tmp_clon.html();
            tmp_buffer = tmp_buffer.replace(new RegExp('tierClon', 'g'), tmp_tier);
            tmp_clon.html(tmp_buffer);

            $('#tiers_content').append(tmp_clon);
        }
        //Helpers
        $('.tooltiped').tooltip({
            html: true
        });
        $('select').material_select();

        $('ul.tabs').tabs();

        $('#pupface_power').off('change').on('change', function() {
            if ($(this).prop("checked")) {
                $('.pupface_on, .pupface_posicion').removeClass('hide');
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "pupfaceOn"}));
            } else {
                $('.pupface_on, .pupface_posicion').addClass('hide');
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "pupfaceOff"}));
            }
            $('.btnSave').trigger('click');
        });

        $('.pup_select').off('change').on('change', function() {
            var tmp_select = $(this);
            var tmp_id = tmp_select.attr('id');
            tmp_id = tmp_id.replace("_select", "");

            if (debug) console.log(tmp_id);

            if (tmp_select.val() === "" || tmp_select.val() == "none" ) {
                $('#' + tmp_id).removeClass('hide');
                $('#' + tmp_id).val('');
            } else {
                if (!$('#' + tmp_id).hasClass('hide')) $('#' + tmp_id).addClass('hide');
                $('#' + tmp_id).val(tmp_select.val()).trigger('focusout');
            }
        });

        $('.tooltip_config_select_audio').off('change').on('change', function() {
            var tmp_select = $(this);
            var tmp_id = tmp_select.attr('id');
            tmp_id = tmp_id.replace("_select", "_url");

            if (debug) console.log(tmp_id);

            if (tmp_select.val() === "") {
                if (!$('#' + tmp_id).hasClass('hide')) $('#' + tmp_id).addClass('hide');
                $('#' + tmp_id).val('');
            } else if (tmp_select.val() === "custom") {
                $('#' + tmp_id).removeClass('hide');
                $('#' + tmp_id).val('');
            } else {
                if (!$('#' + tmp_id).hasClass('hide')) $('#' + tmp_id).addClass('hide');

                $('#' + tmp_id).val(tmp_select.val());
            }
        });

        $('.imgChange').off('focusout').on('focusout', function() {
            var tmp_id = $(this).attr('id');
            var tmp_val = $(this).val();
            tmp_id = tmp_id.replace("_img", "_preview");
            if (debug) console.log(tmp_id);

            if (tmp_val.indexOf('https://www.dropbox.com') > -1) {
                tmp_val = tmp_val.replace('dl=0', 'dl=1');
                $(this).val(tmp_val);
            }

            if (tmp_val !== "" && tmp_val != "none") $("." + tmp_id).attr('src', tmp_val);
        });

        $('.checkIMG, .checkAUDIO, .checkVIDEO').on('focusout', function() {
            var element = $(this);
            if (element.hasClass('checkIMG')) {
                if (element.val() !== '' && element.val().indexOf('www.dropbox.com') > -1 && (new RegExp(/\.(gif|jpg|jpeg|tiff|png).?dl=1$/i)).test(element.val()) === false) {
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_invalid_ext : '<p>Invalid extension<br>Please try again</p>'), 3000);
                    element.val('');
                    return false;
                }
                if (element.val() !== '' && element.val().indexOf('giphy.com') > -1 && (/\.(gif)$/i).test(element.val()) === false) {
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_invalid_ext : '<p>Invalid extension<br>Please try again</p>'), 3000);
                    element.val('');
                    return false;
                }
            } else if (element.hasClass('checkAUDIO')) {
                if (element.val() !== '' && element.val().indexOf('www.dropbox.com') == -1 && (/\.(wav|mp3|ogg)$/i).test(element.val()) === false) {
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_invalid_ext : '<p>Invalid extension<br>Please try again</p>'), 3000);
                    element.val('');
                    return false;
                }

                if (element.val().indexOf('https://www.dropbox.com') > -1) {
                    element.val(element.val().replace('dl=0', 'dl=1'));
                }
            } else if (element.hasClass('checkVIDEO')) {
                if (element.val() !== '' && (/(:\/\/|http|https|www\.youtube\.com|youtube\.com|www\.)/i).test(element.val()) === true) {
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_invalid_format : '<p>Invalid format<br>Please try again</p>'), 3000);
                    element.val('');
                    return false;
                }
            }
        });

        $('.btnTest').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function() {
            if (debug) console.log($("#tier_select").val());
            var tmp_index = $("#tier_select").val();
            tmp_index = Number(tmp_index.replace("tier", ""));

            alerts_tmp[tmp_index - 1].img_url = ($("#tier" + tmp_index + "_img").val() === "" || $("#tier" + tmp_index + "_img").val() == "none" ? '' : runSanitizer($("#tier" + tmp_index + "_img").val()));
            alerts_tmp[tmp_index - 1].body = decodeURI(runSanitizer($("#tier" + tmp_index + "_body").val()));
            alerts_tmp[tmp_index - 1].bits = $("#tier" + tmp_index + "_bits").val();
            alerts_tmp[tmp_index - 1].confetti = $("#tier" + tmp_index + "_confetti").prop("checked") ? "1" : "0";
            alerts_tmp[tmp_index - 1].iconres = decodeURI(runSanitizer($("#tier" + tmp_index + "_iconres").val()));
            alerts_tmp[tmp_index - 1].font = $("#tier" + tmp_index + "_font").val();
            alerts_tmp[tmp_index - 1].font_color = runSanitizer($("#tier" + tmp_index + "_font_color").val());
            alerts_tmp[tmp_index - 1].glow_light = runSanitizer($("#tier" + tmp_index + "_glow_light").val());
            alerts_tmp[tmp_index - 1].glow_hard = runSanitizer($("#tier" + tmp_index + "_glow_hard").val());
            alerts_tmp[tmp_index - 1].alert_position = $("#tier" + tmp_index + "_position").val();
            alerts_tmp[tmp_index - 1].alert_fadein = $("#tier" + tmp_index + "_fadein").val();
            alerts_tmp[tmp_index - 1].alert_fadeout = $("#tier" + tmp_index + "_fadeout").val();
            alerts_tmp[tmp_index - 1].type_img = $("#tier" + tmp_index + "_type_img").val();
            alerts_tmp[tmp_index - 1].shape_img = $("#tier" + tmp_index + "_shape_img").val();
            alerts_tmp[tmp_index - 1].audio_url = runSanitizer($("#tier" + tmp_index + "_audio_url").val());
            alerts_tmp[tmp_index - 1].audio_volumen = $("#tier" + tmp_index + "_audio_volumen").val();
            //alerts_tmp[tmp_index - 1].video_url = runSanitizer($("#tier" + tmp_index + "_video_url").val());
            alerts_tmp[tmp_index - 1].timer_time = $("#tier" + tmp_index + "_timer_time").val();
            alerts_tmp[tmp_index - 1].status = ($("#tier" + tmp_index + "_status").prop("checked") ? "1" : "0");
            ejecuta_alert(tmp_index - 1);
        });

        $('.btnSave').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function() {
            var tmp_config = {};

            tmp_config.poweron = ($("#pupface_power").prop("checked") ? "1" : "0");
            tmp_config.viewerbtn = $("#viewer_btn").val();
            for (var i = 0; i < alerts.length; i++) {
                tmp_config["tier" + (i + 1) + "_img"] = runSanitizer($("#tier" + (i + 1) + "_img").val());
                tmp_config["tier" + (i + 1) + "_body"] = encodeURI(runSanitizer($("#tier" + (i + 1) + "_body").val()));
                tmp_config["tier" + (i + 1) + "_bits"] = $("#tier" + (i + 1) + "_bits").val();
                tmp_config["tier" + (i + 1) + "_confetti"] = $("#tier" + (i + 1) + "_confetti").prop("checked") ? "1" : "0";
                tmp_config["tier" + (i + 1) + "_iconres"] = encodeURI(runSanitizer($("#tier" + (i + 1) + "_iconres").val()));
                tmp_config["tier" + (i + 1) + "_font"] = $("#tier" + (i + 1) + "_font").val();
                tmp_config["tier" + (i + 1) + "_font_color"] = runSanitizer($("#tier" + (i + 1) + "_font_color").val());
                tmp_config["tier" + (i + 1) + "_glow_light"] = runSanitizer($("#tier" + (i + 1) + "_glow_light").val());
                tmp_config["tier" + (i + 1) + "_glow_hard"] = runSanitizer($("#tier" + (i + 1) + "_glow_hard").val());
                tmp_config["tier" + (i + 1) + "_position"] = $("#tier" + (i + 1) + "_position").val();
                tmp_config["tier" + (i + 1) + "_fadein"] = $("#tier" + (i + 1) + "_fadein").val();
                tmp_config["tier" + (i + 1) + "_fadeout"] = $("#tier" + (i + 1) + "_fadeout").val();
                tmp_config["tier" + (i + 1) + "_type_img"] = $("#tier" + (i + 1) + "_type_img").val();
                tmp_config["tier" + (i + 1) + "_shape_img"] = $("#tier" + (i + 1) + "_shape_img").val();
                tmp_config["tier" + (i + 1) + "_audio_url"] = runSanitizer($("#tier" + (i + 1) + "_audio_url").val());
                tmp_config["tier" + (i + 1) + "_audio_volumen"] = $("#tier" + (i + 1) + "_audio_volumen").val();
                //tmp_config["tier" + (i + 1) + "_video_url"] = runSanitizer($("#tier" + (i + 1) + "_video_url").val());
                tmp_config["tier" + (i + 1) + "_timer_time"] = $("#tier" + (i + 1) + "_timer_time").val();
                tmp_config["tier" + (i + 1) + "_status"] = ($("#tier" + (i + 1) + "_status").prop("checked") ? "1" : "0");
            }
            var jwt = signJWT(tmp_config);
            update_settings(jwt);
            twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "updateConfig"}));
            Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_config_save : '<p>Configuration <b class="green-text">Saved</b>!</p>'), 4000);
        });

        $('.btnReset').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function() {
            Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_reset_tiers : '<p>The 9 tiers ara gonna be reset. <br> Are u sure?<br><br><a class="btnAccept green white-text btn">Yes</a> &nbsp;&nbsp; <a class="btnDecline red white-text btn">No</a></p>'), 6000);
            $('.btnAccept').off('click').on('click', function() {
                var tmp_config = {};

                tmp_config.poweron = alerts.poweron;
                tmp_config.viewerbtn = alerts.viewerbtn;
                for (var i = 0; i < alerts.length; i++) {
                    tmp_config["tier" + (i + 1) + "_img"] = alerts[i].img_url;
                    tmp_config["tier" + (i + 1) + "_body"] = encodeURI(alerts[i].body);
                    tmp_config["tier" + (i + 1) + "_bits"] = alerts[i].bits;
                    tmp_config["tier" + (i + 1) + "_confetti"] = alerts[i].confetti;
                    tmp_config["tier" + (i + 1) + "_iconres"] = encodeURI(alerts[i].iconres);
                    tmp_config["tier" + (i + 1) + "_font"] = alerts[i].font;
                    tmp_config["tier" + (i + 1) + "_font_color"] = alerts[i].font_color;
                    tmp_config["tier" + (i + 1) + "_glow_light"] = alerts[i].glow_light;
                    tmp_config["tier" + (i + 1) + "_glow_hard"] = alerts[i].glow_hard;
                    tmp_config["tier" + (i + 1) + "_position"] = alerts[i].alert_position;
                    tmp_config["tier" + (i + 1) + "_fadein"] = alerts[i].alert_fadein;
                    tmp_config["tier" + (i + 1) + "_fadeout"] = alerts[i].alert_fadeout;
                    tmp_config["tier" + (i + 1) + "_type_img"] = alerts[i].type_img;
                    tmp_config["tier" + (i + 1) + "_shape_img"] = alerts[i].shape_img;
                    tmp_config["tier" + (i + 1) + "_audio_url"] = alerts[i].audio_url;
                    tmp_config["tier" + (i + 1) + "_audio_volumen"] = alerts[i].audio_volumen;
                    tmp_config["tier" + (i + 1) + "_video_url"] = alerts[i].video_url;
                    tmp_config["tier" + (i + 1) + "_timer_time"] = alerts[i].timer_time;
                    tmp_config["tier" + (i + 1) + "_status"] = alerts[i].status;
                }

                if (debug) console.log(alerts);
                if (debug) console.log(tmp_config);

                var jwt = signJWT(tmp_config);
                update_settings(jwt);
                twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "updateConfig"}));
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_reset_ok : '<p>Configuration <b class="red-text">Reset</b>!</p>'), 4000);
                $(this).parent().parent().remove();
                setTimeout(refreshSetting, 1000);
            });

            $('.btnDecline').off('click').on('click', function() {
                $(this).parent().parent().remove();
            });
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
                    'version': 'pupface',
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

        $('#tier_select').off('change').on('change', function() {
            $(".tierContainer").addClass('hide');
            $("#" + $(this).val()).removeClass('hide');
        });

        $(window).resize(function(event) {
            if($(window).width() <= 400){
                $('.overlay_custom').addClass('overlay_custom_scale');
            } else {
                $('.overlay_custom').removeClass('overlay_custom_scale');
            }
        });

        //color-picker.js
        var picker1 = new CP(document.querySelector('input[id="tier1_glow_light"]'));
        picker1.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker1_2 = new CP(document.querySelector('input[id="tier1_glow_hard"]'));
        picker1_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker1_3 = new CP(document.querySelector('input[id="tier1_font_color"]'));
        picker1_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker2 = new CP(document.querySelector('input[id="tier2_glow_light"]'));
        picker2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker2_2 = new CP(document.querySelector('input[id="tier2_glow_hard"]'));
        picker2_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker2_3 = new CP(document.querySelector('input[id="tier2_font_color"]'));
        picker2_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker3 = new CP(document.querySelector('input[id="tier3_glow_light"]'));
        picker3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker3_2 = new CP(document.querySelector('input[id="tier3_glow_hard"]'));
        picker3_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker3_3 = new CP(document.querySelector('input[id="tier3_font_color"]'));
        picker3_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker4 = new CP(document.querySelector('input[id="tier4_glow_light"]'));
        picker4.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker4_2 = new CP(document.querySelector('input[id="tier4_glow_hard"]'));
        picker4_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker4_3 = new CP(document.querySelector('input[id="tier4_font_color"]'));
        picker4_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker5 = new CP(document.querySelector('input[id="tier5_glow_light"]'));
        picker5.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker5_2 = new CP(document.querySelector('input[id="tier5_glow_hard"]'));
        picker5_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker5_3 = new CP(document.querySelector('input[id="tier5_font_color"]'));
        picker5_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker6 = new CP(document.querySelector('input[id="tier6_glow_light"]'));
        picker6.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker6_2 = new CP(document.querySelector('input[id="tier6_glow_hard"]'));
        picker6_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker6_3 = new CP(document.querySelector('input[id="tier6_font_color"]'));
        picker6_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker7 = new CP(document.querySelector('input[id="tier7_glow_light"]'));
        picker7.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker7_2 = new CP(document.querySelector('input[id="tier7_glow_hard"]'));
        picker7_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker7_3 = new CP(document.querySelector('input[id="tier7_font_color"]'));
        picker7_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker8 = new CP(document.querySelector('input[id="tier8_glow_light"]'));
        picker8.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker8_2 = new CP(document.querySelector('input[id="tier8_glow_hard"]'));
        picker8_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker8_3 = new CP(document.querySelector('input[id="tier8_font_color"]'));
        picker8_3.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker9 = new CP(document.querySelector('input[id="tier9_glow_light"]'));
        picker9.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker9_2 = new CP(document.querySelector('input[id="tier9_glow_hard"]'));
        picker9_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker9_3 = new CP(document.querySelector('input[id="tier9_font_color"]'));
        picker9_3.on("change", function(color) {
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

        twitch.bits.onTransactionComplete(function(TransactionObject) {
            if (debug) console.log(TransactionObject.userId, root.auth.userId, TransactionObject);
            Materialize.toast("<p>@" + TransactionObject.displayName + " " +  (typeof window.lang[lang_code].tooltip_bits_config_complete != "undefined" ? window.lang[lang_code].tooltip_bits_config_complete : "send a pupface of")+ " " + TransactionObject.product.cost.amount + " bits</p>", 4000);
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