<?php
  $hasPlayist = (!$params['disablePlaylist'] && !$params['controllerOnly']);
  $hasControl = ($params['controllerOnly'] || ($params['showController'] && !$params['playlistOnly']));
  $hasMenu = (!$params['playlistOnly'] && !$params['controllerOnly']);
  $hasTitleBar = ($params['showTitleBar'] && !$params['controllerOnly']);

  $showPlaylist = $hasPlayist && $params['showPlaylist'] ? $params['prefix'] . 'mediashowplaylist ' : '';
  $showTitleBar = $hasTitleBar ? $params['prefix'] . 'mediashowtitle ' : '';
  $showScrollBar = !$params['showScrollbar'] ? 'mediahidescroll ' : '';
  $showVoter = $params['showNodeVoter'] ? $params['prefix'] . 'mediashowvoter ' : '';
  $playlistHorizontal = !$params['vertical'] ? $params['prefix'] . 'playlisthorizontal ' : '';
  $playlistOnly = $params['playlistOnly'] ? $params['prefix'] . 'playlistonly ' : '';
  $controllerOnly = $params['controllerOnly'] ? $params['prefix'] . 'controlleronly ' : '';

  $showCSS = $showPlaylist . $showTitleBar . $showScrollBar . $showVoter . $playlistHorizontal . $playlistOnly . $controllerOnly;
?>
<?php if( !$params['playlistOnly'] && !$params['controllerOnly'] ) { ?>
<div id="<?php print $params['prefix']; ?>mediaplayerloading" style="<?php print $width; ?><?php print $height; ?>">
  <img src="<?php print $params['playerPath']; ?>templates/default/images/busy.gif" />
</div>
<?php } ?>
<div id="<?php print $params['id']; ?>" class="<?php print $showCSS ?><?php print $params['prefix']; ?>mediaplayerdialog <?php print $params['prefix']; ?>ui-dialog <?php print $params['prefix']; ?>ui-widget <?php print $params['prefix']; ?>ui-widget-content <?php print $params['prefix']; ?>ui-corner-all" style="<?php print $width; ?><?php print $height; ?>">
  <?php if ($hasTitleBar) { print $templates['titlebar']; } ?>
  <div id="<?php print $params['prefix']; ?>mediaplayer" class="<?php print $params['prefix']; ?>ui-helper-clearfix">
    <?php if ($hasMenu) { print $templates['menu']; } ?>
    <?php if (!$params['playlistOnly']) { print $templates['node']; } ?>
    <?php if ($hasControl) { print $templates['controlBar']; } ?>
  </div>
  <?php if ($hasPlayist) { print $templates['playlist']; } ?>
</div>