<div id="<?php print $settings['id']; ?>" class="osmplayer" style="width:<?php print $settings['width']; ?>; height:<?php print $settings['height']; ?>;">
  <div class="media-player">
    <div class="media-player-error"></div>
    <div class="media-player-controls">
      <div class="media-player-controls-left">
        <a class="media-player-play" title="Play"></a>
        <a class="media-player-pause" title="Pause"></a>
      </div>
      <div class="media-player-controls-right">
        <div class="media-player-timer">00:00</div>
        <div class="media-player-fullscreen">
          <div class="media-player-fullscreen-inner"></div>
        </div>
        <div class="media-player-volume">
          <div class="media-player-volume-slider"></div>
          <a class="media-player-volume-button" title="Mute/Unmute"></a>
        </div>
      </div>
      <div class="media-player-controls-mid">
        <div class="media-player-seek">
          <div class="media-player-progress"></div>
        </div>
      </div>
    </div>
    <div class="media-player-play-loader">
      <div class="media-player-big-play"><span></span></div>
      <div class="media-player-loader">&nbsp;</div>
      <div class="media-player-preview"></div>
    </div>
    <div class="media-player-display">
      <?php print $player; ?>
    </div>
  </div>
  <div class="osmplayer-playlist">
    <div class="osmplayer-hide-show-playlist ui-corner-left">
      <span class="ui-icon ui-icon ui-icon-triangle-1-e"></span>
    </div>
    <div class="osmplayer-playlist-scroll">
      <div class="osmplayer-playlist-scrollbar"></div>
      <div class="osmplayer-playlist-loader-wrapper">
        <div class="osmplayer-playlist-loader"></div>
      </div>
      <div class="osmplayer-playlist-list"></div>
    </div>
    <div class="osmplayer-playlist-pager ui-state-default">
      <div class="osmplayer-playlist-pager-left">
        <a href="#" class="osmplayer-playlist-pager-link osmplayer-playlist-pager-prevpage">&nbsp;</a>
      </div>
      <div class="osmplayer-playlist-pager-right">
        <a href="#" class="osmplayer-playlist-pager-link osmplayer-playlist-pager-nextpage">&nbsp;</a>
      </div>
    </div>
  </div>
</div>