function Utilidades_base_mat(){
    /****************extensiones jQuery****************/
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
            },
            existeCSS: function(f){
                var hasstyle = false;
                var fullstylesheets = document.styleSheets;
                for (var sx = 0; sx < fullstylesheets.length; sx++) {
                    //console.log(fullstylesheets[sx]);
                    try{
                        if(fullstylesheets[sx].rules) {
                            //console.log('Existe CSS');
                        }
                    } catch(exp) {
                        //console.log(exp);
                        continue;
                    }
                    var sheetclasses = fullstylesheets[sx].rules || document.styleSheets[sx].cssRules;
                    sheetclasses = sheetclasses?sheetclasses:"none";
                    if(sheetclasses == "none") continue;
                    for (var cx = 0; cx < sheetclasses.length; cx++) {
                        if (sheetclasses[cx].selectorText == f) {
                            hasstyle = true; break;
                            //return classes[x].style;
                        }
                    }
                }
                return hasstyle;
            },
            loadScript : function (url, callback) {
                jQuery.ajax({
                    url: url,
                    dataType: 'script',
                    success: callback,
                    async: true
                });
            }
        });
    /****************Variables Privadas****************/
        var who = this;

        var __preloader = function(tipo){
            var spinner_html = '<div class="preloadercss texto_tema_color">';
            spinner_html +=     '<div class="preloader-wrapper big active">';
            spinner_html +=         '<div class="spinner-layer texto_tema_color">';
            spinner_html +=             '<div class="circle-clipper left">';
            spinner_html +=                 '<div class="circle"></div>';
            spinner_html +=             '</div><div class="gap-patch">';
            spinner_html +=                 '<div class="circle"></div>';
            spinner_html +=             '</div><div class="circle-clipper right">';
            spinner_html +=                 '<div class="circle"></div>';
            spinner_html +=             '</div>';
            spinner_html +=         '</div>';
            spinner_html +=     '</div>';
            spinner_html += '</div>';

            switch(tipo){
                case "ok":
                    $('.preloadercss').slideDown(600,function(){
                        $(this).remove();
                    });
                    break;
                default:
                    $('body').append(spinner_html);
                    break;
            }
        };

        var __alert = function(title, msg, duracion){
            var modal_html = '<div id="alert" class="modal bottom-sheet">';
            modal_html +=   '<div class="modal-content">';
            modal_html +=           '<h4>' + title + '</h4>';
            modal_html +=           '<p>' + msg + '</p>';
            modal_html +=       '</div>';
            modal_html +=   '</div>';

            $('body').append(modal_html);

            $('#alert').modal({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: 0.5, // Opacity of modal background
                    in_duration: ((typeof duracion != "undefined" && duracion !== "")?duracion:300), // Transition in duration
                    out_duration: 200, // Transition out duration
                    starting_top: '4%', // Starting top style attribute
                    ending_top: '10%', // Ending top style attribute
                    ready: function() {
                        setTimeout(function(){
                            if($("#alert").length>0){
                                $("#alert").modal("close");
                                $("#alert").remove();
                            }
                        }, 3500);
                    }, // Callback for Modal open
                    complete: function() {
                        $("#alert").remove();
                    } // Callback for Modal close
                }
            ).modal('open');
        };

        var __toast = function(msg, time, tipo, cb){
            Materialize.toast(msg, time, tipo, cb);
        };

        var __tooltips = function(){
            $('.tooltips').tooltip({delay: 50});
        };

        var __materialboxs = function(){
            $('.materialboxed').materialbox();
        };

        var __reset = function(){
            who.filtros_input       = filtros_input;
            who.validar_datos       = validar_datos;
            who.oculta_campos       = oculta_campos;
            who.itsLog              = itsLog;
            who.commaSeparateNumber = commaSeparateNumber;
            who.limitarTextArea     = limitarTextArea;
            who.getParameterByName  = getParameterByName;
            who.parseFecha          = parseFecha;
            who.addCero             = addCero;
            who.getRandom           = getRandom;
            who.getRandom           = getRandom;
            who.crear_colores       = crear_colores;
            who.magnitud_label      = magnitud_label;
            who.tableGrid           = tableGrid;
            who.descargaArchivo     = descargaArchivo;
            who.alertMatClass       = alertMatClass;
            who.paginar_tabla_mat   = paginar_tabla_mat;
            who.sort_select         = sort_select;
            who.capitalizeFirstLetter         = capitalizeFirstLetter;
            who.preloader           = __preloader;
            who.alerta              = __alert;
            who.toast               = __toast;
            who.init                = __reset;

            __materialboxs();
            __tooltips();

            if(!$(document).existeCSS('.error_mat'))__createClass('.error_mat','border-width: 1px !important;border-color: red !important;border-style:solid !important;border-radius:5px !important;padding:5px !important;');

            if(!$(document).existeCSS('.cursor'))__createClass('.cursor','cursor:pointer !important;');

            if(!$(document).existeCSS('.preloadercss'))__createClass('.preloadercss','margin: 25% auto;text-align: center;position: fixed;left: 50%;top: 50px; z-index:1000;');
        };

        var __alerta = function(mensaje){
            var alerta = new alertMatClass();
            alerta.init();
            alerta.title = 'Error';
            alerta.msg = mensaje;
            alerta.icon_color = 'red-text';
            alerta.aceptar = false;
            alerta.footer_inlinecss = "text-align:centar;";
            alerta.cancelar_inlinecss = "float: none !important;";
            alerta.cb_cancelar = function(){
                $('#btnModalCancelar').off('click').on('click', function(event) {
                    event.preventDefault();
                    /* Act on the event */
                });
            };
            alerta.alert();
        };

        var __verificaRFC = function(e){
            var rfc = e;
            var filter = /^([a-zA-Z]{4})+([0-9]{6})+([a-zA-Z0-9]{3})+$/;
            if (!filter.test(rfc.value)) {
                //rfc.focus();
                $(rfc).val("");
                $(rfc).addClass('campo_mal');
                __alert('Error',"Porfavor Escribe un RFC valido.");
                return false;
            } else {
                $(rfc).removeClass('campo_mal');
            }
        };

        var __verificaCURP = function(e){
            var curp = e;
            var filter = /^([a-z]{4})([0-9]{6})([a-z]{6})([0-9]{2})$/i;
            var fecha_y = curp.value.substring(4, 6);
            var fecha_m = curp.value.substring(6, 8);
            var fecha_d = curp.value.substring(8, 10);
            var tmp_date = new Date(fecha_y + "/" + fecha_m + "/" + fecha_d);

            if (!filter.test(curp.value)) {
                //$(curp).focus();
                $(curp).val("");
                $(curp).addClass('campo_mal');
                __alert('Error',"Porfavor Escribe un CURP valido.");
                return false;
            } else {
                if (!tmp_date.esValida()){
                    //$(curp).focus();
                    $(curp).val("");
                    $(curp).addClass('campo_mal');
                    __alerta("Porfavor Escribe un CURP con una FECHA valida.");
                    return false;
                }else{
                    $(curp).removeClass('campo_mal');
                }
            }
        };

        var __verificaMail = function(e) {
            if(e.value !== ""){
                var email = e;
                var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                if (!filter.test(email.value)) {
                    //email.focus();
                    $(email).val("");
                    $(email).addClass('campo_mal');
                    __alert('Error','Porfavor escribe un email válido.');
                    return false;
                } else {
                    $(email).removeClass('campo_mal');
                }
            }
        };

        var __createClass = function(name,rules){
            var style = "";
            if($('#Utilidades_css').length === 0){
                style = document.createElement('style');
                style.type = 'text/css';
                style.id = 'Utilidades_css';
                document.getElementsByTagName('head')[0].appendChild(style);
            }else{
                style = $('#Utilidades_css')[0];
            }
            $('#Utilidades_css').append(name+"{"+rules+"}");
        };
    /****************Variables Publicas****************/
        who.filtros_input       = filtros_input;
        who.validar_datos       = validar_datos;
        who.oculta_campos       = oculta_campos;
        who.itsLog              = itsLog;
        who.commaSeparateNumber = commaSeparateNumber;
        who.limitarTextArea     = limitarTextArea;
        who.getParameterByName  = getParameterByName;
        who.parseFecha          = parseFecha;
        who.addCero             = addCero;
        who.getRandom           = getRandom;
        who.crear_colores       = crear_colores;
        who.magnitud_label      = magnitud_label;
        who.time2string         = time2string;
        who.tableGrid           = tableGrid;
        who.descargaArchivo     = descargaArchivo;
        who.alertMatClass       = alertMatClass;
        who.paginar_tabla_mat   = paginar_tabla_mat;
        who.sort_select         = sort_select;
        who.capitalizeFirstLetter = capitalizeFirstLetter;
        who.preloader           = __preloader;
        who.alerta              = __alert;
        who.toast               = __toast;
        who.init                = __reset;
    /****************Funciones Publicas****************/
        function filtros_input(){
            // ----> FILTRO PARA TAGS NORMALES
            $(".numeros").bind("keypress", function(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode >= 48 && charCode <= 57) || evt.shiftKey) {
                    if (charCode == 8 || charCode == 32 || (charCode >= 35 && charCode <= 40) || (charCode >= 96 && charCode <= 105)) {
                        return charCode;
                    } else {
                        __alerta('Solo se permiten valores numericos.');
                    }
                } else {
                    return charCode;
                }
            });

            $(".numerosmcp").bind("keypress", function(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode >= 48 && charCode <= 57) || evt.shiftKey) {
                    if (charCode == 8 || charCode == 32 || charCode == 188 || charCode == 189 || charCode == 190 || charCode == 36 || (charCode >= 35 && charCode <= 40) || (charCode >= 96 && charCode <= 105)) {
                        return charCode;
                    } else {
                        __alerta('Solo se permiten valores numericos.');
                    }
                } else {
                    return charCode;
                }
            });

            $(".letras").bind("keypress", function(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                var $quien = $(this);

                if ((charCode >= 65 && charCode <= 90) || evt.shiftKey) {
                    if (charCode == 8 || charCode == 32 || (charCode >= 35 && charCode <= 40) || charCode == 192) {
                        return charCode;
                    } else {
                        __alerta('Solo se permiten letras.');
                    }
                } else {
                    setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    return charCode;
                }
            });

            $(".alfanum").bind("keypress", function(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                var $quien = $(this);
                if ((charCode >= 65 && charCode <= 90) || evt.shiftKey) {
                    if (charCode == 8 || charCode == 32 || (charCode >= 35 && charCode <= 40) || (charCode >= 96 && charCode <= 122) || (charCode >= 96 && charCode <= 105) || charCode == 192) {
                        return charCode;
                    } else {
                        __alerta('Solo se permiten valores alfanumericos.');
                    }
                } else {
                    setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    return charCode;
                }
            });

            $(".alfanumguion").bind("keypress", function(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                var $quien = $(this);
                if ((charCode >= 65 && charCode <= 90) || evt.shiftKey) {
                    if (charCode == 8 || charCode == 32 || (charCode >= 35 && charCode <= 40) || (charCode >= 96 && charCode <= 122) || charCode == 189 || (charCode >= 96 && charCode <= 105) || charCode == 192) {
                        return charCode;
                    } else {
                        __alerta('Solo se permiten valores alfanumericos.');
                    }
                } else {
                    setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    return charCode;
                }
            });

            $(".alfanumenter").bind("keypress", function(evt) {
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                var $quien = $(this);
                if ((charCode >= 65 && charCode <= 90) || evt.shiftKey) {
                    if (charCode == 8 || charCode == 32 || (charCode >= 35 && charCode <= 40) || (charCode >= 96 && charCode <= 122) || charCode == 13 || (charCode >= 96 && charCode <= 105) || charCode == 192) {
                        return charCode;
                    } else {
                        __alerta('Solo se permiten valores alfanumericos.');
                    }
                } else {
                    setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    return charCode;
                }
            });

            // ----> FILTRO PARA TAGS ASP
            $(".numeros_asp, .num_asp_sn").off().on("keydown", function(e) {
                var keyCode = e.which ? e.which : e.keyCode;
                if ((e.shiftKey && keyCode == 55) || (e.ctrlKey && keyCode == 86) || (e.ctrlKey && keyCode == 67) || (keyCode >= 96 && keyCode <= 105)) {
                    return keyCode;
                } else {
                    var ret = (((keyCode >= 48 && keyCode <= 57) || (keyCode >= 35 && keyCode <= 40) || (keyCode >= 96 && keyCode <= 122) || keyCode == 8 || keyCode == 46 || keyCode == 9 || keyCode == 32) && !e.shiftKey);
                    return ret;
                }
            });

            $(".numerosmcp_asp").off().on("keydown", function(e) {
                var keyCode = e.which ? e.which : e.keyCode;
                if ((e.shiftKey && keyCode == 52) || (e.shiftKey && keyCode == 55) || (keyCode >= 96 && keyCode <= 105)) {
                    return keyCode;
                } else {
                    var ret = (((keyCode >= 48 && keyCode <= 57) || (keyCode >= 35 && keyCode <= 40) || (keyCode >= 96 && keyCode <= 122) || keyCode == 8 || keyCode == 46 || keyCode == 9 || keyCode == 32 || keyCode == 188 || keyCode == 189 || keyCode == 190) && !e.shiftKey);
                    return ret;
                }
            });

            $(".letras_asp").off().on("keydown", function(e) {
                var keyCode = e.which ? e.which : e.keyCode;
                var ret;
                var $quien = $(this);
                if (e.shiftKey && (keyCode >= 65 && keyCode <= 90)) {
                    return keyCode;
                } else {
                    ret = (((keyCode >= 65 && keyCode <= 90) || (keyCode >= 35 && keyCode <= 40) || (keyCode >= 96 && keyCode <= 122) || keyCode == 8 || keyCode == 46 || keyCode == 9 || keyCode == 165 || keyCode == 32 || keyCode == 192) && !e.shiftKey && !e.altKey);
                }
                setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                return ret;
            });

            $(".alfanum_asp").off().on("keydown", function(e) {
                var keyCode = e.which ? e.which : e.keyCode;
                var $quien = $(this);
                if (e.shiftKey && (keyCode >= 65 && keyCode <= 90 || keyCode == 192) || (e.shiftKey && keyCode == 55) || (keyCode >= 96 && keyCode <= 105)) {
                    return keyCode;
                } else {
                    var ret = (((keyCode >= 65 && keyCode <= 90) || (keyCode >= 35 && keyCode <= 40) || (keyCode >= 96 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 46 || keyCode == 9 || keyCode == 165 || keyCode == 32 || keyCode == 188 || keyCode == 189 || keyCode == 190 || keyCode == 192) && !e.shiftKey && !e.altKey);
                    setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    return ret;
                }
            });

            $(".alfanumguion_asp").off().on("keydown", function(e) {
                var keyCode = e.which ? e.which : e.keyCode;
                var $quien = $(this);
                if (e.shiftKey && (keyCode >= 65 && keyCode <= 90) || keyCode == 189 || (keyCode >= 96 && keyCode <= 105)) {
                    return keyCode;
                } else {
                    var ret = (((keyCode >= 65 && keyCode <= 90) || (keyCode >= 35 && keyCode <= 40) || (keyCode >= 96 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 46 || keyCode == 9 || keyCode == 165 || keyCode == 32 || keyCode == 189 || keyCode == 164 || keyCode == 192) && !e.shiftKey && !e.altKey);
                    setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    return ret;
                }
            });

            $(".alfanumenter_asp").off().on("keydown", function(e) {
                var keyCode = e.which ? e.which : e.keyCode;
                var $quien = $(this);
                if (e.shiftKey && (keyCode >= 65 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 105)) {
                    return keyCode;
                } else {
                    var ret = (((keyCode >= 65 && keyCode <= 90) || (keyCode >= 35 && keyCode <= 40) || (keyCode >= 96 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode == 13 || keyCode == 46 || keyCode == 9 || keyCode == 165 || keyCode == 32 || keyCode == 189 || keyCode == 164 || keyCode == 192) && !e.shiftKey && !e.altKey);
                    if( bklist.indexOf($quien.attr('id')) == -1){
                        setTimeout(function(){$($quien).val( ($($quien).val()).toUpperCase() );},100);
                    }
                    return ret;
                }
            });

            // ----> FILTROS CUSTOM
            $(".numeros_blur").off("blur").on("blur", function(e) {
                e.preventDefault();
                var longitud = $(this).attr("maxlength");
                var longchart = $(this).val().length;

                if (longchart < longitud) {
                    __alerta("Te faltan números por escribir.<br> El valor tiene que tener " + longitud + " números.");
                    return false;
                }
            });

            $(".rfc_val").off("blur").on("blur", function(e) {
                e.preventDefault();
                __verificaRFC(this);
            });

            $(".curp_val").off("blur").on("blur", function(e) {
                e.preventDefault();
                __verificaCURP(this);
            });

            $(".email_val").off("blur").on("blur", function(e) {
                e.preventDefault();
                __verificaMail(this);
            });
        }

        function validar_datos(ids,parent){
            var res = true;
            parent=(typeof parent != "undefined")?parent:$(ids).parent();

            $(ids, parent).removeClass('error_mat');

            $(ids, parent).each(function(){
                var who = $(this);

                if(who.val() === ""){
                    who.addClass('error_mat');
                    res = false;
                }

                if(who.tagName == "textarea" && who.text() === ""){
                    who.addClass('error_mat');
                    res = false;
                }
            });

            return res;
        }

        function oculta_campos(input,hidden,threshold,mask){
            var who = $(input);
            var where = $(hidden);
            var threshold_in = (typeof threshold == "undefined")?16:threshold;
            var mask_in = (typeof mask == "undefined")?4:mask;

            who.off('keypress').on('keypress',function(event){
                event.preventDefault();
                var inp = String.fromCharCode(event.keyCode);

                if (/[0-9]/.test(inp)){
                    validar_input(inp);
                }
            }).off('keyup').on('keyup',function(event){
                event.preventDefault();

                if (event.keyCode == 8){
                    borrar_input();
                }
            });

            function validar_input(inp) {
                var tmp_val = where.val();
                var new_val = '';

                new_val = tmp_val + inp;
                where.val(new_val);

                if(tmp_val.length <= (threshold_in - mask_in)){
                    new_val = tmp_val.replace(/./g, '*');
                }else{
                    new_val = tmp_val.match(new RegExp('.[0-9]{' + ((threshold_in - mask_in) -1)+ '}.', 'g'));
                    new_val = new_val[1].replace(/./g, '*') + tmp_val.match(new RegExp('.[0-9]{0,' + (mask_in -1)+ '}$', 'g'))[1];
                }

                who.val(new_val);

                return false;
            }

            function borrar_input() {
                var where_val = where.val();
                var who_val = who.val();
                var new_val = '';
                new_val = where_val.slice(0,-1);
                where.val(new_val);

                if(where_val.length > who_val.length){
                    where_val = where_val.substring(0,who_val.length);
                    where.val(where_val);
                }
            }

            return false;
        }

        function itsLog(what){
            var res = 0;
            if(what){
                res = 1;
            }

            return res;
        }

        function commaSeparateNumber(val){
            while (/(\d+)(\d{3})/.test(val.toString())){
              val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
            }
            return val;
        }

        function limitarTextArea(who, cuentaActual, limite){
            if (who.value.length > limite) {
                who.value = who.value.substring(0, limite);
            } else {
                cuentaActual.value = limite - who.value.length;
            }
        }

        function getParameterByName(name){
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function parseFecha(strFecha){
            var d = new Date(strFecha);
            return d;
        }

        function time2string(time){
            var msSegundo = 1000;
            var msMinuto = 60 * msSegundo;
            var msHora = 60 * msMinuto;
            var msDia = 24 * msHora;

            time = time * 1000;

            var dias = Math.floor(time / msDia);
            time -= dias * msDia;

            var horas = Math.floor(time / msHora);
            time -= horas * msHora;

            var minutos = Math.floor(time / msMinuto);
            time -= minutos * msMinuto;

            var segundos = Math.floor(time / msSegundo);

            var d = addCero(horas) + ' hrs ' + addCero(minutos) + ' min ' + addCero(segundos) + ' sec';

            return d;
        }

        function addCero(i){
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function getRandom(min, max) {
            return Math.random() * (max - min) + min;
        }

        function crear_colores(count){
            var tmp_arr = [];
            var letras = '0123456789ABCDEF'.split('');

            for(var i=0;i<count;i++){
                var color = '#';
                for (var j = 0; j < 6; j++ ) {
                    color += letras[Math.round(Math.random() * 15)];
                }

                tmp_arr.push(color);
            }

            return tmp_arr;
        }

        function magnitud_label(value){
            var magnitud = '';
            if(value >= 1000){
                magnitud = 'K';
            }
            if(value >= 1000000){
                magnitud = 'M';
            }
            if(value >= 100000000000){
                magnitud = 'B';
            }

            return magnitud;
        }

        function tableGrid(myList, selector){
            var table = $("<table>", {id: selector, class: "striped paginar_tabla"});
            var columns = addAllColumnHeaders(myList, table);
            var row = $('<tr/>');

            if(typeof myList == "object"){
                var tmp_cols = Object.keys(myList);
                for (var prop in tmp_cols) {
                    var tmp_content = (typeof myList[tmp_cols[prop]] == "object") ? dataToUL(myList[tmp_cols[prop]], selector + "_" + tmp_cols[prop] + "_" + prop) : myList[tmp_cols[prop]];

                    row.append($('<td/>',{class:'col_' + prop }).html(tmp_content));
                }
                table.append(row);
            } else {
                for (var i = 0 ; i < myList.length ; i++) {
                    var row = $('<tr/>');
                    for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
                        row.addClass("col_" + myList[i][columns[5]]);
                        var cellValue = myList[i][columns[colIndex]];

                        if (cellValue === null) { cellValue = ""; }

                        row.append(('<td/>',{class:'colindex_' + colIndex }).html(cellValue));
                    }
                    table.append(row);
                }
            }

            function addAllColumnHeaders(myList, selector){
                var columnSet = [];
                var headerTr = $('<tr/>');

                if(typeof myList == "object"){
                    columnSet = Object.keys(myList);
                    for (var prop in columnSet) {
                        headerTr.append($('<th/>').html(columnSet[prop]));
                    }
                } else {
                    for (var i = 0 ; i < myList.length ; i++) {
                        var rowHash = myList[i];
                        for (var key in rowHash) {
                            if ($.inArray(key, columnSet) == -1){
                                columnSet.push(key);
                                headerTr$.append($('<th/>').html(key));
                            }
                        }
                    }
                }
                table.append(headerTr);

                return columnSet;
            }

            return table;
        }

        function dataToUL(myList, selector){
            var ul = $("<ul>", {id: selector, class: "dataToUL"});
            var tmp_cols = Object.keys(myList);
            var last_cat = '';

            for (var prop in tmp_cols) {
                var li = $('<li/>');
                var tmp_content = (typeof myList[tmp_cols[prop]] == "object") ? dataToUL(myList[tmp_cols[prop]], selector + "_" + tmp_cols[prop] + "_" + prop) : myList[tmp_cols[prop]];
                if(tmp_cols[prop] != last_cat && isNaN(tmp_cols[prop])) {
                    last_cat = tmp_cols[prop];
                    if(typeof myList[last_cat] == "object"){
                        li.append($('<p/>',{class:'p_cat_' + prop + ' black'}).html(last_cat));
                    } else {
                        li.append($('<p/>',{class:'p_cat_' + prop + ' grey'}).html(last_cat));
                    }
                }
                li.append($('<p/>',{class:'p_' + prop }).html(tmp_content));
                ul.append(li);
            }

            return ul;
        }

        function descargaArchivo(url){
            var hiddenIFrameID = 'hiddenDownloader',
            iframe = document.getElementById(hiddenIFrameID);
            if (iframe === null) {
                iframe = document.createElement('iframe');
                iframe.id = hiddenIFrameID;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            iframe.src = url;
        }

        function alertMatClass(){
            //var privadas
            var who = this;
            //var publicas
            who.id = (typeof who.id == "undefined" || who.id === "")?'modalAlert':who.id;
            who.title = (typeof who.title == "undefined" || who.title === "")?'title':who.title;
            who.title_h = (typeof who.title_h == "undefined" || who.title_h === "")?'h6':who.title_h;
            who.title_hide = (typeof who.title_hide == "undefined" || who.title_hide === "")?'':who.title_hide;
            who.msg = (typeof who.msg == "undefined" || who.msg === "")?'msg':who.msg;
            who.icon = (typeof who.icon == "undefined" || who.icon === "")?'info':who.icon;
            who.icon_color = (typeof who.icon_color == "undefined" || who.icon_color === "")?'yellow-text':who.icon_color;
            who.icon_size = (typeof who.icon_size == "undefined" || who.icon_size === "")?'small':who.icon_size;
            who.icon_hide = (typeof who.icon_hide == "undefined" || who.icon_hide === "")?'':who.icon_hide;
            who.no_block = (typeof who.no_block == "undefined" || who.no_block === "")?false:who.no_block;
            who.aceptar = (typeof who.aceptar == "undefined" || who.aceptar === "")?true:who.aceptar;
            who.aceptar_pos = (typeof who.aceptar_pos == "undefined" || who.aceptar_pos === "")?'right':who.aceptar_pos;
            who.aceptar_label = (typeof who.aceptar_label == "undefined" || who.aceptar_label === "")?'aceptar':who.aceptar_label;
            who.cb_aceptar = (typeof who.cb_aceptar == "undefined" || who.cb_aceptar === "")?function(){}:who.cb_aceptar;
            who.aceptar_tipo = (typeof who.aceptar_tipo == "undefined" || who.aceptar_tipo === "")?'waves-green green btn':who.aceptar_tipo;
            who.aceptar_inlinecss = (typeof who.aceptar_inlinecss == "undefined" || who.aceptar_inlinecss === "")?'width:120px;':who.aceptar_inlinecss;
            who.cancelar = (typeof who.cancelar == "undefined" || who.cancelar === "")?true:who.cancelar;
            who.cancelar_pos = (typeof who.cancelar_pos == "undefined" || who.cancelar_pos === "")?'left':who.cancelar_pos;
            who.cancelar_label = (typeof who.cancelar_label == "undefined" || who.cancelar_label === "")?'cancelar':who.cancelar_label;
            who.cb_cancelar = (typeof who.cb_cancelar == "undefined" || who.cb_cancelar === "")?function(){}:who.cb_cancelar;
            who.cancelar_tipo = (typeof who.cancelar_tipo == "undefined" || who.cancelar_tipo === "")?'waves-red red btn':who.cancelar_tipo;
            who.cancelar_inlinecss = (typeof who.cancelar_inlinecss == "undefined" || who.cancelar_inlinecss === "")?'width:120px;':who.cancelar_inlinecss;
            who.css_str = (typeof who.css_str == "undefined" || who.css_str === "")?'margin-top:15% !important;':who.css_str;
            who.h = (typeof who.h == "undefined" || who.h === "")?'45%':who.h;
            who.w = (typeof who.w == "undefined" || who.w === "")?'300px':who.w;
            who.autoheight = (typeof who.autoheight == "undefined" || who.autoheight === "")?true:who.autoheight;
            who.autowidth = (typeof who.autowidth == "undefined" || who.autowidth === "")?true:who.autowidth;
            who.modalClass = (typeof who.modalClass == "undefined" || who.modalClass === "")?'modal modal-fixed-footer':who.modalClass;
            who.footer = (typeof who.footer == "undefined" || who.footer === "")?true:who.footer;
            who.footerClass = (typeof who.footerClass == "undefined" || who.footerClass === "")?'modal-footer':who.footerClass;
            who.footer_inlinecss = (typeof who.footer_inlinecss == "undefined" || who.footer_inlinecss === "")?'':who.footer_inlinecss;
            who.opacity = (typeof who.opacity == "undefined" || who.opacity === "")?'0.8':who.opacity;
            //funciones publicas
            who.alert = (typeof who.alert == "undefined" || who.alert === "")?init_alert:who.alert;
            who.init = reset;
            //funciones privadas
            function init_alert(){
                var modalAlert = '<div id="' + who.id + '" class="' + who.modalClass + '" style="height:' + who.h + ' !important; width:' + who.w + ' !important; max-height:100%; max-width:100%; ' + who.css_str + '">';
                    modalAlert += '  <div class="modal-content">';
                    modalAlert += '    <div class="col l12"><' + who.title_h + ' class="' + who.title_hide + '"><i class="material-icons ' + who.icon_size + ' ' + who.icon_color + ' ' + who.icon_hide + '">' + who.icon + '</i>';
                    modalAlert +=         who.title + '</' + who.title_h + '>';
                    modalAlert += '       <p>' + who.msg + '</p>';
                    modalAlert += '    </div>';
                    modalAlert += '    <div class="' + who.footerClass + '" style="' + who.footer_inlinecss + '" id="footerAlertMat">';
                    modalAlert += '     <div class="col l12">';
                    modalAlert += '         <a id="btnModalCancelar" class="modal-action modal-close ' + who.cancelar_pos + ' ' + who.cancelar_tipo + '" style="' + who.cancelar_inlinecss + '">' + who.cancelar_label + '</a>';
                    modalAlert += '         <a id="btnModalAceptar" class="modal-action modal-close ' + who.aceptar_pos + ' ' + who.aceptar_tipo + '" style="' + who.aceptar_inlinecss + '">' + who.aceptar_label + '</a>';
                    modalAlert += '     </div>';
                    modalAlert += '  </div>';
                    modalAlert += '</div>';

                modalAlert = $(modalAlert);

                if(!who.cancelar){$('#btnModalCancelar',modalAlert).hide();}
                if(!who.aceptar){$('#btnModalAceptar',modalAlert).hide();}
                if(!who.footer){$('#footerAlertMat',modalAlert).hide();}

                $('html').append(modalAlert);

                $('#btnModalAceptar',modalAlert).off('click').on('click',who.cb_aceptar());
                $('#btnModalCancelar',modalAlert).off('click').on('click',who.cb_cancelar());

                $('body').animate({opacity: who.opacity},200, function() {
                    $('#'+who.id).modal({
                        dismissible: who.no_block, // Modal can be dismissed by clicking outside of the modal
                        opacity: who.opacity, // Opacity of modal background
                        ready: function() {
                            if(who.autoheight){
                                var content_height = $('#'+who.id).innerHeight() + 50;
                                $('#'+who.id).animate({height: content_height},350);
                            }
                            if(who.autowidth){
                                var content_width = $('#'+who.id).innerWidth() + 50;
                                $('#'+who.id).animate({width: content_width},350);
                            }
                        }, // Callback for Modal open
                        complete: function() {
                            $('body').animate({opacity: "1"},200, function() {
                                $('#'+who.id).remove();
                            });
                        } // Callback for Modal close
                    }).modal('open');
                });

                return false;
            }

            function reset(){
                who.id = 'modalAlert';
                who.title = 'title';
                who.title_h = 'h6';
                who.title_hide = '';
                who.msg = 'msg';
                who.icon = 'info';
                who.icon_color = 'yellow-text';
                who.icon_size = 'small';
                who.icon_hide = '';
                who.no_block = false;
                who.aceptar = true;
                who.aceptar_pos = 'right';
                who.aceptar_label = 'aceptar';
                who.cb_aceptar = function(){};
                who.aceptar_tipo = 'waves-green green btn';
                who.aceptar_inlinecss = 'width:120px;';
                who.cancelar = true;
                who.cancelar_pos = 'left';
                who.cancelar_label = 'cancelar';
                who.cb_cancelar = function(){};
                who.cancelar_tipo = 'waves-red red btn';
                who.cancelar_inlinecss = 'width:120px;';
                who.css_str = 'margin-top:15% !important;';
                who.h = '45%';
                who.w = '300px';
                who.autoheight = true;
                who.autowidth = true;
                who.modalClass = 'modal modal-fixed-footer';
                who.footer = true;
                who.footerClass = 'modal-footer';
                who.footer_inlinecss = '';
                who.opacity = '0.8';
                //funciones publicas
                who.alert = init_alert;
            }

            return false;
        }

        function paginar_tabla_mat(paginar,agrupar,custom_obj,custom_content,destruir,total_ext){
            var obj_nombre = (typeof custom_obj != "undefined")?custom_obj:'.paginar_tabla';
            var obj_content = (typeof custom_content != "undefined")?custom_content:".paginar_tabla tbody tr";
            destruir = (typeof destruir != "undefined")?destruir:"none";

            if($("paginador").length > 0){
                $.each($(obj_nombre), function(index, val) {
                    var inicio_items = 1;
                    var total_items = 1;
                    var paginar_por = paginar?paginar:10;
                    var agrupar_por = agrupar?agrupar:5;
                    var parent = $(this).parent();
                    var paginador = '';
                        paginador = '<paginador>';
                        paginador += '    <p class="center"><small>Mostrando del <b class="leyenda_desde">' + inicio_items + '</b> al <b class="leyenda_hasta">' + paginar_por + '</b> de <b class="leyenda_total">' + total_items + '</b></small></p>';
                        paginador += '    <ul class="center clear-anchor-bg pagination">';
                        paginador += '        <li class="inicioPaginar">';
                        paginador += '            <a class="cursor"><i class="material-icons">skip_previous</i></a>';
                        paginador += '        </li>';
                        paginador += '        <li class="backPaginar">';
                        paginador += '            <a class="cursor"><i class="material-icons">chevron_left</i></a>';
                        paginador += '        </li>';
                        paginador += '        <li class="nextPaginar">';
                        paginador += '            <a class="cursor"><i class="material-icons">chevron_right</i></a>';
                        paginador += '        </li>';
                        paginador += '        <li class="finPaginar">';
                        paginador += '            <a class="cursor"><i class="material-icons">skip_next</i></a>';
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

                            $(".paginador-reg", parent).hide(3);
                            $(".paginador-pagina_" + tmp_who_index, parent).show(300);
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

                                $(".paginador-reg", parent).hide(3);
                                $(".paginador-pagina_" + index, parent).show(300);

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
                                var index = parseInt(seek) + parseInt($('.btnPaginarIndex.active', parent).attr("data-index"));

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

                                $(".paginador-reg", parent).hide(3);
                                $(".paginador-pagina_" + index, parent).show(300);

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
            }
        }

        function sort_select(select){
            var options = $(select);
            var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
            arr.sort(function(o1, o2) {
                var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
                return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
            });
            options.each(function(i, o) {
                o.value = arr[i].v;
                $(o).text(arr[i].t);
            });
        }

        function capitalizeFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
}

var Utilidades = new Utilidades_base_mat();

Utilidades.init();
