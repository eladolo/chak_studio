<?php
	include_once "views/base/headers/base.php";

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

	$products = $API->getProducts();
	$products = $products["data"];

	$games = $API->getGames();
	$games = $games["data"];
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
		<div class="row transparent hide">
			<input id="id" type="hidden" value="">
            <div class="input-field col s4">
                <select id="item" class="validate mandatory">
                	<option value="">---</option>
			      	<option value="diamond">diamond</option>
			      	<option value="chibi">chibi</option>
			      	<option value="chibi">software</option>
			    </select>
			    <label>Item</label>
            </div>
        	<div class="input-field col s4">
                <select id="game_product" class="validate mandatory">
                	<option value="">---</option>
                	<?php
                		foreach ($games as $game) {
                			echo '<option value="' . $game["id"] . '">' . $game["title"] . '</option>';
			      		}
			      	?>
			    </select>
			    <label>Game</label>
            </div>
        	<div class="input-field col s4">
                <input placeholder="7" name="amount" id="amount" type="number" class="validate mandatory">
                <label for="amount">Amount</label>
            </div>
        </div>
        <div class="row transparent hide">
            <div class="input-field col s4">
                <input placeholder="3.99" name="cost" id="cost" type="number" class="mandatory">
                <label for="cost">Cost</label>
            </div>
            <div class="input-field col s4">
                <input placeholder="https://some_place/myimage.png" name="img_product" id="img_product" type="text" class="validate mandatory">
                <label for="img_product">Image</label>
            </div>
            <div class="input-field col s4">
                <input name="status_product" id="status_product" type="checkbox">
                <label for="status_product">Status</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12" style="text-align:center;">
            	<a class="waves-effect btn green btn_send_products hide">send</a>
            	<a class="waves-effect orange btn btn_clear_products hide">clear</a>
            	<a class="waves-effect red btn btn_delete_products hide">delete</a>
            	<a class="waves-effect grey btn btn_cancel_products hide">cancel</a>
            </div>
            <div class="input-field col s10 search_row_products">
				<i class="material-icons prefix">search</i>
	          	<input placeholder="item name" id="search_products" type="text">
	          	<label for="search_products">search</label>
	        </div>
	        <div class="input-field col s2 search_row_products">
            	<a class="waves-effect blue btn btn_new_products">new product</a>
	        </div>
        </div>
	</div>
