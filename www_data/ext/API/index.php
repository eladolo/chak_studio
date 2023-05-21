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
include_once("config.php");
$allowed = array('https://t5xmq1vebg5bxj11rse52gp1xttqne.ext-twitch.tv', 'https://nuywndj06c322vwhiodwytj6c5h0or.ext-twitch.tv', 'https://szk5j0ax55fauzs2lp8fjyk3qn9k62.ext-twitch.tv', 'https://mgow8jbhpikah3vwo113s23mhfdvfu.ext-twitch.tv', 'https://apiext.chakstudio.com', 'apiext.chakstudio.com', 'https://chakstudio.com', 'chakstudio.com');
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : $_SERVER['HTTP_HOST'];

try {
    if(in_array($origin, $allowed)){
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        throw new Exception("Call error: ->"  . $origin . " Not allowed.");
    }
    //recibo peticion de URL
    $requested_method = '';
    if (isset($_REQUEST['m'])) {
        $url = filter_var($_REQUEST['m'], FILTER_SANITIZE_URL);
        $url = explode('/', $url);
        $url = array_filter($url);
        $requested_method = strtolower(array_shift($url)); //del URL solicitado, se obtiene el nombre del metodo
    }
	$api_index_load = true;
    include_once(API_VERSION . "/index.php");

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
        throw new Exception("Method error: " . API_VERSION . ' -> ' . $requested_method . " Not callable or not a method at all.");
    }
} catch (Exception $ex) {
    print $ex->getMessage();
}
session_write_close();
