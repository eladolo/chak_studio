/**
    Copyright 2012 Michael Morris-Pearce

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
window.pianoon = (function() {
    var twitch = window.Twitch.ext;
    var root = this;
    var main_vol = 0.0;
    var debug = false;
    var pianoon_power = true;
    var ejecutando = false;
    var user_trigger = false;
    var cleanToast;
    var bitsID;
    var endpoint = 'https://apiext.chakstudio.com/';

    /* Piano keyboard pitches. Names match sound files by ID attribute. */
    var keys = [
        'A2', 'BB2', 'B2', 'C3', 'DB3', 'D3', 'EB3', 'E3', 'F3', 'GB3', 'G3', 'AB3',
        'A3', 'BB3', 'B3', 'C4', 'DB4', 'D4', 'EB4', 'E4', 'F4', 'GB4', 'G4', 'AB4',
        'A4', 'BB4', 'B4', 'C5'
    ];
    /* Corresponding keyboard keycodes, in order w/ 'keys'. */
    /* QWERTY layout:
    /*   upper register: Q -> P, with 1-0 as black keys. */
    /*   lower register: Z -> M, , with A-L as black keys. */
    var codes = [
        90, 83, 88, 67, 70, 86, 71, 66, 78, 74, 77, 75,
        81, 50, 87, 69, 52, 82, 53, 84, 89, 55, 85, 56,
        73, 57, 79, 80
    ];
    var pedal = 32; /* Keycode for sustain pedal. */
    var tonic = 'A2'; /* Lowest pitch. */
    /* Piano state. */
    var intervals = {};
    var depressed = {};
    /* Selectors */
    var pianoClass = function(name) {
        return '.piano-' + name;
    };
    var soundId = function(id) {
        return 'sound-' + id;
    };
    var sound = function(id) {
        var it = document.getElementById(soundId(id));
        return it;
    };
    /* Virtual piano keyboard events. */
    var keyup = function(code) {
        var offset = codes.indexOf(code);
        var k;
        if (offset >= 0) {
            k = keys.indexOf(tonic) + offset;
            return keys[k];
        }
    };
    var keydown = function(code) {
        return keyup(code);
    };
    var press = function(key) {
        var audio = sound(key);
        if (depressed[key]) {
            return;
        }
        clearInterval(intervals[key]);
        if (audio) {
            audio.pause();
            audio.volume = main_vol;
            if (audio.readyState >= 2) {
                audio.currentTime = 0;
                audio.play();
                depressed[key] = true;
            }
        }
        $(pianoClass(key)).animate({
            'backgroundColor': (typeof root.config != "undefined") ? root.config.playnote_color : '#FE2E9A'
        }, 0);
    };
    /* Manually diminish the volume when the key is not sustained. */
    /* These values are hand-selected for a pleasant fade-out quality. */
    var fade = function(key) {
        var audio = sound(key);
        var stepfade = function() {
            if (audio) {
                if (audio.volume < 0.03) {
                    kill(key)();
                } else {
                    if (audio.volume > 0.2) {
                        audio.volume = audio.volume * 0.95;
                    } else {
                        audio.volume = audio.volume - 0.01;
                    }
                }
            }
        };
        return function() {
            clearInterval(intervals[key]);
            intervals[key] = setInterval(stepfade, 5);
        };
    };
    /* Bring a key to an immediate halt. */
    var kill = function(key) {
        var audio = sound(key);
        return function() {
            clearInterval(intervals[key]);
            if (audio) {
                audio.pause();
            }
            if (key.length > 2) {
                $(pianoClass(key)).animate({
                    'backgroundColor': 'black'
                }, 300, 'easeOutExpo');
            } else {
                $(pianoClass(key)).animate({
                    'backgroundColor': 'white'
                }, 300, 'easeOutExpo');
            }
        };
    };
    /* Simulate a gentle release, as opposed to hard stop. */
    var fadeout = true;
    /* Sustain pedal, toggled by user. */
    var sustaining = false;
    /* Register mouse event callbacks. */
    keys.forEach(function(key) {
        $(pianoClass(key)).mousedown(function() {
            $(pianoClass(key)).animate({
                'backgroundColor': (typeof root.config != "undefined") ? root.config.playnote_color : '#FE2E9A'
            }, 0);
            press(key);
        });
        if (fadeout) {
            $(pianoClass(key)).mouseup(function() {
                depressed[key] = false;
                if (!sustaining) {
                    fade(key)();
                }
            });
        } else {
            $(pianoClass(key)).mouseup(function() {
                depressed[key] = false;
                if (!sustaining) {
                    kill(key)();
                }
            });
        }
    });

    var play_notes = function(msg){
        var tosound = msg[0].split(",");
        var wait = 800;
        var range = 2;
        var octave_rounds = 0;
        var octave_round_change = 0;
        var octave_change = false;
        var init_set = false;
        var scale_length = tosound.length;

        $("#config_modal").modal("close");

        $.each(tosound, function(index_c, sound) {
            sound = sound.replace(" ", "");
            if(sound == "C" || sound == "C#") {
                octave_round_change = index_c + 1;
                return false;
            }
        });

        if(octave_round_change == "0"){
            $.each(tosound, function(index_c, sound) {
                sound = sound.replace(" ", "");
                if(sound == "Db") {
                    octave_round_change = index_c + 1;
                    return false;
                }
            });
        }

        $(".msg_res").html("");
        $(".piano").fadeIn('1200', function() {
            ejecutando = true;
            $.each(tosound, function(index, el) {
                octave_rounds++;
                var el_orig = el.replace(" ", "");

                //change range
                if((enharmonics(el_orig) != "A" && enharmonics(el_orig) != "A#" && enharmonics(el_orig) != "B" && enharmonics(el_orig) != "Bb") && index === 0 && !init_set) {
                    range++;
                    octave_change = true;
                } else {
                    octave_change = true;
                }
                if(octave_rounds == octave_round_change && init_set) range++;
                if("1" == octave_round_change && octave_rounds == scale_length && init_set) range++;
                if(octave_change) {
                    octave_change = false;
                    init_set = true;
                }
                if(enharmonics(el_orig) != "C" && range == 5) range--;

                //play note
                el = enharmonics(el_orig) + range;
                setTimeout(function(){
                    if(debug) console.log(enharmonics(el_orig));
                    var tmp_round = index + 1;
                    var tmp_range = el.replace(enharmonics(el_orig), "");
                    var tmp_ele = el.toUpperCase();
                    var tmp_orig = el_orig;
                    var tmp_res = enharmonics(tmp_orig) != tmp_orig ? tmp_orig + "/" + enharmonics(tmp_orig) : tmp_orig;
                    var tmp_html = tmp_round == scale_length ? $(".msg_res").html() + tmp_res + tmp_range : $(".msg_res").html() + tmp_res + tmp_range + " <b style='color: white !important;'>-</b> ";
                    $(".msg_res").html(tmp_html);
                    $('.piano-' + tmp_ele).trigger('mousedown');
                    setTimeout(function(){
                        var tmp_ele = el.toUpperCase();
                        $('.piano-' + tmp_ele).trigger('mouseup');

                        if(index == (tosound.length - 1)){
                            setTimeout(function(){
                                $(".piano").slideUp(500);
                                $(".msg_res").html("");
                                ejecutando = false;
                            }, 2800);
                        }
                    }, (wait * index === 0 ? 400 : wait + 400));
                }, wait * index);

                if(octave_rounds == scale_length) octave_rounds = 0;
            });
        });
    };

    var play_note = function(note){
        var wait = 1000;
        var range = 3;

        $("#config_modal").modal("close");

        $(".msg_res").html("");
        $(".piano").fadeIn('1200', function() {
            ejecutando = true;
            var el = note;
            el = enharmonics(note) + range;
            if(debug) console.log(el);
            setTimeout(function(){
                $(".msg_res").html($(".msg_res").html() + note + " ");
                $('.piano-' + el).trigger('mousedown');
                setTimeout(function(){
                    $('.piano-' + el).trigger('mouseup');
                    setTimeout(function(){
                        $(".piano").slideUp(1200);
                        $(".msg_res").html("");
                        ejecutando = false;
                    }, wait + 2800);
                }, wait + 1200);
            }, wait);
        });
    };

    var play_chords = function(msg){
        var tosound = msg[0].split(",");
        var wait = 40;
        var range = 2;
        var octave_rounds = 0;
        var octave_round_change = 0;
        var octave_change = false;
        var init_set = false;
        var scale_length = tosound.length;

        $("#config_modal").modal("close");

        $.each(tosound, function(index_c, sound) {
            sound = sound.replace(" ", "");
            if(sound == "C" || sound == "C#") {
                octave_round_change = index_c + 1;
                return false;
            }
        });

        if(octave_round_change == "0"){
            $.each(tosound, function(index_c, sound) {
                sound = sound.replace(" ", "");
                if(sound == "Db") {
                    octave_round_change = index_c + 1;
                    return false;
                }
            });
        }

        $(".msg_res").html("");
        $(".piano").fadeIn('1200', function() {
            ejecutando = true;
            $.each(tosound, function(index, el) {
                octave_rounds++;
                var el_orig = el.replace(" ", "");

                //change range
                if((enharmonics(el_orig) != "A" && enharmonics(el_orig) != "A#" && enharmonics(el_orig) != "B" && enharmonics(el_orig) != "Bb") && index === 0 && !init_set) {
                    range++;
                    octave_change = true;
                } else {
                    octave_change = true;
                }
                if(octave_rounds == octave_round_change && init_set) range++;
                if("1" == octave_round_change && octave_rounds == scale_length && init_set) range++;
                if(octave_change) {
                    octave_change = false;
                    init_set = true;
                }
                if(enharmonics(el_orig) != "C" && range == 5) range--;

                //play note
                el = enharmonics(el_orig) + range;
                setTimeout(function(){
                    if(debug) console.log(enharmonics(el_orig));
                    var tmp_round = index + 1;
                    var tmp_range = el.replace(enharmonics(el_orig), "");
                    var tmp_ele = el.toUpperCase();
                    var tmp_orig = el_orig;
                    var tmp_res = enharmonics(tmp_orig) != tmp_orig ? tmp_orig + "/" + enharmonics(tmp_orig) : tmp_orig;
                    var tmp_html = tmp_round == scale_length ? $(".msg_res").html() + tmp_res + tmp_range : $(".msg_res").html() + tmp_res + tmp_range + " <b style='color: white !important;'>-</b> ";
                    $(".msg_res").html(tmp_html);
                    $('.piano-' + tmp_ele).trigger('mousedown');
                    setTimeout(function(){
                        var tmp_ele = el.toUpperCase();
                        $('.piano-' + tmp_ele).trigger('mouseup');

                        if(index == (tosound.length - 1)){
                            setTimeout(function(){
                                $(".piano").slideUp(500);
                                $(".msg_res").html("");
                                ejecutando = false;
                            }, 2800);
                        }
                    }, (wait * index === 0 ? 1200 : wait + 1200));
                }, wait * index);

                if(octave_rounds == scale_length) octave_rounds = 0;
            });
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
                if(twitch.viewer.role == "broadcaster"){
                    twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "playnotes", "data": res.response.data}));
                    send_text(res.response.data);
                } else {
                    sendAction("playnotes", res.response.data, "broadcast");
                    sendAction("sendText", res.response.data, "broadcaster");
                }
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
                if(twitch.viewer.role == "broadcaster"){
                    twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "playchords", "data": res.response.data}));
                    send_text(res.response.data);
                } else {
                    sendAction("playchords", res.response.data, "broadcast");
                    sendAction("sendText", res.response.data, "broadcaster");
                }
            }
        });
    };

    var enharmonics = function(element){
        element = (element.indexOf("#") > 0) ? element.toUpperCase() : element;
        var tmp_notes = {
            'Cb':'B',
            'Fb':'E',
            'Abb':'G',
            'Bbb':'A',
            'Cbb':'Bb',
            'Dbb':'C',
            'Ebb':'D',
            'Fbb':'Eb',
            'Gbb':'F',
            'A#':'Bb',
            'B#':'C',
            'C#':'Db',
            'D#':'Eb',
            'E#':'F',
            'F#':'Gb',
            'G#':'Ab',
            'A##':'B',
            'B##':'Db',
            'C##':'D',
            'D##':'E',
            'E##':'Gb',
            'F##':'G',
            'G##':'A'
        };
        if(typeof tmp_notes[element] != "undefined"){
            element = tmp_notes[element];
        }
        return element;
    };

    var getConfig = function(){
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
                            if (debug) console.log(tmp_content);
                            tmp_content = decodeJWT(tmp_content);
                            if (debug) console.log(tmp_content);
                            root.config = tmp_content;

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

                            if(tmp_content.poweron == "0" && twitch.viewer.role != "broadcaster"){
                                $('.modal').modal('close');
                                $('.btnShowModal').fadeOut('fast', function() {
                                    Materialize.toast("piano off", 3000);
                                    pianoon_power = false;
                                });
                            } else {
                                $('.btnShowModal').fadeIn('fast', function() {
                                    Materialize.toast("piano on", 3000);
                                    pianoon_power = true;
                                });
                            }

                            _buildLeaderboard();
                        }
                    }
                } else {
                    if(twitch.viewer.role == "broadcaster"){
                        $('.btnShowModal').removeClass('hide');
                        _buildLeaderboard();
                    }
                }
            }
        });
    };

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

    var sendAction = function(msg, data, target) {
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
            success: function(res) {}
        });
    };

    var updateLeaderboard = function(username, bits, value) {
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'updateLeaderboard',
                'version': 'pianoon',
                'client': auth.clientId,
                'channel': auth.channelId,
                'user': auth.userId,
                'token': auth.token,
                'username': username,
                'bits': bits,
                'value': value
            },
            dataType: 'json',
            success: function(res) {
                _buildLeaderboard();
            }
        });
    };

    var _buildLeaderboard = function(){
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                'm': 'getLeaderboard',
                'version': 'pianoon',
                'channel': auth.channelId,
                'token': auth.token
            },
            dataType: 'json',
            success: function(res) {
                if (res.response.success) {
                    var tmp_content = res.response;
                    if(debug) console.log(tmp_content);
                    var tmp_users10 = tmp_content.top10users;
                    var tmp_notes10 = tmp_content.top10val;
                    var tmp_bits10 = tmp_content.top10bits;

                    $('.tb_views tbody, .tb_values tbody, .tb_bits tbody').html('');

                    $.each(tmp_users10, function(index, val) {
                        var tmp_tr = '<tr><td>' + val.username + '</td><td>' + val.bits + '</td></tr>';
                        $('.tb_views tbody').append(tmp_tr);
                    });

                    $.each(tmp_notes10, function(index, val) {
                        tmp_tr = '<tr><td style="width:80px;">' + val.value.replace(/\*\*\*/g, '').replace(/none/g, '') + '</td><td>' + val.times + '</td><td>' + val.spend + '</td></tr>';
                        $('.tb_values tbody').append(tmp_tr);
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

        $('.btnShowModal').off('click').on('click', function(e) {
            $("#config_modal").modal("open");
            setTimeout(function() {
                $('.tab a[href="#main"]').trigger('click');
                $("#config_modal").niceScroll();
                $('.label_leaderboard_tab_piano').trigger('click');
            }, 200);
        });

        $('.btnPlayScale').off('click').on('click', function(e) {
            root.tmp_scale = $('#note_select').val() + $('#alterations_select').val() + " " + $('#mode_select').val();
            if (twitch.viewer.role != "broadcaster" && root.config.scale_notes_bits != "0") {
                var tmp_id = root.config.scale_notes_bits;
                user_trigger = true;
                twitch.bits.useBits(tmp_id);
            } else {
                scalenotes(tmp_scale);
                updateLeaderboard("anon", "0", tmp_scale);
                root.tmp_scale = undefined;
            }
            $("#config_modal").modal("close");
        });

        $('.btnPlayChord').off('click').on('click', function(e) {
            root.tmp_chord = $('#note_select').val() + $('#alterations_select').val() + " " + $('#second_select').val() + "***" + $('#fourth_select').val() + "***" + $('#six_select').val() + "***" + $('#third_select').val() + "***" + $('#fith_select').val() + "***" + $('#seven_select').val() + "***" + $('#nine_select').val() + "***" + $('#eleven_select').val() + "***" + $('#thirteen_select').val();
            if (twitch.viewer.role != "broadcaster" && root.config.chord_notes_bits != "0") {
                var tmp_id = root.config.chord_notes_bits;
                user_trigger = true;
                twitch.bits.useBits(tmp_id);
            } else {
                chordnotes(tmp_chord);
                updateLeaderboard("anon", "0", tmp_chord);
                root.tmp_chord = undefined;
            }
            $("#config_modal").modal("close");
        });

        $('.btnPlayNotes').off('click').on('click', function(e) {
            if ($("#custom_notes").val() === "") {
                Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_custom_notes_empty : "Don´t let custom notes empty"), 3000);
                return;
            }
            root.tmp_notes = runSanitizer($('#custom_notes').val());
            if(twitch.viewer.role == "broadcaster" || root.config.custom_notes_bits == "0"){
                if(twitch.viewer.role == "broadcaster"){
                    twitch.send("broadcast", "application/json", JSON.stringify({ "msg": "playnotes", "data": tmp_notes}));
                    send_text(tmp_notes);
                } else {
                    sendAction("playnotes", tmp_notes, "broadcast");
                    sendAction("sendText", tmp_notes, "broadcaster");
                }
                updateLeaderboard("anon", "0", tmp_notes);
                root.tmp_notes = undefined;
            } else {
                var tmp_id = root.config.custom_notes_bits;
                user_trigger = true;
                twitch.bits.useBits(tmp_id);
            }
            $("#config_modal").modal("close");
        });

        $(document.body).off('mouseover').on('mouseover', function() {
            if (ejecutando) return;
            $('.form_view').stop().animate({
                'opacity': 1
            }, 'fast');
        }).off('mouseout').on('mouseout', function() {
            if (ejecutando) return;
            $('.form_view').stop().animate({
                'opacity': 0.4
            }, 'fast');
        });

        /* Register keyboard event callbacks. */
        $('.piano-black, .piano-white').keydown(function(event) {
            if (event.which === pedal) {
                sustaining = true;
                $(pianoClass('pedal')).addClass('piano-sustain');
            }
            if(debug) console.log($(this).attr('data-note'));
            press(keydown(event.which));

            if(typeof event.which == "undefined") {
                press($(this).attr('data-note'));
            }
        });
        $('.piano-black, .piano-white').keyup(function(event) {
            if (event.which === pedal) {
                sustaining = false;
                $(pianoClass('pedal')).removeClass('piano-sustain');
                Object.keys(depressed).forEach(function(key) {
                    if (!depressed[key]) {
                        if (fadeout) {
                            fade(key)();
                        } else {
                            kill(key)();
                        }
                    }
                });
            }
            if (keyup(event.which)) {
                depressed[keyup(event.which)] = false;
                if (!sustaining) {
                    if (fadeout) {
                        fade(keyup(event.which))();
                    } else {
                        kill(keyup(event.which))();
                    }
                }
            }
            if(typeof event.which == "undefined") {
                fade($(this).attr('data-note'))();
                depressed[$(this).attr('data-note')] = false;
            }
        });

        //Twitch helpers
        twitch.onAuthorized(function(auth) {
            root.auth = auth;
            sessionStorage.twitchOAuthToken = auth.token;
            if (debug) console.log(auth);
            getConfig();
        });

        twitch.onContext(function(context, attr) {
            if(context.theme == "dark"){
                $("body").removeClass('dark_theme');
            } else {
                $("body").removeClass('dark_theme');
            }

            if(context.isMuted){
                main_vol = 0.0;
            } else {
                main_vol = context.volume;
            }

            if(debug) console.log(main_vol);
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
            }
            user_trigger = false;
            root.tmp_scale = undefined;
            root.tmp_chord = undefined;
            root.tmp_notes = undefined;
        });

        twitch.bits.onTransactionComplete(function(TransactionObject) {
            if (debug) console.log(TransactionObject.userId, root.auth.userId);
            if (user_trigger) {
                user_trigger = false;
                Materialize.toast("<p>@" + TransactionObject.displayName + " " +  (typeof window.lang[lang_code] != "undefined" ? window.lang[window.lang_code].tooltip_bits_config_complete : "send notes of") + " " + TransactionObject.product.cost.amount + " bits</p>", 4000);
                if(typeof tmp_scale != "undefined"){
                    scalenotes(tmp_scale);
                    updateLeaderboard(TransactionObject.displayName, TransactionObject.product.cost.amount, tmp_scale);
                    root.tmp_scale = undefined;
                }
                if(typeof tmp_chord != "undefined"){
                    chordnotes(tmp_chord);
                    updateLeaderboard(TransactionObject.displayName, TransactionObject.product.cost.amount, tmp_chord);
                    root.tmp_chord = undefined;
                }
                if(typeof tmp_notes != "undefined"){
                    setTimeout(function(){sendAction("playnotes", encodeURI(tmp_notes), "broadcast");}, 500);
                    setTimeout(function(){
                        var tmp_trans = TransactionObject;
                        sendAction("sendText", tmp_notes, "broadcaster");
                        updateLeaderboard(tmp_trans.displayName, tmp_trans.product.cost.amount, tmp_notes);
                        root.tmp_notes = undefined;
                    }, 1000);
                }

                setTimeout(function(){
                    var tmp_trans = TransactionObject;
                    sendAction("updateConfig", "empty", "broadcast");
                    sendAction("sendTextThanks", encodeURI(tmp_trans.displayName + " " +  (typeof window.lang[lang_code] != "undefined" ? window.lang[window.lang_code].tooltip_bits_config_complete : "send notes for") + " " + tmp_trans.product.cost.amount + " bits"), "broadcaster");
                }, 2000);
            }
        });

        twitch.listen("broadcast", function(target, contentType, object) {
            object = JSON.parse(object);
            if (debug) console.log(object);
            if (object.msg == "playnotes") {
                play_notes([object.data]);
            }
            if (object.msg == "playchords") {
                play_chords([object.data]);
            }
            if (object.msg == "sendTextThanks" && object.target == twitch.viewer.role) {
                send_text("@" + decodeURI(object.data));
            }
            if (object.msg == "sendText" && object.target == twitch.viewer.role) {
                send_text(decodeURI(object.data));
            }
            if (object.msg == "updateConfig") {
                getConfig();
            }
        });
    };

    return {
        'playnote': play_note,
        'playnotes': play_notes,
        'playchords': play_chords,
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