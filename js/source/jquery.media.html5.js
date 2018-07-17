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
})(jQuery);