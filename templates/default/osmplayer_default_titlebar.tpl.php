<div class="<?php print $params['prefix']; ?>mediatitlebar <?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?>ui-corner-top <?php print $params['prefix']; ?>ui-helper-clearfix">
   <?php if( !$params['playlistOnly'] ) { ?>  
      <div class="<?php print $params['prefix']; ?>mediatitlelinks">
	      <a href="#fullscreen" class="<?php print $params['prefix']; ?>mediafullbutton <?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-extlink"></span></a>
	      <?php if( !$params['disablePlaylist'] ) { ?>
	         <a href="#maximize" class="<?php print $params['prefix']; ?>mediamaxbutton <?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-arrow-4-diag"></span></a>
	      <?php } ?>
	      <a href="#menu" class="<?php print $params['prefix']; ?>mediamenubutton <?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-info"></span></a>
      </div>
   <?php } ?>
</div>