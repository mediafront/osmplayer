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
})(jQuery);