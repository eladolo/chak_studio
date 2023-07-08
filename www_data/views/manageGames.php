<?php
	include_once "views/base/headers/base.php";

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

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
		<div class="row transparent_game hide">
			<input id="id" type="hidden" value="">
            <div class="input-field col s6">
                <input placeholder="some title" name="title" id="title" type="text" class="validate mandatory">
                <label for="title">title</label>
            </div>
            <div class="input-field col s6">
                <input placeholder="description" name="description" id="description" type="text" class="validate mandatory">
                <label for="description">description</label>
            </div>
        </div>
        <div class="row transparent_game hide">
        	<div class="input-field col s12">
                <input placeholder="https://some_place/myimage.png" name="logo" id="logo" type="text" class="validate mandatory">
                <label for="logo">logo</label>
            </div>
            <div class="input-field col s12">
            	<textarea id="long_description" class="materialize-textarea" placeholder="Hello, I'm the long description of an game"></textarea>
          		<label for="long_description">Long description</label>
            </div>
            <div class="input-field col s12">
                <input name="status_game" id="status_game" type="checkbox">
                <label for="status_game">Status</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12" style="text-align:center;">
            	<a class="waves-effect btn green btn_send_games hide">send</a>
            	<a class="waves-effect orange btn btn_clear_games hide">clear</a>
            	<a class="waves-effect red btn btn_delete_games hide">delete</a>
            	<a class="waves-effect grey btn btn_cancel_games hide">cancel</a>
            </div>
            <div class="input-field col s10 search_row_games">
				<i class="material-icons prefix">search</i>
	          	<input placeholder="title name" id="search_games" type="text">
	          	<label for="search_games">search</label>
	        </div>
	        <div class="input-field col s2 search_row_games">
            	<a class="waves-effect red btn btn_new_games">new game</a>
	        </div>
        </div>
	</div>
