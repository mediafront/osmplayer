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