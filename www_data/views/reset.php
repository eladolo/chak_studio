<?php
	if(isset($_REQUEST["t"])) {
		function decryptIt($q) {
		    $cryptKey  = 'm1chakb07Pa22';
		    $qDecoded  = rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), base64_decode( $q ), MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ), "\0");
		    return($qDecoded);
		}

		$tmp_req = decryptIt($_REQUEST["t"]);
		$tmp_req = explode("###", $tmp_req);
		$tmp_id = $tmp_req[0];
		$tmp_time = $tmp_req[2] + 3600;

		if(!is_numeric($tmp_id)) {
			echo "<h2>Wrong string!</h2>";
			echo "<script>setTimeout(function(){ window.location.href = '/recovery'; }, 3000);</script>";
			exit();
		}

		if($tmp_time < time()) {
			echo "<h2>Link expire! " . $tmp_time . "</h2>";
			echo "<script>setTimeout(function(){ window.location.href = '/recovery'; }, 3000);</script>";
			exit();
		}
	} else {
		echo "<script>window.location.href = '/';</script>";
		exit();
	}
?>
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
	    <form class="col s12" method="POST" action="/?m=reset">
	        <div class="row">
	            <div class="input-field col s8">
	            	<input name="uid" id="uid" type="hidden" value="<?php echo $tmp_id; ?>">
	            	<input name="t" id="t" type="hidden" value="<?php echo $_REQUEST["t"]; ?>">
	                <input placeholder="password" name="password" id="password" type="password" class="validate">
	                <label for="password" data-error="Don't left field empty." data-success="Thanks -_-">New password</label>
	                <span class="helper-text"></span>
	            </div>
	            <div class="input-field col s4">
	                <button class="btn waves-effect waves-light" type="submit" name="action">Reset
	                    <i class="material-icons right">send</i>
	                </button>
	            </div>
	        </div>
	        <div class="row">
	            <div class="col s12">
	        		<div class="g-recaptcha" data-sitekey="6LeF6GAUAAAAABITRVKYrFraRus0FDwlpHcNV15P" style="margin: 0 auto; width: 300px;"></div>
	        	</div>
	        </div>
	    </form>
	<?php } ?>
</div>
<script type="text/javascript">
	$(document).ready(function($) {
		$('form').off('submit').on('submit', function(event) {
			if($('#password').val() === "") {
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