</div>
<div class="row">
	<div class="col s12">
		<table class="tb_games highlight striped tablesorter paginar_tabla">
			<thead>
				<tr class="tr_header red">
					<th>Logo</th>
					<th>Title</th>
					<th>Description</th>
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
	var games = <?php echo json_encode($games, true); ?>;

	window.fill_table_games = function(){
		$('.tb_games tbody').html('');

		$.each(games, function(index, game) {
			var tmp_tr = "<tr class='editGame cursor'  data-id='" + game.id + "' data-title='" + game.title + "'>";

			tmp_tr += "<td>";
			tmp_tr += "<img alt='" + game.title + "' src='" + game.logo + "' style='width:24px;' />";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + game.title + "</b> ";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += "<b>" + game.description + "</b>";
			tmp_tr += "</td>";
			tmp_tr += "<td>";
			tmp_tr += (game.status == "INACTIVO" ? '<input type="checkbox" disabled="disabled" />' : '<input type="checkbox" checked="checked" disabled="disabled" /><label></label>');
			tmp_tr += "</td>";

			tmp_tr += "</tr>";

			$('.tb_games tbody').append(tmp_tr);
		});

		if(games.length == "0") $('.tb_games tbody').html('<tr><td colspan="4"><h1>Empty</h1></td></tr>');

		$('.editGame').off('click').on('click', function(){
			$(".btn_clear_games").trigger('click');
			var tmp_id = $(this).attr('data-id');
			$.each(games, function(index, game) {
				if(game.id == tmp_id) {
					$("#id").val(game.id);
					$("#title").val(game.title);
					$("#logo").val(game.logo);
					$("#description").val(game.description);
					$("#long_description").val(game.long_description);

					$("#status_game").prop("checked", (game.status == "ACTIVO" ? true : false));

					$('.transparent_game, .btn_new_games, .btn_send_games, .btn_clear_games, .btn_delete_games, .btn_cancel_games').addClass('hide');
					$('.transparent_game, .btn_send_games, .btn_clear_games, .btn_delete_games, .btn_cancel_games').removeClass('hide');

					$("#long_description").focus().keyup();

					return false;
				}
			});

			$('.search_row_games, .tb_games, paginador').addClass('hide');

			$('html, body').animate({scrollTop:0},500);
			$("body").getNiceScroll().resize();
		});

		$('.transparent_game, .btn_new_games, .btn_send_games, .btn_clear_games, .btn_delete_games, .btn_cancel_games').addClass('hide');
		$('.btn_new_games').removeClass('hide');
		$(".tb_games").trigger("destroy");
		$(".tb_games").tablesorter({
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
		$('#search_games').off('keyup').on('keyup', function(e){
	        var tmp_search = $(this).val();
	        $('.tb_games .full').addClass("hide");
	        $('.tb_games .full tr').addClass("hide");
	        $('.tb_games .res').remove();
	        Utilidades.paginar_tabla_mat(10, 5, undefined, undefined, 'destruir', undefined);

	        if(tmp_search === "") {
	            $('.tb_games .full').removeClass("hide");
	            $('.tb_games .full tr').removeClass("hide");
	            $(".tb_games").trigger("destroy");
				$(".tb_games").tablesorter({
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
	        $('.tb_games').append('<tbody class="res">/<tbody>');

	        $('.tb_games .full tr').each(function(index, el) {
	            var tmp_data = $(this).attr('data-title');
	            var on_set = false;
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_games .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	                on_set = true;
	            }

	            tmp_data = $(this).attr('data-id');
	            tmp_data = tmp_data.toUpperCase();
	            if(tmp_data.indexOf(tmp_search.toUpperCase()) >= 0 && on_set === false) {
	                var tmp_res = $(this).clone(true);
	                $('.tb_games .res').append(tmp_res);
	                tmp_res.removeClass("hide");
	            }
	        });

	        $(".tb_games").trigger("destroy");
			$(".tb_games").tablesorter({
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

		$('.btn_new_games').off('click').on('click', function(){
			$('.transparent_game, .btn_new_games, .btn_send_games, .btn_clear_games, .btn_delete_games, .btn_cancel_games, .search_row_games, .tb_games, paginador').addClass('hide');
			$('.transparent_game, .btn_send_games, .btn_clear_games, .btn_cancel_games').removeClass('hide');
			$('.btn_clear_games').trigger('click');
		});

		$('.btn_cancel_games').off('click').on('click', function(){
			$('.transparent_game, .btn_new_games, .btn_send_games, .btn_clear_games, .btn_delete_games, .btn_cancel_games').addClass('hide');
			$('.btn_new_games, .search_row_games, .tb_games, paginador').removeClass('hide');
			$("body").getNiceScroll().resize();
		});

		$('.btn_clear_games').off('click').on('click', function(){
			$("#id").val('');
			$("#title").val('');
			$("#logo").val('');
			$("#description").val('');
			$("#long_description").val('');

			$("#status_game").prop("checked", false);
			$('.btn_delete_games').addClass('hide');
			$("#long_description").focus().keyup();
			$("body").getNiceScroll().resize();
		});

		$('.btn_send_games').off('click').on('click', function(){
			if(sending) {
				return;
			}
			var data = {};
			var url = '/?m=createGame';
			var res_msg = 'game created';

			data.uid = user.id;
			data.title = $("#title").val();
			data.logo = $("#logo").val();
			data.description = $("#description").val();
			data.long_description = $("#long_description").val();
			data.status = Number($("#status_game").prop("checked")) == 1 ? 'ACTIVO' : 'INACTIVO';

			if($("#title").val() === "" || $("#description").val() === "" || $("#long_description").val() === "" || $("#status").val() === "" || $("#logo").val() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let any field empty.', 4000);

				return;
			}

			if($("#id").val() !== ""){
				data.id = $("#id").val();
				data.id = data.id.toString();
				url = "/?m=updateGame";
				res_msg = 'game updated';
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
					$(".btn_clear_games").trigger('click');
					games = html.data;
					fill_table_games();
					$('.search_row_games, .tb_games, paginador').removeClass('hide');
					$('#search_games').val('').trigger('keyup');
				},
				error: function(html){
					console.log(html);
					sending = false;
					$('.toast').remove();
					Materialize.toast('error: <br>' + html, 4000);
				}
			});
		});

		$('.btn_delete_games').off('click').on('click', function(){
			$('.toast').remove();
			Materialize.toast('<span>Are you shure you want to delete this game?</span><button class="btn-flat toast-action del_action red ">del</button>', 4000);

			$('.del_action').off('click').on('click', function(){
				$.ajax({
					url: "/?m=deleteGame",
					type: 'POST',
					dataType: 'json',
					data: {
						uid: user.id,
						id: $("#id").val()
					},
					success: function(html){
						$('.toast').remove();
						Materialize.toast("Game deleted", 4000);
						$(".btn_clear_games").trigger('click');
						games = html.data;
						fill_table_games();
						$('.search_row_games, .tb_games, paginador').removeClass('hide');
					},
					error: function(html){
						console.log(html);
						$('.toast').remove();
						Materialize.toast('error: <br>' + html, 4000);
					}
				});
			});
		});

		fill_table_games();
	});
</script>
