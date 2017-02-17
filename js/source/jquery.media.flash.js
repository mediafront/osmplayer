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
      flashplayer:"./flash/mediafront.swf",
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
         
         this.createMedia = function( videoFile ) {
            this.videoFile = videoFile;
            this.ready = false;
            var playerId = (settings.id + "_media");            
            var rand = Math.floor(Math.random() * 1000000); 
            var flashplayer = settings.flashplayer + "?rand=" + rand;
            var flashvars = {
               config:settings.config,
               id:settings.id,
               file:videoFile.path,
               skin:settings.skin
            };
            if( videoFile.stream ) {
               flashvars.stream = videoFile.stream;
            }
            if( settings.debug ) {
               flashvars.debug = "1";
            }
            jQuery.media.utils.insertFlash( 
               this.display, 
               flashplayer, 
               playerId, 
               this.display.width(), 
               this.display.height(),
               flashvars,
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
               this.player.loadMedia( videoFile.path ); 
               
               // Let them know the player is ready.          
               onUpdate( {type:"playerready"} );                 
            } 
         };      

         this.onReady = function() { 
            this.ready = true;   
            this.loadPlayer();
         };           
         
         this.loadPlayer = function() {
            if( this.ready && this.player ) {
               onUpdate( {type:"playerready"} );
            }         
         };
         
         this.onMediaUpdate = function( eventType ) {
            onUpdate( {type:this.translate[eventType]} ); 
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

         this.hasControls = function() { return true; };         
         
         this.showControls = function(show) {
            this.player.showPlugin("controlBar", show);
            this.player.showPlugin("playLoader", show);
         };         
         
         this.getEmbedCode = function() { 
            var flashVars = {
               config:"config",
               id:"mediafront_player",
               file:this.videoFile.path,
               skin:settings.skin
            };
            if( this.videoFile.stream ) {
               flashVars.stream = this.videoFile.stream;
            }                    
            return jQuery.media.utils.getFlash( 
               settings.flashplayer,
               "mediafront_player", 
               settings.embedWidth, 
               settings.embedHeight, 
               flashVars );
         };         
         
         // Not implemented yet...
         this.setQuality = function( quality ) {};         
         this.getQuality = function() { return ""; };
         this.setSize = function( newWidth, newHeight ) {};           
         this.getMediaLink = function() { return "This video currently does not have a link."; };       
      })( this, settings, onUpdate );
   };
})(jQuery);         