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
(function(a){window.onFlashPlayerReady=function(b){jQuery.media.players[b].node.player.media.player.onReady();};window.onFlashPlayerUpdate=function(c,b){jQuery.media.players[c].node.player.media.player.onMediaUpdate(b);};window.onFlashPlayerDebug=function(b){if(window.console&&console.log){console.log(b);}};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{flashPlayer:"./flash/mediafront.swf",skin:"default",config:"nocontrols"});jQuery.fn.mediaflash=function(c,b){return new (function(f,e,d){e=jQuery.media.utils.getSettings(e);this.display=f;var g=this;this.player=null;this.mediaFile=null;this.preview="";this.ready=false;this.translate={mediaConnected:"connected",mediaBuffering:"buffering",mediaPaused:"paused",mediaPlaying:"playing",mediaStopped:"stopped",mediaComplete:"complete",mediaMeta:"meta"};this.busy={mediaConnected:false,mediaBuffering:"show",mediaPaused:"hide",mediaPlaying:"hide",mediaStopped:false,mediaComplete:false,mediaMeta:false};this.createMedia=function(h,l){this.mediaFile=h;this.preview=l;this.ready=false;var j=(e.id+"_media");var k=Math.floor(Math.random()*1000000);var m=e.flashPlayer+"?rand="+k;var i={config:e.config,id:e.id,file:h.path,image:this.preview,skin:e.skin,autostart:(e.autostart||!e.autoLoad)};if(h.stream){i.stream=h.stream;}if(e.debug){i.debug="1";}jQuery.media.utils.insertFlash(this.display,m,j,"100%","100%",i,e.wmode,function(n){g.player=n;g.loadPlayer();});};this.loadMedia=function(h){if(this.player&&this.ready){this.mediaFile=h;this.player.loadMedia(h.path,h.stream);d({type:"playerready"});}};this.onReady=function(){this.ready=true;this.loadPlayer();};this.loadPlayer=function(){if(this.ready&&this.player){d({type:"playerready"});}};this.onMediaUpdate=function(h){d({type:this.translate[h],busy:this.busy[h]});};this.playMedia=function(){if(this.player&&this.ready){this.player.playMedia();}};this.pauseMedia=function(){if(this.player&&this.ready){this.player.pauseMedia();}};this.stopMedia=function(){if(this.player&&this.ready){this.player.stopMedia();}};this.destroy=function(){this.stopMedia();jQuery.media.utils.removeFlash(this.display,(e.id+"_media"));this.display.children().remove();};this.seekMedia=function(h){if(this.player&&this.ready){this.player.seekMedia(h);}};this.setVolume=function(h){if(this.player&&this.ready){this.player.setVolume(h);}};this.getVolume=function(){return(this.player&&this.ready)?this.player.getVolume():0;};this.getDuration=function(){return(this.player&&this.ready)?this.player.getDuration():0;};this.getCurrentTime=function(){return(this.player&&this.ready)?this.player.getCurrentTime():0;};this.getBytesLoaded=function(){return(this.player&&this.ready)?this.player.getMediaBytesLoaded():0;};this.getBytesTotal=function(){return(this.player&&this.ready)?this.player.getMediaBytesTotal():0;};this.hasControls=function(){return true;};this.showControls=function(h){if(this.player&&this.ready){this.player.showPlugin("controlBar",h);this.player.showPlugin("playLoader",h);}};this.getEmbedCode=function(){var h={config:"config",id:"mediafront_player",file:this.mediaFile.path,image:this.preview,skin:e.skin};if(this.mediaFile.stream){h.stream=this.mediaFile.stream;}return jQuery.media.utils.getFlash(e.flashPlayer,"mediafront_player",e.embedWidth,e.embedHeight,h,e.wmode);};this.setQuality=function(h){};this.getQuality=function(){return"";};this.getMediaLink=function(){return"This video currently does not have a link.";};})(this,c,b);};})(jQuery);