<?php
  $corner = $params['controllerOnly'] ? 'ui-corner-all' : 'ui-corner-bottom';
?>
<div id="<?php print $params['prefix']; ?>mediacontrol" class="<?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?><?php print $corner; ?>">
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
    <div id="<?php print $params['prefix']; ?>mediavolumebar" class="<?php print $params['prefix']; ?>ui-state-default">
      <div id="<?php print $params['prefix']; ?>mediavolumehandle">
        <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-bullet"></span>
      </div>
      <div id="<?php print $params['prefix']; ?>mediavolumeupdate" class="<?php print $params['prefix']; ?>ui-state-active"></div>
    </div>
    <?php if ($params['showNodeVoter']) { print $templates['voter']; } ?>
  </div>
  <div id="<?php print $params['prefix']; ?>mediacontrolcenter">
    <div id="<?php print $params['prefix']; ?>mediaseekbar" class="<?php print $params['prefix']; ?>ui-state-default">
      <div id="<?php print $params['prefix']; ?>mediaseekhandle">
        <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-bullet"></span>
      </div>
      <div id="<?php print $params['prefix']; ?>mediaseekupdate" class="<?php print $params['prefix']; ?>ui-state-active"></div>
      <div id="<?php print $params['prefix']; ?>mediaseekprogress" class="<?php print $params['prefix']; ?>ui-state-hover"></div>
    </div>
  </div>
</div>