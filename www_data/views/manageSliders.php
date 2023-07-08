<?php
	include_once "views/base/headers/base.php";

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

	$sliders = $API->getsliders();
	$sliders = $sliders["data"][0];

	$games = $API->getGames();
	$games = $games["data"][0];
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
		<div class="row transparent_slider hide">
			<input id="id" type="hidden" value="">
        	<div class="input-field col s6">
                <select id="game_slider" class="validate mandatory">
                	<option value="">---</option>
                	<?php
                		foreach ($games as $game) {
                			echo '<option value="' . $game["id"] . '">' . $game["title"] . '</option>';
			      		}
			      	?>
			    </select>
			    <label>Game</label>
            </div>
            <div class="input-field col s6">
                <input name="status_slider" id="status_slider" type="checkbox">
                <label for="status_slider">Status</label>
            </div>
            <div class="input-field col s12">
                <input placeholder="https://some_place/myimage.png" name="img_slider" id="img_slider" type="text" class="validate mandatory">
                <label for="img_slider">Imagen</label>
            </div>
        	<div class="input-field col s12">
                <input placeholder="Some title" name="title" id="title" type="text" class="validate mandatory">
                <label for="title">Title</label>
            </div>
            <div class="input-field col s12">
            	<textarea id="body" class="materialize-textarea" placeholder="Hello, I'm the description of an slide"></textarea>
          		<label for="body">Body</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12" style="text-align:center;">
            	<a class="waves-effect btn green btn_send_sliders hide">send</a>
            	<a class="waves-effect orange btn btn_clear_sliders hide">clear</a>
            	<a class="waves-effect red btn btn_delete_sliders hide">delete</a>
            	<a class="waves-effect grey btn btn_cancel_sliders hide">cancel</a>
            </div>
            <div class="input-field col s10 search_row_sliders">
				<i class="material-icons prefix">search</i>
	          	<input placeholder="title name" id="search_sliders" type="text">
	          	<label for="search_sliders">search</label>
	        </div>
	        <div class="input-field col s2 search_row_sliders">
            	<a class="waves-effect green btn btn_new_sliders">new slider</a>
	        </div>
        </div>
	</div>
