<?php
	if(!isset($_REQUEST["token"])){
		echo "<script> window.location.href = '/store'; </script>";
        exit();
	}
	$api_index_load = true;
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");

	$res = $API->checkPayment($_REQUEST["token"], $_REQUEST["PayerID"]);
	if($res != "Payment created") {
		$_SESSION["error"]["msg"] = $res;
		$_SESSION["error"]["redirect"] = "/store";
		echo "<script> window.location.href = '/welcome'; </script>";
        exit();
	}
?>
<style type="text/css">
</style>
<h1 style="text-align:center;">
	<img src="img/pinata.png" style="width:256px;"><br><br>
	<b style="color:black;">Thanks for you purchase!</b><br><br>
	<p>With transaction ID: <br><b style="color:black"><?php echo $_REQUEST["token"] . "</b>"; ?></p>
	<br>
	<br>
	<a href="/store">back to store <br> <img src="/img/store.png" alt="store" style="width:96px;"/></a>
</h1>
