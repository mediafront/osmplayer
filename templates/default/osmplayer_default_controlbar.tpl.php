<div id="<?php print $params['prefix']; ?>mediacontrol" class="<?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?>ui-corner-bottom">
   <div id="<?php print $params['prefix']; ?>mediacontrolleft">
      <div id="<?php print $params['prefix']; ?>mediaplaypause" class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all">
         <div class="on">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-play"></span>
         </div>
         <div class="off" style="display:none">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-pause"></span>
         </div>
      </div>
      <div id="<?php print $params['prefix']; ?>mediacurrenttime">00:00</div>
   </div>
   <div id="<?php print $params['prefix']; ?>mediacontrolright">
      <div id="<?php print $params['prefix']; ?>mediatotaltime">00:00</div>
      <div id="<?php print $params['prefix']; ?>mediamute" class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all">
         <div class="on" style="display:none">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-volume-off"></span>
         </div>
         <div class="off">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-volume-on"></span>
         </div>
      </div>
      <div id="<?php print $params['prefix']; ?>mediavolumebar">
         <div id="<?php print $params['prefix']; ?>mediavolumehandle">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-triangle-1-s"></span>
         </div>
         <div id="<?php print $params['prefix']; ?>mediavolume" class="<?php print $params['prefix']; ?>ui-state-default">
            <div id="<?php print $params['prefix']; ?>mediavolumeupdate"><div class="<?php print $params['prefix']; ?>ui-state-active"></div></div>
         </div>
      </div>
      <?php if( $params['showNodeVoter'] ) { print $voter; } ?>
   </div>
   <div id="<?php print $params['prefix']; ?>mediacontrolcenter">
      <div id="<?php print $params['prefix']; ?>mediaseekbar">
         <div id="<?php print $params['prefix']; ?>mediaseekhandle">
            <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-triangle-1-s"></span>
         </div>
         <div id="<?php print $params['prefix']; ?>mediaseek" class="<?php print $params['prefix']; ?>ui-state-default">
            <div id="<?php print $params['prefix']; ?>mediaseekupdate"><div class="<?php print $params['prefix']; ?>ui-state-active"></div></div>
            <div id="<?php print $params['prefix']; ?>mediaseekprogress"><div class="<?php print $params['prefix']; ?>ui-state-hover"></div></div>
         </div>
      </div>
   </div>
</div>