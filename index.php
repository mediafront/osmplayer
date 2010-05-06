<?php
	include("OSMPlayer.php");
	$player = new OSMPlayer(array(
		'debug' => true,
		'playlist' => 'playlist.xml'
	));
?>
<html>
   <head><title>Open Standard Media (OSM) Player: PHP Demo</title></head>
   <script type="text/javascript" src="jquery-ui/js/jquery.js"></script>
   <?php print $player->getHeader(); ?>
   <body>
		<h2>Open Standard Media (OSM) Player</h2><br/>
		<?php print $player->getPlayer(); ?>
   </body>
</html>