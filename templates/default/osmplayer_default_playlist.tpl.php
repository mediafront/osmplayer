<div class="<?php print $params['prefix']; ?>mediaplaylist">
   <div class="<?php print $params['prefix']; ?>mediabusy <?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-state-disabled"><img src="<?php print $params['playerurl']; ?>/templates/default/images/busy.gif" /></div> 
   <div class="<?php print $params['prefix']; ?>mediascrollwrapper">
      <?php print $links; ?>
      <div class="<?php print $params['prefix']; ?>mediascroll <?php print $params['prefix']; ?>ui-helper-clearfix">
         <?php print $scrollBar; ?>
         <div class="<?php print $params['prefix']; ?>medialistmask">
            <div class="<?php print $params['prefix']; ?>medialist">
               <?php print $teaser; ?>
            </div>
         </div>
      </div>
   </div>
   <?php print $pager; ?>
</div>
      