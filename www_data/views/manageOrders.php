<?php
	include_once "views/base/headers/base.php";

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

	$orders = $API->getOrders();
	$orders = $orders["data"];
?>
<style type="text/css">
	.logos{
		height: 96px;
		width: 96px;
		border-radius: 5px;
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
	    border-right: 2px solid green;
	    border-bottom: 2px solid green;
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
	          	<input placeholder="payment id" id="search_orders" type="text">
	          	<label for="search_orders">search</label>
	        </div>
        </div>
	</div>
</div>
<div class="row">
	<div class="col s12">
		<table class="tb_orders highlight striped tablesorter paginar_tabla">
			<thead>
				<tr class="tr_header yellow">
					<th>Payment id</th>
					<th>jwt</th>
					<th>AppOS</th>
					<th>Created</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody class="full">
			</tbody>
		</table>
	</div>
</div>
<script type="text/javascript" src="vendor/jquery.tablesorter.js"></script>
<script type="text/javascript">
	var sending = false;
	var user = <?php echo json_encode($_SESSION["login"], true); ?>;
	var orders = <?php echo json_encode($orders, true); ?>;

	window.fill_table_orders = function(){
		$('.tb_orders tbody').html('');

		$.each(orders, function(index, order) {
			var tmp_tr = "<tr class='' data-id='" + order.id + "' data-paymentid='" + order.paymentid + "'>";
			tmp_tr += "<td>";
			tmp_tr += "<b class='btnOrder cursor' data-url='/order?view=1&oid=" + order.paymentid + "'>" + order.paymentid + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<p class='truncate' style='width:100px;'>" + order.jwt + "</p> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + order.appos + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + order.created + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + order.status + "</b> ";
			tmp_tr += "</td>";

			tmp_tr += "</tr>";

			$('.tb_orders tbody').append(tmp_tr);
		});

		$('.btnOrder').off('click').on('click', function(){
			window.open($(this).attr('data-url'));
		});

		if(orders.length == "0") $('.tb_orders tbody').html('<tr><td colspan="5"><h1 style="text-align: center;">Empty</h1></td></tr>');

		$('.transparent').addClass('hide');
		$('.btn_new').removeClass('hide');
		$(".tb_orders").trigger("destroy");
		$(".tb_orders").tablesorter({
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
		$('#search_orders').off('keyup').on('keyup', function(e){
	        var tmp_search = $(this).val();
	        $('.tb_orders .full').addClass("hide");
	        $('.tb_orders .full tr').addClass("hide");
	        $('.tb_orders .res').remove();
	        Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);

	        if(tmp_search === "") {
	            $('.tb_orders .full').removeClass("hide");
	            $('.tb_orders .full tr').removeClass("hide");
	            $(".tb_orders").trigger("destroy");
				$(".tb_orders").tablesorter({
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
	        $('.tb_orders').append('<tbody class="res">/<tbody>');

	        $('.tb_orders .full tr').each(function(index, el) {
	            var tmp_data = $(this).attr('data-paymentid');
	            var on_set = false;
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_orders .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	                on_set = true;
	            }

	            tmp_data = $(this).attr('data-id');
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0 && on_set === false) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_orders .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	            }
	        });

	        $(".tb_orders").trigger("destroy");
			$(".tb_orders").tablesorter({
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

		fill_table_orders();
	});
</script>
