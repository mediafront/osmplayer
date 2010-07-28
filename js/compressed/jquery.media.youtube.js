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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};window.onYouTubePlayerReady=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onReady();};jQuery.media.playerTypes=jQuery.extend(jQuery.media.playerTypes,{youtube:function(b){return(b.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i)===0);}});jQuery.fn.mediayoutube=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.videoFile=null;this.loaded=false;this.ready=false;this.createMedia=function(i,k){this.videoFile=i;this.ready=false;var h=(e.id+"_media");var j=Math.floor(Math.random()*1000000);var l="http://www.youtube.com/apiplayer?rand="+j+"&amp;version=3&amp;enablejsapi=1&amp;playerapiid="+h;jQuery.media.utils.insertFlash(this.display,l,h,this.display.width(),this.display.height(),{},e.wmode,function(m){g.player=m;g.loadPlayer();});};this.getId=function(i){var h=/^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;return(i.search(h)==0)?i.replace(h,"$2"):i;};this.loadMedia=function(h){if(this.player){this.loaded=false;this.videoFile=h;d({type:"playerready"});this.player.loadVideoById(this.getId(this.videoFile.path),0,e.quality);}};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){window[e.id+"StateChange"]=function(h){g.onStateChange(h);};window[e.id+"PlayerError"]=function(h){g.onError(h);};window[e.id+"QualityChange"]=function(h){g.quality=h;};this.player.addEventListener("onStateChange",e.id+"StateChange");this.player.addEventListener("onError",e.id+"PlayerError");this.player.addEventListener("onPlaybackQualityChange",e.id+"QualityChange");d({type:"playerready"});this.player.loadVideoById(this.getId(this.videoFile.path),0);}};this.onStateChange=function(i){var h=this.getPlayerState(i);d({type:h});if(!this.loaded&&h=="playing"){this.loaded=true;d({type:"meta"});}};this.onError=function(i){var h="An unknown error has occured: "+i;if(i==100){h="The requested video was not found.  ";h+="This occurs when a video has been removed (for any reason), ";h+="or it has been marked as private.";}else{if((i==101)||(i==150)){h="The video requested does not allow playback in an embedded player.";}}console.log(h);d({type:"error",data:h});};this.getPlayerState=function(h){switch(h){case 5:return"ready";case 3:return"buffering";case 2:return"paused";case 1:return"playing";case 0:return"complete";case -1:return"stopped";default:return"unknown";}return"unknown";};this.setSize=function(i,h){};this.playMedia=function(){d({type:"buffering"});this.player.playVideo();};this.pauseMedia=function(){this.player.pauseVideo();};this.stopMedia=function(){this.player.stopVideo();};this.seekMedia=function(h){d({type:"buffering"});this.player.seekTo(h,true);};this.setVolume=function(h){this.player.setVolume(h*100);};this.setQuality=function(h){this.player.setPlaybackQuality(h);};this.getVolume=function(){return(this.player.getVolume()/100);};this.getDuration=function(){return this.player.getDuration();};this.getCurrentTime=function(){return this.player.getCurrentTime();};this.getQuality=function(){return this.player.getPlaybackQuality();};this.getEmbedCode=function(){return this.player.getVideoEmbedCode();};this.getMediaLink=function(){return this.player.getVideoUrl();};this.getBytesLoaded=function(){return this.player.getVideoBytesLoaded();};this.getBytesTotal=function(){return this.player.getVideoBytesTotal();};this.hasControls=function(){return false;};this.showControls=function(h){};})(this,c,b);};})(jQuery);