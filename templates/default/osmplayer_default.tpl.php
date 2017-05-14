<div id="<?php print $params['prefix']; ?>mediaplayerloading"><img src="<?php print $params['playerURL']; ?>/templates/default/images/busy.gif" /></div>
<div id="<?php print $params['id']; ?>" class="<?php print $params['prefix']; ?>mediaplayerdialog <?php print $params['prefix']; ?>ui-dialog <?php print $params['prefix']; ?>ui-widget <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-all" id="<?php print $params['id']; ?>" style="width:<?php print $params['width']; ?>px;height:<?php print $params['height']; ?>px;">
   <?php if( $params['showTitleBar'] && !$params['controllerOnly'] ) {  print $titlebar; } ?>
   <div id="<?php print $params['prefix']; ?>mediaplayer" class="<?php print $params['prefix']; ?>ui-helper-clearfix">
      <?php if( !$params['playlistOnly'] && !$params['controllerOnly'] ) { print $menu; } ?>
      <?php if( $params['vertical'] && !$params['disablePlaylist'] && !$params['controllerOnly'] ) { print $playlist; } ?>
      <?php if( !$params['playlistOnly'] ) { print $node; } ?>
      <?php if( !$params['vertical'] && !$params['disablePlaylist'] && !$params['controllerOnly'] ) { print $playlist; } ?>
   </div>
</div>