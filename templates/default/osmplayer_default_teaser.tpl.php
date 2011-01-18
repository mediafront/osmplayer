<div id="<?php print $params['prefix']; ?>mediateaser" class="<?php print $params['prefix']; ?>ui-state-default">
  <div id="<?php print $params['prefix']; ?>mediaimage" class="<?php print $params['prefix']; ?>mediafield <?php print $params['prefix']; ?>ui-widget-content" type="image" field="thumbnail"></div>
  <?php if ($params['showTeaserVoter']) { print $templates['teaservoter']; } ?>
  <div id="<?php print $params['prefix']; ?>mediatitle" class="<?php print $params['prefix']; ?>mediafield <?php print $params['prefix']; ?>ui-helper-clearfix" type="text" field="title">Sample Title</div>
</div>