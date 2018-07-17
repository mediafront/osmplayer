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

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    volume:80,
    autostart:false,
    streamer:"",
    embedWidth:450,
    embedHeight:337,
    wmode:"transparent",
    forceOverflow:false,
    quality:"default",
    repeat:false
  });

  jQuery.fn.mediadisplay = function( options ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( mediaWrapper, options ) {
      this.settings = jQuery.media.utils.getSettings( options );
      this.display = mediaWrapper;
      var _this = this;
      this.volume = -1;
      this.player = null;
      this.preview = '';
      this.updateInterval = null;
      this.progressInterval = null;
      this.playQueue = [];
      this.playIndex = 0;
      this.playerReady = false;
      this.loaded = false;
      this.mediaFile = null;
      this.hasPlaylist = false;

      // If they provide the forceOverflow variable, then that means they
      // wish to force the media player to override all parents overflow settings.
      if( this.settings.forceOverflow ) {
        // Make sure that all parents have overflow visible so that
        // browser full screen will always work.
        this.display.parents().css("overflow", "visible");
      }

      this.reset = function() {
        this.loaded = false;
        this.stopMedia();
        clearInterval( this.progressInterval );
        clearInterval( this.updateInterval );
        this.playQueue.length = 0;
        this.playQueue = [];
        this.playIndex = 0;
        this.playerReady = false;
        this.mediaFile = null;
        this.display.empty().trigger( "mediaupdate", {type:"reset"} );
      };

      // Returns the media that has the lowest weight value, which means
      // this player prefers that media over the others.
      this.getPlayableMedia = function( files ) {
        var mFile = null;
        var i = files.length;
        while(i--) {
          var tempFile = new jQuery.media.file( files[i], this.settings );
          if( !mFile || (tempFile.weight < mFile.weight) ) {
            mFile = tempFile;
          }
        }
        return mFile;
      };

      // Returns a valid media file for this browser.
      this.getMediaFile = function( file ) {
        if( file ) {
          var type = typeof file;
          if( ((type === 'object') || (type === 'array')) && file[0] ) {
            file = this.getPlayableMedia( file );
          }
        }
        return file;
      };

      // Adds a media file to the play queue.
      this.addToQueue = function( file ) {
        if( file ) {
          this.playQueue.push( this.getMediaFile( file ) );
        }
      };

      this.loadFiles = function( files ) {
        if( files ) {
          this.playQueue.length = 0;
          this.playQueue = [];
          this.playIndex = 0;
          this.addToQueue( files.intro );
          this.addToQueue( files.commercial );
          this.addToQueue( files.prereel );
          this.addToQueue( files.media );
          this.addToQueue( files.postreel );
        }
        var hasMedia = (this.playQueue.length > 0);
        if( !hasMedia ) {
          if (this.player) {
            // Destroy the current player.
            this.player.destroy();
            this.player = null;
          }

          this.display.trigger( "mediaupdate", {type:"nomedia"} );
        }
        return hasMedia;
      };

      this.playNext = function() {
        if( this.playQueue.length > this.playIndex ) {
          this.loadMedia( this.playQueue[this.playIndex] );
          this.playIndex++;
        }
        else if( this.settings.repeat ) {
          this.playIndex = 0;
          this.playNext();
        }
        else if( this.hasPlaylist ) {
          this.reset();
        }
        else {
          // If there is no playlist, and no repeat, we will
          // just seek to the beginning and pause.
          this.loaded = false;
          this.settings.autostart = false;
          this.playIndex = 0;
          this.playNext();
        }
      };

      this.loadMedia = function( file, mediaplayer ) {
        if( file ) {
          // Get the media file object.
          file = new jQuery.media.file( this.getMediaFile( file ), this.settings );

          // Set the media player if they force it.
          file.player = mediaplayer ? mediaplayer : file.player;

          // Stop the current player.
          this.stopMedia();

          if( !this.mediaFile || (this.mediaFile.player != file.player) ) {
            // Reset our player variables.
            this.player = null;
            this.playerReady = false;

            // Create a new media player.
            if( file.player ) {
              // Set the new media player.
              this.player = this.display["media" + file.player]( this.settings, function( data ) {
                _this.onMediaUpdate( data );
              });
            }

            if( this.player ) {
              // Create our media player.
              this.player.createMedia( file, this.preview );
            }
          }
          else if( this.player ) {
            // Load our file into the current player.
            this.player.loadMedia( file );
          }

          // Save this file.
          this.mediaFile = file;

          // Send out an update about the initialize.
          this.onMediaUpdate({
            type:"initialize"
          });
        }
      };

      this.onMediaUpdate = function( data ) {
        // Now trigger the media update message.
        switch( data.type ) {
          case "playerready":
            this.playerReady = true;
            this.player.setVolume(0);
            this.player.setQuality(this.settings.quality);
            this.startProgress();
            break;
          case "buffering":
            this.startProgress();
            break;
          case "stopped":
            clearInterval( this.progressInterval );
            clearInterval( this.updateInterval );
            break;
          case "error":
            if( data.code == 4 ) {
              // It is saying not supported... Try and fall back to flash...
              this.loadMedia(this.mediaFile, "flash");
            }
            else {
              clearInterval( this.progressInterval );
              clearInterval( this.updateInterval );
            }
            break;
          case "paused":
            clearInterval( this.updateInterval );
            break;
          case "playing":
            this.startUpdate();
            break;
          case "progress":
            var percentLoaded = this.getPercentLoaded();
            jQuery.extend( data, {
              percentLoaded:percentLoaded
            });
            if( percentLoaded >= 1 ) {
              clearInterval( this.progressInterval );
            }
            break;
          case "meta":
            jQuery.extend( data, {
              currentTime:this.player.getCurrentTime(),
              totalTime:this.getDuration(),
              volume: this.player.getVolume(),
              quality: this.getQuality()
            });
            break;
          case "durationupdate":
            this.mediaFile.duration = data.duration;
            break;
          case "complete":
            this.playNext();
            break;
          default:
            break;
        }

        // If this is the playing state, we want to pause the video.
        if( data.type=="playing" && !this.loaded ) {
          if( this.settings.autoLoad && !this.settings.autostart ) {
            setTimeout( function() {
              _this.setVolume();
              _this.player.pauseMedia();
              _this.settings.autostart = true;
              _this.loaded = true;
            }, 100 );
          }
          else {
            this.loaded = true;
            this.setVolume();
            this.display.trigger( "mediaupdate", data );
          }
        }
        else {
          this.display.trigger( "mediaupdate", data );
        }
      };

      this.startProgress = function() {
        if( this.playerReady ) {
          clearInterval( this.progressInterval );
          this.progressInterval = setInterval( function() {
            _this.onMediaUpdate( {
              type:"progress"
            } );
          }, 500 );
        }
      };

      this.startUpdate = function() {
        if( this.playerReady ) {
          clearInterval( this.updateInterval );
          this.updateInterval = setInterval( function() {
            if( _this.playerReady ) {
              _this.onMediaUpdate({
                type:"update",
                currentTime:_this.player.getCurrentTime(),
                totalTime:_this.getDuration(),
                volume:_this.player.getVolume(),
                quality:_this.getQuality()
              });
            }
          }, 1000 );
        }
      };

      this.stopMedia = function() {
        this.loaded = false;
        clearInterval( this.progressInterval );
        clearInterval( this.updateInterval );
        if( this.playerReady ) {
          this.player.stopMedia();
        }
      };

      this.mute = function( on ) {
        this.player.setVolume( on ? 0 : this.volume );
      };

      this.onResize = function() {
        if( this.player && this.player.onResize ) {
          this.player.onResize();
        }
      };

      this.getPercentLoaded = function() {
        if( this.player.getPercentLoaded ) {
          return this.player.getPercentLoaded();
        }
        else {
          var bytesLoaded = this.player.getBytesLoaded();
          var bytesTotal = this.mediaFile.bytesTotal ? this.mediaFile.bytesTotal : this.player.getBytesTotal();
          return bytesTotal ? (bytesLoaded / bytesTotal) : 0;
        }
      };

      this.showControls = function(show) {
        if( this.playerReady ) {
          this.player.showControls(show);
        }
      };

      this.hasControls = function() {
        if( this.player ) {
          return this.player.hasControls();
        }
        return false;
      };

      this.getDuration = function() {
        if( this.mediaFile ) {
          if(!this.mediaFile.duration ) {
            this.mediaFile.duration = this.player.getDuration();
          }
          return this.mediaFile.duration;
        }
        else {
          return 0;
        }
      };

      this.setVolume = function( vol ) {
        this.volume = vol ? vol : ((this.volume == -1) ? (this.settings.volume / 100) : this.volume);
        if( this.player ) {
          this.player.setVolume(this.volume);
        }
      };

      this.getVolume = function() {
        if( !this.volume ) {
          this.volume = this.player.getVolume();
        }
        return this.volume;
      };

      this.getQuality = function() {
        if( !this.mediaFile.quality ) {
          this.mediaFile.quality = this.player.getQuality();
        }
        return this.mediaFile.quality;
      };
    })( this, options );
  };
})(jQuery);