/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function($) {
  jQuery.media = jQuery.media ? jQuery.media : {};

  window.onVimeoReady = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onReady();
  };

  window.onVimeoFinish = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onFinished();
  };

  window.onVimeoLoading = function( data, playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onLoading( data );
  };

  window.onVimeoPlay = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onPlaying();
  };

  window.onVimeoPause = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onPaused();
  };

  window.onVimeoProgress = function( time, playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onProgress(time);
  };

  // Tell the media player how to determine if a file path is a YouTube media type.
  jQuery.media.playerTypes = jQuery.extend( jQuery.media.playerTypes, {
    "vimeo":function( file ) {
      return (file.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i) === 0);
    }
  });

  jQuery.fn.mediavimeo = function( options, onUpdate ) {
    return new (function( video, options, onUpdate ) {
      this.display = video;
      var _this = this;
      this.player = null;
      this.videoFile = null;
      this.ready = false;
      this.bytesLoaded = 0;
      this.bytesTotal = 0;
      this.currentVolume = 1;

      this.createMedia = function( videoFile, preview ) {
        this.videoFile = videoFile;
        this.ready = false;
        var playerId = (options.id + "_media");
        var flashvars = {
          clip_id:this.getId(videoFile.path),
          width:"100%",
          height:"100%",
          js_api:'1',
          js_onLoad:'onVimeoReady',
          js_swf_id:playerId
        };
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = 'http://vimeo.com/moogaloop.swf?rand=' + rand;
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          flashvars,
          options.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.getId = function( path ) {
        var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;
        return (path.search(regex) === 0) ? path.replace(regex, "$3") : path;
      };

      this.loadMedia = function( videoFile ) {
        this.bytesLoaded = 0;
        this.bytesTotal = 0;
        this.createMedia( videoFile );
      };

      // Called when the player has finished loading.
      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      // Load the player.
      this.loadPlayer = function() {
        if( this.ready && this.player && this.player.api_addEventListener ) {
          // Add our event listeners.
          this.player.api_addEventListener('onProgress', 'onVimeoProgress');
          this.player.api_addEventListener('onFinish', 'onVimeoFinish');
          this.player.api_addEventListener('onLoading', 'onVimeoLoading');
          this.player.api_addEventListener('onPlay', 'onVimeoPlay');
          this.player.api_addEventListener('onPause', 'onVimeoPause');

          // Let them know the player is ready.
          onUpdate({
            type:"playerready"
          });

          this.playMedia();
        }
      };

      this.onFinished = function() {
        onUpdate({
          type:"complete"
        });
      };

      this.onLoading = function( data ) {
        this.bytesLoaded = data.bytesLoaded;
        this.bytesTotal = data.bytesTotal;
      };

      this.onPlaying = function() {
        onUpdate({
          type:"playing",
          busy:"hide"
        });
      };

      this.onPaused = function() {
        onUpdate({
          type:"paused",
          busy:"hide"
        });
      };

      this.playMedia = function() {
        onUpdate({
          type:"playing",
          busy:"hide"
        });
        if (this.player.api_play) {
          this.player.api_play();
        }
      };

      this.onProgress = function( time ) {
        onUpdate({
          type:"progress"
        });
      };

      this.pauseMedia = function() {
        onUpdate({
          type:"paused",
          busy:"hide"
        });
        if (this.player.api_pause) {
          this.player.api_pause();
        }
      };

      this.stopMedia = function() {
        this.pauseMedia();
        if (this.player.api_unload) {
          this.player.api_unload();
        }
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        if (this.player.api_seekTo) {
          this.player.api_seekTo( pos );
        }
      };

      this.setVolume = function( vol ) {
        this.currentVolume = vol;
        if (this.player.api_setVolume) {
          this.player.api_setVolume( (vol*100) );
        }
      };

      // For some crazy reason... Vimeo has not implemented this... so just cache the value.
      this.getVolume = function() {
        return this.currentVolume;
      };

      this.getDuration = function() {
        return this.player.api_getDuration ? this.player.api_getDuration() : 0;
      };

      this.getCurrentTime = function() {
        return this.player.api_getCurrentTime ? this.player.api_getCurrentTime() : 0;
      };

      this.getBytesLoaded = function() {
        return this.bytesLoaded;
      };

      this.getBytesTotal = function() {
        return this.bytesTotal;
      };

      // Not implemented yet...
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
      this.hasControls = function() {
        return true;
      };
      this.showControls = function(show) {};
      //this.setSize = function( newWidth, newHeight ) {};
      this.getEmbedCode = function() {
        return "This video cannot be embedded.";
      };
      this.getMediaLink = function() {
        return "This video currently does not have a link.";
      };
    })( this, options, onUpdate );
  };
})(jQuery);