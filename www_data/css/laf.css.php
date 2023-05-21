<?php
	if(isset($_SESSION["login"])) {
		$tmp_config = json_decode($_SESSION["login"]["config"]);
	}

	$css_buffer = '';
    $tmp_color = isset($tmp_config->color_settings) ? $tmp_config->color_settings : '#000000';//#000000
    $tmp_font = isset($tmp_config->font_settings) ? $tmp_config->font_settings : 'Shadows Into Light';//Shadows Into Light
    $tmp_font_chat = isset($tmp_config->chat_font) ? $tmp_config->chat_font : 'Shadows Into Light';//Shadows Into Light
    $tmp_font_chat_color = isset($tmp_config->chat_font_size) ? $tmp_config->chat_font_size : '11px';//11px
    $tmp_color_font = isset($tmp_config->color_font_settings) ? $tmp_config->color_font_settings : '#FFFFFF';//#FFFFFF
    $tmp_color_shadow = isset($tmp_config->color_shadow_settings) ? $tmp_config->color_shadow_settings : '#FFFFFF';//#FFFFFF
    $tmp_input_color = isset($tmp_config->color_input_settings) ? $tmp_config->color_input_settings : '#00000';//#00000
    $tmp_chat_color = isset($tmp_config->color_shadow_settings) ? $tmp_config->color_shadow_settings : '#00000';//#00000

    $css_buffer .= "<style type='text/css'>";
    $css_buffer .= "body{";
    $css_buffer .= "    font-family:'" . $tmp_font . "' !important;";
    $css_buffer .= "    background-color: " . $tmp_color . " !important;";
    $css_buffer .= "    color: " . $tmp_color_font . " !important;";
    //$css_buffer .= "    text-shadow: 1px 2px " . $tmp_color_shadow . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= "navbar a, .tabs .tab a, label{";
    $css_buffer .= "    font-family:'" . $tmp_font . "' !important;";
    $css_buffer .= "    color: " . $tmp_color_font . " !important;";
    //$css_buffer .= "    text-shadow: 2px 2px " . $tmp_color_shadow . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= ".background_color{";
    $css_buffer .= "    color: " . $tmp_color . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= ".font_color{";
    $css_buffer .= "    color: " . $tmp_color_font . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= ".console,.text_chat{";
    $css_buffer .= "    font-family:'" . $tmp_font_chat . "' !important;";
    $css_buffer .= "    font-size: " . $tmp_font_chat_color . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= ".text_color_theme,";
    $css_buffer .= ".picker__close,";
    $css_buffer .= ".picker__today,";
    $css_buffer .= ".picker__day,";
    $css_buffer .= ".input-field input[type=text]:focus + label,";
    $css_buffer .= ".input-field input[type=password]:focus + label,";
    $css_buffer .= ".input-field input[type=email]:focus + label,";
    $css_buffer .= ".input-field input[type=number]:focus + label,";
    $css_buffer .= ".input-field input[type=time]:focus + label,";
    $css_buffer .= ".input-field input[type=date]:focus + label,";
    $css_buffer .= ".input-field textarea.materialize-textarea:focus:not([readonly]):focus + label,";
    $css_buffer .= ".dropdown-content li>a, .dropdown-content li>span{";
    $css_buffer .= "    color: " . $tmp_input_color . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= "nav,";
    $css_buffer .= "footer,";
    $css_buffer .= ".picker__date-display,";
    $css_buffer .= ".picker__weekday-display,";
    $css_buffer .= ".picker__day--selected,";
    $css_buffer .= ".picker__day--selected:hover,";
    $css_buffer .= ".picker--focused .picker__day--selected,";
    $css_buffer .= ".pagination li.active,";
    $css_buffer .= ".theme_color,";
    $css_buffer .= ".tabs .indicator{";
    $css_buffer .= "    background-color: " . $tmp_color . " !important;";
    $css_buffer .= "} ";

    $css_buffer .= ".input-field input[type=text]:focus,";
    $css_buffer .= ".input-field input[type=password]:focus,";
    $css_buffer .= ".input-field input[type=email]:focus,";
    $css_buffer .= ".input-field input[type=number]:focus,";
    $css_buffer .= ".input-field input[type=date]:focus,";
    $css_buffer .= ".input-field input[type=time]:focus,";
    $css_buffer .= ".tabs .tab a:hover, .tabs .tab a.active,";
    $css_buffer .= ".input-field textarea.materialize-textarea:focus:not([readonly]){";
    $css_buffer .= "    border-bottom: 1px solid " . $tmp_color . " ;";
    $css_buffer .= "    box-shadow: 0 1px 0 0 " . $tmp_color_shadow . " ;";
    $css_buffer .= "} ";

	$css_buffer .= "main{";
	//$css_buffer .= "    background-color: " . $tmp_color . ";";
	$css_buffer .= "    padding: 10px;";
	$css_buffer .= "    border-radius: 8px;";
	$css_buffer .= "}";

	$css_buffer .= " table{";
	//$css_buffer .= "    text-shadow: 1px 1px " . $tmp_color_shadow . ";";
	$css_buffer .= "}";

    $css_buffer .= ".on,.video_on,.video_on img{";
    $css_buffer .= "        box-shadow:";
    $css_buffer .= "            inset 0 0 50px " . $tmp_chat_color . ",";
    $css_buffer .= "            inset 20px 0 80px " . $tmp_color_shadow . ",";
    $css_buffer .= "            inset -20px 0 80px " . $tmp_chat_color . ",";
    $css_buffer .= "            inset 20px 0 300px " . $tmp_color_shadow . ",";
    $css_buffer .= "            inset -20px 0 300px " . $tmp_chat_color . ",";
    $css_buffer .= "            0 0 50px " . $tmp_chat_color . ",";
    $css_buffer .= "            -10px 0 80px " . $tmp_color_shadow . ",";
    $css_buffer .= "            10px 0 80px " . $tmp_chat_color . ";";
    $css_buffer .= "    }";

    $css_buffer .= "</style>";

    echo $css_buffer;
?>
