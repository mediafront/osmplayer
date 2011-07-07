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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.checkPlayType=function(c,b){if((typeof c.canPlayType)=="function"){return("no"!==c.canPlayType(b))&&(""!==c.canPlayType(b));}else{return false;}};jQuery.media.getPlayTypes=function(){var b={};var c=document.createElement("video");b.ogg=jQuery.media.checkPlayType(c,'video/ogg; codecs="theora, vorbis"');b.h264=jQuery.media.checkPlayType(c,'video/mp4; codecs="avc1.42E01E, mp4a.40.2"');b.webm=jQuery.media.checkPlayType(c,'video/webm; codecs="vp8, vorbis"');c=document.createElement("audio");b.audioOgg=jQuery.media.checkPlayType(c,"audio/ogg");b.mp3=jQuery.media.checkPlayType(c,"audio/mpeg");return b;};jQuery.media.playTypes=null;jQuery.media.file=function(b,c){if(!jQuery.media.playTypes){jQuery.media.playTypes=jQuery.media.getPlayTypes();}b=(typeof b==="string")?{path:b}:b;this.duration=b.duration?b.duration:0;this.bytesTotal=b.bytesTotal?b.bytesTotal:0;this.quality=b.quality?b.quality:0;this.stream=c.streamer?c.streamer:b.stream;this.path=b.path?jQuery.trim(b.path):(c.baseURL+jQuery.trim(b.filepath));this.extension=b.extension?b.extension:this.getFileExtension();this.weight=b.weight?b.weight:this.getWeight();this.player=b.player?b.player:this.getPlayer();this.mimetype=b.mimetype?b.mimetype:this.getMimeType();this.type=b.type?b.type:this.getType();};jQuery.media.file.prototype.getFileExtension=function(){return this.path.substring(this.path.lastIndexOf(".")+1).toLowerCase();};jQuery.media.file.prototype.getPlayer=function(){switch(this.extension){case"ogg":case"ogv":return jQuery.media.playTypes.ogg?"html5":"flash";case"mp4":case"m4v":return jQuery.media.playTypes.h264?"html5":"flash";case"webm":return jQuery.media.playTypes.webm?"html5":"flash";case"oga":return jQuery.media.playTypes.audioOgg?"html5":"flash";case"mp3":return jQuery.media.playTypes.mp3?"html5":"flash";case"swf":case"flv":case"f4v":case"f4a":case"mov":case"3g2":case"3gp":case"3gpp":case"m4a":case"aac":case"wav":case"aif":case"wma":return"flash";default:for(var b in jQuery.media.playerTypes){if(jQuery.media.playerTypes.hasOwnProperty(b)){if(jQuery.media.playerTypes[b](this.path)){return b;}}}break;}return"flash";};jQuery.media.file.prototype.getType=function(){switch(this.extension){case"swf":case"webm":case"ogg":case"ogv":case"mp4":case"m4v":case"flv":case"f4v":case"mov":case"3g2":case"3gp":case"3gpp":return"video";case"oga":case"mp3":case"f4a":case"m4a":case"aac":case"wav":case"aif":case"wma":return"audio";default:break;}return"";};jQuery.media.file.prototype.getWeight=function(){switch(this.extension){case"mp4":case"m4v":case"m4a":return jQuery.media.playTypes.h264?3:7;case"webm":return jQuery.media.playTypes.webm?4:8;case"ogg":case"ogv":return jQuery.media.playTypes.ogg?5:20;case"oga":return jQuery.media.playTypes.audioOgg?5:20;case"mp3":return 6;case"mov":case"swf":case"flv":case"f4v":case"f4a":case"3g2":case"3gp":case"3gpp":return 9;case"wav":case"aif":case"aac":return 10;case"wma":return 11;default:break;}return 0;};jQuery.media.file.prototype.getMimeType=function(){switch(this.extension){case"mp4":case"m4v":case"flv":case"f4v":return"video/mp4";case"webm":return"video/x-webm";case"ogg":case"ogv":return"video/ogg";case"3g2":return"video/3gpp2";case"3gpp":case"3gp":return"video/3gpp";case"mov":return"video/quicktime";case"swf":return"application/x-shockwave-flash";case"oga":return"audio/ogg";case"mp3":return"audio/mpeg";case"m4a":case"f4a":return"audio/mp4";case"aac":return"audio/aac";case"wav":return"audio/vnd.wave";case"wma":return"audio/x-ms-wma";default:break;}return"";};})(jQuery);