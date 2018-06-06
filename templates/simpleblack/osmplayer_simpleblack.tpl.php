<div id="<?php print $params['id']; ?>" style="<?php print $width; ?><?php print $height; ?>">
  <div id="mediaplayer" style="<?php print $height; ?>">
    <div id="mediaplayer_node">
      <div id="mediaplayer_menu">
        <div id="mediaplayer_menuHeader">
          <div class="active"><a href="#mediaplayer_embed">embed</a></div>
          <div><a href="#mediaplayer_link">link</a></div>
          <div><a href="#mediaplayer_info">info</a></div>
          <div id="mediaplayer_menuClose"></div>
        </div>
        <div id="mediaplayer_embed" class="mediaplayer_info">
          <div id="mediaembedForm" name="mediaembedForm">
            <label for="mediaembedCode">Embed</label>
            <input id="mediaembedCode" name="mediaembedCode" type="text" value="" readonly />
          </div>
        </div>
        <div id="mediaplayer_link" class="mediaplayer_info">
          <div id="mediaelinkForm" name="mediaelinkForm">
            <label for="mediaelinkCode">URL</label>
            <input id="mediaelinkCode" name="mediaelinkCode" type="text" value="" readonly />
          </div>
        </div>
        <div id="mediaplayer_info" class="mediaplayer_info">
          <p>
            <a target="_blank" href="http://www.mediafront.org">Open Standard Media Player</a> version <?php print $params['version']; ?><br/><br/>
            Built by <a target="_blank" href="http://www.alethia-inc.com">Alethia Inc.</a>
          </p>
        </div>
      </div>
      <div id="mediaplayer_minplayer">
        <div id="mediaplayer_busy">
          <img src="<?php print $params['playerPath']; ?>templates/simpleblack/images/busy.gif" />
        </div>
        <div id="mediaplayer_bigPlay">
          <img src="<?php print $params['playerPath']; ?>templates/simpleblack/images/mediafront_bigplay.png" />
        </div>
        <div id="mediaplayer_preview"></div>
        <div id="mediaplayer_display"></div>
        <a id="mediafront_resizeScreen" class="mediaplayerlink mediaplayer_controlspace" href="#fullscreen">
          <div id="mediafront_resize_to_fullScreen" class="on"><span>make full screen</span></div>
          <div id="mediafront_resize_to_normalScreen" class="off"><span>make normal screen</span></div>
        </a>
        <div id="mediaplayer_control">
          <div id="mediaplayer_controlLeft">
            <div id="mediaplayer_playPause" class="mediaplayer_controlspace">
              <div id="mediaplayer_play" class="on"><span>play</span></div>
              <div id="mediaplayer_pause" class="off"><span>pause</span></div>
            </div>
            <div id="mediafront_playtime" class="mediaplayer_controlspace">00:00</div>
          </div>
          <div id="mediaplayer_controlRight">
            <div id="mediafront_totaltime" class="mediaplayer_controlspace">00:00</div>
            <div id="mediafront_audio" class="mediaplayer_controlspace">
               <div id="mediaplayer_audioButton"></div>
               <div id="mediaplayer_audioBar">
                 <div id="mediaplayer_audioBarInner">
                   <div id="mediafront_audioControler"></div>
                   <div id="mediavolumeupdate"></div>
                 </div>
               </div>
            </div>
            <a id="mediafront_information" class="mediaplayerlink mediaplayer_controlspace" href="#menu">
              <div id="mediafront_menuButton"><span>information</span></div>
            </a>
          </div>
          <div id="mediaplayer_seekBar">
            <div id="mediaplayer_seekUpdate"></div>
            <div id="mediaplayer_seekProgress"></div>
            <div id="mediaplayer_seekHandle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
