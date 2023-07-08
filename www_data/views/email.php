<?php
	include_once "views/base/headers/base.php";

	require_once($_SERVER["DOCUMENT_ROOT"] . '../lib/twitter/autoload.php');
	use Abraham\TwitterOAuth\TwitterOAuth;

    if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }
?>
<div class="view_content row" style="position:absolute; width:100%; left: 10px; top: 75px;">
	<div class="col s12">
		<iframe src="https://webmail.chakstudio.com" frameborder="0" scrolling="no" style="width:100%; min-height:500px;" onload="resizeIframe(this)" name="mail_iframe" id="mail_iframe"></iframe>
	</div>
  <div class="col s12">
    <br><br><br>
  </div>
</div>
<script>
  	window.resizeIframe = function(obj) {
    	obj.style.height = window.innerHeight + 'px';

        //$("footer").css('top', window.innerHeight + 80);
  	};

  	window.appendStyle = function(who){
  		var head = $(who).contents().find('head');

	    $('<link/>', {
	        rel: "stylesheet",
	        type: "text/css",
	        href: "/css/webfonts.css"
	    }).appendTo(head);
	    $('<link/>', {
	        rel: "stylesheet",
	        type: "text/css",
	        href: "/css/iframe_css.css"
	    }).appendTo(head);
  	};

    $(document).ready(function(){
      	$('#mail_iframe').on('load', function () {
    	    appendStyle(this);

      		$(this).contents().find('frame').each(function(index, val) {
      			appendStyle(this);

    		    $(this).on('load', function (){
    		    	appendStyle(this);
    		    });
      		});
    	});

        $(window).resize(function(){
            resizeIframe($('#mail_iframe')[0]);
        });

        resizeIframe($('#mail_iframe')[0]);
    });
</script>