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
  
   // Extend the media namespace
   jQuery.media = jQuery.extend( {}, {
      // Add the auto server object.
      auto : function( settings ) {
         // Return a new function for this object
         return new (function( settings ) {   
            this.json = jQuery.media.json( settings );
            this.rpc = jQuery.media.rpc( settings );  
            this.call = function( method, onSuccess, onFailed, params, protocol ) {
               if( protocol == "json" ) {
                  this.json.call( method, onSuccess, onFailed, params, protocol );
               }
               else {
                  this.rpc.call( method, onSuccess, onFailed, params, protocol );
               }     
            };
         })( settings );
      }
   }, jQuery.media );

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
         this.allowResize = true;
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
         this.seekUpdate = controlBar.find( settings.ids.seekUpdate ).css("width", "0px");
         this.seekProgress = controlBar.find( settings.ids.seekProgress ).css("width", "0px");
         this.seekBar = controlBar.find( settings.ids.seekBar ).mediaslider( settings.ids.seekHandle, false );
         this.seekBar.display.bind( "setvalue", function( event, data ) {
            _this.updateSeek( data );
            _this.display.trigger( "controlupdate", {
               type:"seek",
               value:(data * _this.duration)
            });
         });
         this.seekBar.display.bind( "updatevalue", function( event, data ) {
            _this.updateSeek( data );
         });

         this.updateSeek = function( value ) {
            this.seekUpdate.css( "width", (value * this.seekBar.trackSize) + "px" );
            this.currentTime.text( this.formatTime( value * this.duration ).time );
         };
         
         this.setVolume = function( vol ) {
            if( this.volumeBar ) {
               if( settings.volumeVertical ) {
                  this.volumeUpdate.css({
                     "marginTop":(this.volumeBar.handlePos + this.volumeBar.handleMid + this.volumeBar.handleOffset) + "px",
                     "height":(this.volumeBar.trackSize - this.volumeBar.handlePos) + "px"
                  });
               }
               else {
                  this.volumeUpdate.css( "width", (vol * this.volumeBar.trackSize) + "px" );
               }  
            }
         };
         
         // Set up the volume bar.
         this.volumeUpdate = controlBar.find( settings.ids.volumeUpdate );
         this.volumeBar = controlBar.find( settings.ids.volumeBar ).mediaslider( settings.ids.volumeHandle, settings.volumeVertical, settings.volumeVertical );
         if( this.volumeBar ) {
            this.volumeBar.display.bind("setvalue", function( event, data ) {
               _this.setVolume( data );
               _this.display.trigger( "controlupdate", {
                  type:"volume",
                  value:data
               });
            });
            this.volumeBar.display.bind("updatevalue", function( event, data ) {
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
            if( this.seekProgress ) {
               this.seekProgress.css( "width", (percent * (this.seekBar.trackSize + this.seekBar.handleSize)) + "px" );
            }
         };

         this.onResize = function( deltaX, deltaY ) {
            if( this.allowResize ) {
               if( this.seekBar ) {
                  this.seekBar.onResize( deltaX, deltaY );
               }
               this.setProgress( this.percentLoaded );
            }
         };
         
         // Handle the media events...
         this.onMediaUpdate = function( data ) {
            switch( data.type ) {
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
            this.totalTime.text( this.formatTime( 0 ).time );
            if( this.seekBar ) {
               this.seekBar.updateValue(0);
            }
         };
         
         this.timeUpdate = function( cTime, tTime ) {
            this.duration = tTime;
            this.totalTime.text( this.formatTime( tTime ).time );
            if( tTime && !this.seekBar.dragging ) {
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
               this.display.width(), 
               this.display.height(),
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
            
            if( !(!this.meta && playerState =="stopped") ) {
               onUpdate( {
                  type:playerState
               } );
            }
            
            if( !this.loaded && playerState == "buffering" ) {
               this.loaded = true;
               onUpdate( {
                  type:"paused"
               } );
               if( options.autostart ) {
                  this.playMedia();
               }
            }
            
            if( !this.meta && playerState == "playing" ) {
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
            console.log(errorText);
            onUpdate( {
               type:"error",
               data:errorText
            } );
         };
         
         // Translates the player state for the  API player.
         this.getPlayerState = function( playerState ) {
            switch (playerState) {
               case 5:
                  return 'ready';
               case 3:
                  return 'buffering';
               case 2:
                  return 'paused';
               case 1:
                  return 'playing';
               case 0:
                  return 'complete';
               case -1:
                  return 'stopped';
               default:
                  return 'unknown';
            }
            return 'unknown';
         };                  
         
         this.setSize = function( newWidth, newHeight ) {             
            this.player.setSize(newWidth, newHeight);
         };           
         
         this.playMedia = function() {
            onUpdate({
               type:"buffering"
            });
            this.player.playVideo();
         };
         
         this.pauseMedia = function() {
            this.player.pauseVideo();           
         };
         
         this.stopMedia = function() {
            this.player.stopVideo();              
         };
         
         this.seekMedia = function( pos ) {
            onUpdate({
               type:"buffering"
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
      apiKey:"",
      api:2,
      sessid:"",
      drupalVersion:6         
   });

   // Extend the media namespace
   jQuery.media = jQuery.extend( {}, {
      // Add the drupal server object.
      drupal : function( protocol, settings ) {
         // Return a new server object.
         return new (function( protocol, settings ) {
            settings = jQuery.media.utils.getSettings(settings);
            var _this = this;
   
            var hasKey = (settings.apiKey.length > 0);
            var usesKey = (settings.api == 1);
            var nodeGet = (settings.drupalVersion >= 6) ? "node.get" : "node.load";
            var autoProtocol = (settings.protocol == "auto");
   
            // Set up the commands.
            jQuery.media = jQuery.extend( {}, {
               commands : {
                  connect:{command:{rpc:"system.connect", json:""}, useKey:usesKey, protocol:"rpc"},
                  mail:{command:{rpc:"system.mail", json:""}, useKey:hasKey, protocol:"rpc"},
                  loadNode:{command:{rpc:nodeGet, json:"mediafront_getnode"}, useKey:usesKey, protocol:"json"},
                  getPlaylist:{command:{rpc:"mediafront.getPlaylist", json:"mediafront_getplaylist"}, useKey:usesKey, protocol:"json"},
                  getVote:{command:{rpc:"vote.getVote", json:""}, useKey:usesKey, protocol:"rpc"},
                  setVote:{command:{rpc:"vote.setVote", json:""}, useKey:hasKey, protocol:"rpc"},
                  getUserVote:{command:{rpc:"vote.getUserVote", json:""}, useKey:usesKey, protocol:"rpc"},
                  deleteVote:{command:{rpc:"vote.deleteVote", json:""}, useKey:hasKey, protocol:"rpc"},
                  addTag:{command:{rpc:"tag.addTag", json:""}, useKey:hasKey, protocol:"rpc"},
                  incrementCounter:{command:{rpc:"mediafront.incrementNodeCounter", json:""}, useKey:hasKey, protocol:"rpc"},
                  setFavorite:{command:{rpc:"favorites.setFavorite", json:""}, useKey:hasKey, protocol:"rpc"},
                  deleteFavorite:{command:{rpc:"favorites.deleteFavorite", json:""}, useKey:hasKey, protocol:"rpc"},
                  isFavorite:{command:{rpc:"favorites.isFavorite", json:""}, useKey:usesKey, protocol:"rpc"},
                  login:{command:{rpc:"user.login", json:""}, useKey:hasKey, protocol:"rpc"},
                  logout:{command:{rpc:"user.logout", json:""}, useKey:hasKey, protocol:"rpc"},
                  adClick:{command:{rpc:"mediafront.adClick", json:""}, useKey:hasKey, protocol:"rpc"},
                  getAd:{command:{rpc:"mediafront.getAd", json:""}, useKey:usesKey, protocol:"rpc"},
                  setUserStatus:{command:{rpc:"mediafront.setUserStatus", json:""}, useKey:hasKey, protocol:"rpc"}
               }
            }, jQuery.media);
   
            // Public variables.
            this.user = {};
            this.sessionId = "";
            this.onConnected = null;
            this.encoder = new jQuery.media.sha256();
            
            // Cache this... it is a little processor intensive.   
            // The baseURL has an ending "/".   We need to truncate this, and then remove the "http://"
            this.baseURL = settings.baseURL.substring(0,(settings.baseURL.length - 1)).replace(/^(http[s]?\:[\\\/][\\\/])/,'');
            
            this.connect = function( onSuccess ) {
               this.onConnected = onSuccess;
               // If they provide the session Id, then we can skip this call.
               if( settings.sessid ) {
                  this.onConnect({sessid:settings.sessid});
               }
               else {
                  this.call( jQuery.media.commands.connect, function( result ) {
                     _this.onConnect( result );
                  }, null );
               }
            };
   
            this.call = function( command, onSuccess, onFailed ) {
               var args = [];              
               for (var i=3; i<arguments.length; i++) {
                  args.push(arguments[i]);
               }
               args = this.setupArgs( command, args );              
               var type = autoProtocol ? command.protocol : settings.protocol;
               var method = command.command[type];               
               if( method ) {
                  protocol.call( method, onSuccess, onFailed, args, type );
               }
               else if( onSuccess ) {
                  onSuccess( null );   
               }
            };
   
            this.setupArgs = function( command, args ) {
               args.unshift( this.sessionId );
               if ( command.useKey ) {
                  if( settings.api > 1 ) {
                     var timestamp = this.getTimeStamp();
                     var nonce = this.getNonce();
                     var hash = this.computeHMAC( timestamp, this.baseURL, nonce, command.command.rpc, settings.apiKey);
                     args.unshift( nonce );
                     args.unshift( timestamp );
                     args.unshift( this.baseURL );
                     args.unshift( hash );
                  }
                  else {
                     args.unshift( settings.apiKey );
                  }
               }
               return args;
            };
   
            this.getTimeStamp = function() {
               return (parseInt(new Date().getTime() / 1000, 10)).toString();
            };
   
            this.getNonce = function() {
               var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
               var randomString = '';
               for (var i=0; i<10; i++) {
                  var rnum = Math.floor(Math.random() * chars.length);
                  randomString += chars.substring(rnum,rnum+1);
               }
               return randomString;
            };
   
            this.computeHMAC = function( timestamp, baseURL, nonce, command, apiKey ) {
               var input = timestamp + ";" + baseURL + ";" + nonce + ";" + command;
               return this.encoder.encrypt( apiKey, input );
            };
   
            this.onConnect = function( result ) {
               if( result ) {
                  this.sessionId = result.sessid;
                  this.user = result.user;
               }
               if( this.onConnected ) {
                  this.onConnected( result );
               }
            };
         })( protocol, settings );
      }
   }, jQuery.media );
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

        
   
   // Checks the file type for browser compatibilty.
   jQuery.media.checkPlayType = function( elem, playType ) {
      if( (typeof elem.canPlayType) == 'function' ) { 
         return ("no" != elem.canPlayType(playType)) && ("" != elem.canPlayType(playType));
      }
      else {
         return false;   
      }
   };   
   
   // Get's all of the types that this browser can play.
   jQuery.media.getPlayTypes = function() {
      var types = {};
      
      // Check for video types...
      var elem = document.createElement("video");
      types.ogg  = jQuery.media.checkPlayType( elem, "video/ogg");  
      types.h264  = jQuery.media.checkPlayType( elem, "video/mp4");
      types.webm = jQuery.media.checkPlayType( elem, "video/x-webm");
         
      // Now check for audio types...
      elem = document.createElement("audio");
      types.audioOgg = jQuery.media.checkPlayType( elem, "audio/ogg");
      types.mp3 = jQuery.media.checkPlayType( elem, "audio/mpeg");  
                      
      return types;      
   };
   
   // The play types for the media player.
   jQuery.media.playTypes = null;
   
   // The constructor for our media file object.
   jQuery.media.file = function( file, settings ) {
      // Only set the play types if it has not already been set.
      if( !jQuery.media.playTypes ) {
         jQuery.media.playTypes = jQuery.media.getPlayTypes();
      }
      
      // Normalize the file object passed to this constructor.
      file = (typeof file === "string") ? {
         path:file
      } : file;      
      
      // The duration of the media file.
      this.duration = file.duration ? file.duration : 0;
      this.bytesTotal = file.bytesTotal ? file.bytesTotal : 0;
      this.quality = file.quality ? file.quality : 0;
      this.stream = settings.streamer ? settings.streamer : file.stream;
      this.path = file.path ? jQuery.trim(file.path) : ( settings.baseURL + jQuery.trim(file.filepath) );
      this.extension = file.extension ? file.extension : this.getFileExtension();
      this.weight = file.weight ? file.weight : this.getWeight();
      this.player = file.player ? file.player : this.getPlayer();
      this.mimetype = file.mimetype ? file.mimetype : this.getMimeType();
      this.type = file.type ? file.type : this.getType();      
   };

   // Get the file extension.
   jQuery.media.file.prototype.getFileExtension = function() {
      return this.path.substring(this.path.lastIndexOf(".") + 1).toLowerCase();
   };
   
   // Get the player for this media.
   jQuery.media.file.prototype.getPlayer = function() {
      switch( this.extension )
      {
         case "ogg":case "ogv":
            return jQuery.media.playTypes.ogg ? "html5" : "flash";
         
         case "mp4":case "m4v":
            return jQuery.media.playTypes.h264 ? "html5" : "flash";               
         
         case "webm":
            return jQuery.media.playTypes.webm ? "html5" : "flash";
         
         case "oga":
            return jQuery.media.playTypes.audioOgg ? "html5" : "flash";
            
         case "mp3":
            return jQuery.media.playTypes.mp3 ? "html5" : "flash";
            
         case "swf":case "flv":case "f4v":case "f4a":
         case "mov":case "3g2":case "3gp":case "3gpp":
         case "m4a":case "aac":case "wav":case "aif":
         case "wma":
            return "flash"; 
             
         default:
            // Now iterate through all of our registered players.
            for( var player in jQuery.media.playerTypes ) {
               if( jQuery.media.playerTypes.hasOwnProperty( player ) ) {
                  if( jQuery.media.playerTypes[player]( this.path ) ) {
                     return player;
                  }
               }
            }
      }           
      return "";
   };
   
   // Get the type of media this is...
   jQuery.media.file.prototype.getType = function() {
      switch( this.extension ) {  
         case"swf":case "webm":case "ogg":case "ogv":
         case "mp4":case "m4v":case "flv":case "f4v":
         case "mov":case "3g2":case "3gp":case "3gpp":
            return "video";
         case "oga":case "mp3":case "f4a":case "m4a":
         case "aac":case "wav":case "aif":case "wma":
            return "audio";
      }
   };

   // Get the preference "weight" of this media type.  
   // The lower the number, the higher the preference.
   jQuery.media.file.prototype.getWeight = function() {
      switch( this.extension ) {  
         case 'mp4':case 'm4v':case 'm4a':
            return jQuery.media.playTypes.h264 ? 3 : 7;
         case'webm':
            return jQuery.media.playTypes.webm ? 4 : 8;
         case 'ogg':case 'ogv':
            return jQuery.media.playTypes.ogg ? 5 : 20;
         case 'oga':
            return jQuery.media.playTypes.audioOgg ? 5 : 20;               
         case 'mp3':
            return 6;
         case 'mov':case'swf':case 'flv':case 'f4v':
         case 'f4a':case '3g2':case '3gp':case '3gpp':
            return 9;
         case 'wav':case 'aif':case 'aac':
            return 10;
         case 'wma':
            return 11;
            
      }
   };

   // Return the best guess mime type for the given file.
   jQuery.media.file.prototype.getMimeType = function() {
      switch( this.extension ) {  
         case 'mp4':case 'm4v':case 'flv':case 'f4v':
            return 'video/mp4';
         case'webm':
            return 'video/x-webm';
         case 'ogg':case 'ogv':
            return 'video/ogg';
         case '3g2':
            return 'video/3gpp2';
         case '3gpp':
         case '3gp':
            return 'video/3gpp';
         case 'mov':
            return 'video/quicktime';
         case'swf':
            return 'application/x-shockwave-flash';
         case 'oga':
            return 'audio/ogg';               
         case 'mp3':
            return 'audio/mpeg';
         case 'm4a':case 'f4a':
            return 'audio/mp4';                  
         case 'aac':
            return 'audio/aac';
         case 'wav':
            return 'audio/vnd.wave';
         case 'wma':
            return 'audio/x-ms-wma';        
      }
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
      console.log( debug );
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
         this.videoFile = null;
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
         
         this.createMedia = function( videoFile, preview ) {
            this.videoFile = videoFile;
            this.preview = preview;
            this.ready = false;
            var playerId = (settings.id + "_media");            
            var rand = Math.floor(Math.random() * 1000000); 
            var flashPlayer = settings.flashPlayer + "?rand=" + rand;
            var flashvars = {
               config:settings.config,
               id:settings.id,
               file:videoFile.path,
               skin:settings.skin,
               autostart:(settings.autostart || !settings.autoLoad)
            };
            if( videoFile.stream ) {
               flashvars.stream = videoFile.stream;
            }
            if( settings.debug ) {
               flashvars.debug = "1";
            }
            jQuery.media.utils.insertFlash( 
               this.display, 
               flashPlayer,
               playerId, 
               this.display.width(), 
               this.display.height(),
               flashvars,
               settings.wmode,               
               function( obj ) {
                  _this.player = obj; 
                  _this.loadPlayer();  
               }
               );
         };
         
         this.loadMedia = function( videoFile ) {
            if( this.player ) {
               this.videoFile = videoFile;             
               
               // Load the new media file into the Flash player.
               this.player.loadMedia( videoFile.path, videoFile.stream ); 
               
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
               type:this.translate[eventType]
               } );
         };         
         
         this.playMedia = function() {
            this.player.playMedia();  
         };
         
         this.pauseMedia = function() {
            this.player.pauseMedia();             
         };
         
         this.stopMedia = function() {
            this.player.stopMedia();           
         };
         
         this.seekMedia = function( pos ) {
            this.player.seekMedia( pos );           
         };
         
         this.setVolume = function( vol ) {
            this.player.setVolume( vol ); 
         };
         
         this.getVolume = function() {
            return this.player.getVolume();       
         };
         
         this.getDuration = function() {
            return this.player.getDuration();           
         };
         
         this.getCurrentTime = function() {
            return this.player.getCurrentTime();
         };

         this.getBytesLoaded = function() {
            return this.player.getMediaBytesLoaded();
         };
         
         this.getBytesTotal = function() {
            return this.player.getMediaBytesTotal();
         };  

         this.hasControls = function() {
            return true;
         };
         
         this.showControls = function(show) {
            this.player.showPlugin("controlBar", show);
            this.player.showPlugin("playLoader", show);
         };         
         
         this.getEmbedCode = function() { 
            var flashVars = {
               config:"config",
               id:"mediafront_player",
               file:this.videoFile.path,
               image:this.preview,
               skin:settings.skin
            };
            if( this.videoFile.stream ) {
               flashVars.stream = this.videoFile.stream;
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
         this.setSize = function( newWidth, newHeight ) {};           
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
         
         this.getPlayer = function( mediaFile, preview ) {
            var playerId = options.id + '_' + this.mediaType;            
            var html = '<' + this.mediaType + ' style="position:absolute" id="' + playerId + '"';
            html += (this.mediaType == "video") ? ' width="' + this.display.width() + 'px" height="' + this.display.height() + 'px"' : '';
            html += preview ? ' poster="' + preview + '"' : '';
            
            if( typeof mediaFile === 'array' ) {
               html += '>';
               var i = mediaFile.length;
               while( i-- ) {
                  html += '<source src="' + mediaFile[i].path + '" type="' + mediaFile[i].mimetype + '">';
               }
            }
            else {
               html += ' src="' + mediaFile.path + '">Unable to display media.';
            } 
            
            html += '</' + this.mediaType + '>';
            this.display.append( html );
            return this.display.find('#' + playerId).eq(0)[0];;           
         };
         
         // Create a new HTML5 player.
         this.createMedia = function( mediaFile, preview ) {
            // Remove any previous Flash players.
            jQuery.media.utils.removeFlash( this.display, options.id + "_media" );
            this.display.children().remove();    
            this.mediaType = this.getMediaType( mediaFile );            
            this.player = this.getPlayer( mediaFile, preview );

            this.player.addEventListener( "abort", function() {
               onUpdate( {
                  type:"stopped"
               } );
            }, true);
            this.player.addEventListener( "loadstart", function() {
               onUpdate( {
                  type:"ready"
               } );
            }, true);
            this.player.addEventListener( "loadedmetadata", function() {
               onUpdate( {
                  type:"meta"
               } );
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
            this.player.addEventListener( "error", function() {
               onUpdate( {
                  type:"error"
               } );
            }, true);
            
            // Now add the event for getting the progress indication.
            this.player.addEventListener( "progress", function( event ) {
               _this.bytesLoaded = event.loaded;
               _this.bytesTotal = event.total;
            }, true);
            
            this.player.autoplay = true;
            this.player.autobuffer = true;   
            
            onUpdate( {
               type:"playerready"
            } );
         };      
         
         // Load new media into the HTML5 player.
         this.loadMedia = function( mediaFile ) {
            this.createMedia( mediaFile );
         };                       
         
         this.getMediaType = function( mediaFile ) {
            var extension = (typeof mediaFile === 'array') ? mediaFile[0].extension : mediaFile.extension;
            switch( extension ) {
               case "ogg": case "ogv": case "mp4": case "m4v":
                  return "video";
                  
               case "oga": case "mp3":
                  return "audio";
            }
            return "video";
         };
         
         this.playMedia = function() {
            this.player.play();  
         };
         
         this.pauseMedia = function() {
            this.player.pause();             
         };
         
         this.stopMedia = function() {
            this.pauseMedia();
            this.player.src = "";           
         };
         
         this.seekMedia = function( pos ) {
            this.player.currentTime = pos;            
         };
         
         this.setVolume = function( vol ) {
            this.player.volume = vol;   
         };
         
         this.getVolume = function() {   
            return this.player.volume;       
         };
         
         this.getDuration = function() {
            return this.player.duration;           
         };
         
         this.getCurrentTime = function() {
            return this.player.currentTime;
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
            return false;
         };
         this.showControls = function(show) {};          
         this.setSize = function( newWidth, newHeight ) {};           
         this.getEmbedCode = function() {
            return "This media cannot be embedded.";
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

   /**
    * Load and scale an image while maintining original aspect ratio.
    */
   jQuery.fn.mediaimage = function( link, fitToImage ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( container, link, fitToImage ) {
         this.display = container;
         var _this = this;
         
         var ratio = 0;                  
         var loaded = false;
         this.width = this.display.width();
         this.height = this.display.height();
         
         // Now create the image loader, and add the loaded handler.
         this.imgLoader = new Image();
         this.imgLoader.onload = function() {
            loaded = true;
            ratio = (_this.imgLoader.width / _this.imgLoader.height);
            _this.resize();
            _this.display.trigger( "imageLoaded" );
         }; 
         
         // Now add the image object.
         var code = link ? '<a target="_blank" href="' + link + '"><img src=""></img></a>' : '<img src=""></img>';
         this.image = container.append( code ).find("img");    
         
         // Set the container to not show any overflow...       
         container.css("overflow", "hidden");
         
         // Resize the image.
         this.resize = function( newWidth, newHeight ) {
            this.width = fitToImage ? this.imgLoader.width : (newWidth ? newWidth : this.width ? this.width : this.display.width());
            this.height = fitToImage ? this.imgLoader.height : (newHeight ? newHeight : this.height ? this.height : this.display.height());
            if( this.width && this.height && loaded ) {  
               // Resize the wrapper.
               this.display.css({
                  width:this.width,
                  height:this.height
                  });
               
               // Now resize the image in the container...
               var rect = jQuery.media.utils.getScaledRect( ratio, {
                  width:this.width,
                  height:this.height
                  } );
               this.image.attr( "src", this.imgLoader.src ).css({
                  marginLeft:rect.x, 
                  marginTop:rect.y, 
                  width:rect.width + "px", 
                  height:rect.height + "px"
               }).show();
            }
         };
         
         // Clears the image.
         this.clear = function() {
            loaded = false;
            if( this.image ) {
               this.image.hide();               
               this.image.attr( "src", "" );
            }
            container.empty();
         };
         
         // Refreshes the image.
         this.refresh = function() {
            this.resize();
         };
         
         // Load the image.
         this.loadImage = function( src ) {
            this.image.hide();
            this.imgLoader.src = src;
         };
      })( this, link, fitToImage );     
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

        
  
   // Extend the media namespace
   jQuery.media = jQuery.extend( {}, {
      // Add the json server object.
      json : function( settings ) {
         // Return a new function for this object
         return new (function( settings ) {   
            var _this = this;             
            
            // ************************************************
            // This code is from http://kelpi.com/script/a85cbb
            // ************************************************  
            
            // A character conversion map
            var m = {
               '\b':'\\b',
               '\t':'\\t',
               '\n':'\\n',
               '\f':'\\f',
               '\r':'\\r',
               '"':'\\"',
               '\\':'\\\\'
            };
            
            // Map type names to functions for serializing those types
            var s = { 
               'boolean': function (x) {
                  return String(x);
               },
               'null': function (x) {
                  return "null";
               },
               number: function (x) {
                  return isFinite(x) ? String(x) : 'null';
               },
               string: function (x) {
                  if (/["\\\x00-\x1f]/.test(x)) {
                     x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) {
                           return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                     });
                  }
                  return '"' + x + '"';
               },
               array: function (x) {
                  var a = ['['], b, f, i, l = x.length, v;
                  for (i = 0; i < l; i += 1) {
                     v = x[i];
                     f = s[typeof v];
                     if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                           if (b) {
                              a[a.length] = ',';
                           }
                           a[a.length] = v;
                           b = true;
                        }
                     }
                  }
                  a[a.length] = ']';
                  return a.join('');
               },
               object: function (x) {
                  if (x) {
                     if (x instanceof Array) {
                        return s.array(x);
                     }
                     var a = ['{'], b, f, i, v;
                     for( i in x ) {
                        if( x.hasOwnProperty(i) ) {
                           v = x[i];
                           f = s[typeof v];
                           if(f) {
                              v = f(v);
                              if (typeof v == 'string') {
                                 if (b) {
                                    a[a.length] = ',';
                                 }
                                 a.push(s.string(i), ':', v);
                                 b = true;
                              }
                           }                              
                        }  
                     }
                     a[a.length] = '}';
                     return a.join('');
                  }
                  return 'null';
               }
            };
            
            // Public function to serialize any object to JSON format.   
            this.serializeToJSON = function( o ) {
               return s.object(o);   
            };   
            
            //************************************************
            // End of code from http://kelpi.com/script/a85cbb
            //************************************************ 
                            
            this.call = function( method, onSuccess, onFailed, params, protocol ) {
               if( settings.baseURL ) {
                  // Add json functionality here.
                  jQuery.ajax({ 
                     "url": settings.baseURL + method,
                     "dataType": "json",
                     "type": "POST",
                     "data": {
                        methodName:method,
                        params:this.serializeToJSON(params)
                        },
                     "error": function( XMLHttpRequest, textStatus, errorThrown ) {
                        if( onFailed ) {
                           onFailed( textStatus );
                        }
                        else {
                           console.log( "Error: " + textStatus );
                        }
                     },
                     "success": function( data ) {
                        if( onSuccess ) {
                           onSuccess( data );
                        }
                     }             
                  });
               } 
               else if( onSuccess ) {
                  onSuccess( null );
               }     
            };
         })( settings );
      }
   }, jQuery.media );

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
 
   jQuery.fn.medialink = function( settings, onClick, data ) { 
      data = data ? data : {
         noargs:true
      };
      return new (function( link, settings, onClick, data ) {
         var _this = this;
         this.display = link;     
          
         this.display.css("cursor", "pointer").bind( "click", data, function( event ) {
            onClick( event, $(this) );
         }).bind("mouseenter", function() {
            if( settings.template.onLinkOver ) {
               settings.template.onLinkOver( $(this) );  
            } 
         }).bind("mouseleave", function() {
            if( settings.template.onLinkOut ) {               
               settings.template.onLinkOut( $(this) );   
            }
         });
      })( this, settings, onClick, data );         
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
      links:[],
      linksvertical:false                
   }); 

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      linkScroll:"#medialinkscroll"               
   });    
   
   jQuery.fn.medialinks = function( settings ) {  
      return new (function( links, settings ) {

         // Get our settings.
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = links;
         var _this = this;
         
         // Keep track of the previous link.
         this.previousLink = null;

         // Setup the scroll region
         this.scrollRegion = links.find( settings.ids.linkScroll ).mediascroll({
            vertical:settings.linksvertical
         });
         this.scrollRegion.clear();         

         // Load the links.
         this.loadLinks = function() {
            if( links.length > 0 ) {
               this.scrollRegion.clear();
               var onLinkClick = function( event, data ) {
                  _this.setLink( data );
               };               
               
               var i = settings.links.length;
               while(i--) {
                  // Add this link to the scroll region.
                  var link = this.scrollRegion.newItem().playlistlink( settings, settings.links[i] );
                  link.bind("linkclick", onLinkClick);                  
               }   
               // Activate the scroll region.
               this.scrollRegion.activate(); 
            }
         };       

         // Set the active link.
         this.setLink = function( link ) {

            // If there is a previous link, then unactivate it.
            if( this.previousLink ) {
               this.previousLink.setActive(false);
            }

            // Add the active class to the clicked target.
            link.setActive(true);

            // Store this target for later.
            this.previousLink = link;
         };
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

        
   
   // Set up our defaults for this component.
   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      close:"#mediamenuclose",
      embed:"#mediaembed",
      elink:"#mediaelink",
      email:"#mediaemail"           
   });   
   
   jQuery.fn.mediamenu = function( server, settings ) {  
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, menu, settings ) {
         settings = jQuery.media.utils.getSettings(settings);  
         var _this = this;
         this.display = menu;
         
         this.on = false;
         
         this.contents = [];
         this.prevItem = {
            id:0,
            link:null,
            contents:null
         };
         
         this.close = this.display.find( settings.ids.close );
         this.close.bind( "click", function() {
            _this.display.trigger( "menuclose" );
         });
         
         this.setMenuItem = function( link, itemId ) {
            if( this.prevItem.id != itemId ) {
               if( this.prevItem.id ) {
                  settings.template.onMenuSelect( this.prevItem.link, this.prevItem.contents, false );
               }
               var contents = this.contents[itemId];
               settings.template.onMenuSelect( link, contents, true );
               this.prevItem = {
                  id:itemId,
                  link:link,
                  contents:contents
               };
            }
         };         
         
         this.setEmbedCode = function( embed ) {
            this.setInputItem( settings.ids.embed, embed );
         };
         
         
         this.setMediaLink = function( mediaLink ) {
            this.setInputItem( settings.ids.elink , mediaLink );
         };
         
         this.setInputItem = function( id, value ) {
            var input = this.contents[id].find("input");
            input.unbind();
            input.bind("click", function() {
               $(this).select().focus();   
            });
            input.attr("value", value );            
         };
         
         var linkIndex = 0;
         this.links = this.display.find("ul li");
         this.links.each( function() {
            var link = $(this).find("a");
            var linkId = link.attr("href");
            var contents = _this.display.find(linkId);
            contents.hide();
            _this.contents[linkId] = contents; 
            
            link.bind("mouseenter", $(this), function( event ) {
               settings.template.onMenuOver( event.data );   
            });
            
            link.bind("mouseleave", $(this), function( event ) {
               settings.template.onMenuOut( event.data );   
            });
            
            link.bind("click", {
               id:linkId,
               obj:$(this)
               }, function( event ) {
               event.preventDefault(); 
               _this.setMenuItem( event.data.obj, event.data.id );
            });
            
            if( linkIndex === 0 ) {
               _this.setMenuItem( $(this), linkId );   
            }
            linkIndex++;
         });
        
         
      })( server, this, settings );
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
      node:"",
      incrementTime:5             
   }); 

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      voter:"#mediavoter",
      uservoter:"#mediauservoter",
      mediaRegion:"#mediaregion",
      field:".mediafield"                 
   });   
   
   jQuery.fn.medianode = function( server, settings ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, node, settings ) {
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = node;
         this.nodeInfo = {};
         this.incremented = false;
         var _this = this;
         
         // Add the min player as the player for this node.
         this.player = this.display.find(settings.ids.mediaRegion).minplayer( settings );  
         if( this.player && this.player.media && (settings.incrementTime !== 0)) {
            this.player.media.display.bind( "mediaupdate", function( event, data ) {
               _this.onMediaUpdate( data );            
            });  
         }         
         
         // Store all loaded images.
         this.images = [];
         
         // Get the width and height.
         this.width = this.display.width();
         this.height = this.display.height();
         
         // Load the voters...
         this.voter = this.display.find(settings.ids.voter).mediavoter( settings, server, false );
         this.uservoter = this.display.find(settings.ids.uservoter).mediavoter( settings, server, true );
         if( this.uservoter && this.voter ) {
            this.uservoter.display.bind( "processing", function() {
               _this.player.showBusy(2, true);
            });
            this.uservoter.display.bind( "voteGet", function() {
               _this.player.showBusy(2, false);
            });            
            this.uservoter.display.bind( "voteSet", function( event, vote ) {
               _this.player.showBusy(2, false);
               _this.voter.updateVote( vote );   
            });
         }
         
         // Handle the media events.
         this.onMediaUpdate = function( data ) {
            if( !this.incremented ) {
               switch( data.type ) {
                  case "update":
                     // Increment node counter if the increment time is positive and is less than the current time.
                     if( (settings.incrementTime > 0) && (data.currentTime > settings.incrementTime) ) {
                        this.incremented = true;
                        server.call( jQuery.media.commands.incrementCounter, null, null, _this.nodeInfo.nid );
                     }
                     break;
                  case "complete":
                     // If the increment time is negative, then that means to increment on media completion.
                     if( settings.incrementTime < 0 ) {
                        this.incremented = true;
                        server.call( jQuery.media.commands.incrementCounter, null, null, _this.nodeInfo.nid );
                     }
                     break;
               }
            }
         };         
         
         this.loadNode = function( _nodeInfo ) {
            return this.getNode( this.translateNode( _nodeInfo ) );
         };

         this.translateNode = function( _nodeInfo ) {
            var isValue = ((typeof _nodeInfo) == "number") || ((typeof _nodeInfo) == "string");
            if( !_nodeInfo ) {
               var defaultNode = settings.node;
               if( (typeof defaultNode) == 'object' ) {
                  defaultNode.load = false;
                  return defaultNode;   
               }
               else {
                  return defaultNode ? {
                     nid:defaultNode,
                     load:true
                  } : null;
               }
            }
            else if( isValue ) {
               return {
                  nid:_nodeInfo,
                  load:true
               };
            }
            else {
               _nodeInfo.load = false;
               return _nodeInfo;
            }
         };

         this.onResize = function( deltaX, deltaY ) { 
            // Resize the player.     
            if( this.player ) {
               this.player.onResize( deltaX, deltaY );
            }
            
            // Refresh all images.
            var i=this.images.length;
            while(i--) {
               this.images[i].refresh();
            }
         };
         
         this.getNode = function( _nodeInfo ) {
            if( _nodeInfo ) {
               if( server && _nodeInfo.load ) {
                  server.call( jQuery.media.commands.loadNode, function( result ) {
                     _this.setNode( result );
                  }, null, _nodeInfo.nid, {} );
               }
               else {
                  this.setNode( _nodeInfo ); 
               }

               // Return that the node was loaded.
               return true;
            }

            // Return that there was no node loaded.
            return false;
         };

         this.setNode = function( _nodeInfo ) {
            if( _nodeInfo ) {
               // Set the node information object.
               this.nodeInfo = _nodeInfo;
               this.incremented = false;
   
               // Load the media...
               if( this.player && this.nodeInfo.mediafiles ) {
                  // Load the preview image.
                  var image = this.getImage("preview");
                  if( image ) {
                     this.player.loadImage( image.path );
                  }
                  else {
                     this.player.clearImage();
                  }

                  // Load the media...
                  this.player.loadFiles( this.nodeInfo.mediafiles.media );
               }
               
               // Get the vote for these voters.
               if( this.voter ) {
                  this.voter.getVote( _nodeInfo );
               }
               if( this.uservoter ) {
                  this.uservoter.getVote( _nodeInfo );
               }
               
               // Load all of our fields.
               this.display.find(settings.ids.field).each( function() {
                  _this.setField( this, _nodeInfo, $(this).attr("type"), $(this).attr("field") );
               });
                  
               // Trigger our node loaded event.
               this.display.trigger( "nodeload", this.nodeInfo );
            }
         }; 

         this.setField = function( fieldObj, _nodeInfo, type, fieldName ) {
            // We only want to load the fields that have a type.
            if( type ) {
               switch( type ) {
                  case "text":
                     this.setTextField( fieldObj, _nodeInfo, fieldName );
                     return true;
   
                  case "image":
                     return this.setImageField( fieldObj, fieldName );
   
                  default:
                     if( settings.template.setField ) {
                        // Let the template set this field.
                        return settings.template.setField({
                           node:_nodeInfo,
                           field:fieldObj,
                           fieldType:type, 
                           fieldName:fieldName
                        });
                     }
                     else {
                        return true;  
                     }
               }
            }
         };
         
         this.setTextField = function( fieldObj, _nodeInfo, fieldName ) {
            var field = _nodeInfo[fieldName];
            if( field ) {
               $(fieldObj).empty().html( field );  
            }        
         };

         this.getImage = function( imageName ) {
            var images = this.nodeInfo.mediafiles ? this.nodeInfo.mediafiles.images : null;
            var image = null;
            if( images ) {
               
               // Get the image.
               if( images[imageName] ) {
                  image = images[imageName];
               }
               else {
                  // Or just use the first image...
                  for( var key in images ) {
                     if( images.hasOwnProperty( key ) ) {
                        image = images[key];
                        break;  
                     }
                  }
               }
               
               // If they just provided a string, then still show the image.
               image = (typeof image === "string") ? {
                  path:image
               } : image;
               image.path = image.path ? jQuery.trim(image.path) : ( settings.baseURL + jQuery.trim(image.filepath) );
               if( image && image.path ) {
                  image.path = image.path ? jQuery.trim(image.path) : ( settings.baseURL + jQuery.trim(image.filepath) );
               }
               else {
                  image = null;   
               }
            }
            return image;
         };
         
         this.setImageField = function( fieldObj, fieldName ) {
            var loaded = true;
            var file = this.getImage( fieldName );
            if( file ) {
               var image = $(fieldObj).empty().mediaimage();
               this.images.push( image );
               image.loadImage( file.path );
               loaded = false;
            }
            return loaded;
         };
      })( server, this, settings );
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
      shuffle:false,
      loop:false,
      pageLimit:10          
   });

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      prev:"#mediaprev",
      next:"#medianext",
      loadPrev:"#medialoadprev",
      loadNext:"#medialoadnext",
      prevPage:"#mediaprevpage",
      nextPage:"#medianextpage"         
   });   
   
   jQuery.fn.mediapager = function( settings ){
      return new (function( pager, settings ) {
         settings = jQuery.media.utils.getSettings(settings);

         // Save the jQuery display.
         this.display = pager;
         var _this = this;

         // The active index within a page.
         this.activeIndex = -1;     

         // The non-active index within a page.
         this.currentIndex = -1;

         // The active page index.
         this.activePage = 0;

         // The non-active page index.
         this.currentPage = 0;

         // The number of pages.
         this.numPages = 0;

         // The number of items on the current page.
         this.numItems = 10;

         // The number of items on the active page.
         this.activeNumItems = 10;

         // The load state for loading an index after a new page.
         this.loadState = "";

         // Used to turn on and off the pager.
         this.enabled = false;
         
         // Add our buttons...
         this.prevButton = pager.find( settings.ids.prev ).medialink( settings, function() {
            if( _this.enabled ) {
               _this.loadPrev( false );  
            }
         });
         
         this.nextButton = pager.find( settings.ids.next ).medialink( settings, function() {
            if( _this.enabled ) {
               _this.loadNext( false );   
            }
         });
         
         this.loadPrevButton = pager.find( settings.ids.loadPrev ).medialink( settings, function() {
            if( _this.enabled ) {
               _this.loadPrev( true ); 
            }
         });
         
         this.loadNextButton = pager.find( settings.ids.loadNext ).medialink( settings, function() {
            if( _this.enabled ) {
               _this.loadNext( true );  
            }
         });         

         this.prevPageButton = pager.find( settings.ids.prevPage ).medialink( settings, function() {
            if( _this.enabled ) {
               _this.loadState = "click";
               _this.prevPage();  
            }
         });
         
         this.nextPageButton = pager.find( settings.ids.nextPage ).medialink( settings, function() {
            if( _this.enabled ) {
               _this.loadState = "click";
               _this.nextPage();
            }
         });                       

         this.setTotalItems = function( totalItems ) {
            if ( totalItems && settings.pageLimit ) {
               this.numPages = Math.ceil(totalItems / settings.pageLimit);
               if( this.numPages == 1 ) {
                  this.numItems = totalItems;   
               }
            }              
         };

         this.setNumItems = function( _numItems ) {
            this.numItems = _numItems;  
         };           

         this.reset = function() {
            this.activePage = 0;
            this.currentPage = 0;
            this.activeIndex = -1;  
            this.currentIndex = -1;
            this.loadState = "";
         };

         this.loadIndex = function( setActive ) {
            var indexVar = setActive ? "activeIndex" : "currentIndex";           
            var newIndex = this[indexVar];
            switch ( this.loadState ) {
               case "prev":
                  this.loadState = "";
                  this.loadPrev(setActive);
                  return;

               case "first":
                  newIndex = 0;
                  break;
               case "last" :
                  newIndex = (this.numItems - 1);
                  break;

               case "rand" :
                  newIndex = Math.floor(Math.random() * this.numItems);
                  break;
            }

            this.loadState = "";

            if( newIndex != this[indexVar] ) {
               this.loadState = "";
               this[indexVar] = newIndex;
               this.display.trigger("loadindex", {
                  index:this[indexVar],
                  active:setActive
               });
            }
         };

         this.loadNext = function( setActive ) {            
            if ( this.loadState ) {
               this.loadIndex( setActive );
            }
            else if ( settings.shuffle ) {
               this.loadRand();
            }
            else {
               // Increment the playlist index.
               var indexVar = setActive ? "activeIndex" : "currentIndex";
               if( setActive && ( this.activePage != this.currentPage ) ) {

                  // Check to make sure we cover the crazy corner-case where the activeIndex
                  // is on the last item of the previous page.  Here we don't need to load
                  // a new page, but simply load the first item on the current page.
                  if( (this.activeIndex == (this.activeNumItems - 1)) && (this.activePage == (this.currentPage - 1)) ) {
                     this.currentIndex = this.activeIndex = 0;
                     this.activePage = this.currentPage;
                     this.display.trigger("loadindex", {
                        index:0,
                        active:true
                     });
                  }
                  else {
                     this.currentPage = this.activePage;
                     this.loadState = "";
                     this.display.trigger("loadpage", {
                        index:this.activePage,
                        active:setActive
                     });
                  }
               }
               else {
                  this[indexVar]++;
                  if ( this[indexVar] >= this.numItems ) {
                     if( this.numPages > 1 ) {
                        this[indexVar] = (this.numItems - 1);
                        this.loadState = this.loadState ? this.loadState : "first";
                        this.nextPage( setActive );
                     }
                     else if( !setActive || settings.loop ) {
                        this[indexVar] = 0;
                        this.display.trigger("loadindex", {
                           index:this[indexVar],
                           active:setActive
                        });
                     }
                  }
                  else {
                     this.display.trigger("loadindex", {
                        index:this[indexVar],
                        active:setActive
                     });
                  }
               }
            }               
         };

         this.loadPrev = function( setActive ) {      
            var indexVar = setActive ? "activeIndex" : "currentIndex";

            if( setActive && ( this.activePage != this.currentPage ) ) {
               this.currentPage = this.activePage;
               this.loadState = "prev";
               this.display.trigger("loadpage", {
                  index:this.activePage,
                  active:setActive
               });
            }
            else {
               this[indexVar]--;
               if ( this[indexVar] < 0 ) {
                  if( this.numPages > 1 ) {
                     this[indexVar] = 0;
                     this.loadState = this.loadState ? this.loadState : "last";
                     this.prevPage( setActive );
                  }
                  else if( !setActive || settings.loop ) {
                     this[indexVar] = (this.numItems - 1);
                     this.display.trigger("loadindex", {
                        index:this[indexVar],
                        active:setActive
                     });
                  }
               }
               else {
                  this.display.trigger( "loadindex", {
                     index:this[indexVar],
                     active:setActive
                  } );
               }  
            }
         };

         this.loadRand = function() {
            var newPage = Math.floor(Math.random() * this.numPages);

            if (newPage != this.activePage) {
               this.activePage = newPage;
               this.loadState = this.loadState ? this.loadState : "rand";
               this.display.trigger("loadpage", {
                  index:this.activePage,
                  active:true
               });
            }
            else {
               this.activeIndex = Math.floor(Math.random() * this.numItems);
               this.display.trigger("loadindex", {
                  index:this.activeIndex,
                  active:true
               });
            }              
         };

         this.nextPage = function( setActive ) {
            var pageVar = setActive ? "activePage" : "currentPage";
            var pageLoaded = false;

            if ( this[pageVar] < (this.numPages - 1) ) {
               this[pageVar]++;
               pageLoaded = true;
            }
            else if ( settings.loop ) {
               this.loadState = this.loadState ? this.loadState : "first";
               this[pageVar] = 0;
               pageLoaded = true;            
            }
            else {
               this.loadState = ""; 
            }

            // Set the page state.
            this.setPageState( setActive );  

            if( pageLoaded ) {
               this.display.trigger("loadpage", {
                  index:this[pageVar],
                  active:setActive
               });
            }                            
         };

         this.prevPage = function( setActive ) {      
            var pageVar = setActive ? "activePage" : "currentPage";
            var pageLoaded = false;

            if (this[pageVar] > 0) {
               this[pageVar]--;
               pageLoaded = true;            
            }
            else if ( settings.loop ) {
               this.loadState = this.loadState ? this.loadState : "last";
               this[pageVar] = (this.numPages - 1);
               pageLoaded = true;            
            }
            else {
               this.loadState = ""; 
            }

            // Set the page state.
            this.setPageState( setActive );           

            if( pageLoaded ) {
               this.display.trigger("loadpage", {
                  index:this[pageVar],
                  active:setActive
               });
            }              
         };

         this.setPageState = function( setActive ) {
            if( setActive ) {
               // If this page is active, then we want to make sure
               // we set the current page to the active page.
               this.currentPage = this.activePage; 
            }
            else {
               // Store the active num items.
               this.activeNumItems = this.numItems;   
            }  
         };
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

   jQuery.media = jQuery.extend( {}, {
      parser : function( settings ) {
         // Return a new parser object.
         return new (function( settings ) {  
            var _this = this;
            this.onLoaded = null;
                     
            // Parse the contents from a file.
            this.parseFile = function( file, onLoaded ) {
               this.onLoaded = onLoaded;
               jQuery.ajax({
                  type: "GET",
                  url:file,
                  dataType:"xml",
                  success: function(xml) {
                     _this.parseXML( xml );
                  },
                  error: function( XMLHttpRequest, textStatus, errorThrown ) {
                     console.log( "Error: " + textStatus );
                  }
               });               
            }; 
            
            // Parse an xml string.
            this.parseXML = function( xml ) {
               // Try to parse a playlist in any format...
               var playlist = this.parseXSPF( xml );
               if( playlist.total_rows === 0 ) {
                  playlist = this.parseASX( xml );
               }
               if( playlist.total_rows === 0 ) {
                  playlist = this.parseRSS( xml );
               }                            
               if( this.onLoaded && playlist.total_rows ) {
                  this.onLoaded( playlist ); 
               }              
               return playlist;  
            };
            
            // Parse XSPF contents.
            this.parseXSPF = function( xml ) {
               var playlist = {
                  total_rows:0,
                  nodes:[]
               };
               var trackList = jQuery("playlist trackList track", xml);
               if( trackList.length > 0 ) {
                  trackList.each( function(index) {
                     playlist.total_rows++;
                     playlist.nodes.push({   
                        nid:playlist.total_rows, 
                        title: $(this).find("title").text(),
                        description: $(this).find("annotation").text(),
                        mediafiles: {
                           images:{
                              "image":{
                                 path:$(this).find("image").text()
                                 }
                           },
                           media:{
                              "media":{
                                 path:$(this).find("location").text()
                                 }
                           }
                        }
                     });
                  }); 
               }
               return playlist;                 
            };

            // Parse ASX contents.
            this.parseASX = function( xml ) {
               var playlist = {
                  total_rows:0,
                  nodes:[]
               };
               var trackList = jQuery("asx entry", xml);         
               if( trackList.length > 0 ) {
                  trackList.each( function(index) {
                     playlist.total_rows++;
                     playlist.nodes.push({   
                        nid:playlist.total_rows, 
                        title: $(this).find("title").text(),
                        mediafiles: {
                           images:{
                              "image":{
                                 path:$(this).find("image").text()
                                 }
                           },
                           media:{
                              "media":{
                                 path:$(this).find("location").text()
                                 }
                           }
                        }                        
                     });
                  }); 
               }
               return playlist;              
            };

            // Parse RSS contents.
            this.parseRSS = function( xml ) {
               var playlist = {
                  total_rows:0,
                  nodes:[]
               };
               var channel = jQuery("rss channel", xml);         
               if( channel.length > 0 ) {
                  var youTube = (channel.find("generator").text() == "YouTube data API");
                  
                  // Iterate through all the items.
                  channel.find("item").each( function(index) {
                     playlist.total_rows++;
                     var item = {};
                     item = youTube ? _this.parseYouTubeItem( $(this) ) : _this.parseRSSItem( $(this) );
                     item.nid = playlist.total_rows;
                     playlist.nodes.push(item);
                  }); 
               }
               return playlist;                             
            };
            
            // Parse a default RSS Item.
            this.parseRSSItem = function( item ) {
               return {   
                  title: item.find("title").text(),
                  mediafiles: {
                     images:{
                        "image":{
                           path:item.find("image").text()
                           }
                     },
                     media:{
                        "media":{
                           path:item.find("location").text()
                           }
                     }
                  }                  
               };
            };
            
            // Parse a YouTube item.
            this.parseYouTubeItem = function( item ) {
               var description = item.find("description").text();
               var media = item.find("link").text().replace("&feature=youtube_gdata", ""); 
               return {
                  title: item.find("title").text(),
                  mediafiles: {
                     images:{
                        "image":{
                           path:jQuery("img", description).eq(0).attr("src")
                           }
                     },
                     media:{
                        "media":{
                           path:media,
                           player:"youtube"
                        }
                     }
                  }                                   
               };
            };                       
         })( settings );
      }           
   }, jQuery.media );  
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
      protocol:"auto",
      server:"drupal",
      template:"default",
      baseURL:"",
      debug:false,
      draggable:false,
      resizable:false,
      showPlaylist:true,
      autoNext:true,
      prefix:""
   });    

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      loading:"#mediaplayerloading",
      player:"#mediaplayer",
      menu:"#mediamenu",
      titleBar:"#mediatitlebar",
      node:"#medianode",
      playlist:"#mediaplaylist"   
   });   
   
   // Initialize our players, playlists, and controllers.   
   jQuery.media.players = {};
   jQuery.media.loadCallbacks = {};
   jQuery.media.playlists = {}; 
   jQuery.media.controllers = {};   
   
   // Use this function to trigger when the player has finished registering and loaded.
   jQuery.media.onLoaded = function( playerId, callback ) {
      var player = jQuery.media.players[playerId];
      if( player && player.display && player.loaded ) {
         callback( player );
      }
      else {
         if( !jQuery.media.loadCallbacks[playerId] ) {
            jQuery.media.loadCallbacks[playerId] = [];
         }
         jQuery.media.loadCallbacks[playerId].push( callback );
      }
   };

   // To add a new controller to any existing or future-included players.
   jQuery.media.addController = function( playerId, fromPlayer ) {
      // Check to make sure the fromPlayer has a controller.
      if( fromPlayer && fromPlayer.node && fromPlayer.node.player && fromPlayer.node.player.controller ) {
         // If the player already exists, then add it directly to the player.
         var toPlayer = jQuery.media.players[playerId];
         if( toPlayer && toPlayer.node && toPlayer.node.player ) {
            toPlayer.node.player.addController( fromPlayer.node.player.controller );
         }
         else {
            // Otherwise, cache it for inclusion when the player is created.
            if( !jQuery.media.controllers[playerId] ) {
               jQuery.media.controllers[playerId] = [];
            }
            jQuery.media.controllers[playerId].push( fromPlayer.node.player.controller );
         } 
      }     
   };
   
   // To add a new playlist to any existing or future-included players.
   jQuery.media.addPlaylist = function( playerId, fromPlayer ) {
      // Make sure the fromPlayer has a playlist.
      if( fromPlayer && fromPlayer.playlist ) {
         // If the player already exists, then add it directly to the player.
         var toPlayer = jQuery.media.players[playerId];
         if( toPlayer ) {
            toPlayer.addPlaylist( fromPlayer.playlist );
         }
         else {
            // Otherwise, cache it for inclusion when the player is created.
            if( !jQuery.media.playlists[playerId] ) {
               jQuery.media.playlists[playerId] = [];
            }
            jQuery.media.playlists[playerId].push( fromPlayer.playlist );
         } 
      }
   };
   
   // The main entry point into the player. 
   jQuery.fn.mediaplayer = function( settings ) {
      if( this.length === 0 ) {
         return null;
      }
      // Return the media Media Player
      return new (function( player, settings ) {         
         // Get the settings.
         settings = jQuery.media.utils.getSettings( settings );
         
         // Get the id if it has not been set.
         if( !settings.id ) {
            settings.id = jQuery.media.utils.getId( player );
         }         
         
         // Save the dialog.
         this.dialog = player;                     
        
         // Save the jQuery display.                                        
         this.display = this.dialog.find( settings.ids.player );
         var _this = this;          

         // Fix a really strange issue where if any of the parent elements are invisible
         // when this player's template is initializing, it would crash due to the issue
         // with calling the position() function on an invisible object.  This seems to fix
         // that issue.
         var invisibleParents = [];

         // Now check the visibility of the parents, and add the offenders to the array.
         jQuery.media.utils.checkVisibility( this.display, invisibleParents );

         // Add this player to the players object.
         jQuery.media.players[settings.id] = this;

         // Variable to keep track if this player has finished loading.
         this.loaded = false;
         
         // Set the template object.
         settings.template = jQuery.media.templates[settings.template]( this, settings );
         
         // Get all of the setting overrides used in this template.
         if( settings.template.getSettings ) {
            settings = jQuery.extend( settings, settings.template.getSettings() );
         }
         
         // Add some keyboard event handlers.
         $(window).keypress( function( event ) {
            switch( event.keyCode ) {
               case 0:   /* SpaceBar */
                  _this.onSpaceBar();
                  break;
               case 27:  /* ESC Key */
                  _this.onEscKey();
                  break;
            }
         });
         
         // First get the communication protocol.
         if( jQuery.media[settings.protocol] ) {
            this.protocol = jQuery.media[settings.protocol]( settings );
         }
         
         // Load the server.
         if( jQuery.media[settings.server] ) {
            this.server = jQuery.media[settings.server]( this.protocol, settings );
         }

         // Set the width and height properties.
         this.width = this.dialog.width();
         this.height = this.dialog.height();

         // Get the menu.
         this.menu = this.display.find( settings.ids.menu ).mediamenu( this.server, settings );
         if( this.menu ) {
            this.menu.display.bind( "menuclose", function() {
               _this.showMenu( false );   
            });
         }
         
         // Setup our booleans.
         this.menuOn = false;
         this.maxOn = !settings.showPlaylist;
         this.fullScreen = false;
         
         // The attached playlist.
         this.playlist = null;
         
         // The active playlist.
         this.activePlaylist = null;
         
         // Hide or Show the menu.
         this.showMenu = function( show ) {
            if( settings.template.onMenu ) {
               this.menuOn = show;
               settings.template.onMenu( this.menuOn );
            }         
         };
         
         // Called when the user presses the ESC key.
         this.onEscKey = function() {
            // If they are in full screen mode, then escape when they press the ESC key.
            if( this.fullScreen ) {
               this.fullScreen = false;
               if( this.node && this.node.player ) {
                  this.node.player.fullScreen( this.fullScreen );
               }              
            }            
         };
         
         // When they press the space bar, we will toggle the player play/pause state.
         this.onSpaceBar = function() {
            if( this.fullScreen && this.node && this.node.player ) {            
               this.node.player.togglePlayPause();
            }
         };

         // Adds the media player events to a given element.
         this.addPlayerEvents = function( element ) {
            // Trigger on the menu.
            element.display.bind("menu", function(event) {
               _this.showMenu( !_this.menuOn );
            });

            element.display.bind("maximize", function( event ) {
               _this.maximize( !_this.maxOn );
            });

            element.display.bind("fullscreen", function( event ) {
               _this.fullScreen = !_this.fullScreen;
               if( _this.node && _this.node.player ) {
                  _this.node.player.fullScreen( _this.fullScreen );
               }
            });
         };

         // Setup the title bar.
         this.titleBar = this.dialog.find( settings.ids.titleBar ).mediatitlebar( settings );
         if( this.titleBar ) {
            // Add the player events to the titlebar.
            this.addPlayerEvents( this.titleBar );
         
            // If they have jQuery UI, make this draggable.
            if( settings.draggable && this.dialog.draggable ) {
               this.dialog.draggable({
                  handle: settings.ids.titleBar,
                  containment: 'document'
               });
            }         
   
            // If they have jQuery UI, make this resizable.         
            if( settings.resizable && this.dialog.resizable ) {
               this.dialog.resizable({
                  alsoResize: this.display,
                  containment: 'document',
                  resize: function(event) {
                     _this.setSize( _this.dialog.width(), _this.dialog.height() );
                  }
               });            
            }
         }         

         // Get the node and register for events.
         this.node = this.display.find( settings.ids.node ).medianode( this.server, settings );
         if( this.node ) {
            // Add the player events to the node.
            this.addPlayerEvents( this.node );

            this.node.display.bind( "nodeload", function( event, data ) {
               _this.onNodeLoad( data );
            });
            
            if( this.node.player && this.node.player.media ) {
               this.node.player.media.display.bind( "mediaupdate", function( event, data ) {
                  _this.onMediaUpdate( data );
               });
            }            
            
            if( this.node.uservoter ) {
               this.node.uservoter.display.bind( "voteSet", function( event, vote ) {
                  if( _this.activePlaylist ) {
                     _this.activePlaylist.onVoteSet( vote ); 
                  }
               });
            }
         }
         
         // Called when the media updates.
         this.onMediaUpdate = function( data ) {
            // When the media completes, have the active playlist load the next item.
            if( settings.autoNext && this.activePlaylist && (data.type == "complete") ) {
               this.activePlaylist.loadNext();
            }                   
            
            // Set the media information in the menu.
            if( this.menu && this.node && (data.type == "meta") ) {
               this.menu.setEmbedCode( this.node.player.media.player.getEmbedCode() );
               this.menu.setMediaLink( this.node.player.media.player.getMediaLink() );
            }
         };

         // Called when the playlist is finished loading.
         this.onPlaylistLoad = function( data ) {
            if( this.node ) {
               this.node.loadNode( data );
            }
            
            // Allow the template to do something when the playlist is loaded.
            if( settings.template.onPlaylistLoad ) {            
               settings.template.onPlaylistLoad( data );  
            }                   
         };
         
         // Called when the main node is loaded.
         this.onNodeLoad = function( data ) {           
            // Allow the template to do something when the node is loaded.
            if( settings.template.onNodeLoad ) {             
               settings.template.onNodeLoad( data );  
            }                       
         };

         // Called when the player resizes.
         this.onResize = function( deltaX, deltaY ) {
            // Call the template resize function.
            if( settings.template.onResize ) {             
               settings.template.onResize( deltaX, deltaY );  
            } 
            
            // Only resize the connected playlist.
            if( this.playlist ) {
               this.playlist.onResize( deltaX, deltaY );   
            }
            
            // Resize the node.
            if( this.node ) {
               this.node.onResize( deltaX, deltaY );
            }
         }; 

         // Maximize the player.
         this.maximize = function( on ) {
            // Don't want to maximize in fullscreen mode.
            if( !this.fullScreen ) {
               if( settings.template.onMaximize && (on != this.maxOn) ) {
                  this.maxOn = on;
                  settings.template.onMaximize( this.maxOn );   
               }  
            }
         };

         // Allow multiple playlists to be associated with this single player using this API.
         this.addPlaylist = function( newPlaylist ) {     
            if( newPlaylist ) {
               newPlaylist.display.bind( "playlistload", newPlaylist, function( event, data ) {
                  // Set this as the active playlist.
                  _this.activePlaylist = event.data;
                  _this.onPlaylistLoad( data );
               });
               
               // Check to see if this playlist has already loaded... If so, then we need to
               // go ahead and load the active teaser into this player.
               if( !this.activePlaylist && newPlaylist.activeTeaser ) {
                  this.activePlaylist = newPlaylist;
                  this.onPlaylistLoad( newPlaylist.activeTeaser.node.nodeInfo );
               }
            }
            return newPlaylist;
         };

         // Add the default playlist.
         this.playlist = this.addPlaylist( this.display.find( settings.ids.playlist ).mediaplaylist( this.server, settings ) );
         
         // Now add any queued playlists...
         if( jQuery.media.playlists[settings.id] ) {
            var playlists = jQuery.media.playlists[settings.id];
            var i = playlists.length;
            while(i--) {
               this.addPlaylist( playlists[i] );
            }
         }         
         
         // Allow the player to be resized.
         this.setSize = function( newWidth, newHeight ) {
            // Only call onResize if the width or height changes.
            newWidth = newWidth ? newWidth : this.width;
            newHeight = newHeight ? newHeight : this.height;
            if( (newWidth != this.width) || (newHeight != this.height) ) {
               // Determine the delta's
               var deltaX = (newWidth - this.width);
               var deltaY = (newHeight - this.height);
               
               // Set the width and height properties.
               this.width = newWidth;
               this.height = newHeight;   
               
               this.dialog.css({
                  width:this.width,
                  height:this.height
               });
               
               // Call the resize function.             
               this.onResize( deltaX, deltaY );
            }          
         };

         // Load the content into the player.
         this.loadContent = function() {
            var playlistLoaded = false;

            if( this.playlist ) {
               playlistLoaded = this.playlist.loadPlaylist();
            }

            // Don't load the node if there is a plalist loaded.
            if( !playlistLoaded && this.node ) {
               // Make sure to transfer any playlist settings over to the node.
               if( this.node.player && this.node.player.media ) {
                  this.node.player.media.settings.repeat = (settings.loop || settings.repeat);
               }

               this.node.loadNode(); 
            }
         }; 

         this.initializeTemplate = function() {
            // Initialize our template.
            if( settings.template.initialize ) {
               settings.template.initialize( settings );
            }

            // Now reset the visibility of the parents.
            jQuery.media.utils.resetVisibility( invisibleParents );
         };

         this.load = function() {            
            // Initialize our template.
            this.initializeTemplate();
            
            // Resize the player.
            this.onResize( 0, 0 );
            
            // The player looks good now.  Move the dialog back.
            this.dialog.css("position","relative");
            this.dialog.css("marginLeft",0);  
            this.dialog.css("overflow","visible");

            // Set our loaded flag to true.
            this.loaded = true;
            this.display.trigger( "playerLoaded", this );

            // Call all of our queued onLoaded callback functions.
            if( jQuery.media.loadCallbacks[settings.id] ) {
               var callbacks = jQuery.media.loadCallbacks[settings.id];
               var i = callbacks.length;
               while(i--) {
                  callbacks[i]( this );
               }
            }

            // Connect to the server.
            this.server.connect( function( result ) {
               _this.loadContent();
            });                         
         };     
         
         this.load();     
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

        
   
   // Set up our defaults for this component.
   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      playlist:"",
      args:[],
      wildcard:"*"         
   }); 

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      pager:"#mediapager",
      scroll:"#mediascroll",
      busy:"#mediabusy",
      links:"#medialinks"       
   });   
   
   jQuery.fn.mediaplaylist = function( server, settings ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, playlist, settings ) {
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = playlist;
         var _this = this;

         this.allowResize = true;
         
         // Store all of the current teasers.
         this.teasers = [];

         // The non-active selected teaser.
         this.selectedTeaser = null;

         // The active teaser.
         this.activeTeaser = null;

         // Set up our playlist args.
         this.args = settings.args;

         // Used to keep track if we should set the node active after a playlist load.
         this.setActive = true;

         // The active pager.
         this.activePager = null;

         // The attached pager bar..
         this.pager = null;
                  
         // Set up the playlist parser.
         this.parser = jQuery.media.parser( settings );

         // Get the Scroll Region.
         this.scrollRegion = playlist.find( settings.ids.scroll ).mediascroll( settings );
         this.scrollRegion.clear();

         // Store the dimensions.
         this.width = this.scrollRegion.width;
         this.height = this.scrollRegion.height;
         
         if( settings.vertical ) {
            this.display.width( this.width );
         } else {
            this.display.height( this.height );  
         }
         
         // Store the busy cursor.
         this.busy = playlist.find( settings.ids.busy );
         this.busyVisible = false;
         this.busyImg = this.busy.find("img");
         this.busyWidth = this.busyImg.width();
         this.busyHeight = this.busyImg.height();         

         // Get the links.
         this.links = playlist.find( settings.ids.links ).medialinks( settings );
         this.links.loadLinks();
         
         this.loading = function( _loading ) {
            if( this.pager ) {
               this.pager.enabled = !_loading;
            }
            if( this.activePager ) {
               this.activePager.enabled = !_loading;
            }
            if( _loading ) {
               this.busyVisible = true;
               this.busy.show();
            }
            else {
               this.busyVisible = false;
               this.busy.hide();   
            }
         };       

         this.onResize = function( deltaX, deltaY ) {
            if( this.allowResize ) {  
               this.width += deltaX;
               this.height += deltaY;
               this.pagerWidth += deltaX;
               
               this.scrollRegion.onResize( deltaX, deltaY );
               
               if( this.pager ) {
                  this.pager.display.width( this.width );
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
            }   
         };              

         // Allow mulitple pagers to control this playlist.
         this.addPager = function( newPager, active ) {
            if( newPager ) {
               // Handler for the loadindex event.
               newPager.display.bind( "loadindex", function( event, data ) {
                  if( data.active ) {
                     _this.activateTeaser( _this.teasers[data.index] );
                  }
                  else {
                     _this.selectTeaser( _this.teasers[data.index] );
                  }
               });      
      
               // Handler for the loadpage event.         
               newPager.display.bind( "loadpage", function( event, data ) {
                  _this.setActive = data.active;
                  _this.loadPlaylist( {
                     pageIndex:data.index
                  } );
               });
               
               if( active && !this.activePager ) {
                  this.activePager = newPager;   
               }
            }
            return newPager;
         };

         // Add the pager.
         this.pager = this.addPager( playlist.find( settings.ids.pager ).mediapager( settings ), false );

         // Handler for when a link is clicked.
         this.links.display.bind( "linkclick", function( event, link ) {
            _this.onLinkClick( link );
         });

         this.onLinkClick = function( link ) {
            var index = link.index;
            var newPlaylist = link.playlist;
            var newArgs = [];
            newArgs[index] = link.arg;
            
            if( this.pager ) {
               this.pager.reset();
            }
            
            if( this.activePager ) {
               this.activePager.reset();
            }
            
            this.loadPlaylist( {
               playlist:newPlaylist,
               args:newArgs
            } );
         };

         // Loads the next track.
         this.loadNext = function() {
            if( this.pager ) {
               this.pager.loadNext( true );
            }
            else if( this.activePager ) {
               this.activePager.loadNext( true );
            }
         };

         // Function to load the playlist.
         this.loadPlaylist = function( _args ) {
            var defaults = {
               playlist:settings.playlist,
               pageLimit:settings.pageLimit,
               pageIndex:(this.pager ? this.pager.activePage : 0),
               args:{}
            };          

            var playlistArgs = jQuery.extend( {}, defaults, _args );

            // Set the arguments.         
            this.setArgs( playlistArgs.args );

            // Set the busy cursor.
            this.loading( true );

            // If there is a playlist.
            if( playlistArgs.playlist ) {
               // If the playlist is an object, then just set it directly.
               if( ((typeof playlistArgs.playlist) == "object") ) {
                  settings.playlist = playlistArgs.playlist.name;
                  this.setPlaylist( playlistArgs.playlist ); 
               }
               else {
                  // See if the playlist is a URL file.
                  if( playlistArgs.playlist.match(/^http[s]?\:\/\/|\.xml$/i) ) {
                     // Parse the XML file.
                     this.parser.parseFile( playlistArgs.playlist, function( result ) {
                        _this.setPlaylist( result ); 
                     });
                  }
                  else if( server ) {
                     // Load the playlist from the server.
                     server.call( jQuery.media.commands.getPlaylist, function( result ) {
                        _this.setPlaylist( result );  
                     }, null, playlistArgs.playlist, playlistArgs.pageLimit, playlistArgs.pageIndex, this.args );
                  }
               }

               // Return that the playlist was loaded.
               return true;
            }

            // Return that the playlist was not loaded.
            return false;
         };

         // Set this playlist.
         this.setPlaylist = function( _playlist ) {
            if( _playlist && _playlist.nodes ) {
               // Now check the visibility of the parents, and add the offenders to the array.
               var invisibleParents = [];
               jQuery.media.utils.checkVisibility( this.display, invisibleParents );

               // Set the total number of items for the pager.
               if( this.pager ) {   
                  this.pager.setTotalItems( _playlist.total_rows ); 
               }
               
               // Set the total number of items for the active pager.
               if( this.activePager ) {
                  this.activePager.setTotalItems( _playlist.total_rows ); 
               } 
   
               // Empty the scroll region.
               this.scrollRegion.clear();
               
               // Reset the teasers.
               this.resetTeasers();
               
               // Iterate through all of our nodes.
               var numNodes = _playlist.nodes.length;
               for( var index=0; index < numNodes; index++ ) {
                  // Add the teaser.
                  this.addTeaser( _playlist.nodes[index], index );             
               }
   
               // Activate the scroll region.
               this.scrollRegion.activate();          
   
               // Load the next node.
               if( this.pager ) {
                  this.pager.loadNext( this.setActive );
               }
               
               if( this.activePager ) {
                  this.activePager.loadNext( this.setActive );
               }

               // Now reset the invisibilty.
               jQuery.media.utils.resetVisibility( invisibleParents );
            }
            
            // We are finished loading.
            this.loading( false );
         };

         // When a vote has been cast, we also need to update the playlist.
         this.onVoteSet = function( vote ) {
            if( vote ) {
               var i = this.teasers.length;
               while(i--) {
                  var teaser = this.teasers[i];
                  if( teaser.node.nodeInfo.nid == vote.content_id ) {
                     teaser.node.voter.updateVote( vote );
                  }
               }
            }
         };
         
         // Add a single teaser to the list.
         this.addTeaser = function( nodeInfo, index ) {
            // Setup the teaser.
            var teaser = this.scrollRegion.newItem().mediateaser( server, nodeInfo, index, settings );             
            if( teaser ) {
               // If they click on the teaser, then activate it.      
               teaser.display.bind( "click", teaser, function( event ) {
                  _this.activateTeaser( event.data );
               });  
   
               if( this.activeTeaser ) {            
                  this.activeTeaser.setActive( nodeInfo.nid == this.activeTeaser.node.nodeInfo.nid );
               }
               
               if( this.selectedTeaser ) {             
                  this.selectedTeaser.setSelected( nodeInfo.nid == this.selectedTeaser.node.nodeInfo.nid );
               }
   
               // Add this teaser to the teasers array.
               this.teasers.push( teaser ); 
            }
         };

         this.resetTeasers = function() {
            // Remove all handlers.
            var i = this.teasers.length;
            while(i--) {
               this.teasers[i].reset();   
            }
            this.teasers = [];
         };

         this.refresh = function() {
            this.scrollRegion.refresh();
            var i = this.teasers.length;
            while(i--) {
               this.teasers[i].refresh();   
            }            
         };

         // Set the arguments for this playlist.
         this.setArgs = function( _args ) {
            if( _args ) {
               // Reset the arguments.
               this.args = settings.args;

               // Loop through and add the new arguments.
               var i = _args.length;
               while(i--) {
                  var arg = _args[i];
                  if( arg && (arg != settings.wildcard) ) {
                     this.args[i] = arg;
                  }                  
               }
            }
         };

         // Selects a teaser.
         this.selectTeaser = function( teaser ) {

            // Set the current active teaser to false.
            if( this.selectedTeaser ) {
               this.selectedTeaser.setSelected( false );
            }
            
            // Store the active teaser for next time.                                   
            this.selectedTeaser = teaser;             

            if( this.selectedTeaser ) {
               // Now activate the new teaser.
               this.selectedTeaser.setSelected( true );           
                        
               // Set this item as visible in the scroll region.
               this.scrollRegion.setVisible( teaser.index ); 
            }
         };

         // Activate the teaser.
         this.activateTeaser = function( teaser ) {
            // First select the teaser.
            this.selectTeaser( teaser );
            
            // Set the current active teaser to false.
            if( this.activeTeaser ) {
               this.activeTeaser.setActive( false );
            }
            
            // Store the active teaser for next time.                                   
            this.activeTeaser = teaser;             

            if( this.activeTeaser ) {
               // Now activate the new teaser.
               this.activeTeaser.setActive( true );      
   
               // Set the active and current index to this one.
               if( this.pager ) {
                  this.pager.activeIndex = this.pager.currentIndex = teaser.index;
               }
               
               if( this.activePager ) {
                  this.activePager.activeIndex = this.activePager.currentIndex = teaser.index;
               }
               
               // Trigger an even that the teaser has been activated.
               this.display.trigger( "playlistload", teaser.node.nodeInfo );
            }
         };
      })( server, this, settings );
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
   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      linkText:"#medialinktext"
   });    
   
   jQuery.fn.playlistlink = function( settings, linkInfo ) {  
      return new (function( link, settings, linkInfo ) {
         settings = jQuery.media.utils.getSettings(settings);           
         this.display = link;
         this.arg = linkInfo.arg;
         this.text = linkInfo.text;
         this.index = linkInfo.index;        
         
         // Call the setLink when clicked.
         this.display.medialink( settings, function( event ) {
            _this.display.trigger( "linkclick", event.data ); 
         }, this );      
         
         this.setActive = function( active ) {
            if( settings.template.onLinkSelect ) {             
               settings.template.onLinkSelect( _this, active );
            }
         };
         
         this.display.find( settings.ids.linkText ).html( this.text );
      })( this, settings, linkInfo );
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

   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      rotatorTimeout:5000,
      rotatorTransition:"fade",
      rotatorEasing:"swing",
      rotatorSpeed:"slow",
      rotatorHover:false       
   });  

   jQuery.fn.mediarotator = function( settings ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( rotator, settings ) {
         settings = jQuery.media.utils.getSettings(settings);   
         var _this = this;     
         this.images = []; 
         this.imageIndex = 0;
         this.imageInterval = null;
         this.width = 0;
         this.height = 0;
         
         this.onImageLoaded = function() {
            this.width = this.images[0].imgLoader.width;
            this.height = this.images[0].imgLoader.height;
            rotator.css({
               width:this.width + "px",
               height:this.height + "px"
               });
            var sliderWidth = (settings.rotatorTransition == "hscroll") ? (2*this.width) : this.width;
            var sliderHeight = (settings.rotatorTransition == "vscroll") ? (2*this.height) : this.height;
            this.display.css({
               width:sliderWidth,
               height:sliderHeight
            });
         };
         
         this.addImage = function() {
            var image = $("<div></div>").mediaimage(null, true);
            this.display.append( image.display );
            
            if( (settings.rotatorTransition == "hscroll") || (settings.rotatorTransition == "vscroll") ) {
               image.display.css({
                  "float":"left"
               });
            }
            else {
               image.display.css({
                  position:"absolute",
                  zIndex:(200 - this.images.length),
                  top:0,
                  left:0
               });
            }
            return image;         
         };
         
         this.loadImages = function( _images ) {
            this.images = [];
            this.imageIndex = 0;
            
            jQuery.each( _images, function( index ) {
               var image = _this.addImage();
               if( index === 0 ) {
                  image.display.bind("imageLoaded", function() {
                     _this.onImageLoaded();
                  }).show();
               }   
               image.loadImage( this );
               _this.images.push( image );
            });
            
            if( settings.rotatorHover ) {
               this.display.bind( "mouseenter", function() {
                  _this.startRotator();
               }).bind( "mouseleave", function() {
                  clearInterval( _this.imageInterval );
               });
            }
            else {
               this.startRotator();
            }     
         };
      
         this.startRotator = function() {
            clearInterval( this.imageInterval );
            this.imageInterval = setInterval( function() {
               _this.showNextImage();
            }, settings.rotatorTimeout );     
         };
         
         this.showNextImage = function() {
            this.hideImage( this.images[this.imageIndex].display );
            this.imageIndex = (this.imageIndex + 1) % this.images.length;         
            this.showImage( this.images[this.imageIndex].display );
         };     
      
         this.showImage = function( image ) {
            if( settings.rotatorTransition === 'fade' ) {
               image.fadeIn(settings.rotatorSpeed);
            }
            else {
               image.css({
                  marginLeft:0,
                  marginTop:0
               }).show();
            }    
         };
         
         this.hideImage = function( image ) {
            switch( settings.rotatorTransition ) {
               case "fade":
                  image.fadeOut(settings.rotatorSpeed);
                  break;
               case "hscroll":
                  image.animate({
                     marginLeft:-this.width
                     }, settings.rotatorSpeed, settings.rotatorEasing, function() {
                     image.css({
                        marginLeft:0
                     }).remove();
                     _this.display.append( image );
                  });
                  break;             
               case "vscroll":
                  image.animate({
                     marginTop:-this.height
                     }, settings.rotatorSpeed, settings.rotatorEasing, function() {
                     image.css({
                        marginTop:0
                     }).remove();
                     _this.display.append( image );
                  });
                  break;                                            
               default:
                  image.hide();
                  break;
            }         
         };
   
         // Find all the images in the rotator container.
         var _images = [];
         rotator.find("img").each( function() {
            _images.push( $(this).attr("src") );
         });
         
         // Empty the container and setup the inner rotator.
         rotator.empty().css("overflow", "hidden").append( $('<div class="imagerotatorinner"></div>') );
         this.display = rotator.find(".imagerotatorinner");      

         // If they provided images, then we will want to load them.
         if( _images.length ) {
            this.loadImages( _images );
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

        
   
   // Set up our defaults for this component.
   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      gateway:""       
   });    
  
   // Extend the media namespace
   jQuery.media = jQuery.extend( {}, {
      // Add the rpc object.
      rpc : function( settings ) {
         // Return a new function for this object
         return new (function( settings ) { 
            settings = jQuery.media.utils.getSettings(settings);
            var _this = this;            
               
            this.parseObject = function( data ) {
               var ret = "";
               if( data instanceof Date ) {
                  ret = "<dateTime.iso8601>";
                  ret += data.getFullYear();
                  ret += data.getMonth();
                  ret += data.getDate();
                  ret += "T";
                  ret += data.getHours() + ":";
                  ret += data.getMinutes() + ":";
                  ret += data.getSeconds();
                  ret += "</dateTime.iso8601>";
               } else if( data instanceof Array ) {
                  ret = '<array><data>'+"\n";
                  for (var i=0; i < data.length; i++) {
                     ret += '  <value>'+ this.serializeToXML(data[i]) +"</value>\n";
                  }
                  ret += '</data></array>';
               } else {
                  ret = '<struct>'+"\n";
                  for(var key in data ) {
                     if( data.hasOwnProperty(key) ) {
                        ret += "  <member><name>"+ key +"</name><value>";
                        ret += this.serializeToXML(data[key]) +"</value></member>\n";                        
                     }   
                  }
                  ret += '</struct>';
               }
               return ret;               
            };
            
            this.serializeToXML = function( data ) {
               switch( typeof data ) {
                  case 'boolean':
                     return '<boolean>'+ ((data) ? '1' : '0') +'</boolean>';
                     
                  case 'number':
                     var parsed = parseInt(data, 10);
                     if(parsed == data) {
                        return '<int>'+ data +'</int>';
                     }
                     return '<double>'+ data +'</double>';
                     
                  case 'string':
                     return '<string>'+ data +'</string>';
                     
                  case 'object':
                     return this.parseObject( data );
               } 
            };
            
            this.parseXMLValue = function( node ) {
               var childs = jQuery(node).children();
               var numChildren = childs.length;
               var newArray = function(items) {
                  return function() {
                     items.push( _this.parseXMLValue(this) );
                  };
               };
               var newObject = function( items ) {
                  return function() {
                     items[jQuery( "> name", this).text()] = _this.parseXMLValue(jQuery("value", this));
                  };
               };               
               for(var i=0; i < numChildren; i++) {
                  var element = childs[i];
                  switch(element.tagName) {
                     case 'boolean':
                        return (jQuery(element).text() == 1);
                     case 'int':
                        return parseInt(jQuery(element).text(), 10);
                     case 'double':
                        return parseFloat(jQuery(element).text());
                     case "string":
                        return jQuery(element).text();
                     case "array":
                        var retArray = [];
                        jQuery("> data > value", element).each( newArray( retArray ) );
                        return retArray;
                     case "struct":
                        var retObj = {};
                        jQuery("> member", element).each( newObject( retObj ) );
                        return retObj;
                     case "dateTime.iso8601":
                        return NULL;
                  }                  
               }       
            };
            
            this.parseXML = function( data ) {
               var ret = {};
               ret.version = "1.0";
               jQuery("methodResponse params param > value", data).each( function(index) {
                  ret.result = _this.parseXMLValue(this);
               });
               jQuery("methodResponse fault > value", data).each( function(index) {
                  ret.error = _this.parseXMLValue(this);
               });
               return ret;
            };
            
            this.xmlRPC = function( method, params ) {
               var ret = '<?xml version="1.0"?>';
               ret += '<methodCall>';
               ret += '<methodName>' + method + '</methodName>';
               if( params.length > 0 ) {
                  ret += '<params>';
                  var numParams = params.length;
                  for(var i=0; i < numParams; i++) {
                     if( params[i] ) {
                        ret += "<param><value>" + this.serializeToXML(params[i]) + "</value></param>";
                     }
                  }
                  ret += '</params>';
               }
               ret += '</methodCall>';
               return ret;
            };
            
            this.call = function( method, onSuccess, onFailed, params, protocol ) {
               if( settings.gateway ) {
                  jQuery.ajax({
                     "url": settings.gateway,
                     "dataType": "xml",
                     "type": "POST",
                     "data": this.xmlRPC( method, params ),
                     "error": function( XMLHttpRequest, textStatus, errorThrown ) {
                        if( onFailed ) {
                           onFailed( textStatus );
                        }
                        else {
                           console.log( "Error: " + textStatus );
                        }
                     },
                     "success": function( msg ) {
                        var xml = _this.parseXML( msg );
                        if( xml.error ) {
                           if( onFailed ) {
                              onFailed( xml.error );
                           }
                           else {
                              console.dir( xml.error );
                           }
                        }
                        else if( onSuccess ) {
                           onSuccess( xml.result );
                        }
                     },
                     "processData": false,
                     "contentType": "text/xml"
                  });
               }
               else if( onSuccess ) {
                  onSuccess( null ); 
               }
            };
         })( settings );
      }
   }, jQuery.media );

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

        
   
   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      vertical:true,
      scrollSpeed:20,
      updateTimeout:40,
      hysteresis:40,
      showScrollbar:true,
      scrollMode:"auto"  /* "auto", "span", "none" */        
   });   

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      listMask:"#medialistmask",
      list:"#medialist",
      scrollWrapper:"#mediascrollbarwrapper",
      scrollBar:"#mediascrollbar",
      scrollTrack:"#mediascrolltrack",
      scrollHandle:"#mediascrollhandle",
      scrollUp:"#mediascrollup",
      scrollDown:"#mediascrolldown"        
   });     
   
   jQuery.fn.mediascroll = function( settings ) {
      return new (function( scrollRegion, settings ) {
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = scrollRegion;
         var _this = this;
         
         this.spanMode = (settings.scrollMode == "span");          
         
         // Get the list region.
         this.listMask = scrollRegion.find( settings.ids.listMask );
         
         // Internet Exploder has some serious issues with the auto scroll.  We will just force those
         // users to use the scroll bar.
         if( this.spanMode || (settings.scrollMode == "auto") ) {
            // Add our event callbacks.
            this.listMask.bind( 'mouseenter', function( event ) {
               _this.onMouseOver( event ); 
            });    
            this.listMask.bind( 'mouseleave', function( event ) {
               _this.onMouseOut( event ); 
            });
            this.listMask.bind( 'mousemove', function( event ) {
               _this.onMouseMove( event ); 
            }); 
         }
         this.listMask.css("overflow", "hidden");   
               
         this.list = scrollRegion.find( settings.ids.list );
         
         var element = this.list.children().eq(0);
         this.elementWidth = element.width();
         this.elementHeight = element.height();
         this.elementSize = settings.vertical ? element.outerHeight(true) : element.outerWidth(true);
         
         // Early versions of jQuery have a broken clone method for IE.  This fixes that.
         if( jQuery.browser.msie && parseInt( jQuery.fn.jquery.replace(".", ""), 10 ) < 132 ) {
            this.template = $("<div></div>").append( jQuery.media.utils.cloneFix( element ) ).html();
         }
         else {
            this.template = $("<div></div>").append( element.clone() ).html();  
         }
         
         // Store the width and height.
         this.width = this.listMask.width();
         this.height = settings.vertical ? 0 : this.listMask.height();         
         
         // Empty our list.
         this.list.empty(); 
         
         // Initialize our variables.     
         this.pagePos = settings.vertical ? "pageY" : "pageX";
         this.margin = settings.vertical ? "marginTop" : "marginLeft";
         this.scrollSize = settings.vertical ? 0 : this.listMask.width();
         this.scrollButtonSize = 0;
         this.scrollMid = 0;                 
         this.mousePos = 0;
         this.listPos = 0; 
         this.scrollInterval = 0;
         this.shouldScroll = false;
         this.bottomPos = 0;
         this.ratio = 0;
         this.elements = [];
         this.listSize = 0;     

         // Add the slider control to this scroll bar.
         this.scrollBar = scrollRegion.find( settings.ids.scrollBar ).mediaslider( settings.ids.scrollHandle, settings.vertical );
         this.scrollWrapper = scrollRegion.find( settings.ids.scrollWrapper );
         this.scrollTrack = null;   
         
         // Setup the scroll up button.
         this.scrollUp = scrollRegion.find( settings.ids.scrollUp ).medialink( settings, function() {
            _this.scroll( true );
         });
         
         // Setup the scroll down button.
         this.scrollDown = scrollRegion.find( settings.ids.scrollDown ).medialink( settings, function() {
            _this.scroll( false );
         });        
         
         // Save the scroll button size.
         this.scrollButtonSize = settings.vertical ? this.scrollDown.display.outerHeight(true) : this.scrollDown.display.outerWidth(true);         
         
         if( this.scrollBar ) {
            if( settings.showScrollbar ) {
               if( settings.vertical ) {
                  this.width += this.scrollWrapper.width();
               }
               else {
                  this.height += this.scrollWrapper.height();
               }             
            }
            else {
               this.scrollWrapper.width(0).hide();
            }
            
            // Get the scroll track.
            this.scrollTrack = this.scrollBar.display.find( settings.ids.scrollTrack );  
         
            // Handle the update value event.
            this.scrollBar.display.bind("updatevalue", function( event, data ) {
               _this.setScrollPos( data * _this.bottomPos, false );
            });
            
            // Handle the set value event.
            this.scrollBar.display.bind("setvalue", function( event, data ) {
               _this.setScrollPos( data * _this.bottomPos, true );
            });     
         }        
         
         this.setScrollSize = function( newSize ) {
            if( newSize ) {
               this.scrollSize = newSize;     
               this.listMask.css( settings.vertical ? "height" : "width", this.scrollSize );                                 
               this.scrollMid = this.scrollSize / 2;  
               var activeSize = this.scrollSize - (settings.hysteresis*2);
               this.bottomPos = (this.listSize - this.scrollSize);
               this.ratio = ( (this.listSize - activeSize) / activeSize );
               this.shouldScroll = (this.bottomPos > 0);
            }
         };

         this.onResize = function( deltaX, deltaY ) {     
            this.width += deltaX;
            this.height += deltaY;       
            this.setScrollSize( settings.vertical ? (this.scrollSize + deltaY) : (this.scrollSize + deltaX)); 
            if( this.scrollBar ) {
               var trackSize = this.scrollSize - 2*this.scrollButtonSize;
               if( settings.vertical ) {
                  this.scrollBar.display.css({
                     height:trackSize
                  });
                  this.scrollTrack.css({
                     height:trackSize
                  });
                  this.scrollBar.setSize( 0, trackSize );
               }
               else {
                  this.scrollBar.display.css({
                     width:trackSize
                  });
                  this.scrollTrack.css({
                     width:trackSize
                  });
                  this.scrollBar.setSize( trackSize, 0 );               
               }
            }        
         };         
         
         // Clears this scroll region.
         this.clear = function() {
            // Reset all variables for a page refresh.
            this.mousePos = 0; 
            this.shouldScroll = false;
            this.bottomPos = 0;
            this.ratio = 0;
            this.scrolling = false;
            this.elements = [];
            this.listSize = 0;
            this.list.css( this.margin, "0px" );
            this.list.children().unbind();
            clearInterval( this.scrollInterval );
            this.list.empty();     
         };
         
         this.getOffset = function() {
            return settings.vertical ? this.listMask.offset().top : this.listMask.offset().left;
         };
         
         // Activates the scroll region.
         this.activate = function() {
            // Set the scroll size.
            this.setScrollSize( settings.vertical ? this.listMask.height() : this.listMask.width() );                                 

            // Now reset the list position.
            this.setScrollPos( /*this.listPos*/0, true );
         };
         
         // Refreshes the scroll region.
         this.refresh = function() {
            this.setScrollSize( this.scrollSize );
         };         

         // Add an item to this scroll region.
         this.newItem = function() {     
            var newTemplate = $(this.template);
            this.list.append( newTemplate );
            var element = this.getElement( newTemplate, this.elements.length );
            
            this.listSize += element.size;
            if( settings.vertical ) {
               this.list.css({
                  height:this.listSize,
                  marginTop:this.listSize
                  });
            }
            else {
               element.obj.css({
                  "float":"left"
               });
               this.list.css({
                  width:this.listSize
                  });
            }
            this.elements.push( element );
            return element.obj;
         };

         // Returns the cached element object with all properties.
         this.getElement = function( element, index ) {
            var size = this.elementSize;
            var pos = this.listSize;
            element.css({
               width:this.elementWidth,
               height:this.elementHeight
               });
            return {
               obj:element,
               size:size,
               position:pos,
               bottom:(pos+size),
               mid:(size/2),
               index:index
            };
         };

         // Scroll the list up or down one element.
         this.scroll = function( up ) {
            var element = this.getElementAtPosition( up ? 0 : this.scrollSize );
            if( element ) {
               var newElement = (element.straddle || up) ? element : this.elements[ element.index + 1 ];
               if( newElement ) {
                  var _listPos = up ? newElement.position : (newElement.bottom - this.scrollSize);
                  this.setScrollPos( _listPos, true );
               }
            }
         };

         // Called when the mouse moves within the scroll region.
         this.onMouseMove = function( event ) {
            this.mousePos = event[ this.pagePos ] - this.getOffset();
            
            // If the scroll type is span, then just move the list
            // up and down according to the listSize/regionSize ratio.
            if( this.shouldScroll && this.spanMode ) {
               this.setScrollPos( (this.mousePos - settings.hysteresis) * this.ratio );
            }
         };

         // Called when the mouse enters the scroll region.
         this.onMouseOver = function( event ) {
            if( this.shouldScroll ) {
               clearInterval( this.scrollInterval );
               this.scrollInterval = setInterval( function() {
                  _this.update();   
               }, settings.updateTimeout );
            }
         };

         // Called when the mouse exits the scroll region.
         this.onMouseOut = function( event ) {
            clearInterval( this.scrollInterval );     
         };

         // This function will align the scroll region.
         this.align = function( up ) {
            var element = this.getElementAtPosition( up ? 0 : this.scrollSize );
            if( element ) {
               var _listPos = up ? element.position : (element.bottom - this.scrollSize);
               this.setScrollPos( _listPos, true );
            }
         };

         // Will set the element at the given index visible.
         this.setVisible = function( index ) {
            var element = this.elements[index];
            if( element ) {
               var newPos = this.listPos;
               if( element.position < this.listPos ) {
                  newPos = element.position;
               } else if( (element.bottom - this.listPos) > this.scrollSize ) {
                  newPos = element.bottom - this.scrollSize;
               }
               if( newPos != this.listPos ) {
                  this.setScrollPos( newPos, true );
               }  
            }
         };

         // Gets an element at a specific location in the list.
         this.getElementAtPosition = function( position ) {
            var element = null;
            var i = this.elements.length;
            while(i--) {
               element = this.elements[i];
               if( ((element.position - this.listPos) < position) && 
                  ((element.bottom - this.listPos) >= position) ) {
                  element.straddle = ((element.bottom - this.listPos) != position);
                  break;      
               }               
            }
            return element;
         };

         // Called every interval to update the scroll position.
         this.update = function() {
            var delta = this.mousePos - this.scrollMid;
            if( Math.abs(delta) > settings.hysteresis ) {
               var hyst = (delta > 0) ? -settings.hysteresis : settings.hysteresis;
               delta = settings.scrollSpeed * (( this.mousePos + hyst - this.scrollMid) / this.scrollMid);
               this.setScrollPos(this.listPos + delta);
            }
         };       

         // Sets the scroll position.
         this.setScrollPos = function( _listPos, tween ) {
            // Make sure we are greater than zero here.
            _listPos = (_listPos < 0) ? 0 : _listPos;

            // See if we should scroll and if the list position is
            // greater than the bottom position.
            if( this.shouldScroll && (_listPos > this.bottomPos) ) {
               _listPos = this.bottomPos;
            }          
            
            // Now set the list position.
            this.listPos = _listPos;

            // Set the position of the scroll bar.
            if( this.scrollBar ) {
               this.scrollBar.setPosition( this.listPos / this.bottomPos );
            }              
            
            if( tween ) {
               if( settings.vertical ) {
                  this.list.animate({
                     marginTop: -this.listPos + "px"
                     }, (settings.scrollSpeed*10));
               }
               else {
                  this.list.animate({
                     marginLeft: -this.listPos + "px"
                     }, (settings.scrollSpeed*10));
               }
            }
            else {
               this.list.css( this.margin, -this.listPos + "px" );
            }
         };               
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

   // Extend the media namespace
   jQuery.media = jQuery.extend( {}, {
      // Add the sha256 object.
      sha256 : function() {
         /* A JavaScript implementation of the SHA family of hashes, as defined in FIPS PUB 180-2
          * as well as the corresponding HMAC implementation as defined in FIPS PUB 198a
          * Version 1.2 Copyright Brian Turek 2009
          * Distributed under the BSD License
          * See http://jssha.sourceforge.net/ for more information
          *
          * Several functions taken from Paul Johnson
          */          
         function jsSHA(o,p){jsSHA.charSize=8;jsSHA.b64pad="";jsSHA.hexCase=0;var q=null;var r=null;var s=function(a){var b=[];var c=(1<<jsSHA.charSize)-1;var d=a.length*jsSHA.charSize;for(var i=0;i<d;i+=jsSHA.charSize){b[i>>5]|=(a.charCodeAt(i/jsSHA.charSize)&c)<<(32-jsSHA.charSize-i%32)}return b};var u=function(a){var b=[];var c=a.length;for(var i=0;i<c;i+=2){var d=parseInt(a.substr(i,2),16);if(!isNaN(d)){b[i>>3]|=d<<(24-(4*(i%8)))}else{return"INVALID HEX STRING"}}return b};var v=null;var w=null;if("HEX"===p){if(0!==(o.length%2)){return"TEXT MUST BE IN BYTE INCREMENTS"}v=o.length*4;w=u(o)}else if(("ASCII"===p)||('undefined'===typeof(p))){v=o.length*jsSHA.charSize;w=s(o)}else{return"UNKNOWN TEXT INPUT TYPE"}var A=function(a){var b=jsSHA.hexCase?"0123456789ABCDEF":"0123456789abcdef";var c="";var d=a.length*4;for(var i=0;i<d;i++){c+=b.charAt((a[i>>2]>>((3-i%4)*8+4))&0xF)+b.charAt((a[i>>2]>>((3-i%4)*8))&0xF)}return c};var B=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var c="";var d=a.length*4;for(var i=0;i<d;i+=3){var e=(((a[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((a[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((a[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>a.length*32){c+=jsSHA.b64pad}else{c+=b.charAt((e>>6*(3-j))&0x3F)}}}return c};var C=function(x,n){if(n<32){return(x>>>n)|(x<<(32-n))}else{return x}};var D=function(x,n){if(n<32){return x>>>n}else{return 0}};var E=function(x,y,z){return(x&y)^(~x&z)};var F=function(x,y,z){return(x&y)^(x&z)^(y&z)};var G=function(x){return C(x,2)^C(x,13)^C(x,22)};var I=function(x){return C(x,6)^C(x,11)^C(x,25)};var J=function(x){return C(x,7)^C(x,18)^D(x,3)};var L=function(x){return C(x,17)^C(x,19)^D(x,10)};var M=function(x,y){var a=(x&0xFFFF)+(y&0xFFFF);var b=(x>>>16)+(y>>>16)+(a>>>16);return((b&0xFFFF)<<16)|(a&0xFFFF)};var N=function(a,b,c,d){var e=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF);var f=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16);return((f&0xFFFF)<<16)|(e&0xFFFF)};var O=function(a,b,c,d,e){var f=(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF)+(e&0xFFFF);var g=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)};var P=function(j,k,l){var W=[];var a,b,c,d,e,f,g,h;var m,T2;var H;var K=[0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0x0FC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x06CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2];if(l==="SHA-224"){H=[0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4]}else{H=[0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19]}j[k>>5]|=0x80<<(24-k%32);j[((k+1+64>>9)<<4)+15]=k;var n=j.length;for(var i=0;i<n;i+=16){a=H[0];b=H[1];c=H[2];d=H[3];e=H[4];f=H[5];g=H[6];h=H[7];for(var t=0;t<64;t++){if(t<16){W[t]=j[t+i]}else{W[t]=N(L(W[t-2]),W[t-7],J(W[t-15]),W[t-16])}m=O(h,I(e),E(e,f,g),K[t],W[t]);T2=M(G(a),F(a,b,c));h=g;g=f;f=e;e=M(d,m);d=c;c=b;b=a;a=M(m,T2)}H[0]=M(a,H[0]);H[1]=M(b,H[1]);H[2]=M(c,H[2]);H[3]=M(d,H[3]);H[4]=M(e,H[4]);H[5]=M(f,H[5]);H[6]=M(g,H[6]);H[7]=M(h,H[7])}switch(l){case"SHA-224":return[H[0],H[1],H[2],H[3],H[4],H[5],H[6]];case"SHA-256":return H;default:return[]}};this.getHash=function(a,b){var c=null;var d=w.slice();switch(b){case"HEX":c=A;break;case"B64":c=B;break;default:return"FORMAT NOT RECOGNIZED"}switch(a){case"SHA-224":if(q===null){q=P(d,v,a)}return c(q);case"SHA-256":if(r===null){r=P(d,v,a)}return c(r);default:return"HASH NOT RECOGNIZED"}};this.getHMAC=function(a,b,c,d){var e=null;var f=null;var g=[];var h=[];var j=null;var k=null;var l=null;switch(d){case"HEX":e=A;break;case"B64":e=B;break;default:return"FORMAT NOT RECOGNIZED"}switch(c){case"SHA-224":l=224;break;case"SHA-256":l=256;break;default:return"HASH NOT RECOGNIZED"}if("HEX"===b){if(0!==(a.length%2)){return"KEY MUST BE IN BYTE INCREMENTS"}f=u(a);k=a.length*4}else if("ASCII"===b){f=s(a);k=a.length*jsSHA.charSize}else{return"UNKNOWN KEY INPUT TYPE"}if(512<k){f=P(f,k,c);f[15]&=0xFFFFFF00}else if(512>k){f[15]&=0xFFFFFF00}for(var i=0;i<=15;i++){g[i]=f[i]^0x36363636;h[i]=f[i]^0x5C5C5C5C}j=P(g.concat(w),512+v,c);j=P(h.concat(j),512+l,c);return(e(j))}}
         
         // But I wrote this...   ;)
         this.encrypt = function( key, input ) {
            var shaObj = new jsSHA(input, "ASCII");
            return shaObj.getHMAC(key, "ASCII", "SHA-256", "HEX");
         };
      }
   }, jQuery.media );

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

   jQuery.fn.mediaslider = function( handleId, vertical, inverted ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( control, handleId, vertical, inverted ) {
         var _this = this;
         this.display = control.css({
            cursor:"pointer",
            position:"relative"
         });
         this.dragging = false;
         this.value = 0;
         this.handle = this.display.find(handleId);
         this.pagePos = vertical ? "pageY" : "pageX";
         this.width = this.display.width();
         this.height = this.display.height();         
         this.handleSize = vertical ? this.handle.height() : this.handle.width();
         this.handleOffset = vertical ? this.handle.position().top : this.handle.position().left;
         this.handleMid = (this.handleSize/2);
         this.handlePoint = this.handleMid + this.handleOffset;     
         this.handlePos = 0;
                 
         this.onResize = function( deltaX, deltaY ) {
            this.setSize( this.width + deltaX, this.height + deltaY );
         };
         
         this.setTrackSize = function() {
            this.trackSize = vertical ? this.height : this.width;  
            this.trackSize -= (this.handleOffset + this.handleSize);
         };
         
         this.setTrackSize();         
         
         this.setSize = function( newWidth, newHeight ) {
            this.width = newWidth ? newWidth : this.width;
            this.height = newHeight ? newHeight : this.height;
            this.setTrackSize();
            this.updateValue( this.value );
         };          
         
         this.setValue = function( _value ) {
            this.setPosition( _value );
            this.display.trigger( "setvalue", this.value ); 
         };         
         
         this.updateValue = function( _value ) {
            this.setPosition( _value );
            this.display.trigger( "updatevalue", this.value );
         };
         
         this.setPosition = function( _value ) {
            _value = (_value < 0) ? 0 : _value;
            _value = (_value > 1) ? 1 : _value;
            this.value = _value;

            this.handlePos = inverted ? (1-this.value) : this.value;
            this.handlePos *= this.trackSize;

            if( vertical ) {
               this.handle.css( "marginTop", this.handlePos + "px" );
            }
            else {
               this.handle.css( "marginLeft", this.handlePos + "px" ); 
            }
         };
         
         this.display.bind("mousedown", function( event ) {
            event.preventDefault();
            _this.dragging = true;
         });
         
         this.getOffset = function() {
            var offset = vertical ? this.display.offset().top : this.display.offset().left;
            return (offset + (this.handleSize / 2));            
         };
         
         this.getPosition = function( pagePos ) {
            var pos = (pagePos - this.getOffset()) / this.trackSize;
            pos = (pos < 0) ? 0 : pos;
            pos = (pos > 1) ? 1 : pos;   
            pos = inverted ? (1-pos) : pos;
            return pos;
         };
         
         this.display.bind("mousemove", function( event ) {
            event.preventDefault();
            if( _this.dragging ) {
               _this.updateValue( _this.getPosition( event[_this.pagePos] ) );
            }               
         });

         this.display.bind("mouseleave", function( event ) {
            event.preventDefault();
            if( _this.dragging ) {          
               _this.dragging = false;
               _this.setValue( _this.getPosition( event[_this.pagePos] ) );
            }
         });  
         
         this.display.bind("mouseup", function( event ) {
            event.preventDefault();
            if( _this.dragging ) {             
               _this.dragging = false;
               _this.setValue( _this.getPosition( event[_this.pagePos] ) );
            }
         });   
         
         this.onResize(0,0); 
      })( this, handleId, vertical, inverted );
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
      pageLink:false
   });   
  
   jQuery.fn.mediateaser = function( server, nodeInfo, _index, settings ) {  
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, nodeInfo, _index, teaser, settings ) {
         settings = jQuery.media.utils.getSettings(settings);       
         
         var _this = this;
         this.display = teaser;
         
         // If they hover over the teaser...
         this.display.bind( "mouseenter", function(event) {
            if( settings.template.onTeaserOver ) {
               settings.template.onTeaserOver( _this );
            }
         });
         
         // If they hover away from the teaser...
         this.display.bind( "mouseleave", function(event) {
            if( settings.template.onTeaserOut ) {               
               settings.template.onTeaserOut( _this );
            }
         });           
         
         // The index of this teaser
         this.index = _index;

         // Setup the node.
         this.node = this.display.medianode( server, settings ); 
         
         // Load the node information.
         if( this.node ) {
            this.node.loadNode( nodeInfo ); 
         }         
         
         // If they wish to link these teasers to actual nodes.
         if( this.node && settings.pageLink ) {
            var path = settings.baseURL;
            path += nodeInfo.path ? nodeInfo.path : ("node/" + nodeInfo.nid);
            this.node.display.wrap('<a href="' + path + '"></a>');
         }

         this.reset = function() {
            if( this.node ) {
               this.node.display.unbind(); 
            }
         };

         this.refresh = function() {
            if( this.node ) {
               this.node.onResize(0,0);   
            }   
         };

         this.setActive = function( _active ) {
            if( settings.template.onTeaserActivate ) {            
               settings.template.onTeaserActivate(this, _active);
            }          
         };
         
         this.setSelected = function( _selected ) {
            if( settings.template.onTeaserSelect ) {             
               settings.template.onTeaserSelect(this, _selected);
            }          
         }; 
         
         // Let the template setup the teaser.
         if( settings.template.onTeaserLoad ) {             
            settings.template.onTeaserLoad( this );
         }                                 
      })( server, nodeInfo, _index, this, settings );
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
 
   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      titleLinks:"#mediatitlelinks"                 
   });     
   
   jQuery.fn.mediatitlebar = function( settings ) { 
      if( this.length === 0 ) {
         return null;
      }
      return new (function( titleBar, settings ) {        
         // Save the jQuery display.
         var _this = this;
         this.display = titleBar;
         
         this.titleLinks = this.display.find( settings.ids.titleLinks );
         
         this.display.find("a").each( function() {
            var linkId = $(this).attr("href");
            
            $(this).medialink( settings, function( event ) {
               event.preventDefault(); 
               _this.display.trigger( event.data.id );               
            }, {
               id:linkId.substr(1),
               obj:$(this)
            } );
         });
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

   jQuery.media = jQuery.extend( {}, {
      utils : {
         getBaseURL : function() {
            var url = new RegExp(/^(http[s]?\:[\\\/][\\\/])([^\\\/\?]+)/);
            var results = url.exec(location.href);
            return results ? results[0] : "";
         },           
         
         getSettings : function( settings ) {
            // Make sure it exists...
            if( !settings ) {
               settings = {};
            }
                    
            // Only get the settings if they have not yet been initialized.
            if( !settings.initialized ) {
               settings = jQuery.extend( {}, jQuery.media.defaults, settings );
               settings.ids = jQuery.extend( {}, jQuery.media.ids, settings.ids );
               settings.baseURL = settings.baseURL ? settings.baseURL : jQuery.media.utils.getBaseURL();
               settings.baseURL += settings.baseURL ? "/" : "";               
               settings.initialized = true;
            }
            
            // Return the settings.
            return settings;
         },
         
         getId : function( display ) {
            return display.attr("id") ? display.attr("id") : display.attr("class") ? display.attr("class") : "mediaplayer";
         },
         
         getScaledRect : function( ratio, rect ) {
            var scaledRect = {};
            scaledRect.x = rect.x ? rect.x : 0;
            scaledRect.y = rect.y ? rect.y : 0;
            scaledRect.width = rect.width ? rect.width : 0;
            scaledRect.height = rect.height ? rect.height : 0; 

            if( ratio ) {
               var newRatio = (rect.width / rect.height);
               scaledRect.height = (newRatio > ratio) ? rect.height : Math.floor(rect.width / ratio);
               scaledRect.width = (newRatio > ratio) ? Math.floor(rect.height * ratio) : rect.width;
               scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
               scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
            }

            return scaledRect;         
         },

         // Checks all parents visibility, and resets them and adds those items to a passed in
         // array which can be used to reset their visibiltiy at a later point by calling
         // resetVisibility
         checkVisibility : function( display, invisibleParents ) {
            var isVisible = true;
            display.parents().each( function() {
               var jObject = jQuery(this);
               if( !jObject.is(':visible') ) {
                  isVisible = false;
                  var attrClass = jObject.attr("class");
                  invisibleParents.push( {
                     obj:jObject,
                     attr:attrClass
                  } );
                  jObject.removeClass(attrClass);
               }
            });
         },

         // Reset's the visibility of the passed in parent elements.
         resetVisibility : function( invisibleParents ) {
            // Now iterate through all of the invisible objects and rehide them.
            var i = invisibleParents.length;
            while(i--){
               invisibleParents[i].obj.addClass(invisibleParents[i].attr);
            }
         },
         
         getFlash : function( player, id, width, height, flashvars, wmode ) {
            // Get the protocol.
            var protocol = window.location.protocol; 
            if (protocol.charAt(protocol.length - 1) == ':') { 
               protocol = protocol.substring(0, protocol.length - 1); 
            } 

            // Convert the flashvars object to a string...
            var flashVarsString = "";
            for( var key in flashvars ) {
               if( flashvars.hasOwnProperty(key) ) {
                  flashVarsString += key + "=" + encodeURIComponent(flashvars[key]) + "&";
               }
            }
            flashVarsString = flashVarsString.replace(/&$/, '');

            // Get the HTML flash object string.
            var flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
            flash += 'codebase="' + protocol + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ';
            flash += 'width="' + width + '" ';
            flash += 'height="' + height + '" ';
            flash += 'id="' + id + '" ';
            flash += 'name="' + id + '"> ';
            flash += '<param name="allowScriptAccess" value="always"></param>'; 
            flash += '<param name="allowfullscreen" value="true" />';
            flash += '<param name="movie" value="' + player + '"></param>';
            flash += '<param name="wmode" value="' + wmode + '"></param>';
            flash += '<param name="quality" value="high"></param>';
            flash += '<param name="FlashVars" value="' + flashVarsString + '"></param>';
            flash += '<embed src="' + player + '" quality="high" width="' + width + '" height="' + height + '" ';
            flash += 'id="' + id + '" name="' + id + '" swLiveConnect="true" allowScriptAccess="always" wmode="' + wmode + '"';
            flash += 'allowfullscreen="true" type="application/x-shockwave-flash" FlashVars="' + flashVarsString + '" ';
            flash += 'pluginspage="' + protocol + '://www.macromedia.com/go/getflashplayer" />';
            flash += '</object>';
            return flash;
         },
         
         removeFlash : function( obj, id ) {
            if( typeof(swfobject) != "undefined" ) {
               swfobject.removeSWF( id );
            }
            else {
               var flash = obj.find('object').eq(0)[0];
               if( flash ) {
                  flash.parentNode.removeChild(flash);
               }
            }
         },
         
         // Insert flash routine.  If they have swfobject, then this function will dynamically use that instead.
         insertFlash : function( obj, player, id, width, height, flashvars, wmode, onAdded ) {
            jQuery.media.utils.removeFlash( obj, id );
            obj.children().remove();             
            obj.append('<div id="' + id + '"><p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p></div>');
            if( typeof(swfobject) != "undefined" ) {
               var params = {
                  allowScriptAccess:"always",
                  allowfullscreen:"true",
                  wmode:wmode,
                  quality:"high"
               };                              
               swfobject.embedSWF( 
                  player, 
                  id, 
                  width, 
                  height,
                  "9.0.0",
                  "expressInstall.swf",
                  flashvars,
                  params,
                  {},
                  function( swf ) {
                     onAdded( swf.ref );  
                  }
                  );
            }
            else {            
               var flash = jQuery.media.utils.getFlash( player, id, width, height, flashvars, wmode );
               var container = obj.find('#' + id).eq(0);
               if( jQuery.browser.msie ) {
                  container[0].outerHTML = flash;
                  onAdded( obj.find('object').eq(0)[0] );
               } else {
                  container.replaceWith( flash ); 
                  onAdded( obj.find('embed').eq(0)[0] );
               }
            }
         },
                  
         // Fix the clone method for jQuery 1.2.6 - 1.3.1
         cloneFix: function( obj, events ) {
            // Do the clone
            var ret = obj.map(function(){
               // IE copies events bound via attachEvent when
               // using cloneNode. Calling detachEvent on the
               // clone will also remove the events from the orignal
               // In order to get around this, we use innerHTML.
               // Unfortunately, this means some modifications to
               // attributes in IE that are actually only stored
               // as properties will not be copied (such as the
               // the name attribute on an input).
               var html = this.outerHTML;
               if ( !html ) {
                  var div = this.ownerDocument.createElement("div");
                  div.appendChild( this.cloneNode(true) );
                  html = div.innerHTML;
               }
   
               return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0];
            });
      
            // Copy the events from the original to the clone
            if ( events === true ) {
               var orig = obj.find("*").andSelf(), i = 0;
      
               ret.find("*").andSelf().each(function(){
                  if ( this.nodeName !== orig[i].nodeName ) {
                     return;
                  }
      
                  var events = jQuery.data( orig[i], "events" );
      
                  for ( var type in events ) {
                     if( events.hasOwnProperty( type ) ) {
                        for ( var handler in events[ type ] ) {
                           if( events[ type ].hasOwnProperty( handler ) ) {
                              jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
                           }
                        }
                     }
                  }
      
                  i++;
               });
            }
      
            // Return the cloned set
            return ret;
         }                                                   
      }
   }, jQuery.media );  
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
      playerId = playerId.replace("_media", "");      
      jQuery.media.players[playerId].node.player.media.player.onReady();     
   };

   window.onVimeoFinish = function( playerId ) {
      playerId = playerId.replace("_media", "");           
      jQuery.media.players[playerId].node.player.media.player.onFinished();     
   };

   window.onVimeoLoading = function( data, playerId ) {
      playerId = playerId.replace("_media", "");           
      jQuery.media.players[playerId].node.player.media.player.onLoading( data );       
   };

   window.onVimeoPlay = function( playerId ) {
      playerId = playerId.replace("_media", "");           
      jQuery.media.players[playerId].node.player.media.player.onPlaying();    
   };

   window.onVimeoPause = function( playerId ) {
      playerId = playerId.replace("_media", "");           
      jQuery.media.players[playerId].node.player.media.player.onPaused();   
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
               width:this.display.width(),
               height:this.display.height(),
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
               this.display.width(), 
               this.display.height(),
               flashvars,
               options.wmode,
               function( obj ) {
                  _this.player = obj; 
                  _this.loadPlayer();  
               }
               );
         };      
         
         this.getId = function( path ) {
            var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/([0-9]+)/i;
            return (path.search(regex) == 0) ? path.replace(regex, "$2") : path;
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
            if( this.ready && this.player ) {                              
               // Add our event listeners.
               this.player.api_addEventListener('onFinish', 'onVimeoFinish');
               this.player.api_addEventListener('onLoading', 'onVimeoLoading');
               this.player.api_addEventListener('onPlay', 'onVimeoPlay');
               this.player.api_addEventListener('onPause', 'onVimeoPause');
               
               // Let them know the player is ready.          
               onUpdate( {
                  type:"playerready"
               } );
               
               this.playMedia();
            }         
         };
         
         this.onFinished = function() {
            onUpdate( {
               type:"complete"
            } );
         };

         this.onLoading = function( data ) {
            this.bytesLoaded = data.bytesLoaded;
            this.bytesTotal = data.bytesTotal;
         };
         
         this.onPlaying = function() {
            onUpdate( {
               type:"playing"
            } );
         };                 

         this.onPaused = function() {
            onUpdate( {
               type:"paused"
            } );
         };                  
         
         this.playMedia = function() {
            onUpdate({
               type:"buffering"
            });
            this.player.api_play();
         };
         
         this.pauseMedia = function() {
            this.player.api_pause();           
         };
         
         this.stopMedia = function() {
            this.pauseMedia();  
            this.player.api_unload();            
         };
         
         this.seekMedia = function( pos ) {
            this.player.api_seekTo( pos );           
         };
         
         this.setVolume = function( vol ) {
            this.currentVolume = vol;
            this.player.api_setVolume( (vol*100) );          
         };
         
         // For some crazy reason... Vimeo has not implemented this... so just cache the value.
         this.getVolume = function() { 
            return this.currentVolume; 
         };         
         
         this.getDuration = function() {
            return this.player.api_getDuration();           
         };
         
         this.getCurrentTime = function() {
            return this.player.api_getCurrentTime();
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
         this.setSize = function( newWidth, newHeight ) {};         
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

   jQuery.fn.mediavoter = function( settings, server, userVote ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( voteObj, settings, server, userVote ) {
         // Save the jQuery display.
         this.display = voteObj;
         var _this = this;
         
         // The node id.
         this.nodeId = 0;
         
         // Store all of our votes.
         this.votes = [];
         
         // Get the tag for the voting.
         this.tag = this.display.attr("tag");
         
         // Setup each vote element.  
         this.display.find("div").each( function() {
            if( userVote ) {
               $(this).css("cursor", "pointer");
               $(this).bind( "click", function( event ) {
                  _this.setVote( parseInt($(this).attr("vote"), 10) );
               });
               $(this).bind( "mouseenter", function( event ) {
                  _this.updateVote( {
                     value: parseInt($(this).attr("vote"), 10)
                     }, true );
               });
            }
            _this.votes.push( {
               vote:parseInt($(this).attr("vote"), 10),
               display:$(this)
            } );
         });

         // Sort the votes based on numerical order.
         this.votes.sort( function( voteA, voteB ) {
            return (voteA.vote - voteB.vote);
         });          
         
         // If this is a uservoter, then add the mouse leave event.
         if( userVote ) {
            this.display.bind( "mouseleave", function( event ) {
               _this.updateVote( {
                  value:0
               }, true );
            });
         }        
         
         // Update a vote value.
         this.updateVote = function( vote, hover ) {
            if( vote && settings.template.updateVote ) {            
               settings.template.updateVote( this, vote.value, hover ); 
            }  
         };
         
         // Get the vote from the server.
         this.getVote = function( nodeInfo ) {
            if( nodeInfo && nodeInfo.nid ) {
               this.nodeId = parseInt(nodeInfo.nid, 10);
               if( nodeInfo.vote ) {
                  var vote = userVote ? nodeInfo.vote.uservote : nodeInfo.vote.vote;
                  this.updateVote( nodeInfo.vote.vote, false );  
                  this.display.trigger( "voteGet", vote );
               }
               else {
                  if( server && nodeInfo.nid && (this.display.length > 0) ) {
                     this.display.trigger( "processing" );
                     var cmd = userVote ? jQuery.media.commands.getUserVote : jQuery.media.commands.getVote;
                     server.call( cmd, function( vote ) {
                        _this.updateVote( vote, false );
                        _this.display.trigger( "voteGet", vote );
                     }, null, "node", this.nodeId, this.tag );
                  }
               }
            }
         };
         
         // Set the current vote.
         this.setVote = function( voteValue ) {
            if( server && this.nodeId ) {
               this.display.trigger( "processing" );
               this.updateVote( {
                  value:voteValue
               }, false );
               server.call( jQuery.media.commands.setVote, function( vote ) {
                  _this.display.trigger( "voteSet", vote );            
               }, null, "node", this.nodeId, voteValue, this.tag );
            }
         };
         
         // Delete the current vote.
         this.deleteVote = function() {
            if( server && this.nodeId ) {
               this.display.trigger( "processing" );
               server.call( jQuery.media.commands.deleteVote, function( vote ) {
                  _this.updateVote( vote, false );
                  _this.display.trigger( "voteDelete", vote );
               }, null, "node", this.nodeId, this.tag );
            }
         };
      })( this, settings, server, userVote );
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
      playerId = playerId.replace("_media", "");
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
               this.display.width(), 
               this.display.height(),
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
            return (path.search(regex) == 0) ? path.replace(regex, "$2") : path;
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
               this.player.loadVideoById( this.getId( this.videoFile.path ), 0, options.quality );
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
               this.player.addEventListener('onStateChange', options.id + 'StateChange');
               this.player.addEventListener('onError', options.id + 'PlayerError');
               this.player.addEventListener('onPlaybackQualityChange', options.id + 'QualityChange');
               
               // Let them know the player is ready.          
               onUpdate( {
                  type:"playerready"
               } );
               
               // Load our video.
               this.player.loadVideoById( this.getId( this.videoFile.path ), 0 );  
            }         
         };
         
         // Called when the YouTube player state changes.
         this.onStateChange = function( newState ) {
            var playerState = this.getPlayerState( newState );
            onUpdate( {
               type:playerState
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
            console.log(errorText);
            onUpdate( {
               type:"error",
               data:errorText
            } );
         };
         
         // Translates the player state for the YouTube API player.
         this.getPlayerState = function( playerState ) {
            switch (playerState) {
               case 5:
                  return 'ready';
               case 3:
                  return 'buffering';
               case 2:
                  return 'paused';
               case 1:
                  return 'playing';
               case 0:
                  return 'complete';
               case -1:
                  return 'stopped';
               default:
                  return 'unknown';
            }
            return 'unknown';
         };                  
         
         this.setSize = function( newWidth, newHeight ) {                
         //this.player.setSize(newWidth, newHeight);
         };           
         
         this.playMedia = function() {
            onUpdate({
               type:"buffering"
            });
            this.player.playVideo();
         };
         
         this.pauseMedia = function() {
            this.player.pauseVideo();           
         };
         
         this.stopMedia = function() {
            this.player.stopVideo();              
         };
         
         this.seekMedia = function( pos ) {
            onUpdate({
               type:"buffering"
            });
            this.player.seekTo( pos, true );           
         };
         
         this.setVolume = function( vol ) {
            this.player.setVolume( vol * 100 );
         };
         
         this.setQuality = function( quality ) {
            this.player.setPlaybackQuality( quality );           
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
         
         this.getQuality = function() {
            return this.player.getPlaybackQuality();      
         };

         this.getEmbedCode = function() {
            return this.player.getVideoEmbedCode();
         };
         
         this.getMediaLink = function() {
            return this.player.getVideoUrl();   
         };

         this.getBytesLoaded = function() {
            return this.player.getVideoBytesLoaded();
         };
         
         this.getBytesTotal = function() {
            return this.player.getVideoBytesTotal();
         };  
         
         this.hasControls = function() {
            return false;
         };
         this.showControls = function(show) {};           
      })( this, options, onUpdate );
   };
})(jQuery);         