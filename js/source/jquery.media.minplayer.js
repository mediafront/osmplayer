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
      timeout:2000,
      autoLoad:true
   }); 

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      busy:"#mediabusy",
      preview:"#mediapreview",
      play:"#mediaplay",
      media:"#mediadisplay",
      control:"#mediacontrol"                 
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

         // Our attached controller.
         this.controller = null;
         
         // The active controller.
         this.activeController = null;

         // Store the busy cursor and data.
         this.busy = player.find( settings.ids.busy ); 
         this.busyImg = this.busy.find("img");
         this.busyWidth = this.busyImg.width();
         this.busyHeight = this.busyImg.height();
         
         // Store the play overlay.
         this.play = player.find( settings.ids.play );
         // Toggle the play/pause state if they click on the play button.
         this.play.bind("click", function() {
            _this.togglePlayPause();
         });
         this.playImg = this.play.find("img");
         this.playWidth = this.playImg.width();
         this.playHeight = this.playImg.height();
         
         // Store the preview image.
         this.preview = null;
         
         // The internal player controls.
         this.usePlayerControls = false;
         this.busyFlags = 0;
         this.playVisible = false;
         this.previewVisible = false;
         this.controllerVisible = true;
         this.hasMedia = false;
         this.playing = false;         
         
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
            this.showElement( this.busy, (this.busyFlags > 0), tween );
         }; 
         
         this.showPreview = function( show, tween ) {
            this.previewVisible = show;
            if( this.preview ) {
               this.showElement( this.preview.display, show, tween );      
            }                 
         };

         this.showController = function( show, tween ) {
            this.controllerVisible = show;
            if( this.controller ) {
               this.showElement( this.controller.display, show, tween ); 
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
                        this.media.player.setVolume( data.value );
                        break;
                     case "mute":
                        this.media.mute( data.value );
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
         };
         
         // Handle when the preview image loads.
         this.onPreviewLoaded = function() {
            this.previewVisible = true;
         // If we don't have any media, then we will assume that they
         // just want an image viewer.  Trigger a complete event after the timeout
         // interval.
         /* Doesn't quite work... need to investigate further.
            if( !this.hasMedia ) {
               setTimeout( function() {
                  _this.display.trigger("mediaupdate", {type:"complete"});
               }, settings.timeout );
            }
            */
         };
         
         // Handle the media events.
         this.onMediaUpdate = function( data ) {
            switch( data.type ) {
               case "paused":
                  this.playing = false;
                  this.showPlay(true);
                  this.showBusy(1, false);
                  break;
               case "playing":
                  this.playing = true;
                  this.showPlay(false);
                  this.showBusy(1, false);
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
                  this.showBusy(1, true);
                  this.showPreview((this.media.mediaFile.type == "audio"));
                  break;                 
            }
            
            // Update our controller.
            if( this.controller ) {
               this.controller.onMediaUpdate( data );
            }
            
            // Update our active controller.
            if( this.activeController ) {
               this.activeController.onMediaUpdate( data );
            }
            
            // Let the template do something...
            if( settings.template && settings.template.onMediaUpdate ) {
               settings.template.onMediaUpdate( data );
            }
         };
         
         // Allow mulitple controllers to control this media.
         this.addController = function( newController, active ) {
            if( newController ) {
               newController.display.bind( "controlupdate", newController, function( event, data ) {
                  _this.activeController = event.data;
                  _this.onControlUpdate( data );
               });
               
               if( active && !this.activeController ) {
                  this.activeController = newController;   
               }
            }
            return newController;
         };

         // Set the media player.
         this.media = this.display.find( settings.ids.media ).mediadisplay( settings ); 
         if( this.media ) {
            this.media.display.bind( "mediaupdate", function( event, data ) {
               _this.onMediaUpdate( data );            
            });

            // Toggle the play/pause state if they click on the display.
            this.media.display.bind("click", function() {
               _this.togglePlayPause();
            });
         }
         
         // Add the control bar to the media.
         this.controller = this.addController( this.display.find( settings.ids.control ).mediacontrol( settings ), false ); 
         
         // Now add any queued controllers...
         if( jQuery.media.controllers[settings.id] ) {
            var controllers = jQuery.media.controllers[settings.id];
            var i = controllers.length;
            while(i--) {
               this.addController( controllers[i], true );
            }
         }
         
         // Set the size of this media player.
         this.setSize = function( newWidth, newHeight ) {
            this.width = newWidth ? newWidth : this.width;
            this.height = newHeight ? newHeight : this.height; 

            if( this.width && this.height ) {
               // Set the position of the logo.
               this.setLogoPos();

               // Resize the preview image.
               if( this.preview ) {
                  this.preview.resize( this.width, this.height );   
               }           
               
               // Resize the busy symbol.
               this.busy.css({
                  width:this.width,
                  height:this.height
                  });
               this.busyImg.css({
                  marginLeft:((this.width - this.busyWidth)/2) + "px", 
                  marginTop:((this.height - this.busyHeight)/2) + "px" 
               });

               // Resize the play symbol.
               this.play.css({
                  width:this.width,
                  height:this.height
                  });
               this.playImg.css({
                  marginLeft:((this.width - this.playWidth)/2) + "px", 
                  marginTop:((this.height - this.playHeight)/2) + "px" 
               });            
               
               // Resize the media.
               if( this.media ) {
                  this.media.display.css({
                     width:this.width,
                     height:this.height
                     });
                  this.media.setSize( this.width, this.height );
               }
            }
         };
         
         // Function to show the built in controls or not.
         this.showPlayerController = function( show ) {
            if( this.media && this.media.hasControls() ) {
               this.usePlayerControls = show;
               if( show ) {
                  this.busy.hide();
                  this.play.hide();
                  if( this.preview ) {
                     this.preview.display.hide();
                  }
                  if( this.controller ) {
                     this.controller.display.hide();
                  }
               }
               else {
                  this.showBusy( 1, ((this.busyFlags & 0x2) == 0x2) );
                  this.showPlay( this.playVisible );
                  this.showPreview( this.previewVisible );
                  this.showController( this.controllerVisible );
               }
               this.media.showControls( show );
            }
         };
         
         // Add the logo.
         if( this.media ) {
            this.display.prepend('<div class="medialogo"></div>');
            this.logo = this.display.find(".medialogo").mediaimage( settings.link );
            this.logo.display.css({
               position:"absolute",
               zIndex:490
            });
            this.logo.width = settings.logoWidth;
            this.logo.height = settings.logoHeight;
            this.logo.loadImage( settings.logo );
         }

         // Sets the logo position.
         this.setLogoPos = function() {
            if( this.logo ) {
               var mediaTop = parseInt(this.media.display.css("marginTop"), 0);
               var mediaLeft = parseInt(this.media.display.css("marginLeft"), 0);
               var marginTop = (settings.logopos=="se" || settings.logopos=="sw") ? (mediaTop + this.height - this.logo.height - settings.logoy) : mediaTop + settings.logoy;
               var marginLeft = (settings.logopos=="ne" || settings.logopos=="se") ? (mediaLeft + this.width - this.logo.width - settings.logox) : mediaLeft + settings.logox;
               this.logo.display.css({
                  marginTop:marginTop,
                  marginLeft:marginLeft
               });
            }            
         };

         this.onResize = function( deltaX, deltaY ) {                     
            // Resize the attached control region.
            if( this.controller ) {
               this.controller.onResize( deltaX, deltaY );  
            }
            
            // Resize the media region.     
            this.setSize( this.width + deltaX, this.height + deltaY );
         };
         
         // Reset to previous state...
         this.reset = function() {
            this.hasMedia = false;
            this.playing = false;
            if( this.controller ) {
               this.controller.reset();   
            }
            if( this.activeController ) {
               this.activeController.reset();   
            }

            this.showBusy(1, this.autoLoad);
            
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
            this.preview = player.find( settings.ids.preview ).mediaimage();

            if( this.preview ) {
               // Set the size of the preview.
               this.preview.resize( this.width, this.height );

               // Bind to the image loaded event.
               this.preview.display.bind("imageLoaded", function() {
                  _this.onPreviewLoaded();
               });

               // Load the image.
               this.preview.loadImage( image );

               // Now set the preview image in the media player.
               if( this.media ) {
                  this.media.preview = image;
               }
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
            if( this.media && this.media.loadFiles( files ) && this.autoLoad ) {
               this.media.playNext();
            }
         };
         
         // Play the next file.
         this.playNext = function() {
            if( this.media ) {
               this.media.playNext();
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