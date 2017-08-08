<?php
   include("../../OSMPlayer.php");
   $player = new OSMPlayer(array(
      'debug' => true,
      'prefix' => '',
      'base_path' => '../..',
      'base_url' => '../..',
      'theme' => '',
      'template' => 'simpleblack',
      'file' => 'http://localhost/drupal6/sites/default/files/ToyStory3.mp4'
   ));
?>
<html>
   <head>
      <title>Open Standard Media (OSM) Player: Template Development</title>
      <script type="text/javascript" src="../../jquery-ui/js/jquery.js"></script>
      <?php print $player->getHeader(); ?>
   </head>
   <body>
      <?php print $player->getPlayer(); ?>
   </body>
</html>