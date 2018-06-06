<div id="<?php print $params['prefix']; ?>medianode">
  <div id="<?php print $params['prefix']; ?>mediaregion">
    <?php if (!$params['controllerOnly']) { ?>
      <div id="<?php print $params['prefix']; ?>mediabusy"><img src="<?php print $params['playerPath']; ?>templates/default/images/busy.gif" /></div>
      <div id="<?php print $params['prefix']; ?>mediaplay"><img src="<?php print $params['playerPath']; ?>templates/default/images/play.png" /></div>
      <div id="<?php print $params['prefix']; ?>mediapreview"></div>
    <?php } ?>
    <div id="<?php print $params['prefix']; ?>mediadisplay"></div>
  </div>
</div>