<?php
	$api_index_load = true;
	include_once("./../api/" . API_VERSION . "/index.php");

	$products = $API->getProducts();
	$products = $products["data"];
?>
<style type="text/css">
	.g-recaptcha{
		position: relative;
		left: -10px;
	}
	.g-recaptcha, #rc-imageselect   {
        transform: scale(0.5);
        transform-origin: 0 0;
    }
</style>
<div class="row" style="text-align:center;">
	<?php
		$last_cat = '';
		foreach ($products as $product) {
			if($product['status'] != "ACTIVO") continue;

			if($last_cat != $product['game_title']){
				$last_cat = $product['game_title'];
				echo "<div class=\"col s12\"><br><br><br><h1>" . $last_cat . "<h2></div>";
			}
	?>
			<div class="col s12">
				<div class="windowBGS">
					<div class="windowBGSItem">
						<div style="width:128px; height: 128px; margin:25px auto; top: 5px; position: relative;">
							<?php  for($i = 0; $i < $product['amount']; $i++){
							?>
								<img src="<?php echo $product['img']; ?>" class="itemStoreIMG tooltipped" style="cursor:help;  left:<?php echo $i * 4;  ?>px; position: absolute;" data-tooltip="<?php echo "* for: " .  $product['game_title'] . "<br>" . $product['amount'] . " " . $product['item'] ."(s)"; ?>" data-position="bottom">
							<?php
									if($product['amount'] >= 10) break;
								}
							?>
						</div>
						<h3 class="itemStoreTXT">$<?php echo $product['cost']; ?></h3>
						<h4 style="color:brown"><?php echo $product['amount']; ?></h4>
					</div>
					<div class="btnBuy" data-amount="<?php echo $product['amount']; ?>" data-item="<?php echo $product['item']; ?>" data-cost="<?php echo $product['cost']; ?>" data-id="<?php echo $product['id']; ?>" data-img="<?php echo $product['img']; ?>" data-appos="WEB">
						<h2>BUY</h2>
					</div>
				</div>
			</div>
	<?php } ?>
</div>
<!-- Modal paypal -->
<div id="paypalModal" class="modal modal-fixed-footer" style="width:280px; height: 450px; color: #000000; background-color: transparent !important; box-shadow: unset !important;">
    <div class="modal-content windowBGSItem" style="height: 450px;">
        <div class="row">
		    <div class="col s12">
		      	<ul class="tabs" style="background-color: transparent !important;">
			        <li class="tab"><a class="active black-text tooltipped" data-tooltip="Paypal" data-position="top" data-provider="paypal" href="#paypal_content" style="color:white !important;"><img src="/img/paypal.png" alt="paypal" style="width:48px;"></a></li>
		      	</ul>
		    </div>
		    <div id="paypal_content" class="col s12 modalContentPos">
		    	<div class="provider paypal hide">
					<div class="input-field">
			            <input id="contacto_nombre" type="text" class="validate">
			            <label for="contacto_nombre">Name</label>
			        </div>
			        <div class="input-field">
			            <input id="contacto_email" type="email" class="validate">
			            <label for="contacto_email">email</label>
			        </div>
			    </div>
		        <br>
		    	<img src="/img/logo2.png" style="width: 28px; height: 28px;" >
				<p>$24.99</p>
				<hr>
				<div class="col s12">
		    		<div class="g-recaptcha" data-sitekey="6LeF6GAUAAAAABITRVKYrFraRus0FDwlpHcNV15P" style="margin: 0 auto; width: 300px;"></div>
		    	</div>
		    </div>
		   	<div id="paypal_content_footer" class="col s12" style="position: absolute; bottom: 80px; left: 0px;">
		    	<div class="btnSend">
		    		<p>Order</p>
		    	</div>
		    </div>
		</div>
    </div>
    <div class="modal-footer hide">
    </div>
</div>

<!-- Modal iframe Paypal -->
<div id="paypalIframeModal" class="modal modal-fixed-footer" style="width:320px; height: 450px; color: #000000; background-color: transparent !important; box-shadow: unset !important;">
    <div class="modal-content" style="height: 450px;">
    	<p>
    		<div class="iframe-container">
      			<iframe id="iframePaypal" width="320" height="450" src="" frameborder="0" allowfullscreen></iframe>
      		</div>
    	</p>
    </div>
    <div class="modal-footer hide">
    </div>
