<div class="<?php print $params['prefix']; ?>medianode">
   <div class="<?php print $params['prefix']; ?>mediaregion">
      <?php if( !$params['controllerOnly'] ) { ?>
	      <div class="<?php print $params['prefix']; ?>mediabusy"><img src="<?php print $params['playerurl']; ?>/templates/default/images/busy.gif" /></div>
	      <div class="<?php print $params['prefix']; ?>mediaplay"><img src="<?php print $params['playerurl']; ?>/templates/default/images/play.png" /></div>
	      <div class="<?php print $params['prefix']; ?>mediapreview"></div>
	      <div class="<?php print $params['prefix']; ?>mediadisplay"></div>
      <?php } ?>
      <?php if( $params['showController'] ) { print $controlBar; } ?>      
   </div>  
</div>