<?php
  $scrollup = $params['vertical'] ? 'ui-icon-triangle-1-n' : 'ui-icon-triangle-1-w';
  $scrolldown = $params['vertical'] ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-1-e';
?>
<div id="<?php print $params['prefix']; ?>mediascrollbarwrapper">
  <div id="<?php print $params['prefix']; ?>mediascrollup" class="<?php print $params['prefix']; ?>ui-state-default"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?><?php print $scrollup; ?>"></span></div>
  <div id="<?php print $params['prefix']; ?>mediascrollbar">
    <div id="<?php print $params['prefix']; ?>mediascrolltrack" class="<?php print $params['prefix']; ?>ui-widget-content">
      <div id="<?php print $params['prefix']; ?>mediascrollhandle" class="<?php print $params['prefix']; ?>ui-state-default"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-grip-dotted-horizontal"></span></div>
    </div>
  </div>
  <div id="<?php print $params['prefix']; ?>mediascrolldown" class="<?php print $params['prefix']; ?>ui-state-default"><span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?><?php print $scrolldown; ?>"></span></div>
</div>   