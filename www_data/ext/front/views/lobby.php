<?php
	include_once "views/base/headers/base.php";

	require_once($_SERVER["DOCUMENT_ROOT"] . '../lib/twitter/autoload.php');
	use Abraham\TwitterOAuth\TwitterOAuth;

	$_REQUES["id"] =  0;
	$games = $API->getGames();
	$games = $games["data"];
?>
<style type="text/css">
	main{
		background-color: transparent !important;
	}
</style>
<div class="row">
	<?php
		foreach ($games as $game) {
			if($game['status'] != "ACTIVO") continue;
	?>
		<div class="col s12" style="text-align:center; ">
			<div class="slider" style="border-radius: 8px; position: relative; margin-bottom: 100px;">
			    <ul class="slides" style="border-radius: 8px; box-shadow: 5px 5px rgba(0,0,0,0.3);">
			    	<?php
				    	$tmp_galery = $game['galery'];
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
		</div>
	<?php } ?>
</div>
<script type="text/javascript">
	$(document).ready(function(){
		$('.slider').slider();
	});
</script>