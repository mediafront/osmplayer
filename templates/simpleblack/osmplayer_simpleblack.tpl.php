<div id="<?php print $params['id']; ?>">
  <div id="mediaplayer">
    <div id="mediafront_playerWrap">
      <!--bof information box-->
      <div id="mediafront_informationbox">
        <!--bof infomation box top menus-->
        <div id="mediafront_infoboxTopMenuWrap">
          <ul id="mediafront_infoboxTopMenu">
            <li class="active"><a href="#mediafront_embed">embed</a></li>
            <li><a href="#mediafront_link">link</a></li>
            <li><a href="#mediafront_info">info</a></li>
            <li id="mediafront_inforboxClose"></li>
          </ul>
          <div class="br"><!----></div>
        </div>
        <!--eof infomation box top menus-->
        <!--bof infomation box info-->
        <div id="mediafront_embed" class="mediafront_infoboxDetail">
          <form action="" id="mediaembedForm" name="mediaembedForm">
            <label for="mediaembedCode">Embed</label>
            <input id="mediaembedCode" name="mediaembedCode" type="text" value="" readonly />
          </form>
        </div>
        <div id="mediafront_link" class="mediafront_infoboxDetail">
          <form action="" id="mediaelinkForm" name="mediaelinkForm">
            <label for="mediaelinkCode">URL</label>
            <input id="mediaelinkCode" name="mediaelinkCode" type="text" value="" readonly />
          </form>
        </div>
        <div id="mediafront_info" class="mediafront_infoboxDetail">
          <p>
            <a target="_blank" href="http://www.mediafront.org">Open Standard Media Player</a> version <?php print $params['version']; ?><br/><br/>
            Built by <a target="_blank" href="http://www.alethia-inc.com">Alethia Inc.</a>
          </p>
        </div>
        <!--eof infomation box info-->
      </div>
      <!--eof information box-->

      <div id="mediafront_movieFrame">
        <!--bof big play button-->
        <div id="mediafront_bigPlay"></div>
        <div id="mediafront_preview"></div>
        <!--eof big play button-->
        <!--bof controler bar-->
        <div id="mediafront_controlerBarWrap">
          <div id="mediafront_controlerBar">
            <!--bof play time-->
            <div id="mediafront_playtime">00:00</div>
            <div id="mediafront_separator">&nbsp;/&nbsp;</div>
            <div id="mediafront_totaltime">00:00</div>
            <!--eof play time-->
            <!--bof play pause buttons-->
            <div id="mediafront_play_pause">
              <div id="mediafront_play" class="on"><a href="#"><span>play</span></a></div>
              <div id="mediafront_pause" class="off"><a href="#"><span>pause</span></a></div>
            </div>
            <!--bof play pause buttons-->
            <!--bof progress bar-->
            <div id="mediafront_progressBar">
              <div id="mediafront_progressBar_update"></div>
              <div id="mediafront_progressBar_controler"></div>
              <div id="mediaseekhandle"></div>
            </div>
            <!--eof progress bar-->
            <!--bof resize screen-->
            <div id="mediafront_resizeScreen">
              <div id="mediafront_resize_to_fullScreen"><a href="#fullscreen"><span>make full screen</span></a></div>
              <div id="mediafront_resize_to_normalScreen"><a href="#fullscreen"><span>make normal screen</span></a></div>
            </div>
            <!--eof resize screen-->
            <!--bof information button-->
            <div id="mediafront_information"><a class="mediaplayerlink" href="#menu"><span>information</span></a></div>
            <!--eof information button-->
            <!--bof audio-->
            <div id="mediafront_audio">
               <a href="#" id="mediafront_audioButton"></a>
               <div id="mediafront_audioBarWrap">
                  <div id="mediafront_audioControler"></div>
                  <div id="mediavolumeupdate"></div>
               </div>
            </div>
            <!--eof audio-->
          </div>
        </div>
        <!--eof controler bar-->
        <div id="mediadisplay"></div>
        <div class="br"><!----></div>
      </div>
    </div>
    <!--eof Mediafront player-->
  </div>
</div>