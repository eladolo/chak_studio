window.pupface = (function(){
    var twitch = window.Twitch.ext;
    var root = this;
    var debug = true;

    var refreshSetting = function(){
        $.ajax({
            url: 'https://obss.amznws.access.ly/',
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
            success: function(res){
                if(typeof res.response["broadcaster:" + auth.channelId] != "undefined"){
                    var tmp_content = res.response["broadcaster:" + auth.channelId].record.content;
                    if(verifyJWT(tmp_content)){
                        twitch.send("broadcast", "application/json", JSON.stringify({"msg" : "updateConfig", "data": tmp_content}));
                        tmp_content = decodeJWT(tmp_content);
                        if(debug) console.log(tmp_content);
                        twitch.bits.getProducts().then(function(products){
                            root.products = products;

                            $.each(products, function(index, val) {
                                var tmp_index = index + 1;
                                if(typeof tmp_content["tier" + tmp_index + "_img"] != 'undefined' && tmp_content["tier" + tmp_index + "_img"] !== ''){
                                    $("#tier" + tmp_index + "_img_select").val(tmp_content["tier" + tmp_index + "_img"]);
                                    $("#tier" + tmp_index + "_img").val(tmp_content["tier" + tmp_index + "_img"]);
                                    $(".tier" + tmp_index + "_preview").attr('src', tmp_content["tier" + tmp_index + "_img"]);
                                } else {
                                    $("#tier" + tmp_index + "_img_select").val(alerts[index].img_url);
                                    $("#tier" + tmp_index + "_img").val(alerts[index].img_url);
                                    $(".tier" + tmp_index + "_preview").attr('src', alerts[index].img_url);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_body"] != 'undefined' && tmp_content["tier" + tmp_index + "_body"] !== ''){
                                    $("#tier" + tmp_index + "_body").val(decodeURI(tmp_content["tier" + tmp_index + "_body"]));
                                } else {
                                    $("#tier" + tmp_index + "_body").val(decodeURI(alerts[index].body));
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_glow_light"] != 'undefined' && tmp_content["tier" + tmp_index + "_glow_light"] !== ''){
                                    $("#tier" + tmp_index + "_glow_light").val(tmp_content["tier" + tmp_index + "_glow_light"]);
                                } else {
                                    $("#tier" + tmp_index + "_glow_light").val(alerts[index].glow_light);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_glow_hard"] != 'undefined' && tmp_content["tier" + tmp_index + "_glow_hard"] !== ''){
                                    $("#tier" + tmp_index + "_glow_hard").val(tmp_content["tier" + tmp_index + "_glow_hard"]);
                                } else {
                                    $("#tier" + tmp_index + "_glow_hard").val(alerts[index].glow_hard);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_position"] != 'undefined' && tmp_content["tier" + tmp_index + "_position"] !== ''){
                                    $("#tier" + tmp_index + "_position").val(tmp_content["tier" + tmp_index + "_position"]);
                                } else {
                                    $("#tier" + tmp_index + "_position").val(alerts[index].alert_position);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_fadein"] != 'undefined' && tmp_content["tier" + tmp_index + "_fadein"] !== ''){
                                    $("#tier" + tmp_index + "_fadein").val(tmp_content["tier" + tmp_index + "_fadein"]);
                                } else {
                                    $("#tier" + tmp_index + "_fadein").val(alerts[index].alert_fadein);
                                }
                                if(typeof tmp_content["tier" + tmp_index + "_fadeout"] != 'undefined' && tmp_content["tier" + tmp_index + "_fadeout"] !== ''){
                                    $("#tier" + tmp_index + "_fadeout").val(tmp_content["tier" + tmp_index + "_fadeout"]);
                                } else {
                                    $("#tier" + tmp_index + "_fadeout").val(alerts[index].alert_fadeout);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_type_img"] != 'undefined' && tmp_content["tier" + tmp_index + "_type_img"] !== ''){
                                    $("#tier" + tmp_index + "_type_img").val(tmp_content["tier" + tmp_index + "_type_img"]);
                                } else {
                                    $("#tier" + tmp_index + "_type_img").val(alerts[index].type_img);
                                }
                                if(typeof tmp_content["tier" + tmp_index + "_shape_img"] != 'undefined' && tmp_content["tier" + tmp_index + "_shape_img"] !== ''){
                                    $("#tier" + tmp_index + "_shape_img").val(tmp_content["tier" + tmp_index + "_shape_img"]);
                                } else {
                                    $("#tier" + tmp_index + "_shape_img").val(alerts[index].shape_img);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_audio_url"] != 'undefined' && tmp_content["tier" + tmp_index + "_audio_url"] !== ''){
                                    $("#tier" + tmp_index + "_audio_url").val(tmp_content["tier" + tmp_index + "_audio_url"]);
                                } else {
                                    $("#tier" + tmp_index + "_audio_url").val(alerts[index].audio_url);
                                }
                                if(typeof tmp_content["tier" + tmp_index + "_video_url"] != 'undefined' && tmp_content["tier" + tmp_index + "_video_url"] !== ''){
                                    $("#tier" + tmp_index + "_video_url").val(tmp_content["tier" + tmp_index + "_video_url"]);
                                } else {
                                    $("#tier" + tmp_index + "_video_url").val(alerts[index].video_url);
                                }

                                if(typeof tmp_content["tier" + tmp_index + "_timer_time"] != 'undefined' && tmp_content["tier" + tmp_index + "_timer_time"] !== ''){
                                    $("#tier" + tmp_index + "_timer_time").val(tmp_content["tier" + tmp_index + "_timer_time"]);
                                } else {
                                    $("#tier" + tmp_index + "_timer_time").val(alerts[index].timer_time);
                                }
                            });

                            $('select').material_select('update');
                        });
                    }
                }
            }
        });
    };

    var _init = function(){
        //Generate containers
        $('#tiers_content').html('');

        for (var i = 1; i <= 6; i++) {
            var tmp_tier = "tier" + i;
            var tmp_clon = $('#tierClon').clone();
            var tmp_buffer = '';

            tmp_clon.removeClass('hide');
            tmp_clon.attr('id', tmp_tier);
            tmp_buffer = tmp_clon.html();
            tmp_buffer = tmp_buffer.replace(new RegExp('tierClon', 'g'), tmp_tier);
            tmp_clon.html(tmp_buffer);

            $('#tiers_content').append(tmp_clon);
        };
        //Helpers
        $('.tooltiped').tooltip({
            html: true
        });
        $('select').material_select();

        $('ul.tabs').tabs();

        $('.pup_select').off('change').on('change', function(){
            var tmp_select = $(this);
            var tmp_id = tmp_select.attr('id');
            tmp_id = tmp_id.replace("_select", "");

            if(debug) console.log(tmp_id);

            if(tmp_select.val() === ""){
                $('#' + tmp_id).removeClass('hide');
            } else {
                if(!$('#' + tmp_id).hasClass('hide')) $('#' + tmp_id).addClass('hide');
            }

            $('#' + tmp_id).val(tmp_select.val()).trigger('focusout');
        });

        $('.imgChange').off('focusout').on('focusout', function(){
            var tmp_id = $(this).attr('id');
            var tmp_val = $(this).val();
            tmp_id = tmp_id.replace("_img", "_preview");
            if(debug) console.log(tmp_id);

            if(tmp_val.indexOf('https://www.dropbox.com') > -1) {
                tmp_val = tmp_val.replace('dl=0', 'dl=1');
                $(this).val(tmp_val);
            }

            $("." + tmp_id).attr('src', tmp_val);
        });

        $('.checkIMG, .checkAUDIO, .checkVIDEO').on('focusout', function(){
            var element = $(this);
            if(element.hasClass('checkIMG')){
                if(element.val() !== '' && element.val().indexOf('www.dropbox.com') == -1 && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(element.val()) === false){
                    Materialize.toast('<p>Invalid extension<br>Please try again</p>', 3000);
                    element.val('');
                }
            } else if(element.hasClass('checkAUDIO')){
                if(element.val() !== '' && element.val().indexOf('www.dropbox.com') == -1 && (/\.(wav|mp3|ogg)$/i).test(element.val()) === false){
                    Materialize.toast('<p>Invalid extension<br>Please try again</p>', 3000);
                    element.val('');
                }

                if(element.val().indexOf('https://www.dropbox.com') > -1) {
                    element.val(element.val().replace('dl=0', 'dl=1'));
                }
            } else if(element.hasClass('checkVIDEO')){
                if(element.val() !== '' && (/(:\/\/|http|https|www\.youtube\.com|youtube\.com|www\.)/i).test(element.val()) === true){
                    Materialize.toast('<p>Invalid format<br>Please try again</p>', 3000);
                    element.val('');
                }
            }
        });

        $('.btnSave').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function(){
            var tmp_config = {};

            for(var i = 0; i < alerts.length; i++){
                tmp_config["tier" + (i + 1) + "_img"] = $("#tier" + (i + 1) + "_img").val();
                tmp_config["tier" + (i + 1) + "_body"] = encodeURI($("#tier" + (i + 1) + "_body").val());
                tmp_config["tier" + (i + 1) + "_glow_light"] = $("#tier" + (i + 1) + "_glow_light").val();
                tmp_config["tier" + (i + 1) + "_glow_hard"] = $("#tier" + (i + 1) + "_glow_hard").val();
                tmp_config["tier" + (i + 1) + "_position"] = $("#tier" + (i + 1) + "_position").val();
                tmp_config["tier" + (i + 1) + "_fadein"] = $("#tier" + (i + 1) + "_fadein").val();
                tmp_config["tier" + (i + 1) + "_fadeout"] = $("#tier" + (i + 1) + "_fadeout").val();
                tmp_config["tier" + (i + 1) + "_type_img"] = $("#tier" + (i + 1) + "_type_img").val();
                tmp_config["tier" + (i + 1) + "_shape_img"] = $("#tier" + (i + 1) + "_shape_img").val();
                tmp_config["tier" + (i + 1) + "_audio_url"] = $("#tier" + (i + 1) + "_audio_url").val();
                tmp_config["tier" + (i + 1) + "_video_url"] = $("#tier" + (i + 1) + "_video_url").val();
                tmp_config["tier" + (i + 1) + "_timer_time"] = $("#tier" + (i + 1) + "_timer_time").val();
            }

            var jwt = signJWT(tmp_config);
            twitch.configuration.set("broadcaster", "0.1", jwt);
            twitch.send("broadcast", "application/json", JSON.stringify({"msg" : "updateConfig", "data": jwt}));
            Materialize.toast('<p>Configuration <b class="green-text">Saved</b>!</p>', 4000);
        });

        $('.btnReset').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function(){
            Materialize.toast('<p>The 6 tiers ara gonna be reset. <br> Are u sure?<br><br><a class="btnAccept green white-text btn">Yes</a> &nbsp;&nbsp; <a class="btnDecline red white-text btn">No</a></p>', 6000);
            $('.btnAccept').off('click').on('click', function(){
                var tmp_config = {};

                for(var i = 0; i < alerts.length; i++){
                    tmp_config["tier" + (i + 1) + "_img"] = alerts[i].img_url;
                    tmp_config["tier" + (i + 1) + "_body"] = decodeURI(alerts[i].body);
                    tmp_config["tier" + (i + 1) + "_glow_light"] = alerts[i].glow_light;
                    tmp_config["tier" + (i + 1) + "_glow_hard"] = alerts[i].glow_hard;
                    tmp_config["tier" + (i + 1) + "_position"] = alerts[i].alert_position;
                    tmp_config["tier" + (i + 1) + "_fadein"] = alerts[i].alert_fadein;
                    tmp_config["tier" + (i + 1) + "_fadeout"] = alerts[i].alert_fadeout;
                    tmp_config["tier" + (i + 1) + "_type_img"] = alerts[i].type_img;
                    tmp_config["tier" + (i + 1) + "_shape_img"] = alerts[i].shape_img;
                    tmp_config["tier" + (i + 1) + "_audio_url"] = alerts[i].audio_url;
                    tmp_config["tier" + (i + 1) + "_video_url"] = alerts[i].video_url;
                    tmp_config["tier" + (i + 1) + "_timer_time"] = alerts[i].timer_time;
                }

                var jwt = signJWT(tmp_config);
                twitch.configuration.set("broadcaster", "0.1", jwt);
                refreshSetting();
                Materialize.toast('<p>Configuration <b class="red-text">Reset</b>!</p>', 4000);
                $(this).parent().parent().remove();
            });

            $('.btnDecline').off('click').on('click', function(){
                $(this).parent().parent().remove();
            });
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

        var picker2 = new CP(document.querySelector('input[id="tier2_glow_light"]'));
        picker2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker2_2 = new CP(document.querySelector('input[id="tier2_glow_hard"]'));
        picker2_2.on("change", function(color) {
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

        var picker4 = new CP(document.querySelector('input[id="tier4_glow_light"]'));
        picker4.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker4_2 = new CP(document.querySelector('input[id="tier4_glow_hard"]'));
        picker4_2.on("change", function(color) {
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

        var picker6 = new CP(document.querySelector('input[id="tier6_glow_light"]'));
        picker6.on("change", function(color) {
            this.target.value = '#' + color;
        });

        var picker6_2 = new CP(document.querySelector('input[id="tier6_glow_hard"]'));
        picker6_2.on("change", function(color) {
            this.target.value = '#' + color;
        });

        //Twitch helpers
        twitch.onAuthorized(function(auth) {
            root.auth = auth;
            refreshSetting();
        });
    };

    return {
        'init': _init
    }
})();

$(function() {
    pupface.init();
});