<?php
    if(!isset($api_index_load)) {
        echo "<script>window.location.href = '/';</script>";
        exit();
    }
    class DB{
    	public $host = DB_host;
    	public $name = DB_name_3;
    	public $user = DB_user_3;
    	public $password = DB_password_3;

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

    class DBW{
        public $host = DB_host_WR;
        public $name = DB_name_3_WR;
        public $user = DB_user_3_WR;
        public $password = DB_password_3_WR;

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
                if(isset($_REQUEST["from"])){
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
                    $response = $server_output;
                } else {
                    $response = array("success" => false);
                    $db = new DB();
                    $query = "SELECT jwt FROM configs WHERE channel = '" . $_REQUEST["channel"] . "' AND status = '1'";
                    $rescheck = $db->runQuery($query, array(), "config not found ");
                    $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

                    if(isset($rescheck[0]["jwt"])){
                        $response["success"] = true;
                        $response["broadcaster:" . $_REQUEST["channel"]] = array(
                            "record" => array(
                                "content" => $rescheck[0]["jwt"]
                            )
                        );
                    }
                }
            } else {
                $response = array("error" => "not a valid jwt");
            }

            return array("response" => $response);
        }

        public function updateconfig(){
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $db = new DBW();
                $nid = "-1";

                $query = "SELECT jwt FROM configs WHERE channel = '" . $_REQUEST["channel"] . "' AND status = '1'";

                $rescheck = $db->runQuery($query, array(), "config not found ");
                $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

                if(!isset($rescheck[0]["jwt"])){
                    $query = "INSERT INTO configs ";
                    $query .= "(channel, jwt) ";
                    $query .= "VALUES('" . $_REQUEST["channel"] . "','" . $_REQUEST["jwt"] . "') ";

                    $res = $db->runQuery($query, array(), "Error: cannot create config registry", $nid);

                    if($res == "Error: cannot create config registry") {
                        return array("success" => false, "error" => "Error: cannot create config registry");
                    }
                } else {
                    $query = "UPDATE configs ";
                    $query .= "SET jwt = '" . $_REQUEST["jwt"] . "' ";
                    $query .= "WHERE channel = '" . $_REQUEST["channel"] . "' ";

                    $res = $db->runQuery($query, array(), "Error: cannot update config registry", $nid);

                    if($res == "Error: cannot update config registry") {
                        return array("success" => false, "error" => "Error: cannot update config registry");
                    }
                }
            } else {
                $response = array("error" => "not a valid jwt");
            }

            return array("response" => $response);
        }

        public function getLeaderboard(){
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $response = array("success" => false);
                $db = new DB();
                $query = "SELECT id FROM leaderboard WHERE channel = '" . $_REQUEST["channel"] . "' LIMIT 1 ";
                $rescheck = $db->runQuery($query, array(), "leaderboard info not found ");
                $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);

                if(isset($rescheck[0]["id"])){
                    $response["success"] = true;
                    $query = "SELECT username, sum(bits) as bits FROM leaderboard WHERE channel = '" . $_REQUEST["channel"] . "' GROUP BY username ORDER BY bits DESC LIMIT 10";
                    $rescheck = $db->runQuery($query, array(), "leaderboard info not found ");
                    $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);
                    $response["top10users"] = $rescheck;

                    $query = "SELECT value, count(value) as times, sum(bits) as spend FROM leaderboard WHERE channel = '" . $_REQUEST["channel"] . "' GROUP BY value ORDER BY times DESC LIMIT 10";
                    $rescheck = $db->runQuery($query, array(), "leaderboard info not found ");
                    $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);
                    $response["top10val"] = $rescheck;

                    $query = "SELECT bits, count(bits) as times FROM leaderboard WHERE channel = '" . $_REQUEST["channel"] . "' GROUP BY bits ORDER BY times DESC LIMIT 10";
                    $rescheck = $db->runQuery($query, array(), "leaderboard info not found ");
                    $rescheck = $rescheck->fetchAll(PDO::FETCH_ASSOC);
                    $response["top10bits"] = $rescheck;
                }
            } else {
                $response = array("error" => "not a valid jwt");
            }

            return array("response" => $response);
        }

        public function updateLeaderboard(){
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $db = new DBW();
                $nid = "-1";

                $query = "INSERT INTO leaderboard ";
                $query .= "(channel, username, bits, value) ";
                $query .= "VALUES('" . $_REQUEST["channel"] . "','" . $_REQUEST["username"] . "','" . $_REQUEST["bits"] . "','" . $_REQUEST["value"] . "') ";

                $res = $db->runQuery($query, array(), "Error: cannot create config registry", $nid);

                if($res == "Error: cannot create config registry") {
                    return array("success" => false, "error" => "Error: cannot create config registry");
                }
            } else {
                $response = array("error" => "not a valid jwt");
            }

            return array("response" => $response);
        }

        public function sendText(){
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $server_output = $this->requrl(array(
                    "url" => "https://api.twitch.tv/extensions/" . $_REQUEST["client"] . "/" . $_REQUEST["appv"] . "/channels/" . $_REQUEST["channel"] . "/chat",
                    "header" => array(
                        'Authorization: Bearer ' . $_REQUEST["token"],
                        'client-ID: ' . $_REQUEST["client"],
                        'content-type: application/json'
                    ),
                    "fields" => json_encode(array("text" => utf8_decode($_REQUEST["msg"]))),
                    "type" => "POST"
                ));
                $server_output = json_decode($server_output);
                $response = $server_output->response;
            } else {
                $response = array("error" => "not a valid jwt");
            }

            return array("response" => $response);
        }

        public function transmitMessage(){
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $custom_token = array(
                    "exp" => time() + (60 * 60),
                    "opaque_user_id" => $_REQUEST["user"],
                    "role" => "external",
                    "channel_id" => $_REQUEST["channel"],
                    "pubsub_perms" => array(
                        "send" => array(
                            "broadcast",
                            "whisper-*"
                        ),
                        "listen" => array(
                            "broadcast",
                            "whisper-*"
                        )
                    )
                );
                $custom_token = $this->signJWT($custom_token);
                $server_output_origin = $this->requrl(array(
                    "url" => "https://api.twitch.tv/extensions/message/" . $_REQUEST["channel"],
                    "header" => array(
                        'Authorization: Bearer ' . $custom_token,
                        'client-ID: ' . $_REQUEST["client"],
                        'content-type: application/json'
                    ),
                    "fields" => json_encode(
                        array(
                            "content_type" => "application/json",
                            "message" => json_encode(array(
                                "msg" => utf8_decode($_REQUEST["msg"]),
                                "data" => utf8_decode($_REQUEST["data"]),
                                "target" => $_REQUEST["target"],
                                "id" => "ACT" . $_REQUEST["msg"] . time()
                            )),
                            "targets" => array("broadcast")
                        )
                    ),
                    "type" => "POST"
                ));
                $server_output = json_decode($server_output_origin);
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

        /*
        * Music tools
        */
        public function chordnotes() {
            $response = '';
            $set7 = false;
            $set9 = false;
            $set11 = false;

            if($this->verifyJWT($_REQUEST["token"])){
                $_REQUEST["scale"] = urldecode($_REQUEST["scale"]);
                $note_full = $_REQUEST["scale"];
                $note = explode(" ", $note_full);
                $mode_arr = $note[1];
                $mode_arr = explode("***", $mode_arr);
                $mode = $mode_arr[0];
                $note = $note[0];
                //$note = $note == "Cb" || $note == "Fb" ? $this->enharmonic($note, true) : $note;
                $flat = false;

                $notes_sharp = array("C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B");
                $notes_flat = array("C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B");
                $minor_scales = array("Cm", "Gm", "Dm", "Fm");
                $mayor_scales = array("BM", "DM", "EM", "GM", "AM");

                $scale_order = array("C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B");

                $notes = $notes_sharp;
                if(strpos($note, "b", 1) > 0 || in_array($note . $mode, $minor_scales)){
                    $notes = $notes_flat;
                    $flat = true;
                }
                $notes = (in_array($note . $mode, $mayor_scales)) ? $notes_sharp : $notes;

                $notes_full = false;
                $rescheck = true;
                $root = false;
                $index = 0;
                $tmp_notes = array();
                while(!$notes_full){
                    $tmp_note = $notes[$index];

                    if($tmp_note == $note && !$root){
                        $root = true;
                    }

                    if($root){
                        array_push($tmp_notes, $tmp_note);

                        if(count($notes) == count($tmp_notes)) {
                            $notes_full = true;
                            break;
                        }
                    }

                    $index++;
                    if($index == (count($notes) - 1) ){
                        $index = 0;
                    }
                }

                $notes_full = false;
                $root = false;
                $index = 0;
                $tmp_order = array();
                while(!$notes_full){
                    $tmp_note = $scale_order[$index];

                    if(stripos($note, $tmp_note) !== false && !$root){
                        $root = true;
                    }

                    if($root){
                        array_push($tmp_order, $tmp_note);

                        if(count($scale_order) == count($tmp_order)) {
                            $notes_full = true;
                            break;
                        }
                    }

                    $index++;
                    if($index == (count($scale_order)) ){
                        $index = 0;
                    }
                }

                $notes = $tmp_notes;
                $mapa = array();
                $mapa[$mode] = array();

                //root chord
                array_push($mapa[$mode], 0);

                //2th
                switch ($mode_arr[0]) {
                    case 'Aug':
                        # code...
                        array_push($mapa[$mode], 3);
                        break;
                    case 'm':
                        # code...
                        array_push($mapa[$mode], 1);
                        break;
                    case 'M':
                        # code...
                        array_push($mapa[$mode], 2);
                        break;
                    default:
                        array_push($mapa[$mode], "");
                        # code...
                        break;
                }

                //4th
                switch ($mode_arr[1]) {
                    case 'Aug':
                        # code...
                        array_push($mapa[$mode], 6);
                        break;
                    case 'perfect':
                        # code...
                        array_push($mapa[$mode], 5);
                        break;
                    default:
                        # code...
                        array_push($mapa[$mode], "");
                        break;
                }

                //6th
                switch ($mode_arr[2]) {
                    case 'm':
                        # code...
                        array_push($mapa[$mode], 8);
                        break;
                    case 'M':
                        # code...
                        array_push($mapa[$mode], 9);
                        break;
                    default:
                        # code...
                        array_push($mapa[$mode], "");
                        break;
                }

                //3th
                switch ($mode_arr[3]) {
                    case 'sus2':
                        # code...
                        array_push($mapa[$mode], 2);
                        break;
                    case 'sus4':
                        # code...
                        array_push($mapa[$mode], 5);
                        break;
                    case 'm':
                        # code...
                        array_push($mapa[$mode], 3);
                        break;
                    default:
                        //M
                        array_push($mapa[$mode], 4);
                        # code...
                        break;
                }

                //5th
                switch ($mode_arr[4]) {
                    case 'Aug':
                        # code...
                        array_push($mapa[$mode], 8);
                        break;
                    case 'Dim':
                        # code...
                        array_push($mapa[$mode], 6);
                        break;
                    default:
                        //
                        array_push($mapa[$mode], 7);
                        # code...
                        break;
                }

                //7th
                switch ($mode_arr[5]) {
                    case 'maj7':
                        # code...
                        array_push($mapa[$mode], 11);
                        break;
                    case '7':
                        # code...
                        array_push($mapa[$mode], 10);
                        break;
                    default:
                        //
                        # code...
                        break;
                }

                //9th
                switch ($mode_arr[6]) {
                    case '7/9':
                        # code...
                        if($mode_arr[5] == "none") {
                            $set7 = true;
                            array_push($mapa[$mode], 10);
                        }
                        array_push($mapa[$mode], 14);
                        break;
                    case '7/b9':
                        # code...
                        if($mode_arr[5] == "none") {
                            $set7 = true;
                            array_push($mapa[$mode], 10);
                        }
                        array_push($mapa[$mode], 13);
                        break;
                    default:
                        //
                        # code...
                        break;
                }

                //11th
                switch ($mode_arr[7]) {
                    case '9/11':
                        # code...
                        if($mode_arr[5] == "none") {
                            $set7 = true;
                            array_push($mapa[$mode], 11);
                        }
                        if($mode_arr[6] == "none") {
                            $set9 = true;
                            array_push($mapa[$mode], 14);
                        }
                        array_push($mapa[$mode], 18);
                        break;
                    case '9/b11':
                        # code...
                        if($mode_arr[5] == "none") {
                            $set7 = true;
                            array_push($mapa[$mode], 10);
                        }
                        if($mode_arr[6] == "none") {
                            $set9 = true;
                            array_push($mapa[$mode], 14);
                        }
                        array_push($mapa[$mode], 17);
                        break;
                    default:
                        //
                        # code...
                        break;
                }

                //13th
                switch ($mode_arr[8]) {
                    case '11/13':
                        # code...
                        if($mode_arr[5] == "none") {
                            $set7 = true;
                            array_push($mapa[$mode], 11);
                        }
                        if($mode_arr[6] == "none") {
                            $set9 = true;
                            array_push($mapa[$mode], 14);
                        }
                        if($mode_arr[7] == "none") {
                            $set11 = true;
                            array_push($mapa[$mode], 18);
                        }
                        array_push($mapa[$mode], 21);
                        break;
                    case '11/b13':
                        # code...
                        if($mode_arr[5] == "none") {
                            $set7 = true;
                            array_push($mapa[$mode], 10);
                        }
                        if($mode_arr[6] == "none") {
                            $set9 = true;
                            array_push($mapa[$mode], 14);
                        }
                        if($mode_arr[7] == "none") {
                            $set11 = true;
                            array_push($mapa[$mode], 18);
                        }
                        array_push($mapa[$mode], 20);
                        break;
                    default:
                        //
                        # code...
                        break;
                }

                $tmp_mapa = $mapa[$mode];
                //root
                $tmp_res = $notes[$tmp_mapa[0]];
                //2th
                if($mode_arr[0] !== "none") $tmp_res .= "," . (stripos($notes[$tmp_mapa[1]], $tmp_order[1]) === false ? $this->enharmonic($notes[$tmp_mapa[1]], $tmp_order[1], $flat) : $notes[$tmp_mapa[1]]);
                //3th
                if($mode_arr[3] == "sus2"){
                    $tmp_res .= "," . (stripos($notes[$tmp_mapa[4]], $tmp_order[1]) === false ? $this->enharmonic($notes[$tmp_mapa[4]], $tmp_order[1], $flat) : $notes[$tmp_mapa[4]]);
                } elseif($mode_arr[3] == "sus4") {
                    $tmp_res .= "," . (stripos($notes[$tmp_mapa[4]], $tmp_order[3]) === false ? $this->enharmonic($notes[$tmp_mapa[4]], $tmp_order[3], $flat) : $notes[$tmp_mapa[4]]);
                } else {
                    $tmp_res .= "," . (stripos($notes[$tmp_mapa[4]], $tmp_order[2]) === false ? $this->enharmonic($notes[$tmp_mapa[4]], $tmp_order[2], $flat) : $notes[$tmp_mapa[4]]);
                }
                //4th
                if($mode_arr[1] !== "none") $tmp_res .= "," . (stripos($notes[$tmp_mapa[2]], $tmp_order[3]) === false ? $this->enharmonic($notes[$tmp_mapa[2]], $tmp_order[3], $flat) : $notes[$tmp_mapa[2]]);
                //5th
                $tmp_res .= "," . (stripos($notes[$tmp_mapa[5]], $tmp_order[4]) === false ? $this->enharmonic($notes[$tmp_mapa[5]], $tmp_order[4], $flat) : $notes[$tmp_mapa[5]]);
                //6th
                if($mode_arr[2] !== "none") $tmp_res .= "," . (stripos($notes[$tmp_mapa[3]], $tmp_order[5]) === false ? $this->enharmonic($notes[$tmp_mapa[3]], $tmp_order[5], $flat) : $notes[$tmp_mapa[3]]);
                //7th
                if($mode_arr[5] !== "none" || $set7) $tmp_res .= "," . (stripos($notes[$tmp_mapa[6]], $tmp_order[6]) === false ? $this->enharmonic($notes[$tmp_mapa[6]], $tmp_order[6], $tmp_order[6], $flat) : $notes[$tmp_mapa[6]]);
                //9th
                if($mode_arr[6] !== "none" || $set9) $tmp_res .= "," . (stripos($notes[$tmp_mapa[7]], $tmp_order[1]) === false ? $this->enharmonic($notes[$tmp_mapa[7]], $tmp_order[1], $flat) : $notes[$tmp_mapa[7]]);
                //11th
                if($mode_arr[7] !== "none" || $set11) $tmp_res .= "," . (stripos($notes[$tmp_mapa[8]], $tmp_order[3]) === false ? $this->enharmonic($notes[$tmp_mapa[8]], $tmp_order[3], $flat) : $notes[$tmp_mapa[8]]);
                //13th
                if($mode_arr[8] !== "none") $tmp_res .= "," . (stripos($notes[$tmp_mapa[9]], $tmp_order[5]) === false ? $this->enharmonic($notes[$tmp_mapa[9]], $tmp_order[5], $flat) : $notes[$tmp_mapa[9]]);

                $response = array("data" => str_replace(" ", "", $tmp_res), "success" => true);
            } else {
                $response = array("error" => "not a valid jwt", "success" => false);
            }

            return array("response" => $response);
        }

        public function scalenotes() {
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $_REQUEST["scale"] = urldecode($_REQUEST["scale"]);
                $note_full = $_REQUEST["scale"];
                $note = explode(" ", $note_full);
                $mode = $note[1];
                $note = $note[0];
                //$note = ($note == "Cb" || $note == "Fb") ? $this->enharmonic($note, true) : $note;
                //$note = ($note == "B#" || $note == "E#") ? $this->enharmonic($note, false) : $note;
                $flat = false;

                $notes_sharp = array("C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B");
                $notes_sharp = $note == "B#" ? array("B#", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "B#", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B") : $notes_sharp;
                $notes_sharp = $note == "E#" ? array("C", "C#", "D", "D#", "E", "E#", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "E#", "F#", "G", "G#", "A", "A#", "B") : $notes_sharp;
                $notes_flat = array("C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B");
                $notes_flat = $note == "Cb" ? array("C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "Cb") : $notes_flat;
                $notes_flat = $note == "Fb" ? array("C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "Fb", "F", "Gb", "G", "Ab", "A", "Bb", "B") : $notes_flat;
                $minor_scales = array("CVI", "GVI", "DVI", "FVI", "CVm", "GVm", "DVm", "FVm", "CVII", "FVII");
                $mayor_scales = array("BI", "DI", "EI", "GI", "AI", "BVM", "DVM", "EVM", "GVM", "AVM");

                $scale_order = array("C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B");

                $notes = $notes_sharp;
                if(strpos($note_full, "b", 1) > 0 || in_array($note . $mode, $minor_scales)){
                    $notes = $notes_flat;
                    $flat = true;
                }
                //$notes = (in_array($note . $mode, $minor_scales)) ? $notes_flat : $notes;
                $notes = (in_array($note . $mode, $mayor_scales)) ? $notes_sharp : $notes;

                $notes_full = false;
                $root = false;
                $index = 0;
                $tmp_notes = array();
                while(!$notes_full){
                    $tmp_note = $notes[$index];

                    if($tmp_note == $note && !$root){
                        $root = true;
                    }

                    if($root){
                        array_push($tmp_notes, $tmp_note);

                        if(count($notes) == count($tmp_notes)) {
                            $notes_full = true;
                            break;
                        }
                    }

                    $index++;
                    if($index == (count($notes) - 1) ){
                        $index = 0;
                    }
                }

                $notes_full = false;
                $root = false;
                $index = 0;
                $tmp_order = array();
                while(!$notes_full){
                    $tmp_note = $scale_order[$index];

                    if(stripos($note, $tmp_note) !== false && !$root){
                        $root = true;
                    }

                    if($root){
                        array_push($tmp_order, $tmp_note);

                        if(count($scale_order) == count($tmp_order)) {
                            $notes_full = true;
                            break;
                        }
                    }

                    $index++;
                    if($index == (count($scale_order)) ){
                        $index = 0;
                    }
                }

                /*
                    I   Ionian (the major scale): 0, 2, 2, 1, 2, 2, 2, 1
                    II  Dorian: 0, 2, 1, 2, 2, 2, 1, 2
                    III Phrygian: 0, 1, 2, 2, 2, 1, 2, 2
                    IV  Lydian: 0, 2, 2, 2, 1, 2, 2, 1
                    V   Mixolydian: 0, 2, 2, 1, 2, 2, 1, 2
                    VI  Aeolian (the minor scale): 0, 2, 1, 2, 2, 1, 2, 2
                    VII Locrian: 0, 1, 2, 2, 1, 2, 2, 2
                */
                $mapa = array(
                    "I" => array(0, 2, 4, 5, 7, 9, 11, 12),
                    "II" => array(0, 2, 3, 5, 7, 9, 10, 12),
                    "III" => array(0, 1, 3, 5, 7, 8, 10, 12),
                    "IV" => array(0, 2, 4, 6, 7, 9, 11, 12),
                    "V" => array(0, 2, 4, 5, 7, 9, 10, 12),
                    "VI" => array(0, 2, 3, 5, 7, 8, 10, 12),
                    "VII" => array(0, 1, 3, 5, 6, 8, 10, 12),
                    "NM" => array(0, 1, 3, 5, 7, 8, 11, 12),
                    "Nm" => array(0, 1, 3, 5, 7, 9, 11, 12),
                    "AM" => array(0, 1, 4, 5, 7, 8, 11, 12),
                    "Am" => array(0, 1, 3, 5, 7, 8, 11, 12),
                    "HF" => array(0, 1, 4, 5, 7, 8, 11, 12),
                    "HM" => array(0, 3, 4, 6, 7, 9, 10, 12),
                    "Hm" => array(0, 2, 3, 6, 7, 8, 11, 12),
                    "VM" => array(0, 2, 4, 7, 9, 12),
                    "Vm" => array(0, 3, 5, 7, 10, 12),
                    "insen" => array(0, 1, 5, 7, 10, 12),
                    "kumoi" => array(0, 1, 5, 7, 8, 12),
                    "hirojoshi" => array(0, 2, 3, 7, 8, 12)

                );
                $tmp_mapa = $mapa[$mode];
                if($mode == "VM" || $mode == "Vm" || $mode == "insen" || $mode == "kumoi" || $mode == "hirojoshi"){
                    $penta_order = array();
                    for ($i = 0; $i < count($tmp_order); $i++) {
                        if($mode == "VM"){
                            if($i == 3 || $i == 6) continue;
                            array_push($penta_order, $tmp_order[$i]);
                        }
                        if($mode == "Vm"){
                            if($i == 1 || $i == 5) continue;
                            array_push($penta_order, $tmp_order[$i]);
                        }
                        if($mode == "insen"){
                            if($i == 2 || $i == 5) continue;
                            array_push($penta_order, $tmp_order[$i]);
                        }
                        if($mode == "kumoi"){
                            if($i == 2 || $i == 6) continue;
                            array_push($penta_order, $tmp_order[$i]);
                        }
                        if($mode == "hirojoshi"){
                            if($i == 3 || $i == 6) continue;
                            array_push($penta_order, $tmp_order[$i]);
                        }
                    }

                    array_push($penta_order, $tmp_order[0]);

                    $tmp_order = $penta_order;
                }
                $notes = $tmp_notes;

                //building scale notes
                $tmp_res = $notes[$tmp_mapa[0]];
                $tmp_res .= "," . (strpos($notes[$tmp_mapa[1]], $tmp_order[1]) === false ? $this->enharmonic($notes[$tmp_mapa[1]], $tmp_order[1], $flat) : $notes[$tmp_mapa[1]]);
                $tmp_res .= "," . (strpos($notes[$tmp_mapa[2]], $tmp_order[2]) === false ? $this->enharmonic($notes[$tmp_mapa[2]], $tmp_order[2], $flat) : $notes[$tmp_mapa[2]]);
                $tmp_res .= "," . (strpos($notes[$tmp_mapa[3]], $tmp_order[3]) === false ? $this->enharmonic($notes[$tmp_mapa[3]], $tmp_order[3], $flat) : $notes[$tmp_mapa[3]]);
                $tmp_res .= "," . (strpos($notes[$tmp_mapa[4]], $tmp_order[4]) === false ? $this->enharmonic($notes[$tmp_mapa[4]], $tmp_order[4], $flat) : $notes[$tmp_mapa[4]]);
                $tmp_res .= "," . (strpos($notes[$tmp_mapa[5]], $tmp_order[5]) === false ? $this->enharmonic($notes[$tmp_mapa[5]], $tmp_order[5], $flat) : $notes[$tmp_mapa[5]]);
                if($mode != "VM" && $mode != "Vm" && $mode != "insen" && $mode != "kumoi" && $mode != "hirojoshi"){
                    $tmp_res .= "," . (strpos($notes[$tmp_mapa[6]], $tmp_order[6]) === false ? $this->enharmonic($notes[$tmp_mapa[6]], $tmp_order[6], $flat) : $notes[$tmp_mapa[6]]);
                    $tmp_res .= "," . (strpos($notes[$tmp_mapa[7]], $tmp_order[7]) === false ? $this->enharmonic($notes[$tmp_mapa[7]], $tmp_order[7], $flat) : $notes[$tmp_mapa[7]]);
                }

                $response = array("data" => str_replace(" ", "", $tmp_res), "success" => true);
            } else {
                $response = array("error" => "not a valid jwt", "success" => false);
            }

            return array("response" => $response);
        }

        public function enharmonics() {
            $response = '';

            if($this->verifyJWT($_REQUEST["token"])){
                $_REQUEST["arg1"] = urldecode($_REQUEST["arg1"]);
                $note = strtoupper($_REQUEST["arg1"]);
                $notes_enarmonico = array(
                    'Ab' => 'G#',
                    'Bb' => 'A#',
                    'Cb' => 'B',
                    'Db' => 'C#',
                    'Eb' => 'D#',
                    'Fb' => 'E',
                    'Gb' => 'F#',
                    'Abb' => 'G',
                    'Bbb' => 'A',
                    'Cbb' => 'Bb',
                    'Dbb' => 'C',
                    'Ebb' => 'D',
                    'Fbb' => 'D#',
                    'Gbb' => 'F',
                    'A#' => 'Bb',
                    'B#' => 'C',
                    'C#' => 'Db',
                    'D#' => 'Eb',
                    'E#' => 'F',
                    'F#' => 'Gb',
                    'G#' => 'Ab',
                    'A##' => 'B',
                    'B##' => 'C#',
                    'C##' => 'D',
                    'D##' => 'E',
                    'E##' => 'F#',
                    'F##' => 'G',
                    'G##' => 'A',
                    // inverse
                    'G#' => 'Ab',
                    'A#' => 'Bb',
                    'B' => 'Cb',
                    'C#' => 'Db',
                    'D#' => 'Eb',
                    'E' => 'Fb',
                    'F#' => 'Gb',
                    'G' => 'Abb',
                    'A' => 'Bbb',
                    'Bb' => 'Cbb',
                    'C' => 'Dbb',
                    'D' => 'Ebb',
                    'D#' => 'Fbb',
                    'F' => 'Gbb',
                    'Bb' => 'A#',
                    'C' => 'B#',
                    'Db' => 'C#',
                    'Eb' => 'D#',
                    'F' => 'E#',
                    'Gb' => 'F#',
                    'Ab' => 'G#',
                    'B' => 'A##',
                    'C#' => 'B##',
                    'D' => 'C##',
                    'E' => 'D##',
                    'F#' => 'E##',
                    'G' => 'F##',
                    'A' => 'G##'
                );

                $response = array("data" => str_replace(" ", "", $notes_enarmonico[$note]), "success" => true);
            } else {
                $response = array("error" => "not a valid jwt", "success" => false);
            }
            return array("response" => $response);
        }

        private function enharmonic($test_notes, $original_note, $alt, $recursive = null) {
            $res = $test_notes;
            if($alt){
                $notes_enarmonico = array(
                    'Cb' => 'B',
                    'Fb' => 'E',
                    'A#' => 'Bb',
                    'C#' => 'Db',
                    'D#' => 'Eb',
                    'E' => 'Fb',
                    'F#' => 'Gb',
                    'G#' => 'Ab',
                    'G' => 'Abb',
                    'A' => 'Bbb',
                    'B' => 'Cb',
                    'Bb' => 'Cbb',
                    'C' => 'Dbb',
                    'D' => 'Ebb',
                    'Eb' => 'Fbb',
                    'F' => 'Gbb'
                );
            } else {
                $notes_enarmonico = array(
                    'E#' => 'F',
                    'B#' => 'C',
                    'Bb' => 'A#',
                    'C' => 'B#',
                    'Db' => 'C#',
                    'Eb' => 'D#',
                    'F' => 'E#',
                    'Gb' => 'F#',
                    'Ab' => 'G#',
                    'B' => 'A##',
                    'C#' => 'B##',
                    'D' => 'C##',
                    'E' => 'D##',
                    'F#' => 'E##',
                    'G' => 'F##',
                    'A' => 'G##'
                );
            }

            if(isset($notes_enarmonico[$test_notes])){
                $res = $notes_enarmonico[$test_notes];
            }

            if(stripos($res, $original_note) === false && !isset($recursive)){
                $tmp_alt = $alt ? false : true;
                $res = $this->enharmonic($test_notes, $original_note, $tmp_alt, true);
            }

            return $res;
        }

        /*
        * JWT
        */
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
            $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->base64UrlDecode(SECRET_SHARE_3), true);
            // Encode Signature to Base64Url String
            $base64UrlSignature = $this->base64UrlEncode($signature);
            // Create JWT
            $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

            return $jwt;
        }

        private function verifyJWT($jwt){
            list($headerEncoded, $payloadEncoded, $signatureEncoded) = explode('.', $jwt);
            $dataEncoded = $headerEncoded . "." . $payloadEncoded;
            $rawSignature = hash_hmac('sha256', $dataEncoded, $this->base64UrlDecode(SECRET_SHARE_3), true);
            $testSignature = $this->base64UrlEncode($rawSignature);

            return hash_equals($signatureEncoded, $testSignature);
        }
    }

    $API = new API;
