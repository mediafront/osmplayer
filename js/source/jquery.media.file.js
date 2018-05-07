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
   
  // Checks the file type for browser compatibilty.
  jQuery.media.checkPlayType = function( elem, playType ) {
    if( (typeof elem.canPlayType) == 'function' ) {
      return ("no" !== elem.canPlayType(playType)) && ("" !== elem.canPlayType(playType));
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
    types.ogg  = jQuery.media.checkPlayType( elem, 'video/ogg; codecs="theora, vorbis"');
    types.h264  = jQuery.media.checkPlayType( elem, 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    types.webm = jQuery.media.checkPlayType( elem, 'video/webm; codecs="vp8, vorbis"');
         
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
        break;
    }
    return "flash";
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
      default:
        break;
    }
    return '';
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
      default:
        break;     
    }
    return 0;
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
      default:
        break;
    }
    return '';
  };
})(jQuery);