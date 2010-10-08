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
(function(a){jQuery.fn.mediahtml5=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.bytesLoaded=0;this.bytesTotal=0;this.mediaType="";this.getPlayer=function(h,m){var j=e.id+"_"+this.mediaType;var l="<"+this.mediaType+' style="position:absolute" id="'+j+'"';l+=(this.mediaType=="video")?' width="'+this.display.width()+'px" height="'+this.display.height()+'px"':"";l+=m?' poster="'+m+'"':"";if(typeof h==="array"){l+=">";var k=h.length;while(k--){l+='<source src="'+h[k].path+'" type="'+h[k].mimetype+'">';}}else{l+=' src="'+h.path+'">Unable to display media.';}l+="</"+this.mediaType+">";this.display.append(l);return this.display.find("#"+j).eq(0)[0];};this.createMedia=function(h,i){jQuery.media.utils.removeFlash(this.display,e.id+"_media");this.display.children().remove();this.mediaType=this.getMediaType(h);this.player=this.getPlayer(h,i);this.player.addEventListener("abort",function(){d({type:"stopped"});},true);this.player.addEventListener("loadstart",function(){d({type:"ready"});},true);this.player.addEventListener("loadedmetadata",function(){d({type:"meta"});},true);this.player.addEventListener("ended",function(){d({type:"complete"});},true);this.player.addEventListener("pause",function(){d({type:"paused"});},true);this.player.addEventListener("play",function(){d({type:"playing"});},true);this.player.addEventListener("error",function(){d({type:"error"});},true);this.player.addEventListener("progress",function(j){g.bytesLoaded=j.loaded;g.bytesTotal=j.total;},true);this.player.autoplay=true;this.player.autobuffer=true;d({type:"playerready"});};this.loadMedia=function(h){this.createMedia(h);};this.getMediaType=function(h){var i=(typeof h==="array")?h[0].extension:h.extension;switch(i){case"ogg":case"ogv":case"mp4":case"m4v":return"video";case"oga":case"mp3":return"audio";}return"video";};this.playMedia=function(){this.player.play();};this.pauseMedia=function(){this.player.pause();};this.stopMedia=function(){this.pauseMedia();this.player.src="";};this.seekMedia=function(h){this.player.currentTime=h;};this.setVolume=function(h){this.player.volume=h;};this.getVolume=function(){return this.player.volume;};this.getDuration=function(){return this.player.duration;};this.getCurrentTime=function(){return this.player.currentTime;};this.getBytesLoaded=function(){return this.bytesLoaded;};this.getBytesTotal=function(){return this.bytesTotal;};this.setQuality=function(h){};this.getQuality=function(){return"";};this.hasControls=function(){return false;};this.showControls=function(h){};this.setSize=function(i,h){};this.getEmbedCode=function(){return"This media cannot be embedded.";};this.getMediaLink=function(){return"This media currently does not have a link.";};})(this,c,b);};})(jQuery);