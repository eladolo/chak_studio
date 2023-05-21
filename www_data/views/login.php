<style type="text/css">
</style>
<div class="row">
    <form class="col s12 login_form" method="POST" action='/?m=login'>
        <div class="row">
            <div class="input-field col s4">
                <input placeholder="User" name="user" id="user" type="text" class="validate">
                <label for="user">User</label>
            </div>
            <div class="input-field col s4">
                <input placeholder="Password" id="password" name="password" type="password" class="validate">
                <label for="password">Password</label>
            </div>
            <div class="input-field col s4">
                <button class="btn waves-effect waves-light btnSend green" type="submit" name="action">Login
                    <i class="material-icons right">send</i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col s12">
        		<div class="g-recaptcha" data-sitekey="6LeF6GAUAAAAABITRVKYrFraRus0FDwlpHcNV15P" style="margin: 0 auto; width: 300px;"></div>
        	</div>
        </div>
        <div class="row">
            <div class="col s6">
                <a class="waves-effect waves-teal btn-flat right hide" href="/registry">Registry</a>
            </div>
            <div class="col s6">
                <a class="waves-effect waves-teal btn-flat left black-text" href="/recovery">Recovery</a>
            </div>
        </div>
    </form>
</div>
<script type="text/javascript">
	$(document).ready(function($) {
		$('form').off('submit').on('submit', function(event) {
			if($('#user').val() === "" || $('#password').val() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let any field empty.', 4000);
				return false;
			}

			if(grecaptcha.getResponse() === "") {
				$('.toast').remove();
				Materialize.toast('Don´t let captcha uncheck.', 4000);
				return false;
			}
			$('.form')[0].submit();
		});
	});
</script>
