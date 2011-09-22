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
        show &= this.hasMedia;

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
        this.showBusy(1, false);
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
          this.showBusy(1, false);
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
})(jQuery);