<?php
	include_once "views/base/headers/base.php";

	require_once($_SERVER["DOCUMENT_ROOT"] . '../lib/twitter/autoload.php');
	use Abraham\TwitterOAuth\TwitterOAuth;

	if($_SESSION["login"]["level"] <= 98) {
        echo "<script> window.location.href = '/login'; </script>";
         exit();
    }

	/*
	*Defuse
	*/
	include_once($_SERVER["DOCUMENT_ROOT"] . "../lib/defuse-crypto.phar");
	use Defuse\Crypto\Crypto;
	$encrypt = Crypto::encryptWithPassword("id=" . $_SESSION["login"]["id"] . "&time=" . time(), saltkey);

	$_REQUEST["type"] = 'all';
	$_REQUEST["action"] = 'status';
?>
<link rel="stylesheet" type="text/css" media="screen" href="css/color-picker.css" />
<style type="text/css">
	.logos_settings{
		height: 32px !important;
		border-radius: 5px;
		box-shadow: 5px 0 5px 0 #000;
	}
	.on{
        box-shadow:
            inset 0 0 50px #fff,
            inset 20px 0 80px rgba(153, 204, 0, 0.1),
            inset -20px 0 80px rgba(153, 204, 0, 19),
            inset 20px 0 300px rgba(153, 204, 0, 0.1),
            inset -20px 0 300px rgba(153, 204, 0, 19),
            0 0 50px #fff,
            -10px 0 80px rgba(153, 204, 0, 0.1),
            10px 0 80px rgba(153, 204, 0, 19);
    }
    #ui, #apikeys, #profile{
    	display: none;
    }
    main {
	    position: absolute;
	    left: 0;
		width: 100%;
    }
