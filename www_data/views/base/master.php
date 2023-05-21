<!DOCTYPE html>
<html>
    <head>
        <?php
        	include_once("views/base/headers/headers.php");
            include_once("css/laf.css.php");
        ?>
        <link rel="stylesheet" type="text/css" media="screen" href="css/index.css" />
        <script src="vendor/modernizr-2.8.3.min.js"></script>
        <script src="vendor/jquery-2.2.4.min.js"></script>
        <script src="vendor/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="vendor/materialize.min.js"></script>
        <script src="vendor/jquery.nicescroll.js" type="text/javascript"></script>
        <script src="vendor/jquery.tablesorter.js"></script>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        <script> window.debug = <?php echo (isset($_REQUEST["debug"]) ? "true" : "false") ;?>;<?php echo "window.apikey = '" . apikey . "';"; ?> </script>
        <script type="text/javascript" src="js/utilidades.js"></script>
        <script type="text/javascript">
            var tmp_location = window.location.href;
            $(document).ready(function($) {
                $("body, .modal-content, #paypal_content, .gameContent").niceScroll({
                    cursorcolor:"pink",
                    cursorwidth:"16px",
                    cursorborderradius:2,
                    autohidemode:'leave'
                });

                $('.tabs').tabs();
                $('.modal').modal();
                $('.tooltipped', $(document.body)).tooltip({
                    "html":true
                });
                $(".dropdown-button").dropdown();

                Utilidades.paginar_tabla_mat(10, 5);

                tmp_location = tmp_location.replace("://", "");
                tmp_location = tmp_location.split("/");
                tmp_location = tmp_location[1];
                tmp_location = (tmp_location.indexOf('#') > -1) ? tmp_location.split("#")[0] : tmp_location;
                tmp_location = (tmp_location.indexOf('?') > -1) ? tmp_location.split("?")[0] : tmp_location;

                $("#settings_user_nav li").removeClass('active_nav');
                $("a[href='/" + tmp_location + "']", "#settings_user_nav").parent().addClass('active_nav');

                /*window.refreshTime = 120000; // every 2 minutes in milliseconds
                window.refreshSession = function(){
                    $.ajax({
                        url: 'https://chakbot.mdac.no-ip.org',
                        type: 'POST',
                        data: {
                            m: "session_on"
                        },
                        dataType: 'json',
                        success: function(data) {
                            if(debug) console.log(data);
                            if(data.error.length === 0){
                                window.twitch_info = data.session;
                                window.bot_info = data.botsession;
                                window.socketToken = data.slsession;
                            }
                        }
                    });
                };
                window.intervalSession = setInterval(function(){
                    refreshSession();
                }, refreshTime);*/

                window.isMail = function(e) {
                    var email = e;
                    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                    if (!filter.test(email.value)) {
                        Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;" + email.value + " does not look like a real email.", 3000);
                        $(email).val("");
                        $(email).addClass('error_mat');
                        return false;
                    } else {
                        $(email).removeClass('error_mat');
                    }
                    return true;
                };

                navigator.sayswho = (function(){
                    var ua = navigator.userAgent, tem,
                    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                    if(/trident/i.test(M[1])){
                        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                        return 'IE '+(tem[1] || '');
                    }
                    if(M[1]=== 'Chrome'){
                        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
                    }
                    M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
                    return M.join(' ');
                })();

                $('.parallax').parallax();

                $(window).resize(function(){
                    $("body, .modal-content").getNiceScroll().resize();
                });
            });
        </script>
    </head>
    <body>
        <div class="parallax-container" style="position:fixed; top: -10px; width:100%; height: 1280px;">
            <div class="parallax"><img alt="bg" src="img/bg.png" class="bkImg" /></div>
            <div class="parallax"><img alt="clouds1" src="img/clouds1.png" class="bkImg" /></div>
            <div class="parallax"><img alt="clouds2" src="img/clouds2.png" class="bkImg" /></div>
            <div class="parallax"><img alt="mountains1" src="img/mountains1.png" class="bkImg" /></div>
            <div class="parallax"><img alt="idol" src="img/idol.png" class="bkImg" /></div>
            <div class="parallax"><img alt="rocks1" src="img/rocks1.png" class="bkImg" /></div>
            <div class="parallax"><img alt="rocks3" src="img/rocks3.png" class="bkImg" /></div>
            <div class="parallax"><img alt="rocks4" src="img/rocks4.png" class="bkImg" /></div>
            <div class="parallax"><img alt="road" src="img/road.png" class="bkImg" /></div>
        </div>
        <div class="container" style="width:85%;">
            <header>
                <?php include_once("navbar.php"); ?>
            </header>
            <main id="main">
                <div style="position: relative;width: 100%;">
                    <?php
                        if(file_exists("views/" . $_REQUEST["r"] . ".php")) {
                            include_once("views/" . $_REQUEST["r"] . ".php");
                        } else {
                            include_once("views/404.php");
                        }
                    ?>
                </div>
            </main>
            <?php include_once("footer.php"); ?>
        </div>
    </body>
</html>


