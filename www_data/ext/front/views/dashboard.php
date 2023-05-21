<?php
	include_once "views/base/headers/base.php";

	require_once($_SERVER["DOCUMENT_ROOT"] . '../lib/twitter/autoload.php');
	use Abraham\TwitterOAuth\TwitterOAuth;

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

	$games = $API->getGames();
	$games = $games["data"];

	$products = $API->getProducts();
	$products = $products["data"];

	$sliders = $API->getsliders();
	$sliders = $sliders["data"];

	$orders = $API->getOrders();
	$orders = $orders["data"];

	$payments = $API->getPayments();
	$payments = $payments["data"];

	$total_sells = 0.00;

	foreach ($payments as $payment) {
		$total_sells += $payment["payment_amount"];
	}

	$tmp_caption = array(
		"center-align",
		"left-align",
		"right-align"
	);
?>
<style type="text/css">
	main{
		background-color: transparent !important;
	}
</style>
<div class="row">
	<div class="col s12">
		<ul class="tabs tabs-fixed-width ">
			<li class="tab"><a href="#games" class="tooltippedd red" data-index="0" data-tooltip="Games">Games</a></li>
			<li class="tab"><a href="#sliders" class="tooltippedd green" data-index="1" data-tooltip="Sliders">Sliders</a></li>
			<li class="tab"><a href="#products" class="tooltippedd blue" data-index="2" data-tooltip="Products">Products</a></li>
			<li class="tab"><a href="#orders" class="tooltippedd yellow" data-index="3" data-tooltip="Orders">Orders</a></li>
			<li class="tab"><a href="#payments" class="tooltippedd purple" data-index="4" data-tooltip="Payments">Payments</a></li>
		</ul>
		<div id="games">
			<?php include_once "manageGames.php"; ?>
		</div>
		<div id="sliders">
			<?php include_once "manageSliders.php"; ?>
		</div>
		<div id="products">
			<?php include_once "manageProducts.php"; ?>
		</div>
		<div id="orders">
			<?php include_once "manageOrders.php"; ?>
		</div>
		<div id="payments">
			<?php include_once "managePayments.php"; ?>
		</div>
	</div>
	<div class="col s12" style="text-align:center; ">
		<div class="slider" style="border-radius: 8px; position: relative; margin-bottom: 100px; height: 100px !important;">
		    <ul class="slides" style="border-radius: 8px; box-shadow: 5px 5px rgba(0,0,0,0.3);">
		      	<li class="red">
			        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
			          	<h2><?php echo count($games) . " Games"; ?></h2>
			          	<h5 class="light grey-text text-lighten-3"><?php echo ''; ?></h5>
			        </div>
		      	</li>
		      	<li class="green">
			        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
			          	<h2><?php echo count($sliders) . " Sliders"; ?></h2>
			          	<h5 class="light grey-text text-lighten-3"><?php echo ''; ?></h5>
			        </div>
		      	</li>
		      	<li class="blue">
			        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
			          	<h2><?php echo count($products) . " Products"; ?></h2>
			          	<h5 class="light grey-text text-lighten-3"><?php echo ''; ?></h5>
			        </div>
		      	</li>
		      	<li class="yellow">
			        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
			          	<h2><?php echo count($orders) . " Orders"; ?></h2>
			          	<h5 class="light grey-text text-lighten-3"><?php echo ''; ?></h5>
			        </div>
		      	</li>
		      	<li class="purple">
			        <div class="caption <?php echo $tmp_caption[rand(0, 2)]; ?>">
			          	<h2><?php echo count($payments) . " Payments"; ?></h2>
			          	<h5 class="light grey-text text-lighten-3"><?php echo " for $ " . $total_sells; ?></h5>
			        </div>
		      	</li>
		    </ul>
		</div>
	</div>
</div>
<script type="text/javascript">
	$(document).ready(function(){
		$('.slider').slider({
			height : "180",
			indicators: false,
		    interval: 4000,
		    transition: 800
		});

		$('.tab a').on('click', function(){
			setTimeout(function(){
				$("body").getNiceScroll().resize();
			}, 40);

			$('.slider').slider('pause');

			$('.slider').slider('move', $(this).attr("data-index"));
		});

		setTimeout(function(){
			$('.tab a[href="#payments"]').trigger('click');
			$('.slider').slider('pause');
		}, 4);
	});
</script>