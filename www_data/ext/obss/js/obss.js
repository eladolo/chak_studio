window.obss = (function(){
    var obs = new OBSWebSocket();
    var obsinterval;
    var lookupinterval;
    var streaming = false;
    var changeScene = false;
    var twitch = window.Twitch.ext;
    var debug = false;
    var endpoint = 'https://apiext.chakstudio.com/';

    var lookupobs = function(){
        if(typeof obsinterval == "undefined"){
            try{
                $('.toast').remove();
                $('.console_eco .content').html('Connecting to OBS');
                obs.connect({
                    address: runSanitizer($('#obs_url').val()),
                    password: runSanitizer($('#obs_pass').val())
                });
            } catch (ex) {
                $('.toast').remove();
                $('.console_eco .content').html('OBS exception : ' + ex);
            }

            obsinterval = setInterval(function(){
                clearInterval(obsinterval);
                obsinterval = undefined;
                obs.disconnect();
            }, 5000);
        }
    };
    var drawScenes = function(){
        $('#scene_list').html('').removeClass('hide');
        $('.console_eco').removeClass('hide');
        $('.btnStartStream, .btnStopStream').remove();
        obs.getSceneList().then(function(data) {
            data.scenes.forEach(function(scene) {
                var tmp_a = "<a class='btn cursor scene_btn' data-name='" + scene.name + "' style='width:100%;'>" + scene.name + "</a>";
                $('#scene_list').append(tmp_a);
            });
            if(streaming){
                $('.btnConnect').before("<a class='btn cursor btnStopStream red' style='width:100% !important;'>stop stream</a>");
            } else {
                $('.btnConnect').before("<a class='btn cursor btnStartStream green' style='width:100% !important;'>start stream</a>");
            }

            pager(5, 2, "#scene_list", "#scene_list a.btn");

            $('.scene_btn').off('click').on('click', function(){
                changeScene = true;
                var tmp_scene = $(this).attr("data-name");
                obs.setCurrentScene({
                    'scene-name': tmp_scene
                });
                $('.scene_btn').removeClass('pink darken-1');
                $('.scene_btn[data-name="' + tmp_scene + '"]').addClass('pink darken-1');
            });

            $(document.body).off('click', '.btnStartStream').on('click', '.btnStartStream', function(){
                obs.startStreaming();
                $('.toast').remove();
                $(this).addClass('btnStopStream');
                $(this).removeClass('btnStartStream');

                $(this).addClass('red');
                $(this).removeClass('green');
                $(this).html('stop stream');
                $('.toast').remove();
                Materialize.toast('<p>Streaming <b class="green-text">start</b></p>', 1500);
                streaming = true;
            });

            $(document.body).off('click', '.btnStopStream').on('click', '.btnStopStream', function(){
                obs.stopStreaming();
                $(this).removeClass('btnStopStream');
                $(this).addClass('btnStartStream');

                $(this).addClass('green');
                $(this).removeClass('red');
                $(this).html('start stream');
                $('.toast').remove();
                Materialize.toast('<p>Streaming <b class="red-text">stop</b></p>', 1500);
                streaming = false;
            });

            obs.GetCurrentScene().then(function(data) {
                $('.scene_btn[data-name="' + data.name + '"]').addClass('pink darken-1');
            });

            obs.getStreamingStatus().then(function(data) {
                if(data.streaming){
                    $('.btnStartStream').addClass('btnStopStream');
                    $('.btnStartStream').removeClass('btnStartStream');

                    $('.btnStopStream').addClass('red');
                    $('.btnStopStream').removeClass('green');
                    $('.btnStopStream').html('stop stream');
                    streaming = true;
                } else {
                    $('.btnStopStream').addClass('btnStartStream');
                    $('.btnStopStream').removeClass('btnStopStream');

                    $('.btnStartStream').addClass('green');
                    $('.btnStartStream').removeClass('red');
                    $('.btnStartStream').html('start stream');
                    streaming = false;
                }
            });
        });
    };
    var pager = function(paginar,agrupar,custom_obj,custom_content,destruir,total_ext){
        var obj_nombre = (typeof custom_obj != "undefined")?custom_obj:'.paginar_tabla';
        var obj_content = (typeof custom_content != "undefined")?custom_content:".paginar_tabla tbody tr";
        destruir = (typeof destruir != "undefined")?destruir:"none";

        $.each($(obj_nombre), function(index, val) {
            var inicio_items = 1;
            var total_items = 1;
            var paginar_por = paginar?paginar:10;
            var agrupar_por = agrupar?agrupar:5;
            var parent = $(this).parent();
            var paginador = '';
                paginador = '<paginador>';
                paginador += '    <p class="center white-text"><small><b class="leyenda_desde">' + inicio_items + '</b> to <b class="leyenda_hasta">' + paginar_por + '</b> from <b class="leyenda_total">' + total_items + '</b></small></p>';
                paginador += '    <ul class="center clear-anchor-bg pagination">';
                paginador += '        <li class="inicioPaginar">';
                paginador += '            <a class="cursor"><b><<</b></a>';
                paginador += '        </li>';
                paginador += '        <li class="backPaginar">';
                paginador += '            <a class="cursor"><b><</b></a>';
                paginador += '        </li>';
                paginador += '        <li class="nextPaginar">';
                paginador += '            <a class="cursor"><b>></b></a>';
                paginador += '        </li>';
                paginador += '        <li class="finPaginar">';
                paginador += '            <a class="cursor"><b>>></b></a>';
                paginador += '        </li>';
                paginador += '    </ul>';
                paginador += '    <div class="clearfix"></div>';
                paginador += '    <br />';
                paginador += '</paginador>';

            //si se pide destruir el plugin, muestra todo y destruye la instancia
            if(destruir == "destruir"){
                $(".paginador-reg", parent).show();
                $("paginador", parent).remove();
                $(obj_nombre, parent).removeMatchingClasses("paginador");
                $(obj_content, parent).removeMatchingClasses("paginador");
                return;
            }

            //inicia paginador limpiando alguna paginacion existente
            if($("paginador", parent).length > 0){
                $("paginador", parent).remove();

                $(obj_nombre, parent).removeMatchingClasses("paginador");
                $(obj_content, parent).removeMatchingClasses("paginador");
            }

            //verifica si hay la cantidad suficiente para paginar
            if($(obj_content, parent).length > paginar_por){
                $(obj_nombre, parent).after(paginador);//agrega el paginador

                //procesa la tabla a paginar
                var total = (typeof total_ext != "undefined")?total_ext:$(obj_content, parent).length;
                var contador = 0;
                var cuenta = 0;
                var pagina = 1;
                var paginas_totales = Math.ceil($(obj_content, parent).length/paginar_por);

                //console.log("reg totales: " + $(obj_content, parent).length);
                //console.log("paginas totales: " + paginas_totales);
                $.each($(obj_content, parent), function(index, val) {
                    var tmp_reg = $(this);
                    contador++;
                    cuenta++;

                    tmp_reg.addClass('paginador-registro_' + cuenta);
                    tmp_reg.addClass('paginador-pagina_' + pagina);
                    tmp_reg.addClass('paginador-reg');

                    if(contador == paginar_por){
                        contador = 0;
                        if(pagina < paginas_totales) pagina++;
                    }
                });

                $(".paginador-reg", parent).hide();
                $(".paginador-pagina_1", parent).show();

                $("paginador .leyenda_total", parent).html(total);

                //crea menu de links por cantidad de grupo
                var menu_links = function(index,back){
                    var tmp_index = index?index:1;
                    tmp_index = back?tmp_index - agrupar_por:tmp_index;
                    var tmp_who_index = back?tmp_index + agrupar_por - 1:tmp_index;
                    var paginas_totales = pagina;
                    var limite = (paginas_totales - tmp_index > agrupar_por)?agrupar_por:(paginas_totales - tmp_index + 1);
                    limite = (tmp_index + limite);
                    var index_last_grupo = (paginar_por * (paginas_totales - agrupar_por));
                    var index_grupo = (tmp_index * paginar_por);
                    if(index_grupo > index_last_grupo && index_last_grupo > 0){
                        tmp_index = tmp_who_index; //(paginas_totales - agrupar_por) + 2;
                    }

                    if(tmp_index <= 0) tmp_index = 1;

                    $("paginador ul li:not('.backPaginar'):not('.nextPaginar'):not('.inicioPaginar'):not('.finPaginar')",parent).remove();

                    $('.backPaginar,.nextPaginar', parent).removeClass('disable');
                    if(tmp_who_index == paginas_totales){
                        limite = paginas_totales + 1;
                        $('.nextPaginar', parent).addClass('disable');
                        var tmp_page = Math.ceil(tmp_who_index / agrupar_por);
                        tmp_index = ((tmp_page - 1) * agrupar_por) + 1;
                    }else if(tmp_who_index == 1){
                        $('.backPaginar', parent).addClass('disable');
                    }

                    for(tmp_index;tmp_index<limite;tmp_index++){
                        var tmp_li = "<li class=\"btnPaginarIndex\" data-index=\"" + tmp_index + "\"><a class=\"cursor\">" + tmp_index +  "</a></li>";
                        $("paginador ul .nextPaginar", parent).before(tmp_li);
                    }
                    $('.btnPaginarIndex[data-index=' + tmp_who_index + ']', parent).addClass('active');
                    $("paginador .leyenda_desde", parent).html((tmp_who_index * paginar_por) - paginar_por + 1);
                    var hasta_res = (tmp_who_index == paginas_totales)?$(obj_content, parent).length:tmp_who_index * paginar_por;
                    $("paginador .leyenda_hasta", parent).html(hasta_res);

                    $(".paginador-reg", parent).hide();
                    $(".paginador-pagina_" + tmp_who_index, parent).show();
                };

                //crea listener de links por menu
                var links_listeners = function(){
                    $('.btnPaginarIndex', parent).off('click').on('click', function(event) {
                        var who = $(this);
                        var paginas_totales = pagina;
                        var parent = who.parent().parent().parent();
                        var index = who.attr("data-index");

                        if(who.hasClass('active')){
                            return false;
                        }

                        $('.btnPaginarIndex', parent).removeClass('active');
                        who.addClass('active');

                        $(".paginador-reg", parent).hide();
                        $(".paginador-pagina_" + index, parent).show();

                        $("paginador .leyenda_desde", parent).html((index * paginar_por) - paginar_por + 1);
                        var hasta_res = (index == paginas_totales)?$(obj_content, parent).length:index * paginar_por;
                        $("paginador .leyenda_hasta", parent).html(hasta_res);

                        $('.backPaginar,.nextPaginar', parent).removeClass('disable');

                        if(index == paginas_totales){
                            $('.nextPaginar', parent).addClass('disable');
                        }else if(index == 1){
                            $('.backPaginar', parent).addClass('disable');
                        }
                    });

                    $('.backPaginar,.nextPaginar', parent).off('click').on('click', function(event) {
                        var who = $(this);
                        var paginas_totales = pagina;
                        var agrupar = agrupar_por;
                        var parent = who.parent().parent().parent();
                        var seek = (who.hasClass('backPaginar'))?-1:1;
                        var index = parseInt(seek, 10) + parseInt($('.btnPaginarIndex.active', parent).attr("data-index"), 10);

                        if(who.hasClass('disable')){
                            return false;
                        }

                        if(seek == "1" && $('.btnPaginarIndex[data-index=' + index + ']', parent).length <= 0){
                            menu_links(index);
                            links_listeners();
                            return false;
                        }

                        if(seek == "-1" && $('.btnPaginarIndex[data-index=' + index + ']', parent).length <= 0){
                            menu_links(index + 1,true);
                            links_listeners();
                            return false;
                        }

                        $('.btnPaginarIndex', parent).removeClass('active');
                        $('.btnPaginarIndex[data-index=' + index + ']', parent).addClass('active');

                        $(".paginador-reg", parent).hide();
                        $(".paginador-pagina_" + index, parent).show();

                        $("paginador .leyenda_desde", parent).html((index * paginar_por) - paginar_por + 1);
                        var hasta_res = (index == paginas_totales)?$(obj_content, parent).length:index * paginar_por;
                        $("paginador .leyenda_hasta", parent).html(hasta_res);

                        $('.backPaginar,.nextPaginar', parent).removeClass('disable');

                        if(index == paginas_totales){
                            $('.nextPaginar', parent).addClass('disable');
                        }else if(index == 1){
                            $('.backPaginar', parent).addClass('disable');
                        }
                    });

                    $('.inicioPaginar,.finPaginar', parent).off('click').on('click', function(event) {
                        var who = $(this);
                        var parent = who.parent().parent().parent();
                        var paginas_totales = pagina;

                        if(who.hasClass('disable')){
                            return false;
                        }

                        if(who.hasClass('inicioPaginar')){
                            if($('.btnPaginarIndex[data-index=1]', parent).length > 0){
                                $('.btnPaginarIndex[data-index=1]', parent).trigger('click');
                                return;
                            }
                            menu_links(1);
                            links_listeners();
                            return false;
                        }else{
                            if($('.btnPaginarIndex[data-index=' + (paginas_totales) + ']', parent).length > 0){
                                $('.btnPaginarIndex[data-index=' + (paginas_totales) + ']', parent).trigger('click');
                                return;
                            }
                            menu_links(paginas_totales);
                            links_listeners();
                            return false;
                        }
                    });
                };

                //inicia paginador
                menu_links();
                links_listeners();
            }
        });
    };
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
        $('.btnConnect').addClass('on').addClass('cursor').removeClass('hide').off('click').on('click', function(){
            if($(this).hasClass('reload')){
                obs.disconnect();
            } else {
                if($('#obs_url').val() === '' || $('#obs_pass').val() === ''){
                    $('.toast').remove();
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_empty : '<p>Dont left any field <b class="red-text">empty</b>!</p>'), 4000);
                    return;
                }
                lookupobs();
            }
        });

        $('.btnShowModal').off('click').on('click', function() {
            $("#obss_modal").modal("open");
            setTimeout(function() {
                $("#obss_modal").niceScroll();
            }, 300);
        });

        $('.checkURL').on('focusout', function() {
            var element = $(this);
            if (element.hasClass('checkURL')) {
                if (element.val() !== '' && element.val().indexOf('wss://') < 0) {
                    Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].tooltip_invalid_format : '<p>Invalid format<br>Please try again</p>'), 3000);
                    element.val('');
                    return false;
                }
            }
        });

        $('.tooltiped').tooltip({
            out: 3000,
            html: true
        });
        $('.modal').modal();

        obs.onAuthenticationSuccess(function(res){
            $('.toast').remove();
            Materialize.toast((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_connected : '<p>OBS <b class="green-text">connected</b></p>'), 2000);
            $('.form_fields').fadeOut('fast');
            $('.btnConnect').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_close : 'close')).addClass('reload');
            drawScenes();
            $('.logoobss, .console_eco').addClass('hide');
            var jwt = signJWT({"url": $('#obs_url').val(),"password": $('#obs_pass').val()});
            window.Twitch.ext.configuration.set("broadcaster", "0.1", jwt);
        });

        obs.onAuthenticationFailure(function() {
            $('.toast').remove();
            $('.console_eco .content').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_error_credential : '<p>Check your credential and try again <b class="red-text">error</b></p>'));
            $('.btnConnect').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_connect : 'connect obs')).removeClass('reload');
            $('#scene_list').html('');
            $('.form_fields').fadeIn('fast');
        });

        obs.onConnectionOpened(function() {
            clearInterval(obsinterval);
            clearInterval(lookupinterval);
            obsinterval = undefined;
            lookupinterval = undefined;
        });

        obs.onConnectionClosed(function() {
            if($('.btnConnect').hasClass('reload') === false) {
                if(typeof lookupinterval == "undefined"){
                    lookupinterval = setInterval(function(){
                        lookupobs();
                    }, 7500);
                } else {
                    $('.toast').remove();
                    $('.logoobss, .console_eco').removeClass('hide');
                    $('.console_eco .content').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_check_again : '<p><b class="blue-text">Looking</b> again for obs</p>'));
                    $('.btnConnect').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_connect : 'connect obs')).removeClass('reload');
                    $('#scene_list').html('').addClass('hide');
                    $('.form_fields').fadeIn('fast');
                }
            } else {
                $('.toast').remove();
                $('.console_eco .content').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_check : '<p><b class="orange-text">Looking</b> for obs</p>'));
                $('.btnConnect').html((typeof window.lang[lang_code] != "undefined" ? window.lang[lang_code].label_obs_connect : 'connect obs')).removeClass('reload');
                $('#scene_list').html('').addClass('hide');
                $('.form_fields').fadeIn('fast');
                $('.logoobss, .console_eco').removeClass('hide');
                $('.btnStartStream, .btnStopStream').remove();
                pager(5, 2, "#scene_list", "#scene_list a.btn", true);
                lookupinterval = setInterval(function(){
                    lookupobs();
                }, 7500);
            }
        });

        obs.onSwitchScenes(function() {
            if(!changeScene){
                drawScenes();
            } else {
                changeScene = false;
            }
        });

        obs.onStreamStarted(function() {
            obs.getStreamingStatus().then(function(data){
                if(data.streaming){
                    $('.btnStartStream').addClass('btnStopStream');
                    $('.btnStartStream').removeClass('btnStartStream');

                    $('.btnStopStream').addClass('red');
                    $('.btnStopStream').removeClass('green');
                    $('.btnStopStream').html('stop');
                    streaming = true;
                } else {
                    $('.btnStopStream').addClass('btnStartStream');
                    $('.btnStopStream').removeClass('btnStopStream');

                    $('.btnStartStream').addClass('green');
                    $('.btnStartStream').removeClass('red');
                    $('.btnStartStream').html('start');
                    streaming = false;
                }
            });
        });

        obs.onStreamStopped(function() {
            obs.getStreamingStatus().then(function(data){
                if(data.streaming){
                    $('.btnStartStream').addClass('btnStopStream');
                    $('.btnStartStream').removeClass('btnStartStream');

                    $('.btnStopStream').addClass('red');
                    $('.btnStopStream').removeClass('green');
                    $('.btnStopStream').html('stop');
                    streaming = true;
                } else {
                    $('.btnStopStream').addClass('btnStartStream');
                    $('.btnStopStream').removeClass('btnStopStream');

                    $('.btnStartStream').addClass('green');
                    $('.btnStartStream').removeClass('red');
                    $('.btnStartStream').html('start');
                    streaming = false;
                }
            });
        });

        twitch.onAuthorized(function(auth) {
            if(twitch.viewer.role == "broadcaster"){
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
                                lookupobs();
                            }
                        }
                    }
                });
            } else {
                $('.viewers_view').removeClass('hide');
                $('.btnShowModal, .form_fields, .btnConnect, #scene_list, .console_eco').addClass('hide');
            }
        });

        twitch.onContext(function(context, attr) {
            if(context.mode == "viewer"){
                $('html,body').addClass('overlay-font-s');
                $('.btn:not(.btnShowModal), .btn-large:not(.btnShowModal)').addClass('overlay-btns');
                $("body").addClass('dark_theme');
            } else {
                if(context.theme == "dark"){
                    $("body").addClass('dark_theme');
                } else {
                    $("body").removeClass('dark_theme');
                }
            }
        });
    };
    return {
        'setLang': _set_lang,
        'init': _init,
    };
})();

$.fn.extend({
    removeMatchingClasses: function(pattern){
        return this.each(function() {
            var element = $(this);
            var classes = element.attr("class").split(/\s+/);
            $.each(classes, function(index, val) {
                if(val.match(pattern)) element.removeClass(val);
            });
            return this;
        });
    }
});

$(function(){
    var url = new URL(window.location.href);
    window.lang_code = url.searchParams.get("language");

    if(typeof window.lang[lang_code] != "undefined"){
        obss.setLang();
    }
    obss.init();
});