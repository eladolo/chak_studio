<?php
	include_once "views/base/headers/base.php";
?>
<script src= "/js/speech-to-text.js"></script>
<script type="text/javascript">
	window.user_settings = <?php echo json_encode($tmp_config); ?>;
</script>
