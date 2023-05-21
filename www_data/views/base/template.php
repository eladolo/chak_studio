<?php
	include_once "views/base/headers/base.php";
?>
<script>
    $(document).ready(function(){
    });

    window.user = <?php echo json_encode($_SESSION["login"]); ?>;
    window.user_settings = JSON.parse(user.config);
    window.users = [];
</script>
