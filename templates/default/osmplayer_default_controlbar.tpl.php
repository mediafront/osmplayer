<div class="<?php print $params['prefix']; ?>mediacontrol <?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?>ui-corner-bottom">
   <div class="<?php print $params['prefix']; ?>mediacontrolleft">
      <div class="<?php print $params['prefix']; ?>mediaplaypause <?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all">
         <div class="on">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-play"></span>
         </div>
         <div class="off" style="display:none">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-pause"></span>
         </div>
      </div>
      <div class="<?php print $params['prefix']; ?>mediacurrenttime">00:00</div>
   </div>
   <div class="<?php print $params['prefix']; ?>mediacontrolright">
      <div class="<?php print $params['prefix']; ?>mediatotaltime">00:00</div>
      <div class="<?php print $params['prefix']; ?>mediamute <?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all">
         <div class="on" style="display:none">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-volume-off"></span>
         </div>
         <div class="off">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-volume-on"></span>
         </div>
      </div>
      <div class="<?php print $params['prefix']; ?>mediavolumebar">
         <div class="<?php print $params['prefix']; ?>mediavolumehandle">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-triangle-1-s"></span>
         </div>
         <div class="<?php print $params['prefix']; ?>mediavolume <?php print $params['prefix']; ?>ui-state-default">
            <div class="<?php print $params['prefix']; ?>mediavolumeupdate"><div class="<?php print $params['prefix']; ?>ui-state-active"></div></div>
         </div>
      </div>
      <?php if( $params['showNodeVoter'] ) { print $voter; } ?>
   </div>
   <div class="<?php print $params['prefix']; ?>mediacontrolcenter">
      <div class="<?php print $params['prefix']; ?>mediaseekbar">
         <div class="<?php print $params['prefix']; ?>mediaseekhandle">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-triangle-1-s"></span>
         </div>
         <div class="<?php print $params['prefix']; ?>mediaseek <?php print $params['prefix']; ?>ui-state-default">
            <div class="<?php print $params['prefix']; ?>mediaseekupdate"><div class="<?php print $params['prefix']; ?>ui-state-active"></div></div>
            <div class="<?php print $params['prefix']; ?>mediaseekprogress"><div class="<?php print $params['prefix']; ?>ui-state-hover"></div></div>
         </div>
      </div>
   </div>
</div>