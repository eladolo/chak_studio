<?php

	class bootstrap{
		public function views(){
		    header('Content-Type: text/html; charset=utf-8');
		    include_once("master.php");
		    exit;
		}
	}

	$bootstrap = new bootstrap;

	$bootstrap->views();
