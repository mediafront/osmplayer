<div id="<?php print $params['prefix']; ?>mediatitlebar" class="<?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?>ui-corner-top <?php print $params['prefix']; ?>ui-helper-clearfix">
  <?php if (!$params['playlistOnly']) { ?>
    <div id="<?php print $params['prefix']; ?>mediatitlelinks">
      <div id="<?php print $params['prefix']; ?>mediatitlelinksinner">
        <a href="#fullscreen" id="<?php print $params['prefix']; ?>mediafullbutton" class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-extlink"></span></a>
        <?php if (!$params['disablePlaylist']) { ?>
          <a href="#maximize" id="<?php print $params['prefix']; ?>mediamaxbutton" class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-arrow-4-diag"></span></a>
        <?php } ?>
        <a href="#menu" id="<?php print $params['prefix']; ?>mediamenubutton" class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-all"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-info"></span></a>
      </div>
    </div>
  <?php } ?>
</div>