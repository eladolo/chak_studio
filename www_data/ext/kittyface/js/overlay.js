window.kittyface = (function() {
    var twitch = window.Twitch.ext;
    var root = this;
    var main_vol = 0.0;
    var debug = false;
    var ejecutando = false;
    var user_trigger = false;
    var kittyface_power = true;
    var alert_interval;
    var cleanToast;
    var alertID;
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
        if(!kittyface_power) return false;
        if (ejecutando) {
            alerts_queue.push(alertIndex);
            if (debug) console.log("En ejecucion..");
            return false;
        }

        var tmp_conf = alerts[alertIndex];

        $('.modal').modal('close');
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
                }, 2000);
            } else {
                ejecutando = false;
            }
            if (tmp_conf.confetti == "1") confetti.stop();

            $('.form_view').stop().animate({
                'opacity': 0
            }, 'fast');
        };

        if (tmp_conf.status == "0") {
            alert_reset(tmp_conf);
            return false;
        }

        tmp_conf.img_url = (tmp_conf.img_url === "" || tmp_conf.img_url == "none")? '': tmp_conf.img_url;

        if(tmp_conf.img_url === "" && tmp_conf.body === "") {
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
                var tmp_vol = (main_vol == "0") ? 0 : tmp_conf.audio_volumen;
                tmp_vol = (main_vol <= tmp_conf.audio_volumen) ? main_vol : tmp_vol;
                this.volume = tmp_vol;
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

        if (typeof tmp_conf.audio_url != "undefined" && tmp_conf.audio_url !== "") {
            audioElement.play();
        }

        var bits_val = ["1","5","10","50","100","500","900","1500","2500"];
        if (tmp_conf.confetti == "1") confetti.start(1100 * tmp_conf.timer_time, (50 * tmp_conf.bits), (bits_val[tmp_conf.bits] <= 50 ? 50 : bits_val[tmp_conf.bits]) );

        $('.overlay_custom').css('z-index', '10');

        $('.form_view').stop().animate({
            'opacity': 1
        }, 'fast');

        return true;
    };

    var _buildLeaderboard = function(){
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'getLeaderboard',
                'version': 'kittyface',
                'channel': auth.channelId,
                'token': auth.token
            },
            dataType: 'json',
            success: function(res) {
                if (res.response.success) {
                    var tmp_content = res.response;
                    if(debug) console.log(tmp_content);
                    var tmp_users10 = tmp_content.top10users;
                    var tmp_imgs10 = tmp_content.top10img;
                    var tmp_bits10 = tmp_content.top10bits;

                    $('.tb_views tbody, .tb_kittys tbody, .tb_bits tbody').html('');

                    $.each(tmp_users10, function(index, val) {
                        var tmp_tr = '<tr><td>' + val.username + '</td><td>' + val.bits + '</td></tr>';
                        $('.tb_views tbody').append(tmp_tr);
                    });

                    $.each(tmp_imgs10, function(index, val) {
                        tmp_tr = '<tr><td><div><img class="circle spin_img" style="width: 32px; height: 32px;" alt="' + val.img + '" src="' + val.img + '" /></div></td><td>' + val.times + '</td><td>' + val.spend + '</td></tr>';
                        $('.tb_kittys tbody').append(tmp_tr);
                    });

                    $.each(tmp_bits10, function(index, val) {
                        tmp_tr = '<tr><td>' + val.bits + '</td><td>' + val.times + '</td></tr>';
                        $('.tb_bits tbody').append(tmp_tr);
                    });

                    $(".content_overflow").niceScroll().resize();
                }
            }
        });
    };

    var buildButtons = function() {
        $('#content-preview, #content-send').html('');
        $.each(alerts, function(index, val) {
            if(alerts[index].status == "0") return true;
            if((alerts[index].img_url === "" || alerts[index].img_url == "none") && alerts[index].body === "") return true;
            var tmp_img = (alerts[index].img_url === "" || alerts[index].img_url == "none") ? 'img/kittyface100x100.png' : alerts[index].img_url;
            var bits_val = ["1","5","10","50","100","500","1000","2500","5000"];
            var tmp_bit_val= typeof bits_val[(Number(alerts[index].bits) - 1)] != "undefined" ? bits_val[Number(alerts[index].bits) - 1] : "0";
            var tmp_button = "<img class='btnSend circle responsive tooltiped' data-tooltip='" + tmp_bit_val + " bits' style='width: 64px; height: 64px; cursor: pointer;' data-index='" + index + "' src='" + tmp_img + "' />";
            $('#content-send').append(tmp_button);
        });

        //if (twitch.viewer.role == "broadcaster") $(".label_overlay_send").remove();

        $('.btnSend.tooltiped').tooltip();

        if(alerts.poweron == "0"){
            kittyface_power = false;
            $('.modal').modal('close');
            $('.btnShowModal').fadeOut('fast', function() {
                Materialize.toast("kittyfaces off", 3000);
            });
        }

        _buildLeaderboard();
    };

    var send_text = function(msg) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'sendText',
                'version': 'kittyface',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'msg': msg,
                'appv': '0.3'
            },
            dataType: 'json',
            success: function(res) {}
        });
    };

    var sendAction = function(msg, data, target) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'transmitMessage',
                'version': 'kittyface',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'msg': msg,
                'data': data,
                'target': target,
                'appv': '0.3'
            },
            dataType: 'json',
            success: function(res) {}
        });
    };

    var updateLeaderboard = function(username, bits, img) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'updateLeaderboard',
                'version': 'kittyface',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'username': username,
                'bits': bits,
                'img': img
            },
            dataType: 'json',
            success: function(res) {
                _buildLeaderboard();
            }
        });
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

        $(document.body).addClass('on').addClass('cursor').removeClass('hide').off('click', '.btnSend').on('click', '.btnSend', function() {
            if(!kittyface_power) return false;
            if ($("#preview_select").val() == "send") {
                $("#config_modal").modal("close");
                var tmp_id = $(this).attr('data-index');

                alertID = tmp_id;

                tmp_id = alerts[tmp_id].bits;
                user_trigger = true;
                if(tmp_id == "none"){
                    if (user_trigger) {
                        sendAction("bitdone", alertID, "broadcast");
                        sendAction("sendTextThanks", "chat######" + alertID, "broadcaster");
                        updateLeaderboard("chat", "0", alerts[alertID].img_url);
                        user_trigger = false;
                        alertID = undefined;
                        Materialize.toast("<p>chat " +  (typeof window.lang[lang_code] != "undefined" ? window.lang[window.lang_code].tooltip_bits_config_complete : "send a pupface of") + " 0 bits</p>", 4000);
                    }

                    setTimeout(_buildLeaderboard, 2000);
                } else {
                    twitch.bits.useBits(tmp_id - 1);
                }
            } else {
                $("#config_modal").modal("close");
                ejecuta_alert($(this).attr('data-index'));
            }
        });

        $(window).resize(function(event) {
            if($(window).width() <= 400){
                $('.overlay_custom').addClass('overlay_custom_scale');
            } else {
                $('.overlay_custom').removeClass('overlay_custom_scale');
            }
        });

        $('.btnShowModal').off('click').on('click', function(e) {
            $("#config_modal").modal("open");
            setTimeout(function() {
                $("#config_modal").niceScroll();
                $('.label_leaderboard_tab_kittyfaces').trigger('click');
            }, 300);
        });

        $(document.body).off('mouseover').on('mouseover', function() {
            if (ejecutando) return;
            $('.form_view').stop().animate({
                'opacity': 1
            }, 'fast');
        }).off('mouseout').on('mouseout', function() {
            if (ejecutando) return;
            $('.form_view').stop().animate({
                'opacity': 0
            }, 'fast');
        });

        $('.tooltiped').tooltip({
            html: true
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
                    'version': 'kittyface',
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
                                if (debug) console.log(tmp_content);
                                tmp_content = decodeJWT(tmp_content);
                                if (debug) console.log(tmp_content);
                                alerts.poweron = tmp_content["poweron"];

                                $('.btnShowModal').removeClass('top').removeClass('center_btn').removeClass('bottom').removeClass('right').removeClass('left');

                                if (tmp_content.viewerbtn == "center") {
                                    $('.btnShowModal').addClass('center_btn');
                                }
                                if (tmp_content.viewerbtn == "cleft") {
                                    $('.btnShowModal').addClass('center_btn').addClass('left');
                                }
                                if (tmp_content.viewerbtn == "cright") {
                                    $('.btnShowModal').addClass('center_btn').addClass('right');
                                }
                                if (tmp_content.viewerbtn == "tleft") {
                                    $('.btnShowModal').addClass('top').addClass('left');
                                }
                                if (tmp_content.viewerbtn == "tright") {
                                    $('.btnShowModal').addClass('top').addClass('right');
                                }
                                if (tmp_content.viewerbtn == "tcenter") {
                                    $('.btnShowModal').addClass('top').addClass('center_btn');
                                }
                                if (tmp_content.viewerbtn == "bleft") {
                                    $('.btnShowModal').addClass('bottom').addClass('left');
                                }
                                if (tmp_content.viewerbtn == "bright") {
                                    $('.btnShowModal').addClass('bottom').addClass('right');
                                }
                                if (tmp_content.viewerbtn == "bcenter") {
                                    $('.btnShowModal').addClass('bottom').addClass('center_btn');
                                }
                                $(".btnShowModal").fadeIn('fast', function() {
                                    $(".btnShowModal").removeClass('hide');
                                });
                                $.each(alerts, function(index, val) {
                                    var tmp_index = index + 1;
                                    alerts[index].img_url = tmp_content["tier" + tmp_index + "_img"];
                                    alerts[index].body = tmp_content["tier" + tmp_index + "_body"];
                                    alerts[index].bits = tmp_content["tier" + tmp_index + "_bits"];
                                    alerts[index].confetti = tmp_content["tier" + tmp_index + "_confetti"];
                                    alerts[index].iconres = tmp_content["tier" + tmp_index + "_iconres"];
                                    alerts[index].font = tmp_content["tier" + tmp_index + "_font"];
                                    alerts[index].font_color = tmp_content["tier" + tmp_index + "_font_color"];
                                    alerts[index].glow_light = tmp_content["tier" + tmp_index + "_glow_light"];
                                    alerts[index].glow_hard = tmp_content["tier" + tmp_index + "_glow_hard"];
                                    alerts[index].alert_position = tmp_content["tier" + tmp_index + "_position"];
                                    alerts[index].alert_fadein = tmp_content["tier" + tmp_index + "_fadein"];
                                    alerts[index].alert_fadeout = tmp_content["tier" + tmp_index + "_fadeout"];
                                    alerts[index].type_img = tmp_content["tier" + tmp_index + "_type_img"];
                                    alerts[index].shape_img = tmp_content["tier" + tmp_index + "_shape_img"];
                                    alerts[index].audio_url = tmp_content["tier" + tmp_index + "_audio_url"];
                                    alerts[index].audio_volumen = tmp_content["tier" + tmp_index + "_audio_volumen"];
                                    alerts[index].video_url = tmp_content["tier" + tmp_index + "_video_url"];
                                    alerts[index].timer_time = tmp_content["tier" + tmp_index + "_timer_time"];
                                    alerts[index].status = tmp_content["tier" + tmp_index + "_status"];
                                });

                                twitch.bits.getProducts().then(function(products) {
                                    root.products = products;
                                });

                                buildButtons();
                            }
                        }
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

            if(context.isMuted){
                main_vol = 0;
            } else {
                main_vol = context.volume;
            }
        });

        twitch.bits.onTransactionCancelled(function() {
            if (user_trigger) {
                if (typeof cleanToast != "undefined") {
                    clearInterval("cleanToast");
                    cleanToast = undefined;
                }
                Materialize.toast('<p><img src="img/TopHamBTTV.png" class="tooltiped" data-tooltip="Thxs" data-position="top" alt="TopHam" />??</p>', 3000);
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_bits_error : '<p>Something wrong happends, please try again.</p>'), 5000);

                cleanToast = setInterval(function() {
                    clearInterval("cleanToast");
                    $("#toast-container").remove();
                }, 5050);
                user_trigger = false;
            }
        });

        twitch.bits.onTransactionComplete(function(TransactionObject) {
            if (debug) console.log(TransactionObject.userId, root.auth.userId);
            if (user_trigger) {
                sendAction("bitdone", alertID, "broadcast");
                sendAction("sendTextThanks", TransactionObject.displayName + "######" + alertID, "broadcaster");
                updateLeaderboard(TransactionObject.displayName, TransactionObject.product.cost.amount, alerts[alertID].img_url);
                user_trigger = false;
                alertID = undefined;
                Materialize.toast("<p>@" + TransactionObject.displayName + " " +  (typeof window.lang[lang_code] != "undefined" ? window.lang[window.lang_code].tooltip_bits_config_complete : "send a kittyface of")+ " " + TransactionObject.product.cost.amount + " bits</p>", 4000);
            }

            setTimeout(_buildLeaderboard, 2000);
        });

        twitch.listen("broadcast", function(target, contentType, object) {
            object = JSON.parse(object);
            if (debug) console.log(object);
            if (object.msg == "updateConfig") {
                $.ajax({
                    url: endpoint,
                    type: 'POST',
                    data: {
                        'm': 'getconfig',
                        'version': 'kittyface',
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
                                tmp_content = decodeJWT(tmp_content);
                                if (debug) console.log(tmp_content);

                                alerts.poweron = tmp_content.poweron;

                                $('.btnShowModal').removeClass('top').removeClass('center_btn').removeClass('bottom').removeClass('right').removeClass('left');

                                if (tmp_content.viewerbtn == "center") {
                                    $('.btnShowModal').addClass('center_btn');
                                }
                                if (tmp_content.viewerbtn == "cleft") {
                                    $('.btnShowModal').addClass('center_btn').addClass('left');
                                }
                                if (tmp_content.viewerbtn == "cright") {
                                    $('.btnShowModal').addClass('center_btn').addClass('right');
                                }
                                if (tmp_content.viewerbtn == "tleft") {
                                    $('.btnShowModal').addClass('top').addClass('left');
                                }
                                if (tmp_content.viewerbtn == "tright") {
                                    $('.btnShowModal').addClass('top').addClass('right');
                                }
                                if (tmp_content.viewerbtn == "tcenter") {
                                    $('.btnShowModal').addClass('top').addClass('center_btn');
                                }
                                if (tmp_content.viewerbtn == "bleft") {
                                    $('.btnShowModal').addClass('bottom').addClass('left');
                                }
                                if (tmp_content.viewerbtn == "bright") {
                                    $('.btnShowModal').addClass('bottom').addClass('right');
                                }
                                if (tmp_content.viewerbtn == "bcenter") {
                                    $('.btnShowModal').addClass('bottom').addClass('center_btn');
                                }
                                $(".btnShowModal").fadeIn('fast', function() {
                                    $(".btnShowModal").removeClass('hide');
                                });
                                alerts.viewerbtn = tmp_content.viewerbtn;
                                $.each(alerts, function(index, val) {
                                    var tmp_index = index + 1;
                                    alerts[index].img_url = tmp_content["tier" + tmp_index + "_img"];
                                    alerts[index].body = decodeURI(tmp_content["tier" + tmp_index + "_body"]);
                                    alerts[index].bits = decodeURI(tmp_content["tier" + tmp_index + "_bits"]);
                                    alerts[index].confetti = decodeURI(tmp_content["tier" + tmp_index + "_confetti"]);
                                    alerts[index].iconres = decodeURI(tmp_content["tier" + tmp_index + "_iconres"]);
                                    alerts[index].font = decodeURI(tmp_content["tier" + tmp_index + "_font"]);
                                    alerts[index].font_color = decodeURI(tmp_content["tier" + tmp_index + "_font_color"]);
                                    alerts[index].glow_light = tmp_content["tier" + tmp_index + "_glow_light"];
                                    alerts[index].glow_hard = tmp_content["tier" + tmp_index + "_glow_hard"];
                                    alerts[index].alert_position = tmp_content["tier" + tmp_index + "_position"];
                                    alerts[index].alert_fadein = tmp_content["tier" + tmp_index + "_fadein"];
                                    alerts[index].alert_fadeout = tmp_content["tier" + tmp_index + "_fadeout"];
                                    alerts[index].type_img = tmp_content["tier" + tmp_index + "_type_img"];
                                    alerts[index].shape_img = tmp_content["tier" + tmp_index + "_shape_img"];
                                    alerts[index].audio_url = tmp_content["tier" + tmp_index + "_audio_url"];
                                    alerts[index].audio_volumen = tmp_content["tier" + tmp_index + "_audio_volumen"];
                                    alerts[index].video_url = tmp_content["tier" + tmp_index + "_video_url"];
                                    alerts[index].timer_time = tmp_content["tier" + tmp_index + "_timer_time"];
                                    alerts[index].status = tmp_content["tier" + tmp_index + "_status"];
                                });

                                twitch.bits.getProducts().then(function(products) {
                                    root.products = products;
                                });

                                buildButtons();
                            }
                        }
                    }
                });
            }
            if (object.msg == "bitdone" && $.inArray(object.id, check_command) == -1) {
                ejecuta_alert(object.data);
                check_command.push(object.id);
            }
            if (object.msg == "sendTextThanks" && twitch.viewer.role == object.target && $.inArray(object.id, check_command) == -1) {
                var tmp_data = object.data.split("######");
                if (debug) console.log(decodeURI(alerts[tmp_data[1]].iconres));
                if(decodeURI(alerts[tmp_data[1]].iconres) !== "") send_text("@" + tmp_data[0] + " " + decodeURI(alerts[tmp_data[1]].iconres));
                check_command.push(object.id);
                root.tmp_alert = undefined;
            }
            if (object.msg == "sendText" && twitch.viewer.role == object.target && $.inArray(object.id, check_command) == -1) {
                send_text(object.data);
                check_command.push(object.id);
            }
            if (object.msg == "kittyfaceOn") {
                kittyface_power = true;
                $('.modal').modal('close');
                $('.btnShowModal').fadeIn('fast', function() {
                    Materialize.toast("kittyfaces on", 3000);
                });
            }
        });

        setTimeout(function() {
            if (typeof root.auth == "undefined") buildButtons();
        }, 1000);

        $(window).resize(function() {
            $("#config_modal").niceScroll().resize();
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
        kittyface.setLang();
    }
    kittyface.init();
});