</div>
<div class="row">
	<div class="col s12">
		<table class="tb_sliders highlight striped tablesorter paginar_tabla">
			<thead>
				<tr class="tr_header green">
					<th>Imagen</th>
					<th>Title</th>
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
	var sliders = <?php echo json_encode($sliders, true); ?>;

	window.fill_table_sliders = function(){
		$('.tb_sliders tbody').html('');

		$.each(sliders, function(index, slider) {
			var tmp_tr = "<tr class='editSlider cursor' data-title='" + slider.game_title + "'  data-id='" + slider.id + "' data-item='" + slider.title + "'>";

			tmp_tr += "<td>";
			tmp_tr += "<img alt='" + slider.title + "' src='" + slider.img + "' style='width:24px;' />";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + slider.title + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + slider.game_title + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += (slider.status == "INACTIVO" ? '<input type="checkbox" disabled="disabled" />' : '<input type="checkbox" checked="checked" disabled="disabled" /><label></label>');
			tmp_tr += "</td>";

			tmp_tr += "</tr>";

			$('.tb_sliders tbody').append(tmp_tr);
		});

		if(sliders.length == "0") $('.tb_sliders tbody').html('<tr><td colspan="4"><h1>Empty</h1></td></tr>');

		$('.editSlider').off('click').on('click', function(){
			$(".btn_clear_sliders").trigger('click');
			var tmp_id = $(this).attr('data-id');
			$.each(sliders, function(index, slider) {
				if(slider.id == tmp_id) {
					$("#id").val(slider.id);
					$("#title").val(slider.title);
					$("#game_slider").val(slider.game);
					$("#body").val(slider.body);
					$("#img_slider").val(slider.img);

					$("#status_slider").prop("checked", (slider.status == "ACTIVO" ? true : false));

					$('.transparent_slider, .btn_new_sliders, .btn_send_sliders, .btn_clear_sliders, .btn_delete_sliders, .btn_cancel_sliders').addClass('hide');
					$('.transparent_slider, .btn_send_sliders, .btn_clear_sliders, .btn_delete_sliders, .btn_cancel_sliders').removeClass('hide');

					$('select').material_select('update');

					console.log("info tmp loaded");

					return false;
				}
			});

			$('.search_row_sliders, .tb_sliders, paginador').addClass('hide');

			$('html, body').animate({scrollTop:0},500);
			$("body").getNiceScroll().resize();
		});

		$('.transparent_slider, .btn_new_sliders, .btn_send_sliders, .btn_clear_sliders, .btn_delete_sliders, .btn_cancel_sliders').addClass('hide');
		$('.btn_new_sliders').removeClass('hide');
		$(".tb_sliders").trigger("destroy");
		$(".tb_sliders").tablesorter({
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
		$('#search_sliders').off('keyup').on('keyup', function(e){
	        var tmp_search = $(this).val();
	        $('.tb_sliders .full').addClass("hide");
	        $('.tb_sliders .full tr').addClass("hide");
	        $('.tb_sliders .res').remove();
	        Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);

	        if(tmp_search === "") {
	            $('.tb_sliders .full').removeClass("hide");
	            $('.tb_sliders .full tr').removeClass("hide");
	            $(".tb_sliders").trigger("destroy");
				$(".tb_sliders").tablesorter({
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
	        $('.tb_sliders').append('<tbody class="res">/<tbody>');

	        $('.tb_sliders .full tr').each(function(index, el) {
	            var tmp_data = $(this).attr('data-item');
	            var on_set = false;
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_sliders .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	                on_set = true;
	            }

	            tmp_data = $(this).attr('data-id');
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0 && on_set === false) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_sliders .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	            }

	            tmp_data = $(this).attr('data-title');
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0 && on_set === false) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_sliders .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	            }
	        });

	        $(".tb_sliders").trigger("destroy");
			$(".tb_sliders").tablesorter({
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

		$('.btn_new_sliders').off('click').on('click', function(){
			$('.transparent_slider, .btn_new_sliders, .btn_send_sliders, .btn_clear_sliders, .btn_delete_sliders, .btn_cancel_sliders, .search_row_sliders, .tb_sliders, paginador').addClass('hide');
			$('.transparent_slider, .btn_send_sliders, .btn_clear_sliders, .btn_cancel_sliders').removeClass('hide');
			$('.btn_clear_sliders').trigger('click');
		});

		$('.btn_cancel_sliders').off('click').on('click', function(){
			$('.transparent_slider, .btn_new_sliders, .btn_send_sliders, .btn_clear_sliders, .btn_delete_sliders, .btn_cancel_sliders').addClass('hide');
			$('.btn_new_sliders, .search_row_sliders, .tb_sliders, paginador').removeClass('hide');
			$("body").getNiceScroll().resize();
		});

		$('.btn_clear_sliders').off('click').on('click', function(){
			$("#id").val('');
			$("#title").val('');
			$("#game_slider").val('');
			$("#body").val('');
			$("#img_slider").val('');

			$("#status_slider").prop("checked", false);
			$('.btn_delete_sliders').addClass('hide');
			$('select').material_select('update');
			$("body").getNiceScroll().resize();
		});

		$('.btn_send_sliders').off('click').on('click', function(){
			if(sending) {
				return;
			}
			var data = {};
			var url = '/?m=createSlider';
			var res_msg = 'slider created';

			data.uid = user.id;
			data.title = $("#title").val();
			data.game = $("#game_slider").val();
			data.body = $("#body").val();
			data.img = $("#img_slider").val();
			data.status = Number($("#status_slider").prop("checked")) == 1 ? 'ACTIVO' : 'INACTIVO';

			if($("#title").val() === "" || $("#body").val() === "" || $("#game_slider").val() === "" || $("#img_slider").val() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let any field empty or unselected.', 4000);

				return;
			}

			if($("#id").val() !== ""){
				data.id = $("#id").val();
				data.id = data.id.toString();
				url = "/?m=updateSlider";
				res_msg = 'slider updated';
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
					$(".btn_clear_sliders").trigger('click');
					sliders = html.data;
					fill_table_sliders();
					$('.search_row_sliders, .tb_sliders, paginador').removeClass('hide');
					$('#search_sliders').val('').trigger('keyup');
				},
				error: function(html){
					console.log(html);
					sending = false;
					$('.toast').remove();
					Materialize.toast('error: <br>' + html, 4000);
				}
			});
		});

		$('.btn_delete_sliders').off('click').on('click', function(){
			$('.toast').remove();
			Materialize.toast('<span>Are you shure you want to delete this slider?</span><button class="btn-flat toast-action del_action red ">del</button>', 4000);

			$('.del_action').off('click').on('click', function(){
				$.ajax({
					url: "/?m=deleteSlider",
					type: 'POST',
					dataType: 'json',
					data: {
						uid: user.id,
						id: $("#id").val()
					},
					success: function(html){
						$('.toast').remove();
						Materialize.toast("slider deleted", 4000);
						$(".btn_clear_sliders").trigger('click');
						sliders = html.data;
						fill_table_sliders();
						$('.search_row_sliders, .tb_sliders, paginador').removeClass('hide');
					},
					error: function(html){
						console.log(html);
						$('.toast').remove();
						Materialize.toast('error: <br>' + html, 4000);
					}
				});
			});
		});

		fill_table_sliders();

		$('select').material_select('update');
	});
</script>
