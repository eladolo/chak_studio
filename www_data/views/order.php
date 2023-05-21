<?php
	$api_index_load = true;
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");
	require_once($_SERVER["DOCUMENT_ROOT"] . '../lib/twitter/autoload.php');
	use Abraham\TwitterOAuth\TwitterOAuth;

	$games = $API->getGames();
	$games = $games["data"];

	if(isset($_REQUEST["oid"])) $order = $API->getOrderInfo($_REQUEST["oid"]);
	unset($order->links);
	$order = json_encode($order);
?>
<style type="text/css">
	main{
		background-color: transparent !important;
	}

	#tb_paypal{
		width: 90%;
		margin: 0 auto;
	}
	#tb_paypal td{
		vertical-align: top;
	}

	#tb_paypal th{
		color: black;
	}
</style>
<div class="row data_order">
</div>
<hr>
<?php
	if(!isset($_REQUEST["view"])){
?>
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
<?php
	}
?>
<script type="text/javascript">
	$(document).ready(function(){
		$('.slider').slider();
		<?php
			if(isset($_REQUEST["oid"])) {
				if(!isset($order->error)){
					echo "$('.data_order').html(Utilidades.tableGrid(" . $order . ", 'tb_paypal'));";
				}
			}
		?>
	});
</script>