</style>
<div class="row ">
	<div class="col s12">
		<ul class="tabs tabs-fixed-width settings">
			<li class="tab"><a href="#ui" class="tooltipped truncate" style="color:black !important;" data-tooltip="UI">ui</a></li>
			<li class="tab"><a href="#apikeys" class="tooltipped truncate" style="color:black !important;" data-tooltip="Apikey">apikey</a></li>
			<li class="tab"><a href="#profile" class="tooltipped truncate" style="color:black !important;" data-tooltip="Profile">profile</a></li>
		</ul>
	</div>
	<div id="ui" class="col s12">
		<div class="col s12" style="text-align:left;">
				<h4 class="">UI</h4>
			</div>
		<div class="input-field col s12">
			<input id="color_settings" name="color_settings" type="text" class="setting" placeholder="#000000" value="<?php echo $tmp_config->color_settings; ?>">
			<label for="color_settings">Background color</label>
		</div>
		<hr>
		<div class="col s12">
			<label for="font_settings" class="">Font</label><br>
			<select id="font_settings" name="font_settings" class="setting browser-default background_color">
		      	<option value="" disabled selected>---</option>
		      	<option value="DefaultFont" style="font-family:'DefaultFont' !important; ">DefaultFont :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Open Sans" style="font-family:'Open Sans' !important; ">Open Sans :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Abril Fatface" style="font-family:'Abril Fatface' !important; ">Abril Fatface :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Josefin Slab" style="font-family:'Josefin Slab' !important; ">Josefin Slab :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Sedgwick Ave" style="font-family:'Sedgwick Ave' !important; ">Sedgwick Ave :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Sedgwick Ave Display" style="font-family:'Sedgwick Ave Display' !important; ">Sedgwick Ave Display :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Acme" style="font-family:'Acme' !important; ">Acme :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Anton" style="font-family:'Anton' !important; ">Anton :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Arvo" style="font-family:'Arvo' !important; ">Arvo :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Dancing Script" style="font-family:'Dancing Script' !important; ">Dancing Script :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Lato" style="font-family:'Lato' !important; ">Lato :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Lora" style="font-family:'Lora' !important; ">Lora :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Merriweather" style="font-family:'Merriweather' !important; ">Merriweather :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Pacifico" style="font-family:'Pacifico' !important; ">Pacifico :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Questrial" style="font-family:'Questrial' !important; ">Questrial :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Saira Extra Condensed" style="font-family:'Saira Extra Condensed' !important; ">Saira Extra Condensed :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Shadows Into Light" style="font-family:'Shadows Into Light' !important; ">Shadows Into Light :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		      	<option value="Skranji" style="font-family:'Skranji' !important; ">Skranji :     Lorem ipsum dolor sit amet, consectetur adipiscing elit.</option>
		    </select>
			<br>
		</div>
		<div class="input-field col s12">
			<input id="color_font_settings" name="color_font_settings" type="text" class="setting" placeholder="#000000" value="<?php echo $tmp_config->color_font_settings; ?>">
			<label for="color_font_settings">Font color</label>
		</div>
		<div class="input-field col s12">
			<input id="color_shadow_settings" name="color_shadow_settings" type="text" class="setting" placeholder="#000000" value="<?php echo $tmp_config->color_shadow_settings; ?>">
			<label for="color_shadow_settings">Font color shadow</label>
		</div>
		<div class="input-field col s12">
			<input id="color_input_settings" name="color_input_settings" type="text" class="setting" placeholder="#000000" value="<?php echo $tmp_config->color_input_settings; ?>">
			<label for="color_input_settings">Input label color</label>
		</div>
	</div>
	<!--div id="accounts" class="col s12">
		<div class="row">
			<div class="col s12" style="text-align:left;">
				<h4 class="">Accounts</h4>
			</div>
			<?php
				$class = '';
				$user = new stdClass();
				$user->screen_name = '';
				if(isset($_SESSION["login"]["twitter_token"]) && !empty($_SESSION["login"]["twitter_token"])){
					$class = 'on';
					$twitterObj = new TwitterOAuth(
					   	clientIdTwitter,
					    clientSecretTwitter,
					    $_SESSION['login']['twitter_token'],
					    $_SESSION['login']['twitter_refresh_token']
					);
					$user = $twitterObj->get('account/verify_credentials', ['tweet_mode' => 'extended', 'include_entities' => 'true']);
				}
			?>
			<div class="col s3" style="text-align:left;">
				<h5 class="">Twitter
					<a href="/twitter">
						<img src="img/twitter.png" class="responsive-img logos_settings <?php echo $class; ?>">
					</a>
				</h5>
				<h6 class=""><?php echo htmlspecialchars($user->screen_name); ?></h6><br>
				<div class="input-field">
					<input id="twitter_token" type="text" value="<?php echo $_SESSION['login']['twitter_token']; ?>" disabled>
					<label for="twitter_token">Access Token</label>
				</div>
				<div class="input-field">
					<input id="twitter_refresh_token" type="text" value="<?php echo $_SESSION['login']['twitter_refresh_token']; ?>" disabled>
					<label for="twitter_refresh_token">Refresh Token</label>
				</div>
			</div>
		</div>
	</div-->
	<div id="apikeys" class="col s12">
		<h4 class="">APIkey</h4>
		<div class="row">
			<div class="col s9">
				<div class="input-field">
					<input id="apikey" type="text" value="<?php echo $_SESSION['login']['apikey']; ?>" disabled class="font_color">
					<label for="apikey">API key</label>
				</div>
			</div>
			<div class="col s3">
				<a class="btn btn_apikey">New Apikey</a>
			</div>
		</div>
	</div>
	<div id="profile" class="col s12">
		<h4 class="">Profile</h4>
		<div class="row">
			<div class="col s6 input-field">
				<input id="user_name" type="text" value="<?php echo $_SESSION['login']['name']; ?>" class="font_color">
				<label for="user_name">Name</label>
			</div>
			<div class="col s6 input-field">
				<input id="user_user" type="text" value="<?php echo $_SESSION['login']['user']; ?>" class="font_color">
				<label for="user_user">User</label>
			</div>
			<div class="col s12 input-field">
				<input id="user_email" type="text" value="<?php echo $_SESSION['login']['email']; ?>" class="font_color">
				<label for="user_email">Email</label>
			</div>
			<div class="col s12 input-field">
				<input id="user_password" type="password" value="">
				<label for="user_password">Pasword</label>
			</div>
			<?php if($_SESSION['login']['level'] > 98){ ?>
				<div class="col s6 range-field">
			      	<input type="range" id="user_level" min="0" max="99" step="1" value="<?php echo $_SESSION['login']['level']; ?>"/>
			      	<label for="user_level">Level</label>
				</div>
				<div class="col s6" style="text-align:left;">
					<div class="left">
						<input id="user_status" type="checkbox" <?php echo ($_SESSION['login']['status'] == "1" ? 'checked' : ''); ?>>
						<label for="user_status">Status</label>
					</div>
				</div>
			<?php } ?>
			<div class="col s12 input-field">
				<a href="#!" class="btnUpdateProfile btn" style="width:100%;">set changes</a>
			</div>
		</div>
	</div>
	<div class="col s12">
		<br><br>
		<hr>
		<br>
	</div>
	<div class="col s12">
		<a class="btn-large green waves-effect btn_save" style="width:100%;">Save</a>
	</div>
