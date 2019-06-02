<div id="<?php print $params['id']; ?>" class="osmplayer-<?php print $params['template']; ?> player-ui" style="width=<?php print $params['width']; ?>; height=<?php print $params['height']; ?>;">
  <div class="minplayer-<?php print $params['template']; ?> player-ui">
    <div class="minplayer-<?php print $params['template']; ?>-loader-wrapper">
      <div class="minplayer-<?php print $params['template']; ?>-big-play ui-state-default"><span></span></div>
      <div class="minplayer-<?php print $params['template']; ?>-loader">&nbsp;</div>
      <div class="minplayer-<?php print $params['template']; ?>-preview ui-widget-content"></div>
    </div>
    <div class="minplayer-<?php print $params['template']; ?>-controls ui-widget-header">
      <div class="minplayer-<?php print $params['template']; ?>-controls-left">
        <a class="minplayer-<?php print $params['template']; ?>-play minplayer-<?php print $params['template']; ?>-button ui-state-default ui-corner-all" title="Play">
          <span class="ui-icon ui-icon-play"></span>
        </a>
        <a class="minplayer-<?php print $params['template']; ?>-pause minplayer-<?php print $params['template']; ?>-button ui-state-default ui-corner-all" title="Pause">
          <span class="ui-icon ui-icon-pause"></span>
        </a>
      </div>
      <div class="minplayer-<?php print $params['template']; ?>-controls-right">
        <div class="minplayer-<?php print $params['template']; ?>-timer">00:00</div>
        <div class="minplayer-<?php print $params['template']; ?>-fullscreen ui-widget-content">
          <div class="minplayer-<?php print $params['template']; ?>-fullscreen-inner ui-state-default"></div>
        </div>
        <div class="minplayer-<?php print $params['template']; ?>-volume">
          <a class="minplayer-<?php print $params['template']; ?>-volume-mute minplayer-<?php print $params['template']; ?>-button ui-state-default ui-corner-all" title="Mute">
            <span class="ui-icon ui-icon-volume-on"></span>
          </a>
          <a class="minplayer-<?php print $params['template']; ?>-volume-unmute minplayer-<?php print $params['template']; ?>-button ui-state-default ui-corner-all" title="Unmute">
            <span class="ui-icon ui-icon-volume-off"></span>
          </a>
          <div class="minplayer-<?php print $params['template']; ?>-volume-slider"></div>
        </div>
      </div>
      <div class="minplayer-<?php print $params['template']; ?>-controls-mid">
        <div class="minplayer-<?php print $params['template']; ?>-seek">
          <div class="minplayer-<?php print $params['template']; ?>-progress ui-state-default"></div>
        </div>
      </div>
    </div>
    <div class="minplayer-<?php print $params['template']; ?>-logo"></div>
    <div class="minplayer-<?php print $params['template']; ?>-error"></div>
    <div class="minplayer-<?php print $params['template']; ?>-display ui-widget-content"></div>
  </div>
  <div class="osmplayer-<?php print $params['template']; ?>-playlist">
    <div class="osmplayer-<?php print $params['template']; ?>-hide-show-playlist ui-state-default">
      <span class="ui-icon"></span>
    </div>
    <div class="minplayer-<?php print $params['template']; ?>-loader-wrapper">
      <div class="minplayer-<?php print $params['template']; ?>-loader"></div>
    </div>
    <div class="osmplayer-<?php print $params['template']; ?>-playlist-scroll ui-widget-content">
      <div class="osmplayer-<?php print $params['template']; ?>-playlist-list"></div>
    </div>
    <div class="osmplayer-<?php print $params['template']; ?>-playlist-pager ui-widget-header">
      <div class="osmplayer-<?php print $params['template']; ?>-playlist-pager-left">
        <a href="#" class="osmplayer-<?php print $params['template']; ?>-playlist-pager-link osmplayer-<?php print $params['template']; ?>-playlist-pager-prevpage minplayer-<?php print $params['template']; ?>-button ui-state-default ui-corner-all">
          <span class="ui-icon ui-icon-circle-triangle-w"></span>
        </a>
      </div>
      <div class="osmplayer-<?php print $params['template']; ?>-playlist-pager-right">
        <a href="#" class="osmplayer-<?php print $params['template']; ?>-playlist-pager-link osmplayer-<?php print $params['template']; ?>-playlist-pager-nextpage minplayer-<?php print $params['template']; ?>-button ui-state-default ui-corner-all">
          <span class="ui-icon ui-icon-circle-triangle-e"></span>
        </a>
      </div>
    </div>
  </div>
</div>