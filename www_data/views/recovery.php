<style type="text/css">
</style>
<div class="row">
	<?php
		if(isset($_SESSION["error"])) {
			echo "<h1>" . $_SESSION["error"]["msg"] ."</h1>";
			echo "<script> setTimeout(function(){ window.location.href = '" . $_SESSION["error"]["redirect"] . "';}, 3000); </script>";
			unset($_SESSION["error"]);
		} else {
	?>
	    <form class="col s12" method="POST" action="/?m=recovery">
	        <div class="row">
	            <div class="input-field col s8">
	                <input placeholder="email" name="email" id="email" type="email" class="validate">
	                <label for="email_inline" data-error="Incorrect email format" data-success="Thanks -_-">Email</label>
	                <span class="helper-text"></span>
	            </div>
	            <div class="input-field col s4">
	                <button class="btn waves-effect waves-light green" type="submit" name="action">recovery
	                    <i class="material-icons right">send</i>
	                </button>
	            </div>
	        </div>
	        <div class="row">
	            <div class="col s12">
	        		<div class="g-recaptcha" data-sitekey="6LeF6GAUAAAAABITRVKYrFraRus0FDwlpHcNV15P" style="margin: 0 auto; width: 300px;"></div>
	        	</div>
	        </div>
	        <div class="row">
	            <div class="col s12" style="text-align: center;">
	                <a class="waves-effect waves-teal btn-flat hide" href="/registry" style="margin:0 auto;">Registry</a>
	            </div>
	        </div>
	    </form>
	<?php } ?>
</div>
<script type="text/javascript">
	$(document).ready(function($) {
		$('form').off('submit').on('submit', function(event) {
			if($('#email').val() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let any field empty.', 4000);
				return false;
			}

			if(grecaptcha.getResponse() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let captcha uncheck.', 4000);
				return false;
			}
			$('.form')[0].submit();
		});
	});
</script>