</div>
<div class="row">
	<div class="col s12">
		<table class="tb_products highlight striped tablesorter paginar_tabla">
			<thead>
				<tr class="tr_header blue">
					<th>Imagen</th>
					<th>Item</th>
					<th>Amount</th>
					<th>Cost</th>
					<th>Game</th>
					<th class='checkbox'>Status</th>
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
	var products = <?php echo json_encode($products, true); ?>;

	window.fill_table_products = function(){
		$('.tb_products tbody').html('');

		$.each(products, function(index, product) {
			var tmp_tr = "<tr class='editProduct cursor'  data-id='" + product.id + "' data-item='" + product.item + "'>";

			tmp_tr += "<td>";
			tmp_tr += "<img alt='" + product.item + "' src='" + product.img + "' style='width:24px;' />";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + product.item + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + product.amount + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + product.cost + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + product.game_title + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += (product.status == "INACTIVO" ? '<input type="checkbox" disabled="disabled" />' : '<input type="checkbox" checked="checked" disabled="disabled" /><label></label>');
			tmp_tr += "</td>";

			tmp_tr += "</tr>";

			$('.tb_products tbody').append(tmp_tr);
		});

		if(products.length == "0") $('.tb_products tbody').html('<tr><td colspan="4"><h1>Empty</h1></td></tr>');

		$('.editProduct').off('click').on('click', function(){
			$(".btn_clear_products").trigger('click');
			var tmp_id = $(this).attr('data-id');
			$.each(products, function(index, product) {
				if(product.id == tmp_id) {
					$("#id").val(product.id);
					$("#item").val(product.item);
					$("#game_product").val(product.game);
					$("#amount").val(product.amount);
					$("#cost").val(product.cost);
					$("#img_product").val(product.img);

					$("#status_product").prop("checked", (product.status == "ACTIVO" ? true : false));

					$('.transparent, .btn_new_products, .btn_send_products, .btn_clear_products, .btn_delete_products, .btn_cancel_products').addClass('hide');
					$('.transparent, .btn_send_products, .btn_clear_products, .btn_delete_products, .btn_cancel_products').removeClass('hide');

					$('select').material_select('update');

					return false;
				}
			});

			$('.search_row_products, .tb_products, paginador').addClass('hide');

			$('html, body').animate({scrollTop:0},500);
			$("body").getNiceScroll().resize();
		});

		$('.transparent, .btn_new_products, .btn_send_products, .btn_clear_products, .btn_delete_products, .btn_cancel_products').addClass('hide');
		$('.btn_new_products').removeClass('hide');
		$(".tb_products").trigger("destroy");
		$(".tb_products").tablesorter({
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
		$('#search_products').off('keyup').on('keyup', function(e){
	        var tmp_search = $(this).val();
	        $('.tb_products .full').addClass("hide");
	        $('.tb_products .full tr').addClass("hide");
	        $('.tb_products .res').remove();
	        Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);

	        if(tmp_search === "") {
	            $('.tb_products .full').removeClass("hide");
	            $('.tb_products .full tr').removeClass("hide");
	            $(".tb_products").trigger("destroy");
				$(".tb_products").tablesorter({
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
	        $('.tb_products').append('<tbody class="res">/<tbody>');

	        $('.tb_products .full tr').each(function(index, el) {
	            var tmp_data = $(this).attr('data-item');
	            var on_set = false;
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_products .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	                on_set = true;
	            }

	            tmp_data = $(this).attr('data-id');
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0 && on_set === false) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_products .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	            }
	        });

	        $(".tb_products").trigger("destroy");
			$(".tb_products").tablesorter({
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

		$('.btn_new_products').off('click').on('click', function(){
			$('.transparent, .btn_new_products, .btn_send_products, .btn_clear_products, .btn_delete_products, .btn_cancel_products, .search_row_products, .tb_products, paginador').addClass('hide');
			$('.transparent, .btn_send_products, .btn_clear_products, .btn_cancel_products').removeClass('hide');
			$('.btn_clear_products').trigger('click');
		});

		$('.btn_cancel_products').off('click').on('click', function(){
			$('.transparent, .btn_new_products, .btn_send_products, .btn_clear_products, .btn_delete_products, .btn_cancel_products').addClass('hide');
			$('.btn_new_products, .search_row_products, .tb_products, paginador').removeClass('hide');
			$("body").getNiceScroll().resize();
		});

		$('.btn_clear_products').off('click').on('click', function(){
			$("#id").val('');
			$("#item").val('');
			$("#game_product").val('');
			$("#amount").val('');
			$("#cost").val('');
			$("#img_product").val('');

			$("#status_product").prop("checked", false);
			$('.btn_delete_products').addClass('hide');
			$('select').material_select('update');
			$("body").getNiceScroll().resize();
		});

		$('.btn_send_products').off('click').on('click', function(){
			if(sending) {
				return;
			}
			var data = {};
			var url = '/?m=createProduct';
			var res_msg = 'product created';

			data.uid = user.id;
			data.item = $("#item").val();
			data.game = $("#game_product").val();
			data.amount = $("#amount").val();
			data.cost = $("#cost").val();
			data.img = $("#img_product").val();
			data.status = Number($("#status_product").prop("checked")) == 1 ? 'ACTIVO' : 'INACTIVO';

			if($("#item").val() === "" || $("#game_product").val() === "" || $("#amount").val() === "" || $("#cost").val() === "" || $("#img_product").val() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let any field empty or unselected.', 4000);

				return;
			}

			if($("#id").val() !== ""){
				data.id = $("#id").val();
				data.id = data.id.toString();
				url = "/?m=updateProduct";
				res_msg = 'product updated';
			}

			sending = true;

			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(html){
					sending = false;
					$('.toast').remove();
					Materialize.toast(res_msg, 4000);
					$(".btn_clear_products").trigger('click');
					products = html.data;
					fill_table_products();
					$('.search_row_products, .tb_products, paginador').removeClass('hide');
					$('#search_products').val('').trigger('keyup');
				},
				error: function(html){
					console.log(html);
					sending = false;
					$('.toast').remove();
					Materialize.toast('error: <br>' + html, 4000);
				}
			});
		});

		$('.btn_delete_products').off('click').on('click', function(){
			$('.toast').remove();
			Materialize.toast('<span>Are you shure you want to delete this product?</span><button class="btn-flat toast-action del_action red ">del</button>', 4000);

			$('.del_action').off('click').on('click', function(){
				$.ajax({
					url: "/?m=deleteProduct",
					type: 'POST',
					dataType: 'json',
					data: {
						uid: user.id,
						id: $("#id").val()
					},
					success: function(html){
						$('.toast').remove();
						Materialize.toast("product deleted", 4000);
						$(".btn_clear_products").trigger('click');
						products = html.data;
						fill_table_products();
						$('.search_row_products, .tb_products, paginador').removeClass('hide');
					},
					error: function(html){
						console.log(html);
						$('.toast').remove();
						Materialize.toast('error: <br>' + html, 4000);
					}
				});
			});
		});

		fill_table_products();

		$('select').material_select('update');
	});
</script>
