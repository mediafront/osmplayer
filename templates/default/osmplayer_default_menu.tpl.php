<div id="<?php print $params['prefix']; ?>mediamenu" class="<?php print $params['prefix']; ?>ui-tabs <?php print $params['prefix']; ?>ui-widget <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-all" id="tabs">
  <div id="<?php print $params['prefix']; ?>mediamenuclose">
    <span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-circle-close"></span>
  </div>
  <ul class="<?php print $params['prefix']; ?>ui-tabs-nav <?php print $params['prefix']; ?>ui-helper-reset <?php print $params['prefix']; ?>ui-helper-clearfix <?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?>ui-corner-all">
    <li class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-top <?php print $params['prefix']; ?>ui-tabs-selected <?php print $params['prefix']; ?>ui-state-active"><a href="#<?php print $params['prefix']; ?>mediaembed">embed</a></li>
    <li class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-top"><a href="#<?php print $params['prefix']; ?>mediaelink">link</a></li>
    <li class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-top"><a href="#<?php print $params['prefix']; ?>mediainfo">info</a></li>
  </ul>
  <div id="<?php print $params['prefix']; ?>mediaembed" class="<?php print $params['prefix']; ?>menucontent <?php print $params['prefix']; ?>ui-tabs-panel <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-bottom" id="<?php print $params['prefix']; ?>mediaembed">
    <div id="<?php print $params['prefix']; ?>mediaembedForm" name="<?php print $params['prefix']; ?>mediaembedForm">
      <label for="<?php print $params['prefix']; ?>mediaembedCode">Embed</label>
      <input id="<?php print $params['prefix']; ?>mediaembedCode" name="<?php print $params['prefix']; ?>mediaembedCode" type="text" value="" readonly />
    </div>
  </div>
  <div id="<?php print $params['prefix']; ?>mediaelink" class="<?php print $params['prefix']; ?>menucontent <?php print $params['prefix']; ?>ui-tabs-panel <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-bottom" id="<?php print $params['prefix']; ?>mediaelink">
    <div id="<?php print $params['prefix']; ?>mediaelinkForm" name="<?php print $params['prefix']; ?>mediaelinkForm">
      <label for="<?php print $params['prefix']; ?>mediaelinkCode">URL</label>
      <input id="<?php print $params['prefix']; ?>mediaelinkCode" name="<?php print $params['prefix']; ?>mediaelinkCode" type="text" value="" readonly />
    </div>
  </div>
  <div id="<?php print $params['prefix']; ?>mediainfo" class="<?php print $params['prefix']; ?>menucontent <?php print $params['prefix']; ?>ui-tabs-panel <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-bottom" id="<?php print $params['prefix']; ?>mediainfo">
    <p>
      <a target="_blank" href="http://www.mediafront.org">Open Standard Media Player</a> version <?php print $params['version']; ?>
    </p>
  </div>
</div>