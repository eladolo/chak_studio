<?php
	$api_index_load = true;
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");

	$_REQUEST["id"] = "1";
	$chakstudio = $API->infoGame();
	$chakstudio = $chakstudio["data"];
?>
<style type="text/css">
	main{
		background-color: transparent !important;
	}
</style>
<link rel="stylesheet" href="css/particles.css"/>
<div class="row">
	<div class="col s12" style="text-align:center;"></div>
</div>
<div class="row">
	<div class="col s12" style="text-align:center; ">
		<?php if(!isset($_SESSION["error"])){ ?>
			<h1 style="text-align:center;font-size:72px;color:white; top:85px; z-index:51; width:100%;">
				<br><br>
				Hello...<br><br>
				<img src="img/logo.png" style="width:256px;"><br><br>
				Welcome<br>
				to<br>
				<b>-_-</b><br><br>
				<b>Chak Studio</b><br><br>
				<img src="img/logo2.png" style="width:256px;"><br><br>
			</h1>
			<div class="slider" style="border-radius: 8px; position: absolute; margin-bottom: 100px;">
			    <ul class="slides" style="border-radius: 8px; box-shadow: 5px 5px rgba(0,0,0,0.3);">
			    	<?php
				    	$tmp_galery = $chakstudio['galery'];
				    	$tmp_caption = array(
				    		"center-align",
				    		"left-align",
				    		"right-align"
				    	);
				    	foreach ($tmp_galery as $slide) {
				    		if($slide['status'] != "ACTIVO") continue
					?>
				      	<li>
					        <img src="<?php echo $slide["img"]; ?>" style="border-radius: 8px;"> <!-- random image -->
					        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
					          	<h2><?php echo $slide['title']; ?></h2>
					          	<h5 class="light grey-text text-lighten-3"><?php echo $slide['body']; ?></h5>
					        </div>
				      	</li>
				    <?php } ?>
			    </ul>
			</div>
		<?php } else {
				echo "<h1><b style='color:red;'>" . $_SESSION["error"]["msg"] . "</b>";
				echo "<script> setTimeout(function(){ window.location.href = '" . (isset($_SESSION["error"]["redirect"]) ? $_SESSION["error"]["redirect"] : '/login') . "';}, 3000); </script>";
				unset($_SESSION["error"]);
			}
		?>
	</dv>
</div>
<script type="text/javascript">
	$(document).ready(function(){
		setTimeout(function(){
			$("html, body").stop().scrollTop(0);
			$("html, body").stop().animate({scrollTop:$("html, body")[0].scrollHeight - $("html, body").innerHeight()}, 8000, 'swing', function() {
				$("#infoModal").modal("open");
			});
		}, 1000);

		$(window).on("beforeunload", function(e) {
			$("html, body").stop().animate({scrollTop:0}, 1000, 'swing');
			if(typeof window.ask_close != "undefined"){
				e.returnValue = "you want to exit?";
				return "you want to exit?";
			}
		});

		$('.slider').slider();
	});
</script>