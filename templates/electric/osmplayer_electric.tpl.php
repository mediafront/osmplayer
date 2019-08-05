<div id="<?php print $params['id']; ?>" class="media-player" style="width:<?php print $params['width']; ?>; height:<?php print $params['height']; ?>;">
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
  <div class="media-player-display"></div>
</div>