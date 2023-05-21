<?php
	include_once "views/base/headers/base.php";

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

	$payments = $API->getPayments();
	$payments = $payments["data"];
?>
<style type="text/css">
	.logos{
		height: 96px;
		width: 96px;
		bpayment-radius: 5px;
		box-shadow: 5px 0 5px 0 #000;
	}
	.on{
        box-shadow:
            inset 0 0 50px #fff,
            inset 20px 0 80px rgba(153, 204, 0, 0.1),
            inset -20px 0 80px rgba(153, 204, 0, 19),
            inset 20px 0 300px rgba(153, 204, 0, 0.1),
            inset -20px 0 300px rgba(153, 204, 0, 19),
            0 0 50px #fff,
            -10px 0 80px rgba(153, 204, 0, 0.1),
            10px 0 80px rgba(153, 204, 0, 19);
    }
    input, textarea{
    	color: white;
    }
    [type="checkbox"]:checked:disabled+label:before {
	    bpayment-right: 2px solid green;
	    bpayment-bottom: 2px solid green;
	}
	main {
	    position: absolute;
	    left: 0;
		width: 100%;
    }
    table{
    	color: black;
    }
    .tr_header{
    	color: white;
    }
</style>
<div class="row">
	<div class="col s12">
        <div class="row">
            <div class="input-field col s4 search_row">
				<i class="material-icons prefix">search</i>
	          	<input placeholder="payment id" id="search_payments" type="text">
	          	<label for="search_payments">search</label>
	        </div>
        </div>
	</div>
</div>
<div class="row">
	<div class="col s12">
		<table class="tb_payments highlight striped tablesorter paginar_tabla">
			<thead>
				<tr class="tr_header purple">
					<th>Payment id</th>
					<th>Customer email</th>
					<th>Item amount</th>
					<th>Item type</th>
					<th>Payment amount</th>
					<th>Payment status</th>
					<th class='checkbox'>Status</th>
					<th>Created</th>
				</tr>
			</thead>
			<tbody class="full">
			</tbody>
		</table>
	</div>
</div>
<script src="vendor/jquery.tablesorter.js"></script>
<script type="text/javascript">
	var sending = false;
	var user = <?php echo json_encode($_SESSION["login"], true); ?>;
	var payments = <?php echo json_encode($payments, true); ?>;

	window.fill_table_payments = function(){
		$('.tb_payments tbody').html('');

		$.each(payments, function(index, payment) {
			var tmp_tr = "<tr class=''  data-id='" + payment.id + "' data-paymentid='" + payment.paymentid + "'>";
			tmp_tr += "<td>";
			tmp_tr += "<b class='btnOrderPayment cursor' data-url='/order?view=1&oid=" + payment.paymentid + "'>" + payment.paymentid + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.customer_email + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.item_amount + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.item_type + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.payment_amount + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.payment_status + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.status + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + payment.created + "</b> ";
			tmp_tr += "</td>";

			tmp_tr += "</tr>";

			$('.tb_payments tbody').append(tmp_tr);
		});

		$('.btnOrderPayment').off('click').on('click', function(){
			window.open($(this).attr('data-url'));
		});

		if(payments.length == "0") $('.tb_payments tbody').html('<tr><td colspan="8"><h1 style="text-align: center;">Empty</h1></td></tr>');

		$('.transparent').addClass('hide');
		$('.btn_new').removeClass('hide');
		$(".tb_payments").trigger("destroy");
		$(".tb_payments").tablesorter({
			textExtraction: {
			    '.input' : function(node, table, cellIndex) { return $(node).find("input").val(); },
			    '.checkbox' : function(node, table, cellIndex) { return Number($("input[type='checkbox']", $(node)).prop("checked")); },
			    '.date' : function(node, table, cellIndex) { return $(node).find("u").text(); }
			}
		}).off("sortStart").on("sortStart",function(e, table) {
	      	Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);
	    }).off("sortEnd").on("sortEnd",function(e, table) {
	      	Utilidades.paginar_tabla_mat(10, 5);
	      	$("body").getNiceScroll().resize();
	    });

	    Utilidades.paginar_tabla_mat(10, 5);
	};

	$(document).ready(function(){
		$('#search_payments').off('keyup').on('keyup', function(e){
	        var tmp_search = $(this).val();
	        $('.tb_payments .full').addClass("hide");
	        $('.tb_payments .full tr').addClass("hide");
	        $('.tb_payments .res').remove();
	        Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);

	        if(tmp_search === "") {
	            $('.tb_payments .full').removeClass("hide");
	            $('.tb_payments .full tr').removeClass("hide");
	            $(".tb_payments").trigger("destroy");
				$(".tb_payments").tablesorter({
					textExtraction: {
					    '.input' : function(node, table, cellIndex) { return $(node).find("input").val(); },
					    '.checkbox' : function(node, table, cellIndex) { return Number($("input[type='checkbox']", $(node)).prop("checked")); },
					    '.date' : function(node, table, cellIndex) { return $(node).find("u").text(); }
					}
				}).off("sortStart").on("sortStart",function(e, table) {
			      	Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);
			    }).off("sortEnd").on("sortEnd",function(e, table) {
			      	Utilidades.paginar_tabla_mat(10, 5);
			      	$("body").getNiceScroll().resize();
			    });
	            Utilidades.paginar_tabla_mat(10, 5);
	      		$("body").getNiceScroll().resize();
	        }
	        if(tmp_search.length < 1) return;
	        $('.tb_payments').append('<tbody class="res">/<tbody>');

	        $('.tb_payments .full tr').each(function(index, el) {
	            var tmp_data = $(this).attr('data-paymentid');
	            var on_set = false;
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_payments .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	                on_set = true;
	            }

	            tmp_data = $(this).attr('data-id');
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0 && on_set === false) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_payments .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	            }
	        });

	        $(".tb_payments").trigger("destroy");
			$(".tb_payments").tablesorter({
				textExtraction: {
				    '.input' : function(node, table, cellIndex) { return $(node).find("input").val(); },
				    '.checkbox' : function(node, table, cellIndex) { return Number($("input[type='checkbox']", $(node)).prop("checked")); },
				    '.date' : function(node, table, cellIndex) { return $(node).find("u").text(); }
				}
			}).off("sortEnd").on("sortEnd",function(e, table) {
		      	$("body").getNiceScroll().resize();
		    });

	        $("body").getNiceScroll().resize();
	    });

		fill_table_payments();
	});
</script>
