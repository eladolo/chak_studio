<?php
	if(!isset($_SESSION["login"])) {
		unset($_SESSION);
		echo "<script> window.location.href = '/login'; </script>";
		exit();
	}

	$api_index_load = true;
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");
?>
