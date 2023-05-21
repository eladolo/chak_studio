<?php
	include_once "views/base/headers/base.php";
?>
<style type="text/css">
</style>
<link rel="stylesheet" href="css/particles.css"/>
<div class="row">
	<div class="col s12" style="text-align:center;">
		<img src="img/logo.png">
	</div>
</div>
<div class="row">
	<div class="col s12" style="text-align:center;">
		<?php if(isset($_SESSION["error"])){
				echo "<h1><b style='color:red;'>" . $_SESSION["error"]["msg"] . "</b>";
				echo "<script> setTimeout(function(){ window.location.href = '" . $_SESSION["error"]["redirect"] . "';}, 3000); </script>";
				unset($_SESSION["error"]);
			} else {
				echo "<script> window.location.href = 'https://chakbot.mdac.no-ip.org/'; </script>";
			}
		?>
	</dv>
</div>
<div id="particles-js"></div>
<script src="js/particles.js"></script>
<script src="js/app.js"></script>