</div>
<script type="text/javascript" src="vendor/color-picker.js"></script>
<script type="text/javascript">
	var user = <?php echo json_encode($_SESSION["login"]); ?>;
	var user_settings = JSON.parse(user.config);

    var picker = new CP(document.querySelector('input[id="color_settings"]'));
    picker.on("change", function(color) {
        this.target.value = '#' + color;
    });

    var picker2 = new CP(document.querySelector('input[id="color_font_settings"]'));
    picker2.on("change", function(color) {
        this.target.value = '#' + color;
    });

    var picker3 = new CP(document.querySelector('input[id="color_shadow_settings"]'));
    picker3.on("change", function(color) {
        this.target.value = '#' + color;
    });

    var picker4 = new CP(document.querySelector('input[id="color_input_settings"]'));
    picker4.on("change", function(color) {
        this.target.value = '#' + color;
    });

	$(document).ready(function(){
		$('select#chat_font').val('<?php echo $tmp_config->chat_font; ?>');
		$('select#font_settings').val('<?php echo $tmp_config->font_settings; ?>');
		$('select').material_select();
		$('.btn_save').off('click').on('click', function(){
			var tmp_json = {};
			$('input.setting').each(function(index, el) {
				var tmp_who = $(this);
				tmp_json[tmp_who.attr('id')] = (tmp_who.attr('type') == "checkbox") ? Number(tmp_who.prop('checked')) : tmp_who.val();
			});
			$('select.setting').each(function(index, el) {
				var tmp_who = $(this);
				tmp_json[tmp_who.attr('id')] = (tmp_who.attr('type') == "checkbox") ? Number(tmp_who.prop('checked')) : tmp_who.val();
			});
			tmp_json = JSON.stringify(tmp_json);
			$(this).hide('1200');

			$.ajax({
				url: '/?m=set_settings',
				type: 'POST',
				dataType: 'json',
				data: {
					config: tmp_json,
					id: user.sid
				},
				success: function(html){
					$('.toast').remove();
					Materialize.toast('Settings updated.', 4000);
					$('.btn_save').show('1200');
				}
			});
		});
		$('.tab a').on('click', function(){
			var tmp_val = $(this).attr('href');

			if(tmp_val == "#apikeys" || tmp_val == "#profile"){
				$('.btn_save').parent().hide();
			} else {
				$('.btn_save').parent().show();
			}
		});
		$('.btn_apikey').off('click').on('click', function(){
			$.ajax({
				url: '/?m=set_apikey',
				type: 'POST',
				dataType: 'json',
				success: function(html){
					$('.toast').remove();
					Materialize.toast('New APIkey set. This <b>eliminated</b> previous one. Update your code with this one to avoid outrage.', 6000);
					$('#apikey').html(html.apikey);
					window.user = html;
				}
			});
		});
		$('.btnUpdateProfile').off('click').on('click', function(){
			$.ajax({
				url: '/?m=update_profile',
				type: 'POST',
				dataType: 'json',
				data: {
					id: user.id,
					name: $('#user_name').val(),
					user: $('#user_user').val(),
					email: $('#user_email').val(),
					password: $('#user_password').val(),
					level: $('#user_level').val(),
					status: Number($('#user_status').prop("checked")),
				},
				success: function(html){
					$('.toast').remove();
					if(typeof html == "string") {
						Materialize.toast(html, 6000);
					} else {
						Materialize.toast('Profile updated.', 6000);
						window.user = html;
					}
				}
			});
		});

		$('ul.tabs').tabs('select_tab', 'ui');
	});

	//iframe logic
	if(window.self !== window.top){
		$('header').hide();
		$('footer').remove();
	}
</script>
<?php
    if($tmp_config->obs_host !== "") include_once "base/modals/obs.php";
?>
