<div id="<?php print $params['id']; ?>" class="osmplayer-<?php print $template; ?> player-ui">
  <?php print $minplayer; ?>
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