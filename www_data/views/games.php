<?php
	$api_index_load = true;
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");

	$games = $API->getGames();
	$games = $games["data"];
?>
<style type="text/css">
	.slider .slides li{
		border-radius: 5px;
	}
</style>
<div class="row" style="text-align:center;">
	<div class="col s12 windowBGTitle"></div>
</div>
<div class="row" style="text-align:center;">
	<?php
		foreach ($games as $game) {
			if($game['status'] != "ACTIVO") continue;
			if($game['id'] == "1") continue;
	?>
		<div class="col s12">
			<div class="windowBG" style="background-size: cover;">
				<div class="gameContent" style="overflow:auto; height: 490px; border-radius:5px; padding:25px; margin-top: 25px;">
					<img src="<?php echo $game['logo']; ?>" class="itemGameIMG">
					<h3 class="itemGameTitle"><?php echo $game['title']; ?></h3>
					<p class="itemGameTXT">
						<?php echo $game['description']; ?>
					</p>
					<div class="slider" style="border-radius: 8px;">
					    <ul class="slides">
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
							        <img src="<?php echo $slide["img"]; ?>"> <!-- random image -->
							        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
							          	<h3><?php echo $slide['title']; ?></h3>
							          	<h5 class="light grey-text text-lighten-3"><?php echo $slide['body']; ?></h5>
							        </div>
						      	</li>
						    <?php } ?>
					    </ul>
					</div>
					<p>
						<?php echo $game['long_description']; ?>
					</p>
					<div class="btnMore hide" data-id="<?php echo $game['id']; ?>" data-description="<?php echo $game['long_descripition']; ?>">
						<h2>MORE</h2>
					</div>
				</div>
			</div>
		</div>
	<?php } ?>
</div>
<script type="text/javascript">
	$(document).ready(function(){
		$('.slider').slider();
	});
</script>
