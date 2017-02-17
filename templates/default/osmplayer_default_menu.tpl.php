<div class="<?php print $params['prefix']; ?>mediamenu <?php print $params['prefix']; ?>ui-tabs <?php print $params['prefix']; ?>ui-widget <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-all" id="tabs">
	<div class="<?php print $params['prefix']; ?>mediamenuclose">
		<span class="<?php print $params['prefix']; ?>ui-icon <?php print $params['prefix']; ?>ui-icon-circle-close"></span>
	</div>
   <ul class="<?php print $params['prefix']; ?>ui-tabs-nav <?php print $params['prefix']; ?>ui-helper-reset <?php print $params['prefix']; ?>ui-helper-clearfix <?php print $params['prefix']; ?>ui-widget-header <?php print $params['prefix']; ?>ui-corner-all">
      <li class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-top <?php print $params['prefix']; ?>ui-tabs-selected <?php print $params['prefix']; ?>ui-state-active"><a href="#<?php print $params['prefix']; ?>mediaembed">embed</a></li>
      <li class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-top"><a href="#<?php print $params['prefix']; ?>mediaelink">link</a></li>      
      <li class="<?php print $params['prefix']; ?>ui-state-default <?php print $params['prefix']; ?>ui-corner-top"><a href="#<?php print $params['prefix']; ?>mediainfo">info</a></li>
   </ul>
   <div class="<?php print $params['prefix']; ?>mediaembed <?php print $params['prefix']; ?>ui-tabs-panel <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-bottom" id="<?php print $params['prefix']; ?>mediaembed">
		<form action="" id="<?php print $params['prefix']; ?>mediaembedForm" name="<?php print $params['prefix']; ?>mediaembedForm">
			<label for="<?php print $params['prefix']; ?>mediaembedCode">Embed</label>
			<input id="<?php print $params['prefix']; ?>mediaembedCode" name="<?php print $params['prefix']; ?>mediaembedCode" type="text" value="" readonly />
		</form>
   </div>
   <div class="<?php print $params['prefix']; ?>mediaelink <?php print $params['prefix']; ?>ui-tabs-panel <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-bottom" id="<?php print $params['prefix']; ?>mediaelink">
      <form action="" id="<?php print $params['prefix']; ?>mediaelinkForm" name="<?php print $params['prefix']; ?>mediaelinkForm">
         <label for="<?php print $params['prefix']; ?>mediaelinkCode">URL</label>
			<input id="<?php print $params['prefix']; ?>mediaelinkCode" name="<?php print $params['prefix']; ?>mediaelinkCode" type="text" value="" readonly />
		</form>
   </div>
   <div class="<?php print $params['prefix']; ?>mediainfo <?php print $params['prefix']; ?>ui-tabs-panel <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-bottom" id="<?php print $params['prefix']; ?>mediainfo">
      <p>
         <a target="_blank" href="http://www.mediafront.org">Open Standard Media Player</a> version <?php print $params['version']; ?><br/><br/>
         Built by <a target="_blank" href="http://www.alethia-inc.com">Alethia Inc.</a>
      </p>
   </div>                                 
</div>