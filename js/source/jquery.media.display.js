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
         this.volume = 0;
         this.player = null;
         this.preview = '';
         this.reflowInterval = null;
         this.updateInterval = null;
         this.progressInterval = null;
         this.playQueue = [];
         this.playIndex = 0;
         this.playerReady = false;
         this.loaded = false;
         this.mediaFile = null; 
         this.width = 0;
         this.height = 0;

         // If they provide the forceOverflow variable, then that means they
         // wish to force the media player to override all parents overflow settings.
         if( this.settings.forceOverflow ) {
            // Make sure that all parents have overflow visible so that
            // browser full screen will always work.
            this.display.parents().css("overflow", "visible");
         }   
         
         // Set the size of this media display region.
         this.setSize = function( newWidth, newHeight ) {
            this.width = newWidth ? newWidth : this.width;
            this.height = newHeight ? newHeight : this.height;
            
            // Set the width and height of this media region.
            this.display.css({
               height:this.height + "px",
               width:this.width + "px"
            });
            
            // Now resize the player.
            if( this.playerReady && this.width && this.height ) {
               this.player.player.width = this.width;
               this.player.player.height = this.height;               
               this.player.setSize( newWidth, this.height );
            }                       
         };    
         
         this.reset = function() {
            this.loaded = false;
            clearInterval( this.progressInterval );
            clearInterval( this.updateInterval );
            clearTimeout( this.reflowInterval );  
            this.playQueue.length = 0;                                  
            this.playQueue = [];
            this.playIndex = 0;
            this.playerReady = false;
            this.mediaFile = null;             
         };         
         
         this.resetContent = function() {
            this.display.empty();
            this.display.append( this.template );
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
            return (this.playQueue.length > 0);
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
            else {
               this.reset();
            }
         };
         
         this.loadMedia = function( file ) {
            if( file ) {
               // Get the media file object.
               file = new jQuery.media.file( this.getMediaFile( file ), this.settings );
               
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
                     
                     // Reflow the player if it does not show up.
                     this.startReflow();
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
                  clearTimeout( this.reflowInterval );
                  this.player.setVolume(0);
                  this.startProgress();
                  break;
               case "buffering":
                  this.startProgress();
                  break;
               case "stopped":
                  clearInterval( this.progressInterval );
                  clearInterval( this.updateInterval );
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
               case "update":
               case "meta":
                  jQuery.extend( data, {
                     currentTime:this.player.getCurrentTime(), 
                     totalTime:this.getDuration(),
                     volume: this.player.getVolume(),
                     quality: this.getQuality()
                  });
                  break;
               case "complete":
                  this.playNext();
                  break;                   
            }
            
            // If this is the playing state, we want to pause the video.
            if( data.type=="playing" && !this.loaded ) {
               this.loaded = true;
               this.player.setVolume( (this.settings.volume / 100) );
               if( this.settings.autoLoad && !this.settings.autostart ) {
                  this.player.pauseMedia();
                  this.settings.autostart = true;
               }
               else {
                  this.display.trigger( "mediaupdate", data ); 
               }
            } 
            else {
               this.display.trigger( "mediaupdate", data );  
            }
         };

         this.reflowPlayer = function() {
            // Store the CSS state before the reflow...
            var displayCSS = {
               marginLeft:parseInt( this.display.css("marginLeft"), 10 ),
               height:this.display.css("height")
            };

            // Is the margin-left positive?
            var isPositive = (displayCSS.marginLeft >=0);

            // Now reflow the player by setting the margin-left value.  If the player
            // has a margin-left value ( typically means it is off the screen ), then
            // we need to give it a positive CSS value to trigger a reflow event.
            this.display.css({
               marginLeft:(isPositive ? (displayCSS.marginLeft+1) : 0),
               height:(isPositive ? displayCSS.height : 0)
            });

            // Now set a timeout to set everything back 1ms later.
            setTimeout( function() {

               // Restore the display state.
               _this.display.css(displayCSS);
            }, 1 );
         };

         this.startReflow = function() {
            clearTimeout( this.reflowInterval );
            this.reflowInterval = setTimeout( function() {
               // If the player does not register after two seconds, try a reflow.
               _this.reflowPlayer();
            }, 2000 );      
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
                     _this.onMediaUpdate( {
                        type:"update"
                     } );
                  }
               }, 1000 );   
            }
         };

         this.stopMedia = function() { 
            this.loaded = false;
            clearInterval( this.progressInterval );
            clearInterval( this.updateInterval );
            clearTimeout( this.reflowInterval );             
            if( this.playerReady ) {
               this.player.stopMedia();
            }              
         };        
         
         this.mute = function( on ) {
            if( on ) {
               this.volume = this.player.getVolume();   
               this.player.setVolume( 0 );
            }
            else {
               this.player.setVolume( this.volume );
            }
         };
         
         this.getPercentLoaded = function() {
            var bytesLoaded = this.player.getBytesLoaded();
            var bytesTotal = this.mediaFile.bytesTotal ? this.mediaFile.bytesTotal : this.player.getBytesTotal();
            return bytesTotal ? (bytesLoaded / bytesTotal) : 0;       
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
            if( !this.mediaFile.duration ) {
               this.mediaFile.duration = this.player.getDuration();
            } 
            return this.mediaFile.duration;           
         };                
         
         this.getQuality = function() {
            if( !this.mediaFile.quality ) {
               this.mediaFile.quality = this.player.getQuality();
            }
            return this.mediaFile.quality;      
         };  
         
         this.setSize( this.display.width(), this.display.height() );
      })( this, options );
   };
})(jQuery);