</div>
<script type="text/javascript">
	var tmp_data = {};
	window.purchaseDone = function(data){
		Materialize.toast('Thanks for your purchase!', 3000);
		Materialize.toast('You receive an email with more information about your purchase.', 5000);
		$("#contacto_nombre, #contacto_email").val("");
		$("#paypalModal .btnSend").val("data-id", "");
		$("#paypalModal .btnSend").val("data-img", "");
		$("#paypalModal .btnSend").val("data-amount", "");
		$("#paypalModal .btnSend").val("data-item", "");
		$("#paypalModal .btnSend").val("data-cost", "");
		$("#paypalModal .btnSend").val("data-appos", "");
		$("#paypalModal .btnSend").val("data-provider", "");
		tmp_data = {};
	};

	$(document).ready(function(){
		$('.btnBuy').off('click').on('click', function(){
			$("#paypalModal input").removeClass('error_mat');
			$("#paypalModal .btnSend").attr("data-id", $(this).attr('data-id'));
			$("#paypalModal .btnSend").attr("data-amount", $(this).attr('data-amount'));
			$("#paypalModal .btnSend").attr("data-item", $(this).attr('data-item'));
			$("#paypalModal .btnSend").attr("data-cost", $(this).attr('data-cost'));
			$("#paypalModal .btnSend").attr("data-appos", $(this).attr('data-appos'));
			$("#paypalModal #paypal_content img").attr("src", $(this).attr('data-img'));
			$('#paypalModal .tab > a').trigger('click');

			var tmp_content = "Amount: " + $(this).attr('data-amount');
			tmp_content += "<br>Item: " + $(this).attr('data-item');
			tmp_content += "<br><br>Cost: $ <b style='color:brown'>" + $(this).attr('data-cost') + "</b>";
			$("#paypalModal #paypal_content p").html(tmp_content);
			$("#paypalModal").modal('open');
			$("#paypalModal #paypal_content").scrollTop(0);
			$("#paypalModal #paypal_content").getNiceScroll().resize();
		});

		$('#paypalModal .btnSend').off('click').on('click', function(){
			event.preventDefault();
			if(!Utilidades.validar_datos("#contacto_nombre,#contacto_email")) return false;

	        if(!window.isMail($("#contacto_email")[0])) return false;

			if(grecaptcha.getResponse() === "") {
				Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;check captcha please", 3000);
				return false;
			}

			var data = {};
			data.m = "createOrder";
			data.itemid = $(this).attr("data-id");
			data.pp_name = $("#contacto_nombre").val();
			data.pp_email = $("#contacto_email").val();
			data.amount = $(this).attr("data-amount");
			data.item = $(this).attr("data-item");
			data.cost = $(this).attr("data-cost");
			data.appos = $(this).attr("data-appos");
			data.provider = $(this).attr("data-provider");
			data["g-recaptcha-response"] = grecaptcha.getResponse();

			Utilidades.preloader();

			$.ajax({
				url: '/',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(html,xmlrq,xtra){
					if(html.error){
						switch(html.error){
							case 96:
								//captcha incorrecto
								Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;wrong captcha", 3000);
								break;
	                        case 97:
	                            //no se pudo validar tu correo
	                            Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;can check email", 3000);
	                            break;
	                        case 98:
	                            //correo invalido
	                            Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;wrong email", 3000);
	                            $("#contacto_email").val("").addClass('error_mat');
	                            break;
	                        case 99:
	                        case 100:
	                            //paypal anwsers
	                            Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;" + html.msg, 3000);
	                            break;
						}
					} else {
						tmp_data = data;
						tmp_data.orderid = html.orderid;
						tmp_data.paymenid = html.paymenid;
						tmp_data.url = html.url.href;

						//$("#iframePaypal").attr("src", html.url.href);

						$("#paypalModal").modal('close');
						//$("#paypalIframeModal").modal('open');

						window.location.href = html.url.href;
					}
					grecaptcha.reset();
					Utilidades.preloader('ok');
				},
				error: function(html,xmlrq,xtra){
					grecaptcha.reset();
					Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;" + html, 3000);
					Utilidades.preloader('ok');
				}
			});

			$("#paypalModal").modal('close');
		});

		$('#paypalModal .tab a').on('click', function(){
			var tmp_val = $(this).attr('data-provider');
			$('.provider').removeClass('hide');
			$('.provider').addClass('hide');
			$('.provider.' + tmp_val).removeClass('hide');
			$("#paypalModal .btnSend").attr("data-provider", tmp_val);
		});
	});
</script>