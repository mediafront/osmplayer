<div id="<?php print $params['id']; ?>" class="minplayer-jqueryui player-ui">
  <div class="minplayer-jqueryui-loader-wrapper">
    <div class="minplayer-jqueryui-big-play ui-state-default"><span></span></div>
    <div class="minplayer-jqueryui-loader">&nbsp;</div>
    <div class="minplayer-jqueryui-preview ui-widget-content"></div>
  </div>
  <div class="minplayer-jqueryui-controls ui-widget-header">
    <div class="minplayer-jqueryui-controls-left">
      <a class="minplayer-jqueryui-play minplayer-jqueryui-button ui-state-default ui-corner-all" title="Play">
        <span class="ui-icon ui-icon-play"></span>
      </a>
      <a class="minplayer-jqueryui-pause minplayer-jqueryui-button ui-state-default ui-corner-all" title="Pause">
        <span class="ui-icon ui-icon-pause"></span>
      </a>
    </div>
    <div class="minplayer-jqueryui-controls-right">
      <div class="minplayer-jqueryui-timer">00:00</div>
      <div class="minplayer-jqueryui-fullscreen ui-widget-content">
        <div class="minplayer-jqueryui-fullscreen-inner ui-state-default"></div>
      </div>
      <div class="minplayer-jqueryui-volume">
        <div class="minplayer-jqueryui-volume-slider"></div>
        <a class="minplayer-jqueryui-volume-mute minplayer-jqueryui-button ui-state-default ui-corner-all" title="Mute">
          <span class="ui-icon ui-icon-volume-on"></span>
        </a>
        <a class="minplayer-jqueryui-volume-unmute minplayer-jqueryui-button ui-state-default ui-corner-all" title="Unmute">
          <span class="ui-icon ui-icon-volume-off"></span>
        </a>
      </div>
    </div>
    <div class="minplayer-jqueryui-controls-mid">
      <div class="minplayer-jqueryui-seek">
        <div class="minplayer-jqueryui-progress ui-state-default"></div>
      </div>
    </div>
  </div>
  <div class="minplayer-jqueryui-logo"></div>
  <div class="minplayer-jqueryui-error"></div>
  <div class="minplayer-jqueryui-display ui-widget-content">
    <?php if (!empty($player)) { print $player; } ?>
  </div>
</div>