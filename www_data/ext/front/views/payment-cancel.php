<?php
	if(!isset($_REQUEST["token"])){
		echo "<script> window.location.href = '/store'; </script>";
        exit();
	}
	$api_index_load = true;
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");

	$API->cancelOrder($_REQUEST["token"]);
?>
<style type="text/css">
</style>
<h1 style="text-align:center;">
	<img src="img/chili.png" style="width:256px;"><br><br>
	<b style="color:black;">Order cancel</b><br><br>
	<p>Transaction ID: <br><b style="color:black"><?php echo $_REQUEST["token"] . "</b>"; ?></p>
	<br>
	<br>
	<a href="/store">back to store <br> <img src="/img/store.png" alt="store" style="width:96px;"/></a>
</h1>