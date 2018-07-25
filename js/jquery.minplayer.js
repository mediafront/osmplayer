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
    volumeVertical:false
  });
   
  // Set up our defaults for this component.
  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    currentTime:"#mediacurrenttime",
    totalTime:"#mediatotaltime",
    playPause:"#mediaplaypause",
    seekUpdate:"#mediaseekupdate",
    seekProgress:"#mediaseekprogress",
    seekBar:"#mediaseekbar",
    seekHandle:"#mediaseekhandle",
    volumeUpdate:"#mediavolumeupdate",
    volumeBar:"#mediavolumebar",
    volumeHandle:"#mediavolumehandle",
    mute:"#mediamute"
  });
   
  jQuery.fn.mediacontrol = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( controlBar, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
      this.display = controlBar;
      var _this = this;
         
      // Allow the template to provide their own function for this...
      this.formatTime = (settings.template && settings.template.formatTime) ? settings.template.formatTime :
      function( time ) {
        time = time ? time : 0;
        var seconds = 0;
        var minutes = 0;
        var hour = 0;
            
        hour = Math.floor(time / 3600);
        time -= (hour * 3600);
        minutes = Math.floor( time / 60 );
        time -= (minutes * 60);
        seconds = Math.floor(time % 60);
         
        var timeString = "";
            
        if( hour ) {
          timeString += String(hour);
          timeString += ":";
        }
            
        timeString += (minutes >= 10) ? String(minutes) : ("0" + String(minutes));
        timeString += ":";
        timeString += (seconds >= 10) ? String(seconds) : ("0" + String(seconds));
        return {
          time:timeString,
          units:""
        };
      };
         
      this.setToggle = function( button, state ) {
        var on = state ? ".on" : ".off";
        var off = state ? ".off" : ".on";
        if( button ) {
          button.find(on).show();
          button.find(off).hide();
        }
      };
         
      var zeroTime = this.formatTime( 0 );
      this.duration = 0;
      this.volume = -1;
      this.prevVolume = 0;
      this.percentLoaded = 0;
      this.playState = false;
      this.muteState = false;
      this.currentTime = controlBar.find( settings.ids.currentTime ).text( zeroTime.time );
      this.totalTime = controlBar.find( settings.ids.totalTime ).text( zeroTime.time );

      // Allow them to attach custom links to the control bar that perform player functions.
      this.display.find("a.mediaplayerlink").each( function() {
        var linkId = $(this).attr("href");
        $(this).medialink( settings, function( event ) {
          event.preventDefault();
          _this.display.trigger( event.data.id );
        }, {
          id:linkId.substr(1),
          obj:$(this)
        } );
      });

      // Set up the play pause button.
      this.playPauseButton = controlBar.find( settings.ids.playPause ).medialink( settings, function( event, target ) {
        _this.playState = !_this.playState;
        _this.setToggle( target, _this.playState );
        _this.display.trigger( "controlupdate", {
          type: (_this.playState ? "pause" : "play")
        });
      });
         
      // Set up the seek bar...
      this.seekUpdate = controlBar.find( settings.ids.seekUpdate ).css("width", 0);
      this.seekProgress = controlBar.find( settings.ids.seekProgress ).css("width", 0);
      this.seekBar = controlBar.find( settings.ids.seekBar ).mediaslider( settings.ids.seekHandle, false );
      if( this.seekBar ) {
        this.seekBar.display.unbind("setvalue").bind( "setvalue", function( event, data ) {
          _this.seekUpdate.css( "width", (data * _this.seekBar.trackSize) + "px" );
          _this.display.trigger( "controlupdate", {
            type:"seek",
            value:(data * _this.duration)
          });
        });
        this.seekBar.display.unbind("updatevalue").bind( "updatevalue", function( event, data ) {
          _this.seekUpdate.css( "width", (data * _this.seekBar.trackSize) + "px" );
        });
      }
         
      this.setVolume = function( vol ) {
        if( this.volumeBar ) {
          if( settings.volumeVertical ) {
            this.volumeUpdate.css({
              "marginTop":(this.volumeBar.handlePos + this.volumeBar.handleMid),
              "height":(this.volumeBar.trackSize - this.volumeBar.handlePos)
            });
          }
          else {
            this.volumeUpdate.css( "width", (vol * this.volumeBar.trackSize) );
          }
        }
      };
         
      // Set up the volume bar.
      this.volumeUpdate = controlBar.find( settings.ids.volumeUpdate );
      this.volumeBar = controlBar.find( settings.ids.volumeBar ).mediaslider( settings.ids.volumeHandle, settings.volumeVertical, settings.volumeVertical );
      if( this.volumeBar ) {
        this.volumeBar.display.unbind("setvalue").bind("setvalue", function( event, data ) {
          _this.setVolume( data );
          _this.display.trigger( "controlupdate", {
            type:"volume",
            value:data
          });
        });
        this.volumeBar.display.unbind("updatevalue").bind("updatevalue", function( event, data ) {
          _this.setVolume( data );
          _this.volume = data;
        });
      }
         
      // Setup the mute button.
      this.mute = controlBar.find(settings.ids.mute).medialink( settings, function( event, target ) {
        _this.muteState = !_this.muteState;
        _this.setToggle( target, _this.muteState );
        _this.setMute( _this.muteState );
      });
                
      this.setMute = function( state ) {
        this.prevVolume = (this.volumeBar.value > 0) ? this.volumeBar.value : this.prevVolume;
        this.volumeBar.updateValue( state ? 0 : this.prevVolume );
        this.display.trigger( "controlupdate", {
          type:"mute",
          value:state
        });
      };

      this.setProgress = function( percent ) {
        if( this.seekProgress && this.seekBar ) {
          this.seekProgress.css( "width", (percent * (this.seekBar.trackSize + this.seekBar.handleSize)) );
        }
      };

      this.onResize = function() {
        if( this.seekBar ) {
          this.seekBar.onResize();
        }
        this.setProgress( this.percentLoaded );
      };

      // Handle the media events...
      this.onMediaUpdate = function( data ) {
        switch( data.type ) {
          case "reset":
            this.reset();
            break;
          case "paused":
            this.playState = true;
            this.setToggle( this.playPauseButton.display, this.playState );
            break;
          case "playing":
            this.playState = false;
            this.setToggle( this.playPauseButton.display, this.playState );
            break;
          case "stopped":
            this.playState = true;
            this.setToggle( this.playPauseButton.display, this.playState );
            break;
          case "progress":
            this.percentLoaded = data.percentLoaded;
            this.setProgress( this.percentLoaded );
            break;
          case "meta":
          case "update":
            this.timeUpdate( data.currentTime, data.totalTime );
            if( this.volumeBar ) {
              this.volumeBar.updateValue( data.volume );
            }
            break;
          default:
            break;
        }
      };
         
      // Call to reset all controls...
      this.reset = function() {
        this.totalTime.text( this.formatTime(0).time );
        this.currentTime.text( this.formatTime(0).time );
        if( this.seekBar ) {
          this.seekBar.updateValue(0);
        }
        this.seekUpdate.css( "width", "0px" );
        this.seekProgress.css( "width", "0px" );
      };
         
      this.timeUpdate = function( cTime, tTime ) {
        this.duration = tTime;
        this.totalTime.text( this.formatTime( tTime ).time );
        this.currentTime.text( this.formatTime( cTime ).time );
        if( tTime && this.seekBar && !this.seekBar.dragging ) {
          this.seekBar.updateValue( cTime / tTime );
        }
      };
         
      // Reset the time values.
      this.timeUpdate( 0, 0 );
    })( this, settings );
  };
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

  

  // Called when the YouTube player is ready.
  window.onDailymotionPlayerReady = function( playerId ) {
    playerId = playerId.replace("_media", "");
    jQuery.media.players[playerId].node.player.media.player.onReady();
  };

  // Tell the media player how to determine if a file path is a YouTube media type.
  jQuery.media.playerTypes = jQuery.extend( jQuery.media.playerTypes, {
    "dailymotion":function( file ) {
      return (file.search(/^http(s)?\:\/\/(www\.)?dailymotion\.com/i) === 0);
    }
  });

  jQuery.fn.mediadailymotion = function( options, onUpdate ) {
    return new (function( video, options, onUpdate ) {
      this.display = video;
      var _this = this;
      this.player = null;
      this.videoFile = null;
      this.meta = false;
      this.loaded = false;
      this.ready = false;

      this.createMedia = function( videoFile, preview ) {
        this.videoFile = videoFile;
        this.ready = false;
        var playerId = (options.id + "_media");
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = 'http://www.dailymotion.com/swf/' + videoFile.path + '?rand=' + rand + '&amp;enablejsapi=1&amp;playerapiid=' + playerId;
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          {},
          options.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.loadMedia = function( videoFile ) {
        if( this.player ) {
          this.loaded = false;
          this.meta = false;
          this.videoFile = videoFile;

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );

          // Load our video.
          this.player.loadVideoById( this.videoFile.path, 0 );
        }
      };

      // Called when the player has finished loading.
      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      this.loadPlayer = function() {
        if( this.ready && this.player ) {
          // Create our callback functions.
          window[options.id + 'StateChange'] = function( newState ) {
            _this.onStateChange( newState );
          };

          window[options.id + 'PlayerError'] = function( errorCode ) {
            _this.onError( errorCode );
          };

          // Add our event listeners.
          this.player.addEventListener('onStateChange', options.id + 'StateChange');
          this.player.addEventListener('onError', options.id + 'PlayerError');

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );

          // Load our video.
          this.player.loadVideoById( this.videoFile.path, 0 );
        }
      };

      // Called when the player state changes.
      this.onStateChange = function( newState ) {
        var playerState = this.getPlayerState( newState );

        // Alright... Dailymotion's status updates are just crazy...
        // write some hacks to just make it work.

        if( !(!this.meta && playerState.state =="stopped") ) {
          onUpdate( {
            type:playerState.state,
            busy:playerState.busy
          } );
        }

        if( !this.loaded && playerState.state == "buffering" ) {
          this.loaded = true;
          onUpdate( {
            type:"paused",
            busy:"hide"
          } );
          if( options.autostart ) {
            this.playMedia();
          }
        }

        if( !this.meta && playerState.state == "playing" ) {
          // Set this player to meta.
          this.meta = true;

          // Update our meta data.
          onUpdate( {
            type:"meta"
          } );
        }
      };

      // Called when the player has an error.
      this.onError = function( errorCode ) {
        var errorText = "An unknown error has occured: " + errorCode;
        if( errorCode == 100 ) {
          errorText = "The requested video was not found.  ";
          errorText += "This occurs when a video has been removed (for any reason), ";
          errorText += "or it has been marked as private.";
        } else if( (errorCode == 101) || (errorCode == 150) ) {
          errorText = "The video requested does not allow playback in an embedded player.";
        }
        onUpdate( {
          type:"error",
          data:errorText
        } );
      };

      // Translates the player state for the  API player.
      this.getPlayerState = function( playerState ) {
        switch (playerState) {
          case 5:
            return {state:'ready', busy:false};
          case 3:
            return {state:'buffering', busy:"show"};
          case 2:
            return {state:'paused', busy:"hide"};
          case 1:
            return {state:'playing', busy:"hide"};
          case 0:
            return {state:'complete', busy:false};
          case -1:
            return {state:'stopped', busy:false};
          default:
            return {state:'unknown', busy:false};
        }
        return 'unknown';
      };

      /*
         this.setSize = function( newWidth, newHeight ) {
            this.player.setSize(newWidth, newHeight);
         };
         */
      this.playMedia = function() {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        this.player.playVideo();
      };

      this.pauseMedia = function() {
        this.player.pauseVideo();
      };

      this.stopMedia = function() {
        this.player.stopVideo();
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        this.player.seekTo( pos, true );
      };

      this.setVolume = function( vol ) {
        this.player.setVolume( vol * 100 );
      };

      this.getVolume = function() {
        return (this.player.getVolume() / 100);
      };

      this.getDuration = function() {
        return this.player.getDuration();
      };

      this.getCurrentTime = function() {
        return this.player.getCurrentTime();
      };

      this.getBytesLoaded = function() {
        return this.player.getVideoBytesLoaded();
      };

      this.getBytesTotal = function() {
        return this.player.getVideoBytesTotal();
      };

      this.getEmbedCode = function() {
        return this.player.getVideoEmbedCode();
      };

      this.getMediaLink = function() {
        return this.player.getVideoUrl();
      };

      this.hasControls = function() {
        return true;
      };
      this.showControls = function(show) {};
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
    })( this, options, onUpdate );
  };
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

  window.onFlashPlayerReady = function( id ) {
    jQuery.media.players[id].node.player.media.player.onReady();
  };

  window.onFlashPlayerUpdate = function( id, eventType ) {
    jQuery.media.players[id].node.player.media.player.onMediaUpdate( eventType );
  };

  window.onFlashPlayerDebug = function( debug ) {
    if( window.console && console.log ) {
      console.log( debug );
    }
  };

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    flashPlayer:"./flash/mediafront.swf",
    skin:"default",
    config:"nocontrols"
  });

  jQuery.fn.mediaflash = function( settings, onUpdate ) {
    return new (function( video, settings, onUpdate ) {
      settings = jQuery.media.utils.getSettings( settings );
      this.display = video;
      var _this = this;
      this.player = null;
      this.mediaFile = null;
      this.preview = '';
      this.ready = false;

      // Translate the messages.
      this.translate = {
        "mediaConnected":"connected",
        "mediaBuffering":"buffering",
        "mediaPaused":"paused",
        "mediaPlaying":"playing",
        "mediaStopped":"stopped",
        "mediaComplete":"complete",
        "mediaMeta":"meta"
      };

      // When to show the busy cursor.
      this.busy = {
        "mediaConnected":false,
        "mediaBuffering":"show",
        "mediaPaused":"hide",
        "mediaPlaying":"hide",
        "mediaStopped":false,
        "mediaComplete":false,
        "mediaMeta":false
      };

      this.createMedia = function( mediaFile, preview ) {
        this.mediaFile = mediaFile;
        this.preview = preview;
        this.ready = false;
        var playerId = (settings.id + "_media");
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = settings.flashPlayer + "?rand=" + rand;
        var flashvars = {
          config:settings.config,
          id:settings.id,
          file:mediaFile.path,
          image:this.preview,
          skin:settings.skin,
          autostart:(settings.autostart || !settings.autoLoad)
        };
        if( mediaFile.stream ) {
          flashvars.stream = mediaFile.stream;
        }
        if( settings.debug ) {
          flashvars.debug = "1";
        }
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          flashvars,
          settings.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.loadMedia = function( mediaFile ) {
        if( this.player && this.ready ) {
          this.mediaFile = mediaFile;

          // Load the new media file into the Flash player.
          this.player.loadMedia( mediaFile.path, mediaFile.stream );

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );
        }
      };

      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      this.loadPlayer = function() {
        if( this.ready && this.player ) {
          onUpdate( {
            type:"playerready"
          } );
        }
      };

      this.onMediaUpdate = function( eventType ) {
        onUpdate( {
          type:this.translate[eventType],
          busy:this.busy[eventType]
        });
      };

      this.playMedia = function() {
        if( this.player && this.ready ) {
          this.player.playMedia();
        }
      };

      this.pauseMedia = function() {
        if( this.player && this.ready ) {
          this.player.pauseMedia();
        }
      };

      this.stopMedia = function() {
        if( this.player && this.ready ) {
          this.player.stopMedia();
        }
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        if( this.player && this.ready ) {
          this.player.seekMedia( pos );
        }
      };

      this.setVolume = function( vol ) {
        if( this.player && this.ready ) {
          this.player.setVolume( vol );
        }
      };

      this.getVolume = function() {
        return (this.player && this.ready) ? this.player.getVolume() : 0;
      };

      this.getDuration = function() {
        return (this.player && this.ready) ? this.player.getDuration() : 0;
      };

      this.getCurrentTime = function() {
        return (this.player && this.ready) ? this.player.getCurrentTime() : 0;
      };

      this.getBytesLoaded = function() {
        return (this.player && this.ready) ? this.player.getMediaBytesLoaded() : 0;
      };

      this.getBytesTotal = function() {
        return (this.player && this.ready) ? this.player.getMediaBytesTotal() : 0;
      };

      this.hasControls = function() {
        return true;
      };

      this.showControls = function(show) {
        if( this.player && this.ready ) {
          this.player.showPlugin("controlBar", show);
          this.player.showPlugin("playLoader", show);
        }
      };

      this.getEmbedCode = function() {
        var flashVars = {
          config:"config",
          id:"mediafront_player",
          file:this.mediaFile.path,
          image:this.preview,
          skin:settings.skin
        };
        if( this.mediaFile.stream ) {
          flashVars.stream = this.mediaFile.stream;
        }
        return jQuery.media.utils.getFlash(
          settings.flashPlayer,
          "mediafront_player",
          settings.embedWidth,
          settings.embedHeight,
          flashVars,
          settings.wmode );
      };

      // Not implemented yet...
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
      //this.setSize = function( newWidth, newHeight ) {};
      this.getMediaLink = function() {
        return "This video currently does not have a link.";
      };
    })( this, settings, onUpdate );
  };
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

  jQuery.fn.mediahtml5 = function( options, onUpdate ) {
    return new (function( media, options, onUpdate ) {
      this.display = media;
      var _this = this;
      this.player = null;
      this.bytesLoaded = 0;
      this.bytesTotal = 0;
      this.mediaType = "";
      this.loaded = false;
      this.mediaFile = null;
      this.playerElement = null;

      this.getPlayer = function( mediaFile, preview ) {
        this.mediaFile = mediaFile;
        var playerId = options.id + '_' + this.mediaType;
        var html = '<' + this.mediaType + ' style="position:absolute" id="' + playerId + '"';
        html += preview ? ' poster="' + preview + '"' : '';

        if( typeof mediaFile === 'array' ) {
          html += '>';
          var i = mediaFile.length;
          while(i) {
            i--;
            html += '<source src="' + mediaFile[i].path + '" type="' + mediaFile[i].mimetype + '">';
          }
        }
        else {
          html += ' src="' + mediaFile.path + '">Unable to display media.';
        }

        html += '</' + this.mediaType + '>';
        this.display.append( html );
        this.bytesTotal = mediaFile.bytesTotal;
        this.playerElement = this.display.find('#' + playerId);
        this.onResize();

        // return the player object.
        return this.playerElement.eq(0)[0];
      };

      // Create a new HTML5 player.
      this.createMedia = function( mediaFile, preview ) {
        // Remove any previous Flash players.
        jQuery.media.utils.removeFlash( this.display, options.id + "_media" );
        this.display.children().remove();
        this.mediaType = this.getMediaType( mediaFile );
        this.player = this.getPlayer( mediaFile, preview );
        this.loaded = false;
        var timeupdated = false;
        if( this.player ) {
          this.player.addEventListener( "abort", function() {
            onUpdate( {
              type:"stopped"
            } );
          }, true);
          this.player.addEventListener( "loadstart", function() {
            onUpdate( {
              type:"ready",
              busy:"show"
            });

            _this.onReady();
          }, true);
          this.player.addEventListener( "loadeddata", function() {
            onUpdate( {
              type:"loaded",
              busy:"hide"
            });
          }, true);
          this.player.addEventListener( "loadedmetadata", function() {
            onUpdate( {
              type:"meta"
            } );
          }, true);
          this.player.addEventListener( "canplaythrough", function() {
            onUpdate( {
              type:"canplay",
              busy:"hide"
            });
          }, true);
          this.player.addEventListener( "ended", function() {
            onUpdate( {
              type:"complete"
            } );
          }, true);
          this.player.addEventListener( "pause", function() {
            onUpdate( {
              type:"paused"
            } );
          }, true);
          this.player.addEventListener( "play", function() {
            onUpdate( {
              type:"playing"
            } );
          }, true);
          this.player.addEventListener( "playing", function() {
            onUpdate( {
              type:"playing",
              busy:"hide"
            });
          }, true);
          this.player.addEventListener( "error", function(e) {
            _this.onError(e.target.error);
            onUpdate( {
              type:"error",
              code:e.target.error.code
            } );
          }, true);
          this.player.addEventListener( "waiting", function() {
            onUpdate( {
              type:"waiting",
              busy:"show"
            });
          }, true);
          this.player.addEventListener( "timeupdate", function() {
            if( timeupdated ) {
              onUpdate( {
                type:"timeupdate",
                busy:"hide"
              });
            }
            else {
              timeupdated = true;
            }
          }, true);
          this.player.addEventListener( "durationchange", function() {
            if( this.duration && (this.duration !== Infinity) ) {
              onUpdate( {
                type:"durationupdate",
                duration:this.duration
              });
            }
          }, true);

          // Now add the event for getting the progress indication.
          this.player.addEventListener( "progress", function( event ) {
            _this.bytesLoaded = event.loaded;
            _this.bytesTotal = event.total;
          }, true);

          this.player.autoplay = true;

          if (typeof this.player.hasAttribute == "function" && this.player.hasAttribute("preload") && this.player.preload != "none") {
            this.player.autobuffer = true;
          } else {
            this.player.autobuffer = false;
            this.player.preload = "none";
          }

          onUpdate({
            type:"playerready"
          });
        }
      };

      // A function to be called when an error occurs.
      this.onError = function( error ) {
        switch(error.code) {
          case 1:
            console.log("Error: MEDIA_ERR_ABORTED");
            break;
          case 2:
            console.log("Error: MEDIA_ERR_DECODE");
            break;
          case 3:
            console.log("Error: MEDIA_ERR_NETWORK");
            break;
          case 4:
            console.log("Error: MEDIA_ERR_SRC_NOT_SUPPORTED");
            break;
          default:
            break;
        }
      };

      // Called when the media has started loading.
      this.onReady = function() {
        if( !this.loaded ) {
          this.loaded = true;
          this.playMedia();
        }
      };

      // Load new media into the HTML5 player.
      this.loadMedia = function( mediaFile ) {
        this.mediaFile = mediaFile;
        this.createMedia( mediaFile );
      };

      this.getMediaType = function( mediaFile ) {
        var extension = (typeof mediaFile === 'array') ? mediaFile[0].extension : mediaFile.extension;
        switch( extension ) {
          case "ogg": case "ogv": case "mp4": case "m4v":
            return "video";

          case "oga": case "mp3":
            return "audio";

          default:
            break;
        }
        return "video";
      };

      this.playMedia = function() {
        if( this.player && this.player.play ) {
          this.player.play();
        }
      };

      this.pauseMedia = function() {
        if( this.player && this.player.pause ) {
          this.player.pause();
        }
      };

      this.stopMedia = function() {
        this.pauseMedia();
        if( this.player ) {
          this.player.src = "";
        }
      };

      this.destroy = function() {
        this.stopMedia();
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        if( this.player ) {
          this.player.currentTime = pos;
        }
      };

      this.setVolume = function( vol ) {
        if( this.player ) {
          this.player.volume = vol;
        }
      };

      this.getVolume = function() {
        return this.player ? this.player.volume : 0;
      };

      this.getDuration = function() {
        var dur = this.player ? this.player.duration : 0;
        return (dur === Infinity) ? 0 : dur;
      };

      this.getCurrentTime = function() {
        return this.player ? this.player.currentTime : 0;
      };

      this.getPercentLoaded = function() {
        if( this.player && this.player.buffered && this.player.duration ) {
          return (this.player.buffered.end(0) / this.player.duration);
        }
        else if( this.bytesTotal ) {
          return (this.bytesLoaded / this.bytesTotal);
        }
        else {
          return 0;
        }
      };

      // Called when the player resizes.
      this.onResize = function() {
        // If this is a video, set the width and height of the video element.
        if( this.mediaType == "video" ) {
          this.playerElement.css({width:this.display.width(), height:this.display.height()});
        }
      };

      // Not implemented yet...
      this.setQuality = function( quality ) {};
      this.getQuality = function() {
        return "";
      };
      this.hasControls = function() {
        return false;
      };
      this.showControls = function(show) {};
      //this.setSize = function( newWidth, newHeight ) {};
      this.getEmbedCode = function() {

        // Only return the Flash embed if this is a Flash playable media field.
        if( (this.mediaFile.extension == 'mp4') ||
            (this.mediaFile.extension == 'm4v') ||
            (this.mediaFile.extension == 'webm') ) {
          var flashVars = {
            config:"config",
            id:"mediafront_player",
            file:this.mediaFile.path,
            image:this.preview,
            skin:options.skin
          };
          if( this.mediaFile.stream ) {
            flashVars.stream = this.mediaFile.stream;
          }
          return jQuery.media.utils.getFlash(
            options.flashPlayer,
            "mediafront_player",
            options.embedWidth,
            options.embedHeight,
            flashVars,
            options.wmode );
        }
        else {
          return "This media does not support embedding.";
        }
      };
      this.getMediaLink = function() {
        return "This media currently does not have a link.";
      };
    })( this, options, onUpdate );
  };
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

  

  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    logo:"logo.png",
    logoWidth:49,
    logoHeight:15,
    logopos:"sw",
    logox:5,
    logoy:5,
    link:"http://www.mediafront.org",
    file:"",
    image:"",
    timeout:8,
    autoLoad:true
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    busy:"#mediabusy",
    preview:"#mediapreview",
    play:"#mediaplay",
    media:"#mediadisplay"
  });

  jQuery.fn.minplayer = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( player, settings ) {
      // Get the settings.
      settings = jQuery.media.utils.getSettings(settings);

      // Save the jQuery display.
      this.display = player;
      var _this = this;

      // If the player should auto load or not.
      this.autoLoad = settings.autoLoad;

      // Store the busy cursor and data.
      this.busy = player.find( settings.ids.busy );
      this.busyImg = this.busy.find("img");
      this.busyWidth = this.busyImg.width();
      this.busyHeight = this.busyImg.height();

      // Store the play overlay.
      this.play = player.find( settings.ids.play );
      // Toggle the play/pause state if they click on the play button.
      this.play.unbind("click").bind("click", function() {
        _this.togglePlayPause();
      });
      this.playImg = this.play.find("img");
      this.playWidth = this.playImg.width();
      this.playHeight = this.playImg.height();

      // Store the preview image.
      this.preview = player.find( settings.ids.preview ).mediaimage();
      if( this.preview ) {
        this.preview.display.unbind("click").bind("click", function() {
          _this.onMediaClick();
        });

        this.preview.display.unbind("imageLoaded").bind("imageLoaded", function() {
          _this.onPreviewLoaded();
        });
      }

      // The internal player controls.
      this.usePlayerControls = false;
      this.busyFlags = 0;
      this.busyVisible = false;
      this.playVisible = false;
      this.previewVisible = false;
      this.playing = false;
      this.hasMedia = false;
      this.timeoutId = 0;

      // Cache the width and height.
      this.width = this.display.width();
      this.height = this.display.height();

      // Hide or show an element.
      this.showElement = function( element, show, tween ) {
        if( element && !this.usePlayerControls ) {
          if( show ) {
            element.show(tween);
          }
          else {
            element.hide(tween);
          }
        }
      };

      this.showPlay = function( show, tween ) {
        show &= this.hasMedia;
        this.playVisible = show;
        this.showElement( this.play, show, tween );
      };

      this.showBusy = function( id, show, tween ) {
        if( show ) {
          this.busyFlags |= (1 << id);
        }
        else {
          this.busyFlags &= ~(1 << id);
        }

        // Set the busy cursor visiblility.
        this.busyVisible = (this.busyFlags > 0);
        this.showElement( this.busy, this.busyVisible, tween );

        // If the media has finished loading, then we don't need the
        // loader for the image.
        if (id==1 && !show) {
          this.showBusy(3, false);
        }
      };

      this.showPreview = function( show, tween ) {
        this.previewVisible = show;
        if( this.preview ) {
          this.showElement( this.preview.display, show, tween );
        }
      };

      // Handle the control events.
      this.onControlUpdate = function( data ) {
        if( this.media ) {
          // If the player is ready.
          if( this.media.playerReady ) {
            switch( data.type ) {
              case "play":
                this.media.player.playMedia();
                break;
              case "pause":
                this.media.player.pauseMedia();
                break;
              case "seek":
                this.media.player.seekMedia( data.value );
                break;
              case "volume":
                this.media.setVolume( data.value );
                break;
              case "mute":
                this.media.mute( data.value );
                break;
              default:
                break;
            }
          }
          // If there are files in the queue but no current media file.
          else if( (this.media.playQueue.length > 0) && !this.media.mediaFile ) {
            // They interacted with the player.  Always autoload at this point on.
            this.autoLoad = true;

            // Then play the next file in the queue.
            this.playNext();
          }

          // Let the template do something...
          if( settings.template && settings.template.onControlUpdate ) {
            settings.template.onControlUpdate( data );
          }
        }
      };

      // Handle the full screen event requests.
      this.fullScreen = function( full ) {
        if( settings.template.onFullScreen ) {
          settings.template.onFullScreen( full );
        }

        // Refresh the preview image.
        this.preview.refresh();
      };

      // Handle when the preview image loads.
      this.onPreviewLoaded = function() {
        this.previewVisible = true;
      };

      // Handle the media events.
      this.onMediaUpdate = function( data ) {
        switch( data.type ) {
          case "paused":
            this.playing = false;
            this.showPlay(true);
            //this.showBusy(1, false);
            if( !this.media.loaded ) {
              this.showPreview(true);
            }
            break;
          case "update":
          case "playing":
            this.playing = true;
            this.showPlay(false);
            this.showPreview((this.media.mediaFile.type == "audio"));
            break;
          case "initialize":
            this.playing = false;
            this.showPlay(true);
            this.showBusy(1, this.autoLoad);
            this.showPreview(true);
            break;
          case "buffering":
            this.showPlay(true);
            this.showPreview((this.media.mediaFile.type == "audio"));
            break;
          default:
            break;
        }

        // If they provide a busy cursor.
        if( data.busy ) {
          this.showBusy(1, (data.busy == "show"));
        }
      };

      // Called when the media is clicked.
      this.onMediaClick = function() {
        if( this.media.player && !this.media.hasControls() ) {
          if( this.playing ) {
            this.media.player.pauseMedia();
          }
          else {
            this.media.player.playMedia();
          }
        }
      };

      // Set the media player.
      this.media = this.display.find( settings.ids.media ).mediadisplay( settings );
      if( this.media ) {
        // If they click on the media region, then pause the media.
        this.media.display.unbind("click").bind("click", function() {
          _this.onMediaClick();
        });
      }

      // Sets the logo position.
      this.setLogoPos = function() {
        if( this.logo ) {
          var logocss = {};
          if( settings.logopos=='se' || settings.logopos=='sw' ) {
            logocss['bottom'] = settings.logoy;
          }
          if( settings.logopos=='ne' || settings.logopos=='nw' ) {
            logocss['top'] = settings.logoy;
          }
          if( settings.logopos=='nw' || settings.logopos=='sw' ) {
            logocss['left'] = settings.logox;
          }
          if( settings.logopos=='ne' || settings.logopos=='se' ) {
            logocss['right'] = settings.logox;
          }
          this.logo.display.css(logocss);
        }
      };

      // Add the logo.
      if( !settings.controllerOnly ) {
        this.display.prepend('<div class="' + settings.prefix + 'medialogo"></div>');
        this.logo = this.display.find("." + settings.prefix + "medialogo").mediaimage( settings.link );
        if( this.logo ) {
          this.logo.display.css({
            width:settings.logoWidth,
            height:settings.logoHeight
            });
          this.logo.display.bind("imageLoaded", function() {
            _this.setLogoPos();
          });
          this.logo.loadImage( settings.logo );
        }
      }

      // Reset to previous state...
      this.reset = function() {
        this.hasMedia = false;
        this.playing = false;
        jQuery.media.players[settings.id].showNativeControls(false);
        this.showPlay(true);
        this.showPreview(true);
        clearTimeout( this.timeoutId );
        if( this.media ) {
          this.media.reset();
        }
      };

      // Toggle the play/pause state.
      this.togglePlayPause = function() {
        if( this.media ) {
          if( this.media.playerReady ) {
            if( this.playing ) {
              this.showPlay(true);
              this.media.player.pauseMedia();
            }
            else {
              this.showPlay(false);
              this.media.player.playMedia();
            }
          }
          else if( (this.media.playQueue.length > 0) && !this.media.mediaFile ) {
            // They interacted with the player.  Always autoload at this point on.
            this.autoLoad = true;

            // Then play the next file in the queue.
            this.playNext();
          }
        }
      };

      // Loads an image...
      this.loadImage = function( image ) {
        if( this.preview ) {
          // Show a busy cursor for the image loading...
          this.showBusy(3, true);

          // Load the image.
          this.preview.loadImage( image );

          // Set and interval to check if the image is loaded.
          var imageInterval = setInterval(function() {

            // If the image is loaded, then clear the interval.
            if (_this.preview.loaded()) {

              // Clear the interval and stop the busy cursor.
              clearInterval(imageInterval);
              _this.showBusy(3, false);
            }
          }, 500);

          // Now set the preview image in the media player.
          if( this.media ) {
            this.media.preview = image;
          }
        }
      };

      this.onResize = function() {
        if( this.preview ) {
          this.preview.refresh();
        }

        if( this.media ) {
          this.media.onResize();
        }
      };

      // Clears the loaded image.
      this.clearImage = function() {
        if( this.preview ) {
          this.preview.clear();
        }
      };

      // Expose the public load functions from the media display.
      this.loadFiles = function( files ) {
        this.reset();
        this.hasMedia = this.media && this.media.loadFiles(files);
        if( this.hasMedia && this.autoLoad ) {
          this.media.playNext();
        }
        else if( !this.hasMedia ) {
          // Hide the overlays for non-media types.
          this.showPlay(false);
          this.showPreview(true);
          this.timeoutId = setTimeout( function() {
            _this.media.display.trigger( "mediaupdate", {type:"complete"} );
          }, (settings.timeout * 1000) );
        }
        return this.hasMedia;
      };

      // Play the next file.
      this.playNext = function() {
        if( this.media ) {
          this.media.playNext();
        }
      };

      // Check the player for controls.
      this.hasControls = function() {
        if( this.media ) {
          return this.media.hasControls();
        }
        return true;
      };

      // Show the native controls.
      this.showControls = function( show ) {
        if( this.media ) {
          this.media.showControls( show );
        }
      };

      // Loads a single media file.
      this.loadMedia = function( file ) {
        this.reset();
        if( this.media ) {
          this.media.loadMedia( file );
        }
      };

      // If they provide a file, then load it.
      if( settings.file ) {
        this.loadMedia( settings.file );
      }

      // If they provide the image, then load it.
      if( settings.image ) {
        this.loadImage( settings.image );
      }
    })( this, settings );
  };
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

  

  // Called when the YouTube player is ready.
  window.onYouTubePlayerReady = function( playerId ) {
    playerId = playerId.replace(/\_media$/, "");
    jQuery.media.players[playerId].node.player.media.player.onReady();
  };

  // Tell the media player how to determine if a file path is a YouTube media type.
  jQuery.media.playerTypes = jQuery.extend( jQuery.media.playerTypes, {
    "youtube":function( file ) {
      return (file.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i) === 0);
    }
  });

  jQuery.fn.mediayoutube = function( options, onUpdate ) {
    return new (function( video, options, onUpdate ) {
      this.display = video;
      var _this = this;
      this.player = null;
      this.videoFile = null;
      this.loaded = false;
      this.ready = false;
      this.qualities = [];

      this.createMedia = function( videoFile, preview ) {
        this.videoFile = videoFile;
        this.ready = false;
        var playerId = (options.id + "_media");
        var rand = Math.floor(Math.random() * 1000000);
        var flashPlayer = 'http://www.youtube.com/apiplayer?rand=' + rand + '&amp;version=3&amp;enablejsapi=1&amp;playerapiid=' + playerId;
        jQuery.media.utils.insertFlash(
          this.display,
          flashPlayer,
          playerId,
          "100%",
          "100%",
          {},
          options.wmode,
          function( obj ) {
            _this.player = obj;
            _this.loadPlayer();
          }
          );
      };

      this.getId = function( path ) {
        var regex = /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
        return (path.search(regex) === 0) ? path.replace(regex, "$2") : path;
      };

      this.loadMedia = function( videoFile ) {
        if( this.player ) {
          this.loaded = false;
          this.videoFile = videoFile;

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          } );

          // Load our video.
          if (this.player.loadVideoById) {
            this.player.loadVideoById( this.getId( this.videoFile.path ), 0, options.quality );
          }
        }
      };

      // Called when the player has finished loading.
      this.onReady = function() {
        this.ready = true;
        this.loadPlayer();
      };

      // Try to load the player.
      this.loadPlayer = function() {
        if( this.ready && this.player ) {
          // Create our callback functions.
          window[options.id + 'StateChange'] = function( newState ) {
            _this.onStateChange( newState );
          };

          window[options.id + 'PlayerError'] = function( errorCode ) {
            _this.onError( errorCode );
          };

          window[options.id + 'QualityChange'] = function( newQuality ) {
            _this.quality = newQuality;
          };

          // Add our event listeners.
          if (this.player.addEventListener) {
            this.player.addEventListener('onStateChange', options.id + 'StateChange');
            this.player.addEventListener('onError', options.id + 'PlayerError');
            this.player.addEventListener('onPlaybackQualityChange', options.id + 'QualityChange');
          }

          // Get all of the quality levels.
          if (this.player.getAvailableQualityLevels) {
            this.qualities = this.player.getAvailableQualityLevels();
          }

          // Let them know the player is ready.
          onUpdate( {
            type:"playerready"
          });

          // Load our video.
          if (this.player.loadVideoById) {
            this.player.loadVideoById( this.getId( this.videoFile.path ), 0 );
          }
        }
      };

      // Called when the YouTube player state changes.
      this.onStateChange = function( newState ) {
        var playerState = this.getPlayerState( newState );
        onUpdate( {
          type:playerState.state,
          busy:playerState.busy
        } );

        if( !this.loaded && playerState == "playing" ) {
          // Set this player to loaded.
          this.loaded = true;

          // Update our meta data.
          onUpdate( {
            type:"meta"
          } );
        }
      };

      // Called when the YouTube player has an error.
      this.onError = function( errorCode ) {
        var errorText = "An unknown error has occured: " + errorCode;
        if( errorCode == 100 ) {
          errorText = "The requested video was not found.  ";
          errorText += "This occurs when a video has been removed (for any reason), ";
          errorText += "or it has been marked as private.";
        } else if( (errorCode == 101) || (errorCode == 150) ) {
          errorText = "The video requested does not allow playback in an embedded player.";
        }
        if( window.console && console.log ) {
          console.log(errorText);
        }
        onUpdate( {
          type:"error",
          data:errorText
        } );
      };

      // Translates the player state for the YouTube API player.
      this.getPlayerState = function( playerState ) {
        switch (playerState) {
          case 5:
            return {state:'ready', busy:false};
          case 3:
            return {state:'buffering', busy:"show"};
          case 2:
            return {state:'paused', busy:"hide"};
          case 1:
            return {state:'playing', busy:"hide"};
          case 0:
            return {state:'complete', busy:false};
          case -1:
            return {state:'stopped', busy:false};
          default:
            return {state:'unknown', busy:false};
        }
        return 'unknown';
      };
      /*
      this.setSize = function( newWidth, newHeight ) {
      //this.player.setSize(newWidth, newHeight);
      };
      */
      this.playMedia = function() {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        if (this.player.playVideo) {
          this.player.playVideo();
        }
      };

      this.pauseMedia = function() {
        if (this.player.pauseVideo) {
          this.player.pauseVideo();
        }
      };

      this.stopMedia = function() {
        if (this.player.stopVideo) {
          this.player.stopVideo();
        }
      };

      this.destroy = function() {
        this.stopMedia();
        jQuery.media.utils.removeFlash( this.display, (options.id + "_media") );
        this.display.children().remove();
      };

      this.seekMedia = function( pos ) {
        onUpdate({
          type:"buffering",
          busy:"show"
        });
        if (this.player.seekTo) {
          this.player.seekTo( pos, true );
        }
      };

      this.setVolume = function( vol ) {
        if (this.player.setVolume) {
          this.player.setVolume( vol * 100 );
        }
      };

      this.setQuality = function( quality ) {
        if (this.player.setPlaybackQuality) {
          this.player.setPlaybackQuality( quality );
        }
      };

      this.getVolume = function() {
        return this.player.getVolume ? (this.player.getVolume() / 100) : 0;
      };

      this.getDuration = function() {
        return this.player.getDuration ? this.player.getDuration() : 0;
      };

      this.getCurrentTime = function() {
        return this.player.getCurrentTime ? this.player.getCurrentTime() : 0;
      };

      this.getQuality = function() {
        return this.player.getPlaybackQuality ? this.player.getPlaybackQuality() : 0;
      };

      this.getEmbedCode = function() {
        return this.player.getVideoEmbedCode ? this.player.getVideoEmbedCode() : 0;
      };

      this.getMediaLink = function() {
        return this.player.getVideoUrl ? this.player.getVideoUrl() : 0;
      };

      this.getBytesLoaded = function() {
        return this.player.getVideoBytesLoaded ? this.player.getVideoBytesLoaded() : 0;
      };

      this.getBytesTotal = function() {
        return this.player.getVideoBytesTotal ? this.player.getVideoBytesTotal() : 0;
      };

      this.hasControls = function() {
        return false;
      };
      this.showControls = function(show) {};
    })( this, options, onUpdate );
  };
})(jQuery);