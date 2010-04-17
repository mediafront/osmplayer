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
      embedHeight:337
   }); 

   jQuery.fn.mediadisplay = function( settings ) {  
      if( this.length === 0 ) { return null; }
      return new (function( mediaWrapper, settings ) {
         settings = jQuery.media.utils.getSettings( settings ); 
         this.display = mediaWrapper;
         var _this = this;
         this.volume = 0;
         this.player = null;
         this.reflowInterval = null;
         this.updateInterval = null;
         this.progressInterval = null;
         this.playQueue = []; 
         this.playerReady = false;
         this.loaded = false;
         this.mediaFile = null; 
         this.width = 0;
         this.height = 0;
         
         this.checkPlayType = function( elem, playType ) {
            if( (typeof elem.canPlayType) == 'function' ) { 
               return ("no" != elem.canPlayType(playType)) && ("" != elem.canPlayType(playType));
            }
            else {
               return false;   
            }
         };
         
         // Get all the types of media that this browser can play.
         this.getPlayTypes = function() {
            var types = {};
            
            // Check for video types...
            var elem = document.createElement("video");
            types.ogg  = this.checkPlayType( elem, "video/ogg");  
            types.h264  = this.checkPlayType( elem, "video/mp4"); 
               
            // Now check for audio types...
            elem = document.createElement("audio");
            types.audioOgg = this.checkPlayType( elem, "audio/ogg");
            types.mp3 = this.checkPlayType( elem, "audio/mpeg");  
                            
            return types;            
         };
         this.playTypes = this.getPlayTypes();    
         
         // Set the size of this media display region.
         this.setSize = function( newWidth, newHeight ) {
            this.width = newWidth ? newWidth : this.width;
            this.height = newHeight ? newHeight : this.height;
            
            // Set the width and height of this media region.
            this.display.css({height:this.height + "px", width:this.width + "px"});  
            
            // Now resize the player.
            if( this.playerReady && this.width && this.height ) {
               this.player.player.width = this.width;
               this.player.player.height = this.height;               
               this.player.setSize( newWidth, this.height );
            }                       
         };    
         
         this.resetContent = function() {
            this.display.empty();
            this.display.append( this.template );
         };
         
         this.addToQueue = function( file ) {
            if( file ) {
               this.playQueue.push( file );
            }
         };
         
         this.loadFiles = function( files ) {
            if( files ) {
               this.playQueue.length = 0;
               this.addToQueue( files.intro );
               this.addToQueue( files.commercial );
               this.addToQueue( files.prereel );
               this.addToQueue( files.media );
               this.addToQueue( files.postreel ); 
            }
            return (this.playQueue.length > 0);
         };        
         
         this.playNext = function() {
            if( this.playQueue.length > 0 ) {
               this.loadMedia( this.playQueue.shift() );
            }
         };
         
         this.loadMedia = function( file ) {
            if( file ) {
               // Get the media file object.
               file = this.getMediaFile( file );
               
               // Stop the current player.
               this.stopMedia();  
               
               if( !this.mediaFile || (this.mediaFile.player != file.player) ) {
                  // Reset our player variables.
                  this.player = null;                                  
                  this.playerReady = false;                
                  
                  // Create a new media player.
                  if( file.player ) {                 
                     // Set the new media player.
                     this.player = this.display["media" + file.player]( settings, function( data ) {
                        _this.onMediaUpdate( data );                      
                     });
                  }
                  
                  // Create our media player.
                  this.player.createMedia( file ); 
                  
                  // Reflow the player if it does not show up.
                  this.startReflow();
               }   
               else if( this.player ) {
                  // Load our file into the current player.
                  this.player.loadMedia( file );                
               }
               
               // Save this file.
               this.mediaFile = file;
               
               // Send out an update about the initialize.
               this.onMediaUpdate({type:"initialize"});        
            }
         };      

         this.getMediaFile = function( file ) {
            var mFile = {};
            file = (typeof file === "string") ? {path:file} : file;
            mFile.duration = file.duration ? file.duration : 0;
            mFile.bytesTotal = file.bytesTotal ? file.bytesTotal : 0;
            mFile.quality = file.quality ? file.quality : 0;
            mFile.stream = settings.streamer ? settings.streamer : file.stream;
            mFile.path = file.path ? jQuery.trim(file.path) : ( settings.baseURL + jQuery.trim(file.filepath) );
            mFile.extension = file.extension ? file.extension : this.getFileExtension(mFile.path);
            mFile.player = file.player ? file.player : this.getPlayer(mFile.extension);
            mFile.type = file.type ? file.type : this.getType(mFile.extension);
            return mFile;       
         };
         
         // Get the file extension.
         this.getFileExtension = function( file ) {
            return file.substring(file.lastIndexOf(".") + 1).toLowerCase();
         };
         
         // Get the player for this media.
         this.getPlayer = function( extension ) {
            switch( extension )
            {
               case "ogg":case "ogv":
                  return this.playTypes.ogg ? "html5" : "flash";
               
               case "mp4":case "m4v":
                  return this.playTypes.h264 ? "html5" : "flash";               
               
               case "oga":
                  return this.playTypes.audioOgg ? "html5" : "flash";
                  
               case "mp3":
                  return this.playTypes.mp3 ? "html5" : "flash";
                  
               case "flv":case "f4v":case "mov":case "3g2":case "m4a":case "aac":case "wav":case "aif":case "wma":            
                  return "flash";  
            }           
            return "";
         };
         
         // Get the type of media this is...
         this.getType = function( extension ) {
            switch( extension ) {  
               case "ogg":case "ogv":case "mp4":case "m4v":case "flv":case "f4v":case "mov":case "3g2":
                  return "video";
               case "oga":case "mp3":case "m4a":case "aac":case "wav":case "aif":case "wma":
                  return "audio";
            }
         };

         this.onMediaUpdate = function( data ) {
            // Now trigger the media update message.
            switch( data.type ) {
               case "playerready":
                  this.playerReady = true;
                  clearTimeout( this.reflowInterval );
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
               this.player.setVolume( (settings.volume / 100) );
               if( !settings.autostart ) {
                  this.player.pauseMedia();
               }
               else {
                  this.display.trigger( "mediaupdate", data ); 
               }
            } 
            else {
               this.display.trigger( "mediaupdate", data );  
            }
         };

         this.startReflow = function() {
            clearTimeout( this.reflowInterval );
            this.reflowInterval = setTimeout( function() {
               // If the player does not register after two seconds, try to wiggle it... just a little bit!
               // No seriously... this is needed for Firefox in Windows for some odd reason.
               var marginLeft = parseInt( _this.display.css("marginLeft"), 10 );
               _this.display.css({marginLeft:(marginLeft+1)});
               setTimeout( function() {
                  _this.display.css({marginLeft:marginLeft});
               }, 1 );
            }, 2000 );      
         };         
         
         this.startProgress = function() {
            if( this.playerReady ) {
               clearInterval( this.progressInterval );
               this.progressInterval = setInterval( function() {
                  _this.onMediaUpdate( {type:"progress"} );
               }, 500 ); 
            }        
         };

         this.startUpdate = function() {
            if( this.playerReady ) {
               clearInterval( this.updateInterval );
               this.updateInterval = setInterval( function() {
                  if( _this.playerReady ) {
                     _this.onMediaUpdate( {type:"update"} );
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
      })( this, settings );
   };
})(jQuery);