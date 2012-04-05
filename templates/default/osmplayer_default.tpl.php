<div id="<?php print $params['id']; ?>" class="osmplayer-<?php print $template; ?> player-ui">
  <div class="minplayer-<?php print $template; ?> player-ui">
    <div class="minplayer-<?php print $template; ?>-loader-wrapper">
      <div class="minplayer-<?php print $template; ?>-big-play ui-state-default"><span></span></div>
      <div class="minplayer-<?php print $template; ?>-loader">&nbsp;</div>
      <div class="minplayer-<?php print $template; ?>-preview ui-widget-content"></div>
    </div>
    <div class="minplayer-<?php print $template; ?>-controls ui-widget-header">
      <div class="minplayer-<?php print $template; ?>-controls-left">
        <a class="minplayer-<?php print $template; ?>-play minplayer-<?php print $template; ?>-button ui-state-default ui-corner-all" title="Play">
          <span class="ui-icon ui-icon-play"></span>
        </a>
        <a class="minplayer-<?php print $template; ?>-pause minplayer-<?php print $template; ?>-button ui-state-default ui-corner-all" title="Pause">
          <span class="ui-icon ui-icon-pause"></span>
        </a>
      </div>
      <div class="minplayer-<?php print $template; ?>-controls-right">
        <div class="minplayer-<?php print $template; ?>-timer">00:00</div>
        <div class="minplayer-<?php print $template; ?>-fullscreen ui-widget-content">
          <div class="minplayer-<?php print $template; ?>-fullscreen-inner ui-state-default"></div>
        </div>
        <div class="minplayer-<?php print $template; ?>-volume">
          <div class="minplayer-<?php print $template; ?>-volume-slider"></div>
          <a class="minplayer-<?php print $template; ?>-volume-mute minplayer-<?php print $template; ?>-button ui-state-default ui-corner-all" title="Mute">
            <span class="ui-icon ui-icon-volume-on"></span>
          </a>
          <a class="minplayer-<?php print $template; ?>-volume-unmute minplayer-<?php print $template; ?>-button ui-state-default ui-corner-all" title="Unmute">
            <span class="ui-icon ui-icon-volume-off"></span>
          </a>
        </div>
      </div>
      <div class="minplayer-<?php print $template; ?>-controls-mid">
        <div class="minplayer-<?php print $template; ?>-seek">
          <div class="minplayer-<?php print $template; ?>-progress ui-state-default"></div>
        </div>
      </div>
    </div>
    <div class="minplayer-<?php print $template; ?>-logo"></div>
    <div class="minplayer-<?php print $template; ?>-error"></div>
    <div class="minplayer-<?php print $template; ?>-display ui-widget-content"></div>
  </div>
  <div class="osmplayer-<?php print $template; ?>-playlist">
    <div class="osmplayer-<?php print $template; ?>-hide-show-playlist ui-state-default">
      <span class="ui-icon"></span>
    </div>
    <div class="osmplayer-<?php print $template; ?>-playlist-scroll ui-widget-content">
      <div class="osmplayer-<?php print $template; ?>-playlist-scrollbar"></div>
      <div class="minplayer-<?php print $template; ?>-loader-wrapper">
        <div class="minplayer-<?php print $template; ?>-loader"></div>
      </div>
      <div class="osmplayer-<?php print $template; ?>-playlist-list"></div>
    </div>
    <div class="osmplayer-<?php print $template; ?>-playlist-pager ui-widget-header">
      <div class="osmplayer-<?php print $template; ?>-playlist-pager-left">
        <a href="#" class="osmplayer-<?php print $template; ?>-playlist-pager-link osmplayer-<?php print $template; ?>-playlist-pager-prevpage minplayer-<?php print $template; ?>-button ui-state-default ui-corner-all">
          <span class="ui-icon ui-icon-circle-triangle-w"></span>
        </a>
      </div>
      <div class="osmplayer-<?php print $template; ?>-playlist-pager-right">
        <a href="#" class="osmplayer-<?php print $template; ?>-playlist-pager-link osmplayer-<?php print $template; ?>-playlist-pager-nextpage minplayer-<?php print $template; ?>-button ui-state-default ui-corner-all">
          <span class="ui-icon ui-icon-circle-triangle-e"></span>
        </a>
      </div>
    </div>
  </div>
</div>