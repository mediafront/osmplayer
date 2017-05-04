<?php
   include("OSMPlayer.php");
   $player = new OSMPlayer(array(
      'playlist' => 'playlist.xml'
   ));
?>
<html>
   <head>
      <title>Open Standard Media (OSM) Player: PHP Demo</title>
      <script type="text/javascript" src="jquery-ui/js/jquery.js"></script>
      <?php print $player->getHeader(); ?>
   </head>
   <body>
      <h2>Open Standard Media (OSM) Player</h2><br/>
      <?php print $player->getPlayer(); ?>
   </body>
</html>