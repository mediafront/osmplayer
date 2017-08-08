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
})(jQuery);         