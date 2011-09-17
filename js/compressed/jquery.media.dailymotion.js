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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};window.onDailymotionPlayerReady=function(b){b=b.replace("_media","");jQuery.media.players[b].node.player.media.player.onReady();};jQuery.media.playerTypes=jQuery.extend(jQuery.media.playerTypes,{dailymotion:function(b){return(b.search(/^http(s)?\:\/\/(www\.)?dailymotion\.com/i)===0);}});jQuery.fn.mediadailymotion=function(c,b){return new (function(f,e,d){this.display=f;var g=this;this.player=null;this.videoFile=null;this.meta=false;this.loaded=false;this.ready=false;this.createMedia=function(i,k){this.videoFile=i;this.ready=false;var h=(e.id+"_media");var j=Math.floor(Math.random()*1000000);var l="http://www.dailymotion.com/swf/"+i.path+"?rand="+j+"&amp;enablejsapi=1&amp;playerapiid="+h;jQuery.media.utils.insertFlash(this.display,l,h,"100%","100%",{},e.wmode,function(m){g.player=m;g.loadPlayer();});};this.loadMedia=function(h){if(this.player){this.loaded=false;this.meta=false;this.videoFile=h;d({type:"playerready"});this.player.loadVideoById(this.videoFile.path,0);}};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){window[e.id+"StateChange"]=function(h){g.onStateChange(h);};window[e.id+"PlayerError"]=function(h){g.onError(h);};this.player.addEventListener("onStateChange",e.id+"StateChange");this.player.addEventListener("onError",e.id+"PlayerError");d({type:"playerready"});this.player.loadVideoById(this.videoFile.path,0);}};this.onStateChange=function(i){var h=this.getPlayerState(i);if(!(!this.meta&&h.state=="stopped")){d({type:h.state,busy:h.busy});}if(!this.loaded&&h.state=="buffering"){this.loaded=true;d({type:"paused",busy:"hide"});if(e.autostart){this.playMedia();}}if(!this.meta&&h.state=="playing"){this.meta=true;d({type:"meta"});}};this.onError=function(i){var h="An unknown error has occured: "+i;if(i==100){h="The requested video was not found.  ";h+="This occurs when a video has been removed (for any reason), ";h+="or it has been marked as private.";}else{if((i==101)||(i==150)){h="The video requested does not allow playback in an embedded player.";}}d({type:"error",data:h});};this.getPlayerState=function(h){switch(h){case 5:return{state:"ready",busy:false};case 3:return{state:"buffering",busy:"show"};case 2:return{state:"paused",busy:"hide"};case 1:return{state:"playing",busy:"hide"};case 0:return{state:"complete",busy:false};case -1:return{state:"stopped",busy:false};default:return{state:"unknown",busy:false};}return"unknown";};this.playMedia=function(){d({type:"buffering",busy:"show"});this.player.playVideo();};this.pauseMedia=function(){this.player.pauseVideo();};this.stopMedia=function(){this.player.stopVideo();};this.destroy=function(){this.stopMedia();jQuery.media.utils.removeFlash(this.display,(e.id+"_media"));this.display.children().remove();};this.seekMedia=function(h){d({type:"buffering",busy:"show"});this.player.seekTo(h,true);};this.setVolume=function(h){this.player.setVolume(h*100);};this.getVolume=function(){return(this.player.getVolume()/100);};this.getDuration=function(){return this.player.getDuration();};this.getCurrentTime=function(){return this.player.getCurrentTime();};this.getBytesLoaded=function(){return this.player.getVideoBytesLoaded();};this.getBytesTotal=function(){return this.player.getVideoBytesTotal();};this.getEmbedCode=function(){return this.player.getVideoEmbedCode();};this.getMediaLink=function(){return this.player.getVideoUrl();};this.hasControls=function(){return true;};this.showControls=function(h){};this.setQuality=function(h){};this.getQuality=function(){return"";};})(this,c,b);};})(jQuery);