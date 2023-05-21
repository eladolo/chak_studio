<?php
    if(!isset($api_index_load)) {
        echo "<script>window.location.href = '/';</script>";
        exit();
    }
    class DB{
    	public $host = DB_host;
    	public $name = DB_name;
    	public $user = DB_user;
    	public $password = DB_password;

        public function connect(){
            return new \PDO('mysql:host=' . $this->host . ';dbname=' . $this->name, $this->user, $this->password, array(\PDO::ATTR_PERSISTENT => true));
        }

        public function runTransaction($queries_params, $errormsg){
            $pdo = $this->connect();
            try {
                $pdo->beginTransaction();
                foreach ($queries_params as $qrystep) {
                    $statem = $pdo->prepare($qrystep->query);
                    if (!$statem->execute($qrystep->params)){
                        $errorsql = $statem->errorInfo();
                        $statem = null;
                        return array("error"=>$errormsg . $errorsql[2]);
                    }
                    $statem = null;
                }
                $fnlresp = $pdo->commit();
                $pdo = null;
                return $fnlresp;
            } catch (\PDOException $exc) {
                $pdo->rollBack();
                $pdo = null;
                return array("error"=>$errormsg . $exc->getMessage());
            }
        }

        public function runQuery($query, $params, $errormsg, &$insertid = null){
            $pdo = $this->connect();
            $statem = $pdo->prepare($query);
            if (!$statem->execute($params)) {
                $errorsql = $statem->errorInfo();
                return array("error"=>$errormsg . $errorsql[2]);
            }
            if (isset($insertid)) {
                //regreso el id del ultimo insert
                $insertid = $pdo->lastInsertId();
            }
            $pdo = null;
            return $statem;
        }
    }

    class API{
        /*
        * CURL function
        */
        public function requrl($param){
            $url = "";
            $header = array();
            $type = "GET";
            $fields = "";

            ini_set('memory_limit', '-1');

            foreach ($param as $key => $value) {
                if($key == "url") $url = $value;
                if($key == "header") $header = $value;
                if($key == "type") $type = $value;
                if($key == "fields") $fields = $value;
            }

            $ch = curl_init();

            if($type == "GET" && $fields !== ""){
                $url = $url . "?" . $fields;
            }

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
            curl_setopt($ch, CURLOPT_TIMEOUT, 400); //timeout in seconds

            if(count($header) > 0){
                curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            }
            if($type == "POST"){
                curl_setopt($ch, CURLOPT_POST,true);
                if($fields !== "") curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            }

            if($type == "PUT" || $type == "DELETE"){
            	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $type);
            }

            // receive server response ...
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $server_output = curl_exec($ch);

            if(curl_error($ch)){
            	$server_output = array(
            		"error" => true,
            		"msg" => curl_error($ch)
            	);
            } else {
                $server_output = array(
                	"error" => false,
            		"response" => json_decode($server_output, true)
                );
            }

            curl_close($ch);

            return json_encode($server_output);
        }

        /*
        * Extension functions
        */
        public function getconfig(){
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $server_output = $this->requrl(array(
                    "url" => "https://api.twitch.tv/extensions/" . $_REQUEST["client"] . "/configurations/channels/" . $_REQUEST["channel"],
                    "header" => array(
                        'Authorization: Bearer ' . $_REQUEST["token"],
                        'client-ID: ' . $_REQUEST["client"],
                        'content-type: application/json'
                    ),
                    "type" => "GET"
                ));
                $server_output = json_decode($server_output);
                $response = $server_output->response;
            } else {
                $response = array("error" => "not a valid jwt");
            }

            return array("response" => $response);
        }

        public function feedback(){
            $db = new DB();
            $querycheck = "INSERT INTO feedback ";
            $querycheck .= "(clientid, channelid, userid, msg) ";
            $querycheck .= "VALUES('" . $_REQUEST["client"] . "', '" . $_REQUEST["channel"] . "', '" . $_REQUEST["user"] . "', '" . $_REQUEST["msg"] . "'); ";

            $rescheck = $db->runQuery($querycheck, array(), "Error: Can´t insert feedback.");

            if($rescheck == "Error: Can´t insert feedback."){
                return array("success" => false, "response" => $rescheck);
            } else {
                return array("success" => true);
            }
        }

        private function base64UrlEncode($data){
            return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
        }

        private function base64UrlDecode($data){
            $urlUnsafeData = str_replace(['-', '_'], ['+', '/'], $data);
            $paddedData = str_pad($urlUnsafeData, strlen($data) % 4, '=', STR_PAD_RIGHT);

            return base64_decode($paddedData);
        }

        private function signJWT($payload_array){
            // Create token header as a JSON string
            $header = json_encode(array('alg' => 'HS256', 'typ' => 'JWT'));
            // Create token payload as a JSON string
            $payload = json_encode($payload_array);
            // Encode Header to Base64Url String
            $base64UrlHeader = $this->base64UrlEncode($header);
            // Encode Payload to Base64Url String
            $base64UrlPayload = $this->base64UrlEncode($payload);
            // Create Signature Hash
            $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->base64UrlDecode(SECRET_SHARE), true);
            // Encode Signature to Base64Url String
            $base64UrlSignature = $this->base64UrlEncode($signature);
            // Create JWT
            $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

            return $jwt;
        }

        private function verifyJWT($jwt){
            list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);
            $dataEncoded = $headerEncoded . "." . $payloadEncoded;
            $rawSignature = hash_hmac('sha256', $dataEncoded, $this->base64UrlDecode(SECRET_SHARE), true);
            $testSignature = $this->base64UrlEncode($rawSignature);

            return hash_equals($signatureEncoded, $testSignature);
        }
    }

    $API = new API;
