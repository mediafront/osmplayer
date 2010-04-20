<div class="<?php print $params['prefix']; ?>mediateaser <?php print $params['prefix']; ?>ui-state-default">
   <div class="<?php print $params['prefix']; ?>mediaimage <?php print $params['prefix']; ?>mediafield <?php print $params['prefix']; ?>ui-widget-content" type="image" field="thumbnail"></div>
   <?php if( $params['showTeaserVoter'] ) { print $teaservoter; } ?>
   <div class="<?php print $params['prefix']; ?>mediatitle <?php print $params['prefix']; ?>mediafield <?php print $params['prefix']; ?>ui-helper-clearfix" type="text" field="title">Sample Title</div>
</div>