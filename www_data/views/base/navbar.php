<ul id="settings_user_nav" class="dropdown-content">
	<li class="divider"></li>
	<li class="left"><a href="/lobby" data-tooltip="Lobby" class="tooltipped"><img alt="sol" src="img/logo.png" style="height:24px;"></a></li>
  	<!--li><a href="/chat" data-tooltip="Chat" class="tooltipped"><i class="material-icons">chrome_reader_mode</i></a></li-->
  	<li class="divider"></li>
  	<?php if(isset($_SESSION["login"]) && $_SESSION["login"]["level"] > 98){ ?>
  		<li class="left"><a href="/dashboard" data-tooltip="Dashboard" class="tooltipped"><img alt="logo" src="img/logo2.png" style="height:24px;"></a></li>
  		<li class="left"><a href="/settings" data-tooltip="Settings" class="tooltipped"><img alt="phone" src="img/phone.png" style="height:24px;"></a></li>
		<li class="divider"></li>
		<li class="left"><a href="https://webmail.chakstudio.com" _target="_blank" data-tooltip="Email" class="tooltipped"><img alt="poncho" src="img/poncho.png" style="height:24px;"></a></li>
  		<li class="divider"></li>
  		<li class="left"><a href="/manageGames" data-tooltip="Games" class="tooltipped"><img alt="games" src="img/games.png" style="height:24px;"></a></li>
  		<li class="left"><a href="/manageSliders" data-tooltip="Sliders" class="tooltipped"><img alt="store" src="img/cupones.png" style="height:24px;"></a></li>
  		<li class="left"><a href="/manageProducts" data-tooltip="Products" class="tooltipped"><img alt="store" src="img/store.png" style="height:24px;"></a></li>
  		<li class="divider"></li>
  		<li class="left"><a href="/manageOrders" data-tooltip="Orders" class="tooltipped"><img alt="order" src="img/order.png" style="height:24px;"></a></li>
  		<li class="left"><a href="/managePayments" data-tooltip="Payments" class="tooltipped"><img alt="payment" src="img/payment.png" style="height:24px;"></a></li>
	<?php } ?>
	<li class="divider"></li>
	<li class="left"><a href="/?m=logout" data-tooltip="Logout" class="tooltipped"><img alt="calabera" src="img/calabera.png" style="height:24px;"></a></li>
</ul>
<nav>
	<div class="nav-wrapper">
		<ul id="nav-mobile-left" class="left left_nav">
			<li class="left"><a href="/" data-tooltip="Home" class="tooltipped"><img alt="pyramid" src="img/pyramid3.png" style="height:28px;"></a></li>
			<li class="left"><a href="/games" data-tooltip="Games" class="tooltipped"><img alt="games" src="img/games.png" style="height:24px;"></a></li>
			<li class="left"><a href="/store" data-tooltip="Store" class="tooltipped"><img alt="store" src="img/store.png" style="height:24px;"></a></li>
		</ul>
		<ul id="nav-mobile-right" class="right right_nav">
			<li class="left"><a href="/contact" data-tooltip="Contact" class="tooltipped"><img alt="store" src="img/contact.png" style="height:24px;"></a></li>
			<?php if(isset($_SESSION["login"])) { ?>
				<li><a class="dropdown-button" href="#!" data-activates="settings_user_nav">---<i class="material-icons right">arrow_drop_down</i></a></li>
			<?php } else { ?>
				<li class="left"><a href="/login" data-tooltip="Login" class="tooltipped"><img alt="machete" src="img/machete.png" style="height:24px;"></a></li>
			<?php } ?>
		</ul>
	</div>
</nav>