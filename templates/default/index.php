<?php
   include("../../OSMPlayer.php");
   $player = new OSMPlayer(array(
      'playlist' => 'playlist.xml',
      'debug' => true,
      'prefix' => '',
      'base_path' => '../..',
      'base_url' => '../..',
      'theme' => '',
      'template' => 'default'
   ));
?>
<html>
   <head>
      <title>Open Standard Media (OSM) Player: Template Development</title>
      <script type="text/javascript" src="../../jquery-ui/js/jquery.js"></script>
      <?php print $player->getJSHeader(); ?>
      <link rel="stylesheet" type="text/css" href="osmplayer_default.css" />
      <link rel="stylesheet" type="text/css" href="../../jquery-ui/css/dark-hive/jquery-ui-1.8rc1.custom.css" />
      <!--[if IE]><link rel="stylesheet" type="text/css" href="osmplayer_default_ie.css" /><![endif]-->
   </head>
   <body>
      <h2>Open Standard Media (OSM) Player</h2><br/>
      <?php print $player->getPlayer(); ?>
   </body>
</html>