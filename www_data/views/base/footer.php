<footer class="page-footer">
	<img alt="pyramid" src="img/pyramid2.png" class="btnCredits tooltipped cursor" data-position="top" data-tooltip="Credits" style="width:128px; position:absolute; left: 10px; bottom: -25px;" />
	<img alt="pyramid" src="img/pyramid.png" class="btnAbout tooltipped cursor" data-position="top" data-tooltip="About us" style="width:128px; position:absolute; right: 10px; bottom: -25px;" />
	<img alt="mayan" src="img/mayan.png" class="btnAbout tooltipped cursor" data-position="top" data-tooltip="About us" style="width:128px; position:absolute; right: 10px; bottom: -25px;" />
	<div class="footer-copyright" style="z-index:55; position:relative">
		<div class="container">
			© <?php echo date("Y"); ?> Copyright <?php echo sitename; ?>
		</div>
	</div>
</footer>
<!-- Modal info -->
<div id="infoModal" class="modal modal-fixed-footer" style="width:280px; height: 450px; color: #000000; background-color: transparent !important; box-shadow: unset !important;">
    <div class="modal-content windowBGSItem" style="height: 450px;">
        <div class="row">
		    <div class="col s12">
		      	<ul class="tabs" style="background-color: transparent !important;">
			        <li class="tab"><a class="active black-text ttooltipped" data-tooltip="About us" data-position="top" href="#about" style="color:white !important;">About us</a></li>
			        <li class="tab"><a class="active black-text ttooltipped" data-tooltip="Services" data-position="top" href="#services" style="color:white !important;">Services</a></li>
		      	</ul>
		    </div>
		    <div id="about" class="col s12">
		    	<p style="width: 100px; margin-left: 45px; margin-top: 15px;">
		    		Chak Studio it's a mexican indie game development company funded on 2018.
		    		<br><br>
		    	</p>
		    </div>
		    <div id="services" class="col s12">
		    	<p style="width: 100px; margin-left: 45px; margin-top: 15px;">
					We offer services of consultancy and development.
		    	</p>
		    </div>
		</div>
    </div>
    <div class="modal-footer hide">
    </div>
</div>

<!-- Modal credits -->
<div id="creditsModal" class="modal modal-fixed-footer windowBG" style="width: 510px !important; height: 610px; color: #000000; background-color: transparent !important; box-shadow: unset !important; overflow:hidden;">
    <div class="modal-content" style="width: 530px; height: 400px; top:50px;">
        <div class="row">
        	<div class="">
			    <div class="col s12">
			      	<ul class="tabs" style="background-color: transparent !important;">
				        <li class="tab col s3"><a class="active black-text ttooltipped" data-tooltip="Credits" data-position="top" href="#credits" style="color:white !important;">Credits</a></li>
			      	</ul>
			    </div>
			    <div id="credits" class="col s12">
			    	<p style="margin: 15px;">
			    		<br><br>
						<a href="https://jquery.com/" title="jquery" target="_blank">jquery</a><br>
						<br><br>
						<a href="https://materializecss.com/" title="materializecss" target="_blank">materializecss</a><br>
						<br><br>
						<a href="https://www.apache.org/" title="apache" target="_blank">apache</a><br>
						<br><br>
						<a href="https://php.net/" title="php" target="_blank">php</a><br>
						<br><br>
						<a href="https://unity.com/" title="unity" target="_blank">unity</a><br>
						<br><br>
			    		Some Icons & Graphics made by<br>
						<a href="https://craftpix.net" title="Freepik" target="_blank">craftpix</a><br>
						<br><br>
			    		Some Icons made by<br>
						<a href="https://www.freepik.com/" title="Freepik" target="_blank">Freepik</a><br>
						from<br>
						<a href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</a><br>
						is licensed by<br>
						<a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a><br>
						<br><br>
			    	</p>
			    </div>
			</div>
		</div>
    </div>
    <div class="modal-footer hide">
    </div>
</div>

<script type="text/javascript">
	$(document).ready(function(){
		$('.btnAbout').off('click').on('click', function(){
			$("#infoModal").modal("open");
		});

		$('.btnCredits').off('click').on('click', function(){
			$("#creditsModal").modal("open");
			$(".modal-content").getNiceScroll().resize();
			var tmp_height = $("#creditsModal .modal-content")[0].scrollHeight - $("#creditsModal .modal-content").innerHeight();
			$("#creditsModal .modal-content").stop().scrollTop(0);
			$("#creditsModal .modal-content").stop().animate({scrollTop: tmp_height}, 20000, 'swing');

			var timesScroll = 0;
			$("#creditsModal .modal-content").off('scroll').on('scroll', function(){
				timesScroll++;
				if(timesScroll >= tmp_height - 10){
					$("#creditsModal .modal-content").stop();
					timesScroll = 0;
				}
			});

			$("#creditsModal .modal-content").off('mouseenter').on('mouseenter', function(){
				$("#creditsModal .modal-content").stop();
			});

			$("#creditsModal").off('mouseleave').on('mouseleave', function(){
				$("#creditsModal .modal-content").stop().animate({scrollTop: tmp_height}, 10000, 'swing');
			});
		});
	});
</script>
