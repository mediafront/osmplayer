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