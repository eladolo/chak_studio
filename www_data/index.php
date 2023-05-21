<?php
/**
* Created by sublime text 2.
* User: adolito
* Date: 17/05/2018
* Time: 15:32
*/
session_start();
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
$dominio = $_SERVER["SERVER_NAME"];
define('BASE_URL', $dominio);//Instalation folder
$_SERVER["DOCUMENT_ROOT"] = "";
include_once( $_SERVER["DOCUMENT_ROOT"] . "../config/config.php");
header('Access-Control-Allow-Origin: https://chakstudio.com');
try {
    //recibo peticion de URL
    $requested_method = '';
    if (isset($_REQUEST['m'])) {
        $url = filter_var($_REQUEST['m'], FILTER_SANITIZE_URL);
        $url = explode('/', $url);
        $url = array_filter($url);
        $requested_method = strtolower(array_shift($url)); //del URL solicitado, se obtiene el nombre del metodo
    } else {
        //valores default
        $requested_method = 'views';
        $_REQUEST['r'] = "welcome";
        if(isset($_SESSION["login"])) {
            //$_REQUEST['r'] = "dashboard";
        }
    }

    if($requested_method == "views") {
        include_once("views/base/bootstrap.php");
    } else {
    	$api_index_load = true;
        include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/API/" . API_VERSION . "/index.php");

        //Reviso autorizacion de apikey

        $not_authorized = true;
        foreach (getallheaders() as $header => $val) {
        	if($header == "Authorization") {
        		$val = str_replace(",", "", $val);
        		$val = explode(" ", $val);
        		if(strripos($val[0], "Bearer") === false) throw new Exception("Call not authorized: Not valid authorization header.");

        		$tmp_db = new DB;
        		$query_apikeys = "SELECT apikey FROM apikeys WHERE apikey = '" . $val[1] . "' AND apikey_status = 1";

        		$res_apikeys = $tmp_db->runQuery($query_apikeys, array(), "Error: user not found. ");
	            $res_apikeys = $res_apikeys->fetchAll(PDO::FETCH_ASSOC);

	            if(count($res_apikeys) == 0){
	            	throw new Exception("Error: apikey not found.");
	            } else {
	        		$array_keys = array("apikey" => $res_apikeys[0]["apikey"]);
	        		if(!in_array($val[1], $array_keys)) {
	        			throw new Exception("Call not authorized: Not valid apikey '" . $val[1] . "' .");
	        		} else {
	        			$not_authorized = false;
	        			break;
	        		}
	        	}
        	}
        }
        if($not_authorized) throw new Exception("Call not authorized: Empty authorization header.");/**/

        if (is_callable(array($API, $requested_method))) {
            $response = call_user_func(array($API, $requested_method)); //si existe la funcion, se ejecuta (los parametros se toman directo del $_REQUEST) si quisieramos mandar parametros aqui, usar call_user_func_array
            if(is_string($response)){
                header('Content-type:application/html;charset=utf-8');
                print $response;
            } else {
                header('Content-type:application/json;charset=utf-8');
                print json_encode($response);
            }
        } else {
            throw new Exception("Method error: Not callable or not a method at all.");
        }
    }
} catch (Exception $ex) {
    print $ex->getMessage();
}
session_write_close();
