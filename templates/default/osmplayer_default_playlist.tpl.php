<div id="<?php print $params['prefix']; ?>mediaplaylist">
   <div id="<?php print $params['prefix']; ?>mediabusy" class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-state-disabled"><img src="<?php print $params['playerURL']; ?>/templates/default/images/busy.gif" /></div>
   <div id="<?php print $params['prefix']; ?>mediascrollwrapper">
      <?php print $links; ?>
      <div id="<?php print $params['prefix']; ?>mediascroll" class="<?php print $params['prefix']; ?>ui-helper-clearfix">
         <?php print $scrollBar; ?>
         <div id="<?php print $params['prefix']; ?>medialistmask">
            <div id="<?php print $params['prefix']; ?>medialist">
               <?php print $teaser; ?>
            </div>
         </div>
      </div>
   </div>
   <?php print $pager; ?>
</div>
      