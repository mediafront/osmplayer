<div id="<?php print $params['id']; ?>" class="osmplayer-<?php print $params['template']; ?> player-ui">
  <div id="mediaplayer" style="height:<?php print $params['height']; ?>">
    <div id="mediaplayer_node">
      <div id="mediaplayer_minplayer">
        <div id="mediaplayer_play_loader">
          <div id="mediaplayer_busy"></div>
          <div id="mediaplayer_bigPlay"></div>
          <div id="mediaplayer_preview"></div>
        </div>
        <div id="mediaplayer_display"></div>
        <div id="mediaplayer_control">
          <div id="mediaplayer_controlLeft">
            <div id="mediaplayer_playPause" class="mediaplayer_controlspace">
              <div id="mediaplayer_play" class="on"><span>play</span></div>
              <div id="mediaplayer_pause" class="off"><span>pause</span></div>
            </div>
            <div id="mediafront_playtime" class="mediaplayer_controlspace">00:00</div>
          </div>
          <div id="mediaplayer_controlRight">
            <a id="mediafront_resizeScreen" class="mediaplayerlink mediaplayer_controlspace" href="#fullscreen">
              <div id="mediafront_resize_to_fullScreen" class="on"><span>make full screen</span></div>
              <div id="mediafront_resize_to_normalScreen" class="off"><span>make normal screen</span></div>
            </a>
            <div id="mediafront_totaltime" class="mediaplayer_controlspace">00:00</div>
            <div id="mediafront_audio" class="mediaplayer_controlspace">
               <div id="mediaplayer_audioButton"></div>
               <div id="mediaplayer_audioBar"></div>
            </div>
          </div>
          <div id="mediaplayer_seekBar">
            <div id="mediaplayer_seekProgress"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
