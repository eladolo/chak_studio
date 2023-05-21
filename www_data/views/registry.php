<style type="text/css">
</style>
<div class="row">
    <form class="col s12 form_reg" method="POST" action="/?m=registry">
        <div class="row">
            <div class="input-field col s6">
                <input placeholder="Name" name="name" id="name" type="text" class="validate mandatory">
                <label for="name">Name</label>
            </div>
            <div class="input-field col s6">
                <input placeholder="email" id="email_inline" name="email" type="email" class="validate mandatory">
                <label for="email_inline" data-error="Incorrect email format" data-success="Thanks -_-">Email</label>
                <span class="helper-text"></span>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s6">
                <input placeholder="User" name="user" id="user" type="text" class="validate mandatory">
                <label for="user">User</label>
            </div>
            <div class="input-field col s6">
                <input placeholder="password" id="password" name="password" type="password" class="validate mandatory">
                <label for="password">Password</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12" style="text-align:center;">
        		<div class="g-recaptcha mandatory" data-sitekey="6LeF6GAUAAAAABITRVKYrFraRus0FDwlpHcNV15P" style="margin: 0 auto; width: 300px;"></div>
        	</div>
        </div>
        <div class="row" style="text-align:center;">
            <div class="input-field col s12">
                <button class="btn waves-effect waves-light green" type="submit" name="action">Registry
                    <i class="material-icons right">send</i>
                </button>
            </div>
        </div>
    </form>
</div>
<script type="text/javascript">
	$(document).ready(function($) {
		$('form').off('submit').on('submit', function(event) {
			if($('#name').val() === "" || $('#email').val() === "" || $('#user').val() === "" || $('#password').val() === "") {
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
