<?php
	if(!isset($api_index_load)) {
		echo "<script>window.location.href = '/';</script>";
		exit();
	}
	$dir = dirname(__FILE__);
	if(!isset($no_email)) include_once($dir . "../../../sendgrid/vendor/" . 'autoload.php');

	include_once($dir . "../../../twitter/" . 'autoload.php');
	use Abraham\TwitterOAuth\TwitterOAuth;

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
        private $api_endpoint = "https://api.sandbox.paypal.com";
        /*
        * CURL function
        */

        public function requrl($param){
            $url = "";
            $header = array();
            $type = "GET";
            $fields = "";
            $user = "";

            ini_set('memory_limit', '-1');

            foreach ($param as $key => $value) {
                if($key == "url") $url = $value;
                if($key == "header") $header = $value;
                if($key == "type") $type = $value;
                if($key == "fields") $fields = $value;
                if($key == "user") $user = $value;
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

            if($user !== ""){
                curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                curl_setopt($ch, CURLOPT_USERPWD, $user);
            }

            if(count($header) > 0){
                if(in_array("Content-Type: application/json", $header) && $fields !== "") array_push($header, 'Content-Length: ' . strlen($fields));
                curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
            }
            if($type == "POST"){
                curl_setopt($ch, CURLOPT_POST, true);
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
        * APP functions
        */

        //user
        public function registry(){
            if(!isset($_REQUEST["g-recaptcha-response"]) || empty($_REQUEST["g-recaptcha-response"])){
                $_SESSION["error"] = array("msg" => "missing gcaptcha", "redirect" => "/login");
            }
            $captcha_res = $this->check_captcha($_REQUEST["g-recaptcha-response"]);
            if(isset($captcha_res["error"])){
                $_SESSION["error"] = array("msg"=>"Error with catpcha. " . $captcha_res["error"], "redirect" => "/login");
            } else {
            	$db = new DB();
	            $querycheck = "SELECT id FROM users WHERE user = '" . $_REQUEST["name"] . "' OR email = '" . $_REQUEST["email"] . "' ";

	            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
	            $rescheck = $rescheck->fetchAll();
	            if(!isset($rescheck[0]) && !isset($rescheck[0]["id"])){
	                $query = "INSERT INTO users ";
	                $query .= "(name,email,user,password";
	                if(isset($_REQUEST["status"])) $query .= ",status";
	                $query .= ") ";
	                $query .= "VALUES('" . $_REQUEST["name"] . "','" . $_REQUEST["email"] . "','" . $_REQUEST["user"] . "',PASSWORD('" . $_REQUEST["password"] . "') ";
	                if(isset($_REQUEST["status"])) $query .= ",'" . $_REQUEST["status"] . "'";
	                $query .= ")";
	                $nid = "-1";
	                $res = $db->runQuery($query, array(), "Error: cannot create user", $nid);

	                if($res == "Error: cannot create user.") {
	                    $_SESSION["error"] = array("msg"=>"Error cannot create user ", "redirect" => "/registry");
	                } else {
	                	$uid = $nid;
	                    $query = "INSERT INTO tokens ";
	                    $query .= "(uid) ";
	                    $query .= "VALUES('" . $uid . "') ";
	                    $nid = "-1";
	                    $res = $db->runQuery($query, array(), "Error: cannot create tokens registry", $nid);

	                    if($res == "Error: cannot create tokens registry") {
	                        $_SESSION["error"] = array("msg"=>"Error: cannot create tokens registry ", "redirect" => "/");
	                    } else {
	                        $default_config = array(
	                            "obs_host" => "",
	                            "obs_port" => "",
	                            "obs_user" => "",
	                            "obs_password" => "",
	                            "chat_alerts_on" => 1,
	                            "chat_video_autoplay" => 1
	                        );
	                        $query = "INSERT INTO settings ";
	                        $query .= "(uid, config) ";
	                        $query .= "VALUES('" . $uid . "', '" . $this->signJWT($default_config) . "') ";
	                        $nid = "-1";
	                        $res = $db->runQuery($query, array(), "Error: cannot create settings registry", $nid);

	                        if($res == "Error: cannot create settings registry") {
	                            $_SESSION["error"] = array("msg"=>"Error: cannot create settings registry ", "redirect" => "/");
	                        } else {
	                        	$query = "INSERT INTO apikeys ";
		                        $query .= "(uid, apikey) ";
		                        $query .= "VALUES('" . $uid . "', '" . md5($uid . "" . time() . "" . $_REQUEST["email"]) . "') ";
		                        $nid = "-1";
		                        $res = $db->runQuery($query, array(), "Error: cannot create apikey registry", $nid);

		                        if($res == "Error: cannot create apikey registry") {
		                            $_SESSION["error"] = array("msg"=>"Error: cannot create apikey registry ", "redirect" => "/");
		                        } else {
		                        	$param = array(
		                        		"to" => $_REQUEST["email"],
		                        		"from" => 'admin@chakstudio.com',
		                        		"subject" => 'Welcome ' . $_REQUEST["name"],
		                        		"html" => "
		                        			<h2>Welcome " . $_REQUEST["name"] . "</h2>
		                        			<p>
		                        				Thanks for subscribe into chakstudio.com system.<br>
		                        				Use the follow user <em>" . $_REQUEST["user"] . "</em> and password you provide  for further logins.<br>
		                        				<a href='https://chakstudio.com/login' target='_blank' >Login</a><br>
		                        				<a href='https://chakstudio.comrecovery' target='_blank' >Recovery</a><br>
		                        			</p>
		                        			<pre>-_-</pre>
		                        		"
		                        	);
		                        	$this->send_email($param);
		                            $this->login();
		                        }
	                        }
	                    }
	                }
	            }else{
	                $_SESSION["error"] = array("msg"=>"User all ready registry. " . $rescheck[0]["id"], "redirect" => "/login");
	            }
	        }

	        header("Location: /");
        }

        public function login(){
        	$db = new DB();
            $querycheck = "SELECT count(*) As count FROM login_log ";
            $querycheck .= "WHERE success = '0' ";
            $querycheck .= "AND ip = '" . $this->get_client_ip_server() . "' ";
            $querycheck .= "AND DATE_ADD(created_login, INTERVAL 5 MINUTE) >= NOW() ";

            $rescheck = $db->runQuery($querycheck, array(), "Mysql error: ");

            if(is_array($rescheck)){
            	$_SESSION["error"] = array("msg" => $rescheck["error"], "redirect" => "/login");
            } else {
	            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

	            if($rescheck[0]["count"] <= 10){
		        	if(!isset($_REQUEST["g-recaptcha-response"]) || empty($_REQUEST["g-recaptcha-response"])){
		                $_SESSION["error"] = array("msg" => "missing gcaptcha", "redirect" => "/login");

		                $param = array(
		                	"user" => $_REQUEST["user"],
		                	"password" => $_REQUEST["password"],
		                	"ip" => $this->get_client_ip_server(),
		                	"msg" => $_SESSION["error"]["msg"]
		                );
		                $this->login_log($param);
		            } else {
			            $captcha_res = $this->check_captcha($_REQUEST["g-recaptcha-response"]);
			            if(isset($captcha_res["error"])){
			                $_SESSION["error"] = array("msg"=>"Error with catpcha. " . $captcha_res["error"], "redirect" => "/login");
			                $param = array(
			                	"user" => $_REQUEST["user"],
			                	"password" => $_REQUEST["password"],
			                	"ip" => $this->get_client_ip_server(),
			                	"msg" => $_SESSION["error"]["msg"]
			                );
			                $this->login_log($param);
			            } else {
				            $db = new DB();
				            $querycheck = "SELECT * FROM users As U ";
				            //$querycheck .= "LEFT JOIN (Select * From tokens) as T ON U.id = T.uid ";
				            $querycheck .= "LEFT JOIN (Select * From settings) as S ON U.id = S.uid ";
				            $querycheck .= "LEFT JOIN (Select * From apikeys Where apikey_status = 1) as A ON U.id = A.uid ";
				            $querycheck .= "WHERE user = '" . $_REQUEST["user"] . "' ";
				            $querycheck .= "AND password = PASSWORD('" . $_REQUEST["password"] . "') ";
				            $querycheck .= "AND status = 1 ";

				            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
				            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

				            if(!isset($rescheck[0]) && !isset($rescheck[0]["id"])){
				                $_SESSION["error"] = array("msg"=>"user not found " . $rescheck[0]["id"], "redirect" => "/login");
				                $param = array(
				                	"user" => $_REQUEST["user"],
				                	"password" => $_REQUEST["password"],
				                	"ip" => $this->get_client_ip_server(),
				                	"msg" => $_SESSION["error"]["msg"]
				                );
				                $this->login_log($param);
				            }else{
				                unset($rescheck[0]["password"]);
				                $_SESSION["login"] = $rescheck[0];

                                list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
                                $tmp_config = $this->base64UrlDecode($payloadEncoded);
                                $_SESSION["login"]["config"] = $tmp_config;

				                $param = array(
				                	"user" => $_REQUEST["user"],
				                	"password" => $_REQUEST["password"],
				                	"ip" => $this->get_client_ip_server(),
				                	"uid" => $_SESSION["login"]['id'],
				                	"msg" => "login",
				                	"success" => 1
				                );
				                $this->login_log($param);
				            }
				        }
				    }
				} else {
					$_SESSION["error"] = array("msg"=>"Max amount per hour of attempt reached. <br>Please cool down -_- <br>" . $rescheck[0]["count"], "redirect" => "/login");
	            	$param = array(
	                	"user" => $_REQUEST["user"],
	                	"ip" => $this->get_client_ip_server(),
	                	"msg" => $_SESSION["error"]["msg"]
	                );
	                $this->login_log($param);
				}
			}

            header("location: /");
        }

        public function login_service($id, $service){
            $db = new DB();
            $querycheck = "SELECT * FROM users As U ";
            //$querycheck .= "LEFT JOIN (Select * From tokens) as T ON U.id = T.uid ";
            $querycheck .= "LEFT JOIN (Select * From settings) as S ON U.id = S.uid ";
            $querycheck .= "LEFT JOIN (Select * From apikeys Where apikey_status = 1) as A ON U.id = A.uid ";
            $querycheck .= "WHERE status = 1 ";
            $querycheck .= ($service == "overlay") ? "AND id = '" . $id . "' " : "AND id_" . $service . " = '" . $id . "' ";

            $rescheck = $db->runQuery($querycheck, array(), "user not found.");

            if(is_array($rescheck)){
            	$_SESSION["error"] = array("msg"=>"Mysql error: " . $rescheck["error"], "redirect" => "/login");
            	$param = array(
                	"user" => $id,
                	"type" => $service,
                	"ip" => $this->get_client_ip_server(),
                	"msg" => $_SESSION["error"]["msg"]
                );
                $this->login_log($param);
            } else {
	            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

	            unset($rescheck[0]["password"]);
                $_SESSION["login"] = $rescheck[0];

                list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
                $tmp_config = $this->base64UrlDecode($payloadEncoded);
                $_SESSION["login"]["config"] = $tmp_config;

                $param = array(
                	"user" => $_SESSION["login"]["user"],
                	"ip" => $this->get_client_ip_server(),
                	"uid" => $_SESSION["login"]['id'],
                	"type" => $service,
                	"msg" => "login",
                	"success" => 1
                );
                $this->login_log($param);
	        }

            if($service != "overlay")  echo "<script>window.location.href = '/'; </script>";
        }

        public function logout(){
        	$param = array(
            	"user" => $_SESSION["login"]["user"],
            	"ip" => $this->get_client_ip_server(),
            	"uid" => $_SESSION["login"]['id'],
            	"type" => "logout",
            	"msg" => "byebye"
            );
            $this->login_log($param);
            unset($_SESSION["login"]);
            header("location: /");
        }

        private function login_log($param){
            if(!isset($param["ip"]) || !isset($param["user"])) return false;

            $db = new DB();
            $query = "INSERT INTO login_log ";
            $query .= "(ip,user";
            if(isset($param["password"])) $query .= ",password";
            if(isset($param["type"])) $query .= ",type";
            if(isset($param["uid"])) $query .= ",uid";
            if(isset($param["msg"])) $query .= ",msg";
            if(isset($param["success"])) $query .= ",success";
            $query .= ") ";
            $query .= "VALUES('" . $param["ip"] . "','" . $param["user"] . "' ";
            if(isset($param["password"])) $query .= ",PASSWORD('" . $param["password"] . "')";
            if(isset($param["type"])) $query .= ",'" . $param["type"] . "'";
            if(isset($param["uid"])) $query .= ",'" . $param["uid"] . "'";
            if(isset($param["msg"])) $query .= ",'" . $param["msg"] . "'";
            if(isset($param["success"])) $query .= ",'" . $param["success"] . "'";
            $query .= ")";
            $nid = "-1";
            $res = $db->runQuery($query, array(), "Error: cannot create login log.", $nid);

            return true;
        }

        public function recovery(){
        	if(!isset($_REQUEST["g-recaptcha-response"]) || empty($_REQUEST["g-recaptcha-response"])){
                $_SESSION["error"] = array("msg" => "missing gcaptcha", "redirect" => "/recovery");
            } else {
	            $captcha_res = $this->check_captcha($_REQUEST["g-recaptcha-response"]);
	            if(isset($captcha_res["error"])){
	                $_SESSION["error"] = array("msg"=>"Error with catpcha. " . $captcha_res["error"], "redirect" => "/recovery");
	            } else {
	            	if(!isset($_REQUEST["g-recaptcha-response"]) || empty($_REQUEST["g-recaptcha-response"])){
		                $_SESSION["error"] = array("msg" => "missing gcaptcha", "redirect" => "/recovery");
		            } else {
			            $db = new DB();
			            $querycheck = "SELECT id,name,user,email FROM users As U ";
			            $querycheck .= "WHERE email = '" . $_REQUEST["email"] . "' ";

			            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
			            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

			            if(!isset($rescheck[0]) && !isset($rescheck[0]["email"])){
			                $_SESSION["error"] = array("msg"=>"user not found " . $rescheck[0]["email"], "redirect" => "/recovery");
			            } else {
			            	$reset_token = $this->encryptIt($rescheck[0]["id"] . "###" . $rescheck[0]["email"] . "###" . time());
			                $param = array(
		                		"to" => $_REQUEST["email"],
		                		"from" => 'admin@chakstudio.com',
		                		"subject" => 'Recovery password for ' . $rescheck[0]["user"],
		                		"html" => "
		                			<h2>Hi " . $rescheck[0]["name"] . "</h2>
		                			<p>
		                				Someone has request to recovery your password.<br>
		                				<b>If you dont do this you can ignore this mail</b>.<br>
		                				Use the follow link to reset your password.<br>
		                				<a href='https://chakstudio.com/reset?t=" . $reset_token . "' target='_blank' >RESET</a><br>
		                			</p>
		                		"
		                	);
		                	$this->send_email($param);

		                	$_SESSION["error"] = array("msg"=>"Email send to " . $rescheck[0]["email"] . "!", "redirect" => "/login");
			            }
			        }
		        }
	        }

	        header("Location: /recovery");
        }

        public function reset(){
        	$tmp_req = $this->decryptIt($_REQUEST["t"]);
			$tmp_req = explode("###", $tmp_req);
			$tmp_id = $tmp_req[0];

            $db = new DB();
            $querycheck = "UPDATE users ";
            $querycheck .= "SET password = PASSWORD('" . $_REQUEST["password"] . "') ";
            $querycheck .= "WHERE id = " . $tmp_id . " ";

            $rescheck_1 = $db->runQuery($querycheck, array(), "Error: cannot update password. ");

            if(strpos($rescheck_1, "Error") > -1) {
            	$_SESSION["error"] = array("msg"=> $rescheck_1, "redirect" => "/recovery");
            } else {
            	$querycheck = "SELECT name,user,email,password FROM users As U ";
	            $querycheck .= "WHERE id = '" . $tmp_id . "' ";

	            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
	            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);
	            $rescheck = $rescheck[0];

	            $_REQUEST["user"] = $rescheck["user"];
	            $_REQUEST["password"] = $_REQUEST["password"];

	            $param = array(
	        		"to" => $rescheck["email"],
	        		"from" => 'admin@chakstudio.com',
	        		"subject" => 'Password reset',
	        		"html" => "
	        			<h2>Hi " . $rescheck["name"] . "</h2>
	        			<p>
	        				Your password has being succesfully reset<br>
	        				Use the follow user <em>" . $rescheck["user"] . "</em> and password you provide for further logins.<br>
	        				<a href='https://chakstudio.com/login' target='_blank' >Login</a><br>
	        				<a href='https://chakstudio.com/recovery' target='_blank' >Recovery</a><br>
	        			</p>
	        			<pre>-_-</pre>
	        		"
	        	);
	        	$this->send_email($param);

	        	$_SESSION["error"] = array("msg"=>"Paswoord changed!", "redirect" => "/");
	        }

            header("Location: /reset?t=" . $_REQUEST["t"]);
        }

        public function set_token(){
            $db = new DB();
            $querycheck = "UPDATE tokens ";
            $querycheck .= "SET uid = " . $_REQUEST["id"] . " ";
            if(isset($_REQUEST["status"])) $querycheck .= ",token_status = '" . (isset($_REQUEST["status"]) ? $_REQUEST["status"] : "1") . "' ";
            if(isset($_REQUEST["token"])) $querycheck .= ",token = '" . $_REQUEST["token"] . "' ";
            if(isset($_REQUEST["token_refresh"])) $querycheck .= ",token_refresh = '" . $_REQUEST["token_refresh"] . "' ";
            $querycheck .= "WHERE uid = '" . $_REQUEST["id"] . "' ";
            $querycheck .= "AND token_type = '" . $_REQUEST["token_type"] . "' ";

            $rescheck_1 = $db->runQuery($querycheck, array(), "Error: cannot set token. ");

        	if(isset($_SESSION["login"])){
	            $querycheck = "SELECT * FROM users As U ";
	            //$querycheck .= "LEFT JOIN (Select * From tokens) as T ON U.id = T.uid ";
	            $querycheck .= "LEFT JOIN (Select * From settings) as S ON U.id = S.uid ";
	            $querycheck .= "LEFT JOIN (Select * From apikeys Where apikey_status = 1) as A ON U.id = A.uid ";
	            $querycheck .= "WHERE id = '" . $_REQUEST["id"] . "' ";

	            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
	            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

	            unset($rescheck[0]["password"]);
	            $_SESSION["login"] = $rescheck[0];

                list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
                $tmp_config = $this->base64UrlDecode($payloadEncoded);
                $_SESSION["login"]["config"] = $tmp_config;
	        }
        }

        public function set_apikey(){
            $db = new DB();
            $querycheck = "UPDATE apikeys ";
            $querycheck .= "SET apikey_status = 0 ";
            $querycheck .= "WHERE uid = '" . $_SESSION["login"]["id"] . "' ";

            $res_update = $db->runQuery($querycheck, array(), "Error: cannot update apikeys. ");

            $new_apikey = md5($_SESSION["login"]["id"] . "" . time() . "" . $_SESSION["login"]["email"]);

            $query = "INSERT INTO apikeys ";
            $query .= "(uid, apikey) ";
            $query .= "VALUES('" . $_SESSION["login"]["id"] . "', '" . $new_apikey . "') ";
            $nid = "-1";
            $res = $db->runQuery($query, array(), "Error: cannot create apikey registry", $nid);

            if($res == "Error: cannot create apikey registry") {
                $_SESSION["error"] = array("msg"=>"Error: cannot create apikey registry ", "redirect" => "/");
            } else {
	            $querycheck = "SELECT * FROM users As U ";
	            //$querycheck .= "LEFT JOIN (Select * From tokens) as T ON U.id = T.uid ";
	            $querycheck .= "LEFT JOIN (Select * From settings) as S ON U.id = S.uid ";
	            $querycheck .= "LEFT JOIN (Select * From apikeys Where apikey_status = 1) as A ON U.id = A.uid ";
	            $querycheck .= "WHERE id =  " . $_SESSION["login"]["id"] . " ";

	            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
	            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

	            unset($rescheck[0]["password"]);
	            $_SESSION["login"] = $rescheck[0];

                list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
                $tmp_config = $this->base64UrlDecode($payloadEncoded);
                $_SESSION["login"]["config"] = $tmp_config;
	        }
            return $_SESSION["login"];
        }

        public function set_settings(){
            $db = new DB();
            $querycheck = "UPDATE settings ";
            $querycheck .= "SET config = '" . $this->signJWT(json_decode($_REQUEST["config"])) . "' ";
            $querycheck .= "WHERE sid = " . $_REQUEST["id"] . " ";

            $rescheck_1 = $db->runQuery($querycheck, array(), "Error: cannot set settings. ");

            $querycheck = "SELECT * FROM users As U ";
            $querycheck .= "LEFT JOIN (Select * From settings) as S ON U.id = S.uid ";
            $querycheck .= "LEFT JOIN (Select * From apikeys Where apikey_status = 1) as A ON U.id = A.uid ";
            $querycheck .= "WHERE id = (Select uid From settings Where sid = " . $_REQUEST["id"] . ") ";

            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

            unset($rescheck[0]["password"]);
            $_SESSION["login"] = $rescheck[0];

            list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
            $tmp_config = $this->base64UrlDecode($payloadEncoded);
            $_SESSION["login"]["config"] = $tmp_config;

            return $_SESSION["login"];
        }

        public function get_settings(){
            $db = new DB();
            $querycheck = "SELECT config FROM settings ";
            $querycheck .= "WHERE uid =  " . $_REQUEST["uid"] . " ";

            $rescheck = $db->runQuery($querycheck, array(), "Error: settings not found. ");
            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

            list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
            $tmp_config = $this->base64UrlDecode($payloadEncoded);

            if(isset($_SESSION["login"])) {
                if(is_object($_SESSION["login"])) $_SESSION["login"]["config"] = $tmp_config;
            }
            return $tmp_config;
        }

        public function update_profile(){
        	$db = new DB();
            $query = "UPDATE users ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["name"])) $query .= ",name = '" . $_REQUEST["name"] . "' ";
            if(isset($_REQUEST["user"])) $query .= ",user = '" . $_REQUEST["user"] . "' ";
            if(isset($_REQUEST["password"]) && !empty($_REQUEST["password"])) $query .= ",password = PASSWORD('" . $_REQUEST["password"] . "') ";
            if(isset($_REQUEST["email"])) $query .= ",email = '" . $_REQUEST["email"] . "' ";
            if(isset($_REQUEST["level"])) $query .= ",level = '" . $_REQUEST["level"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = '" . $_REQUEST["status"] . "' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";
            $res = $db->runQuery($query, array(), "Error: cannot update profile.");

            $querycheck = "SELECT * FROM users As U ";
            //$querycheck .= "LEFT JOIN (Select * From tokens) as T ON U.id = T.uid ";
            $querycheck .= "LEFT JOIN (Select * From settings) as S ON U.id = S.uid ";
            $querycheck .= "LEFT JOIN (Select * From apikeys Where apikey_status = 1) as A ON U.id = A.uid ";
            $querycheck .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $rescheck = $db->runQuery($querycheck, array(), "Error: user not found. ");
            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

            unset($rescheck[0]["password"]);
            $_SESSION["login"] = $rescheck[0];

            list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["config"]);
            $tmp_config = $this->base64UrlDecode($payloadEncoded);
            $_SESSION["login"]["config"] = $tmp_config;

            return $_SESSION["login"];
        }

        public function enviar_comentario(){
            $nombre = $_POST['nombre'];
            $email = $_POST['email'];
            $web = $_POST['web'];
            $comentario = $_POST['comentario'];
            $captcha_res = $this->check_captcha($_POST["g-recaptcha-response"]);
            $respuesta = "";
            if(isset($captcha_res["error"])){
                $respuesta = array("error" => 96);
            } else {
                $send_mail = true;

                // Initialize CURL:
                // $ch = curl_init('https://apilayer.net/api/check?access_key=' . MAILBOXLAYER_API . '&email=' . $email . '');
                // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                // // Store the data:
                // $json = curl_exec($ch);
                // curl_close($ch);
                // // Decode JSON response:
                // $validationResult = json_decode($json, true);

                // if(!isset($validationResult['score'])) {
                //     return array("error" => 97);
                // }

                // if($validationResult['score'] >= 0.70) {
                //     $send_mail = true;
                // } else {
                //     return array("error" => 98);
                // }

                if($send_mail){
                    $from = $email;
                    $to = "contacto@chakstudio.com";
                    $cc = "admin@chakstudio.com";
                    $subject = "Comentarios de " . $nombre;

                    $body = "<p>Correo de <b>" . $nombre . "</b>:<br>";
                    $body .= $email . "</p>";
                    if(!empty($web)) $body .= "<p>" . $web . "</p>";
                    $body .= "<p>" . $comentario . "</p>";

                    $cabeceras = 'MIME-Version: 1.0' . "\r\n";
                    $cabeceras .= 'Content-type: text/html; charset=utf-8' . "\r\n";
                    $cabeceras .= 'From: ' . $email . "\r\n";
                    $cabeceras .= 'Cc: ' . $cc . '>';

                    $enviado = mail($to, $subject, $body, $cabeceras);

                    if($enviado){
                        $respuesta = array("success" => true);
                    } else {
                        $respuesta = array("error" => 99);
                    }
                }
            }

            return $respuesta;
        }

        /*
        * Games
        */
        public function createGame(){
            $db = new DB();
            $nid = "-1";

            $query = "SELECT id FROM games WHERE title = '" . $_REQUEST["title"] . "' AND description = '" . $_REQUEST["description"] . "' AND long_description = '" . $_REQUEST["long_description"] . "' AND status = '" . $_REQUEST["status"] . "'";

            $rescheck = $db->runQuery($query, array(), "Order not found ");
            $rescheck = $rescheck->fetchAll();

            if(!isset($rescheck[0]["id"])){
                $query = "INSERT INTO games ";
                $query .= "(title, description, long_description, logo, status) ";
                $query .= "VALUES('" . $_REQUEST["title"] . "','" . $_REQUEST["description"] . "','" . $_REQUEST["long_description"] . "','" . $_REQUEST["logo"] . "','" . $_REQUEST["status"] . "') ";

                $res = $db->runQuery($query, array(), "Error: cannot create game registry", $nid);

                if($res == "Error: cannot create game registry") {
                    return array("success" => false, "error" => "Error: cannot create game registry");
                }
            } else {
                return array("success" => false, "error" => "Error: game exist");
            }

            return $this->getGames();
        }

        public function updateGame(){
            $db = new DB();

            $query = "UPDATE games ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["title"])) $query .= ",title = '" . $_REQUEST["title"] . "' ";
            if(isset($_REQUEST["description"])) $query .= ",description = '" . $_REQUEST["description"] . "' ";
            if(isset($_REQUEST["long_description"])) $query .= ",long_description = '" . $_REQUEST["long_description"] . "' ";
            if(isset($_REQUEST["logo"])) $query .= ",logo = '" . $_REQUEST["logo"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = '" . $_REQUEST["status"] . "' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot update game registry");

            if($res == "Error: cannot update game registry") {
                return array("success" => false, "error" => "Error: cannot update game registry");
            }

            return $this->getGames();
        }

        public function deleteGame(){
            $db = new DB();

            $query = "UPDATE games ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = 'BORRADO' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot delete game registry");

            if($res == "Error: cannot delete game registry") {
                return array("success" => false, "error" => "Error: cannot delete game registry");
            }

            return array("success" => true, "id" => $_REQUEST["id"]);
        }

        public function infoGame(){
            $db = new DB();

            $query = "SELECT * FROM games ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive game registry");

            if($res == "Error: cannot retrive game registry") {
                return array("success" => false, "error" => "Error: cannot retrive game registry");
            }

            $games = array();

            while($row = $res->fetch()) {
                $query = "SELECT * FROM sliders WHERE game = '" . $row["id"] . "' ";
                $tmp_res_sliders = $db->runQuery($query, array(), "Error: cannot retrive slider registry");

                $galery = array();

                while($slider = $tmp_res_sliders->fetch()) {
                    array_push($galery, $slider);
                }

                $row["galery"] = $galery;
                //array_push($games, $row);
                $games = $row;
            }

            return array("success" => true, "id" => $_REQUEST["id"], "data" => $games);
        }

        public function getGames(){
            $db = new DB();

            $query = "SELECT * FROM games ";
            $query .= "ORDER BY title ASC ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive games registry");

            if($res == "Error: cannot retrive games registry") {
                return array("success" => false, "error" => "Error: cannot retrive games registry");
            }

            $games = array();

            while($row = $res->fetch(PDO::FETCH_ASSOC)) {
                $query = "SELECT * FROM sliders WHERE game = '" . $row["id"] . "' ";
                $tmp_res_sliders = $db->runQuery($query, array(), "Error: cannot retrive slider registry");

                $galery = array();

                while($slider = $tmp_res_sliders->fetch(PDO::FETCH_ASSOC)) {
                    array_push($galery, $slider);
                }

                $row["galery"] = $galery;
                array_push($games, $row);
            }

            return array("success" => true, "data" => $games);
        }

        /*
        * Sliders
        */
        public function createSlider(){
            $db = new DB();
            $nid = "-1";

            $query = "SELECT id FROM sliders WHERE title = '" . $_REQUEST["title"] . "' AND body = '" . $_REQUEST["body"] . "' AND img = '" . $_REQUEST["img"] . "' AND game = '" . $_REQUEST["game"] . "' AND status = '" . $_REQUEST["status"] . "'";

            $rescheck = $db->runQuery($query, array(), "Order not found ");
            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

            if(!isset($rescheck[0]["id"])){
                $query = "INSERT INTO sliders ";
                $query .= "(title, body, img, game, status) ";
                $query .= "VALUES('" . $_REQUEST["title"] . "','" . $_REQUEST["body"] . "','" . $_REQUEST["img"] . "','" . $_REQUEST["game"] . "','" . $_REQUEST["status"] . "') ";

                $res = $db->runQuery($query, array(), "Error: cannot create slider registry", $nid);

                if($res == "Error: cannot create slider registry") {
                    return array("success" => false, "error" => "Error: cannot create slider registry");
                }
            } else {
                return array("success" => false, "error" => "Error: slider exist");
            }

            return $this->getSliders();
        }

        public function updateSlider(){
            $db = new DB();

            $query = "UPDATE sliders ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["title"])) $query .= ",title = '" . $_REQUEST["title"] . "' ";
            if(isset($_REQUEST["body"])) $query .= ",body = '" . $_REQUEST["body"] . "' ";
            if(isset($_REQUEST["img"])) $query .= ",img = '" . $_REQUEST["img"] . "' ";
            if(isset($_REQUEST["game"])) $query .= ",game = '" . $_REQUEST["game"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = '" . $_REQUEST["status"] . "' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot update slider registry");

            if($res == "Error: cannot update slider registry") {
                return array("success" => false, "error" => "Error: cannot update slider registry");
            }

            return $this->getSliders();
        }

        public function deleteSlider(){
            $db = new DB();

            $query = "UPDATE sliders ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = 'BORRADO' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot delete slider registry");

            if($res == "Error: cannot delete slider registry") {
                return array("success" => false, "error" => "Error: cannot delete slider registry");
            }

            return getSliders();
        }

        public function infoSlider(){
            $db = new DB();

            $query = "SELECT * sliders ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive slider registry");

            if($res == "Error: cannot retrive slider registry") {
                return array("success" => false, "error" => "Error: cannot retrive slider registry");
            }

            $res = $res->fetchAll(PDO::FETCH_ASSOC);

            return array("success" => true, "id" => $_REQUEST["id"], "data" => $res[0]);
        }

        public function getSliders(){
            $db = new DB();

            $query = "SELECT * ";
            $query .= ",(SELECT title FROM games WHERE id = S.game) as game_title ";
            $query .= "FROM sliders as S ";
            $query .= "ORDER BY game, title ASC ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive sliders registry");

            if($res == "Error: cannot retrive sliders registry") {
                return array("success" => false, "error" => "Error: cannot retrive sliders registry");
            }

            $sliders = array();

            while($row = $res->fetch(PDO::FETCH_ASSOC)) {
                array_push($sliders, $row);
            }

            return array("success" => true, "data" => $sliders);
        }

        /*
        * Productos
        */
        public function createProduct(){
            $db = new DB();
            $nid = "-1";

            $query = "SELECT id FROM products WHERE item = '" . $_REQUEST["item"] . "' AND amount = '" . $_REQUEST["amount"] . "' AND cost = '" . $_REQUEST["cost"] . "' AND img = '" . $_REQUEST["img"] . "' AND game = '" . $_REQUEST["game"] . "' AND status = '" . $_REQUEST["status"] . "'";

            $rescheck = $db->runQuery($query, array(), "Order not found ");
            $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

            if(!isset($rescheck[0]["id"])){
                $query = "INSERT INTO products ";
                $query .= "(item, amount, cost, img, game, status) ";
                $query .= "VALUES('" . $_REQUEST["item"] . "','" . $_REQUEST["amount"] . "','" . $_REQUEST["cost"] . "','" . $_REQUEST["img"] . "','" . $_REQUEST["game"] . "','" . $_REQUEST["status"] . "') ";

                $res = $db->runQuery($query, array(), "Error: cannot create product registry", $nid);

                if($res == "Error: cannot create product registry") {
                    return array("success" => false, "error" => "Error: cannot create product registry");
                }
            } else {
                return array("success" => false, "error" => "Error: product exist");
            }

            return $this->getProducts();
        }

        public function updateProduct(){
            $db = new DB();

            $query = "UPDATE products ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["item"])) $query .= ",item = '" . $_REQUEST["item"] . "' ";
            if(isset($_REQUEST["amount"])) $query .= ",amount = '" . $_REQUEST["amount"] . "' ";
            if(isset($_REQUEST["cost"])) $query .= ",cost = '" . $_REQUEST["cost"] . "' ";
            if(isset($_REQUEST["img"])) $query .= ",img = '" . $_REQUEST["img"] . "' ";
            if(isset($_REQUEST["game"])) $query .= ",game = '" . $_REQUEST["game"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = '" . $_REQUEST["status"] . "' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot update product registry");

            if($res == "Error: cannot update product registry") {
                return array("success" => false, "error" => "Error: cannot update product registry");
            }

            return $this->getProducts();
        }

        public function deleteProduct(){
            $db = new DB();

            $query = "UPDATE products ";
            $query .= "SET id = '" . $_REQUEST["id"] . "' ";
            if(isset($_REQUEST["status"])) $query .= ",status = 'BORRADO' ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot delete product registry");

            if($res == "Error: cannot delete product registry") {
                return array("success" => false, "error" => "Error: cannot delete product registry");
            }

            return getProducts();
        }

        public function infoProduct(){
            $db = new DB();

            $query = "SELECT * products ";
            $query .= "WHERE id = '" . $_REQUEST["id"] . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive product registry");

            if($res == "Error: cannot retrive product registry") {
                return array("success" => false, "error" => "Error: cannot retrive product registry");
            }

            $res = $res->fetchAll(PDO::FETCH_ASSOC);

            return array("success" => true, "id" => $_REQUEST["id"], "data" => $res[0]);
        }

        public function getProducts(){
            $db = new DB();

            $query = "SELECT * ";
            $query .= ",(SELECT title FROM games WHERE id = P.game) as game_title ";
            $query .= "FROM products as P ";
            $query .= "ORDER BY game, item, amount ASC ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive products registry");

            if($res == "Error: cannot retrive products registry") {
                return array("success" => false, "error" => "Error: cannot retrive products registry");
            }

            $products = array();

            while($row = $res->fetch(PDO::FETCH_ASSOC)) {
                array_push($products, $row);
            }

            return array("success" => true, "data" => $products);
        }

        public function getProductsFromGame(){
            $db = new DB();

            $query = "SELECT * ";
            $query .= ",(SELECT title FROM games WHERE id = P.game) as game_title ";
            $query .= "FROM products as P ";
            $query .= "ORDER BY game, item, amount ASC ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive products registry");

            if($res == "Error: cannot retrive products registry") {
                return array("success" => false, "error" => "Error: cannot retrive products registry");
            }

            $products = array();

            while($row = $res->fetch(PDO::FETCH_ASSOC)) {
                array_push($products, json_encode($row));
            }

            return array("success" => true, "data" => $products);
        }

        /*
        * Server functions
        */
        public function encryptIt($q) {
		    $cryptKey  = saltkey;
		    $qEncoded  = base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), $q, MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ) );
		    return($qEncoded);
		}

		public function decryptIt($q) {
		    $cryptKey  = saltkey;
		    $qDecoded  = rtrim( mcrypt_decrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), base64_decode( $q ), MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ), "\0");
		    return($qDecoded);
		}

        private function send_email($param){
	        $from_tmp = new SendGrid\Email(null, $param["from"]);
	        $to_tmp = new SendGrid\Email(null, $param["to"]);
	        $subject_tmp = $param["subject"];
	        $content = new SendGrid\Content("text/html", $param["html"]);
	        $email = new SendGrid\Mail($from_tmp, $subject_tmp, $to_tmp, $content);

	        $apiKey = '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'; //DEV
	        $sendgrid = new SendGrid($apiKey);

	        $tmp_res = $sendgrid->client->mail()->send()->post($email);
	        return array("success" => true, "statuscode" => $tmp_res->statusCode(), "email" => $param["to"]);
        }

        private function get_client_ip_server() {
		    $ipaddress = '';
		    if (isset($_SERVER['HTTP_CLIENT_IP']))
		        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
		    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
		        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
		    else if(isset($_SERVER['HTTP_X_FORWARDED']))
		        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
		    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
		        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
		    else if(isset($_SERVER['HTTP_FORWARDED']))
		        $ipaddress = $_SERVER['HTTP_FORWARDED'];
		    else if(isset($_SERVER['REMOTE_ADDR']))
		        $ipaddress = $_SERVER['REMOTE_ADDR'];
		    else
		        $ipaddress = 'UNKNOWN';

		    return $ipaddress;
		}

        /*
        * Funciones de JWT
        */
        private function base64UrlEncode($data){
            return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
        }

        private function base64UrlDecode($data){
            $urlUnsafeData = str_replace(['-', '_'], ['+', '/'], $data);
            $paddedData = str_pad($urlUnsafeData, strlen($data) % 4, '=', STR_PAD_RIGHT);

            return base64_decode($paddedData);
        }

        public function signJWT($payload_array){
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

        public function verifyJWT($jwt){
            list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);
            $dataEncoded = $headerEncoded . "." . $payloadEncoded;
            $rawSignature = hash_hmac('sha256', $dataEncoded, $this->base64UrlDecode(SECRET_SHARE), true);
            $testSignature = $this->base64UrlEncode($rawSignature);

            return hash_equals($signatureEncoded, $testSignature);
        }

        /*
        *Google function
        */
        private function check_captcha($token_user) {
			$post_param = array(
				"secret" => "6LeF6GAUAAAAADHWOAQZ0Y_fnJAQjHqph39O0OgW",
				"response" => $token_user
			);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL,"https://www.google.com/recaptcha/api/siteverify");
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_param));

			// receive server response ...
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			$server_output = curl_exec ($ch);
			$server_output = json_decode($server_output);

			curl_close ($ch);

			// further processing ....
			if ($server_output->success === false) {
				return array("error" => "invalid gcaptcha");
			}
		}

        /*
        *Paypal functions
        */
        public function tokenPaypal(){
            $server_output_original = $this->requrl(array(
                "url" => $this->api_endpoint . "/v1/oauth2/token",
                "header" => array(
                    'Accept: application/json',
                    'Accept-Language: en_US'
                ),
                "type" => "POST",
                "fields" => "grant_type=client_credentials",
                "user" => PPclientId . ':' . PPclientSecret,
            ));

            $server_output_original = json_decode($server_output_original);
            $server_output = $server_output_original->response;

            $_SESSION["pptoken"] = $server_output->access_token;

            return $server_output;
        }

        public function createOrder(){
            $db = new DB();
            $data_array = array();
            $captcha_res = $this->check_captcha($_POST["g-recaptcha-response"]);
            $server_output = "";
            $nid = "-1";

            if(isset($captcha_res["error"])){
                return array("error" => 96);
            } else {
                $is_trusted = true;

                // // Initialize CURL:
                // $ch = curl_init('https://apilayer.net/api/check?access_key=' . MAILBOXLAYER_API . '&email=' . $_REQUEST["pp_email"] . '');
                // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                // // Store the data:
                // $json = curl_exec($ch);
                // curl_close($ch);
                // // Decode JSON response:
                // $validationResult = json_decode($json, true);

                // if(!isset($validationResult['score'])) {
                //     return array("error" => 97);
                // }

                // if($validationResult['score'] >= 0.70) {
                //     $is_trusted = true;
                // } else {
                //     return array("error" => 98);
                // }

                if($is_trusted){
                    $this->tokenPaypal();
                    // Data format
                    $data_array["intent"] = "CAPTURE";
                    $data_array["purchase_units"] = array(
                        array(
                            "amount" => array(
                                "currency_code" => "USD",
                                "value" =>  $_REQUEST["cost"]
                            ),
                            "payee" => array(
                                "email_address" => "payments@chakstudio.com"
                            ),
                            "description" => $_REQUEST["amount"] . " " . $_REQUEST["item"] . " " . $_REQUEST["appos"]
                        )
                    );
                    $data_array["payer"] = array(
                        "name" => array(
                            "given_name" => $_REQUEST["pp_name"]
                        ),
                        "email_address" => $_REQUEST["pp_email"]
                    );
                    $data_array["application_context"] = array(
                        "brand_name" => "Chak Studio",
                        "user_action" => "PAY_NOW",
                        "return_url" => "https://chakstudio.com/payment-success",
                        "cancel_url" => "https://chakstudio.com/payment-cancel"
                    );

                    // cURL call
                    $server_output_original = $this->requrl(array(
                        "url" => $this->api_endpoint . "/v2/checkout/orders",
                        "header" => array(
                            'Content-Type: application/json',
                            'Authorization: Bearer ' . $_SESSION["pptoken"]
                        ),
                        "type" => "POST",
                        "fields" => json_encode($data_array)
                    ));

                    $server_output_original = json_decode($server_output_original);
                    $server_output = $server_output_original->response;

                    // Response process
                    if($server_output->status == "CREATED") {
                        $query = "INSERT INTO orders ";
                        $query .= "(paymentid, jwt, appos) ";
                        $query .= "VALUES('" . $server_output->id . "', '" . $this->signJWT($data_array) . "', '" . $_REQUEST["appos"] . "') ";

                        $res = $db->runQuery($query, array(), "Error: cannot create order registry", $nid);

                        if($res == "Error: cannot create order registry") {
                            return array("success" => false, "error" => 99, "msg" => "Error: cannot create order registry");
                        }
                    } else {
                        return array("success" => false, "error" => 100, "server_out" => $server_output, "msg" => $server_output->message, "data" => json_encode($data_array), "token" => $_SESSION["pptoken"]);
                    }
                }
            }

            return array("success" => true, "url" => $server_output->links[1], "paymentid" => $server_output->id, "orderid" => $nid);
        }

        public function createOrderFromGame(){
            $db = new DB();
            $data_array = array();
            $server_output = "";
            $nid = "-1";
            $is_trusted = true;

            // Initialize CURL:
            // $ch = curl_init('https://apilayer.net/api/check?access_key=' . MAILBOXLAYER_API . '&email=' . $_REQUEST["pp_email"] . '');
            // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            // // Store the data:
            // $json = curl_exec($ch);
            // curl_close($ch);
            // // Decode JSON response:
            // $validationResult = json_decode($json, true);

            // if(!isset($validationResult['score'])) {
            //     return array("error" => 97, "data" => $_REQUEST);
            // }

            // if($validationResult['score'] >= 0.70) {
            //     $is_trusted = true;
            // } else {
            //     return array("error" => 98, "data" => $_REQUEST);
            // }

            if($is_trusted){
                $this->tokenPaypal();
                // Data format
                $data_array["intent"] = "CAPTURE";
                $data_array["purchase_units"] = array(
                    array(
                        "amount" => array(
                            "currency_code" => "USD",
                            "value" =>  $_REQUEST["cost"]
                        ),
                        "payee" => array(
                            "email_address" => "payments@chakstudio.com"
                        ),
                        "description" => $_REQUEST["amount"] . " " . $_REQUEST["item"] . " " . $_REQUEST["appos"]
                    )
                );
                $data_array["payer"] = array(
                    "name" => array(
                        "given_name" => $_REQUEST["pp_name"]
                    ),
                    "email_address" => $_REQUEST["pp_email"]
                );
                $data_array["application_context"] = array(
                    "brand_name" => "Chak Studio",
                    "user_action" => "PAY_NOW",
                    "return_url" => "https://chakstudio.com/payment-success",
                    "cancel_url" => "https://chakstudio.com/payment-cancel"
                );

                // cURL call
                $server_output_original = $this->requrl(array(
                    "url" => $this->api_endpoint . "/v2/checkout/orders",
                    "header" => array(
                        'Content-Type: application/json',
                        'Authorization: Bearer ' . $_SESSION["pptoken"]
                    ),
                    "type" => "POST",
                    "fields" => json_encode($data_array)
                ));

                $server_output_original = json_decode($server_output_original);
                $server_output = $server_output_original->response;

                // Response process
                if($server_output->status == "CREATED") {
                    $query = "INSERT INTO orders ";
                    $query .= "(paymentid, jwt, appos) ";
                    $query .= "VALUES('" . $server_output->id . "', '" . $this->signJWT($data_array) . "', '" . $_REQUEST["appos"] . "') ";

                    $res = $db->runQuery($query, array(), "Error: cannot create order registry", $nid);

                    if($res == "Error: cannot create order registry") {
                        return array("success" => false, "error" => 99, "msg" => "Error: cannot create order registry");
                    }
                } else {
                    return array("success" => false, "error" => 100, "server_out" => $server_output, "msg" => $server_output->message, "data" => json_encode($data_array), "token" => $_SESSION["pptoken"]);
                }
            }
            return array("success" => true, "url" => $server_output->links[1]->href, "paymentid" => $server_output->id, "orderid" => $nid);
        }

        public function cancelOrder($paymentID){
            $db = new DB();

            $query = "SELECT * FROM payments WHERE paymentid = '" . $paymentID . "' ";

            $rescheck = $db->runQuery($query, array(), "payment not found ");
            $rescheck = $rescheck->fetchAll();

            $query = "SELECT jwt FROM orders WHERE paymentid = '" . $paymentID . "' AND status = 'INPROCESS' ";

            $resorder = $db->runQuery($query, array(), "order not found ");
            $resorder = $resorder->fetchAll();

            if(isset($resorder[0]["jwt"])){
                $this->changeOrderStatus($paymentID, "CANCEL");
            } else {
                return "order is all ready CANCEL. " . $server_output->status;
            }
        }

        public function getOrders(){
            $db = new DB();

            $query = "SELECT * ";
            $query .= "FROM orders ";
            $query .= "ORDER BY appos, created ASC ";

            $res = $db->runQuery($query, array(), "Error: cannot retrive orders registry");

            if($res == "Error: cannot retrive orders registry") {
                return array("success" => false, "error" => "Error: cannot retrive orders registry");
            }

            $orders = array();

            while($row = $res->fetch(PDO::FETCH_ASSOC)) {
                array_push($orders, $row);
            }

            return array("success" => true, "data" => $orders);
        }

        public function changeOrderStatus($paymentID, $status){
            $db = new DB();

            $query = "UPDATE orders ";
            $query .= "SET paymentid = '" . $paymentID . "' ";
            $query .= ",status = '" . $status . "' ";
            $query .= "WHERE paymentid = '" . $paymentID . "' ";

            $res = $db->runQuery($query, array(), "Error: cannot update order status registry");

            if($res == "Error: cannot update order status registry") {
                return array("success" => false, "error" => "Error: cannot update order status registry");
            }

            return $this->getOrders();
        }

        public function createPayment(){
            $db = new DB();
            $nid = "-1";

            $query = "SELECT jwt FROM orders WHERE paymentid = '" . $_REQUEST["paymentid"] . "' ";

            $rescheck = $db->runQuery($query, array(), "Order not found ");
            $rescheck = $rescheck->fetchAll();

            if(isset($rescheck[0]) && isset($rescheck[0]["jwt"])){
                list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $rescheck[0]["jwt"]);
                $tmp_json = $this->base64UrlDecode($payloadEncoded);
                $tmp_item_name = explode(" ", $tmp_json->purchase_units[0]->description);
                $query = "INSERT INTO payments ";
                $query .= "(paymentid, customer_email, item_amount, item_type, payment_amount, payment_status, payerid) ";
                $query .= "VALUES('" . $_REQUEST["paymentid"] . "', '" . $tmp_json->payer->email_address . "', '" . $tmp_item_name[0] . "', '" . $tmp_item_name[1] . "', '" . $tmp_json->amount->value . "', '" . $_REQUEST["paymentstatus"] . "', '" . $_REQUEST["payerid"] . "') ";

                $res = $db->runQuery($query, array(), "Error: cannot create payment registry", $nid);

                if($res == "Error: cannot create payment registry") {
                    return array("success" => false, "error" => "Error: cannot create payment registry");
                }
            } else {
                return array("success" => false, "error" => "Error: Order not found");
            }

            return array("success" => true, "id" => $nid, "json" => $tmp_json->payer->email_address);
        }

        public function updatePayment(){
            $db = new DB();

            $query = "UPDATE payments SET status = 'APPLY' WHERE id = '" . $_REQUEST["id"] . "' ";

            $rescheck = $db->runQuery($query, array(), "Error updating payment");
            $rescheck = $rescheck->fetchAll();

            if(isset($rescheck[0]) && isset($rescheck[0]["jwt"])){
                return array("success" => true);
            } else {
                return array("success" => false, "error" => "Error: Error updating payment");
            }

            return array("success" => true);
        }

        public function getPayments(){
            $db = new DB();

            $query = "SELECT * FROM payments";

            $rescheck = $db->runQuery($query, array(), "Error: no payments");
            $payments = array();

            while($row = $rescheck->fetch(PDO::FETCH_ASSOC)) {
                array_push($payments, $row);
            }

            return array("success" => true, "data" => $payments);
        }

        public function getPaymentsClient(){
            $db = new DB();

            $query = "SELECT * FROM payments WHERE status = 'NOTAPPLY' AND customer_email = '" . $_REQUEST["email"] . "'; ";

            $rescheck = $db->runQuery($query, array(), "Error: no payments for that email");
            $payments = array();

            while($row = $rescheck->fetch(PDO::FETCH_ASSOC)) {
                array_push($payments, json_encode($row));
            }

            if(count($payments) > 0){
                return array("success" => true, "payments" => $payments, "data" => json_encode($_REQUEST));
            } else {
                return array("success" => false, "error" => "Error: no payments for that email", "data" => json_encode($_REQUEST));
            }
        }

        public function checkPayment($paymentID, $payerID){
            $db = new DB();
            $this->tokenPaypal();
            // cURL call
            $server_output_original = $this->requrl(array(
                "url" => $this->api_endpoint . "/v2/checkout/orders/" . $paymentID,
                "header" => array(
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $_SESSION["pptoken"]
                ),
                "type" => "GET"
            ));

            $server_output_original = json_decode($server_output_original);
            $server_output = $server_output_original->response;

            // Response process
            if($server_output->status == "APPROVED") {
                $nid = "-1";

                $query = "SELECT * FROM payments WHERE paymentid = '" . $paymentID . "' ";

                $rescheck = $db->runQuery($query, array(), "payment not found ");
                $rescheck = $rescheck->fetchAll();

                if(!isset($rescheck[0]["paymentid"])){
                    $query = "SELECT jwt FROM orders WHERE paymentid = '" . $paymentID . "' ";

                    $resorder = $db->runQuery($query, array(), "order not found ");
                    $resorder = $resorder->fetchAll();

                    if(isset($resorder[0]["jwt"])){
                        list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $resorder[0]["jwt"]);
                        $tmp_json = json_decode($this->base64UrlDecode($payloadEncoded));
                        $tmp_item_name = explode(" ", $tmp_json->purchase_units[0]->description);

                        $query = "INSERT INTO payments ";
                        $query .= "(paymentid, customer_email, item_amount, item_type, payment_amount, payment_status, payerid) ";
                        $query .= "VALUES('" . $paymentID . "', '" . $tmp_json->payer->email_address . "', '" . $tmp_item_name[0] . "', '" . $tmp_item_name[1] . "', '" . $tmp_json->purchase_units[0]->amount->value . "', '" . $server_output->status . "', '" . $payerID . "') ";

                        $res = $db->runQuery($query, array(), "Error: cannot create payment registry", $nid);

                        if($res == "Error: cannot create payment registry") {
                            return "Error: cannot create payment registry";
                        }

                        $param = array(
                            "to" => $tmp_json->payer->email_address,
                            "from" => 'payments@chakstudio.com',
                            "subject" => 'Thanks for your puchase:  ' . $paymentID,
                            "html" => "
                                <h2>Thanks for your puchase " . $tmp_json->payer->name->given_name . "</h2>
                                <h4>Order ID: <b>" . $paymentID . "</b></h4>
                                <table style='width:100%; padding: 10px;'>
                                    <tr>
                                        <th style='text-align:center; width: 90px;'>Item</th>
                                        <th style='text-align:center; width: 90px;'>Amount</th>
                                        <th style='text-align:center; width: 90px;'>Cost</th>
                                        <th style='text-align:center; width: 90px;'>Paypal ID</th>
                                    </tr>
                                    <tr>
                                        <td style='text-align:center; width: 90px;'>" . $tmp_item_name[1] . "</td>
                                        <td style='text-align:center; width: 90px;'>" . $tmp_item_name[0] . "</td>
                                        <td style='text-align:center; width: 90px;'>" . $tmp_json->purchase_units[0]->amount->value . "</td>
                                        <td style='text-align:center; width: 90px;'>" . $payerID . "</td>
                                    </tr>
                                </table>
                                <hr>
                                <p>
                                    <emp>Use the following link to know more about your purchase</emp>:<br>
                                    <a href='https://chakstudio.com/order?oid=" . $paymentID . "' target='_blank'>https://chakstudio.com/order?oid=" . $paymentID . "</a><br>
                                </p>
                                <br>
                            "
                        );
                        $this->send_email($param);

                        $this->changeOrderStatus($paymentID, "COMPLETED");

                        return "Payment created";
                    } else {
                        return "order not found " . $server_output->status;
                    }
                } else {
                    return "order is all ready complete. " . $server_output->status;
                }
            } else {
                return "order is not complete yet. " . $server_output->status;
            }
        }

        public function getOrderInfo($paymentID){
            $db = new DB();
            $this->tokenPaypal();

            // cURL call
            $server_output_original = $this->requrl(array(
                "url" => $this->api_endpoint . "/v2/checkout/orders/" . $paymentID,
                "header" => array(
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $_SESSION["pptoken"]
                ),
                "type" => "GET"
            ));

            $server_output_original = json_decode($server_output_original);
            $server_output = $server_output_original->response;

            return $server_output;
        }
    }

    $API = new API;
