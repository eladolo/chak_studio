<?php
?>
<style type="text/css">
</style>
<div class="row">
	<div class="col s12">
		<div class="windowBGContacto">
			<h4>Contact</h4>
	        <div class="row">
		        <div class="input-field col s6">
		            <input id="contacto_nombre" type="text" class="validate">
		            <label for="contacto_nombre">Name</label>
		        </div>
		        <div class="input-field col s6">
		            <input id="contacto_email" type="email" class="validate">
		            <label for="contacto_email">email</label>
		        </div>
		        <div class="input-field col s12">
		            <textarea id="contacto_comentario" type="text" class="materialize-textarea"></textarea>
		            <label for="contacto_comentario">Comment</label>
		        </div>
		        <div class="input-field col s12">
		            <input id="contacto_web" type="text">
		            <label for="contacto_web">website</label>
		        </div>
				<div class="col s12 input-field center">
		            <button class="btn waves-effect waves-light lime darken-2 btnEnviarComentario" style="float:none;width:80%;top:-15px;" type="submit" name="action">send
		                <i class="material-icons right">send</i>
		            </button>
		        </div>
		        <div class="col s12">
		    		<div class="g-recaptcha" data-sitekey="6LeF6GAUAAAAABITRVKYrFraRus0FDwlpHcNV15P" style="margin: 0 auto; width: 300px;"></div>
		    	</div>
		    </div>
		</div>
	</div>
</div>
<script type="text/javascript">
	$(document).ready(function(){
		$('.btnEnviarComentario').off('click').on('click', function(event){
			event.preventDefault();
			if(!Utilidades.validar_datos("#contacto_nombre,#contacto_email,#contacto_comentario")) return false;

	        if(!window.isMail($("#contacto_email")[0])) return false;

			if(grecaptcha.getResponse() === "") {
				Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;check captcha please", 'error');
				return false;
			}

			var data = {};
			data.m = "enviar_comentario";
			data.nombre = $("#contacto_nombre").val();
			data.email = $("#contacto_email").val();
			data.web = $("#contacto_web").val();
			data.comentario = $("#contacto_comentario").val();
			data["g-recaptcha-response"] = grecaptcha.getResponse();

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
								Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;wrong captcha");
								break;
	                        case 97:
	                            //no se pudo validar tu correo
	                            Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;can check email");
	                            break;
	                        case 98:
	                            //correo invalido
	                            Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;wrong email");
	                            $("#contacto_email").val("").addClass('error_mat');
	                            break;
							case 99:
								//error al enviar correo
								Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;error sending email");
								$("#contacto_nombre, #contacto_email, #contacto_web, #contacto_comentario").val("");
								break;
						}
					} else {
						Materialize.toast('Thanks!', 3000);
						Materialize.toast('someone from our team will contact you soon.', 5000);
						$("#contacto_nombre, #contacto_email, #contacto_web, #contacto_comentario").val("");
					}
					grecaptcha.reset();
				},
				error: function(html,xmlrq,xtra){
					grecaptcha.reset();
					Materialize.toast("<i class='small material-icons red-text'>report_problem</i>&nbsp;" + html);
				}
			});
		});
	});
</script>