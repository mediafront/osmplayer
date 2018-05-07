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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{node:"",incrementTime:5});jQuery.media.ids=jQuery.extend(jQuery.media.ids,{voter:"#mediavoter",uservoter:"#mediauservoter",mediaRegion:"#mediaregion",field:".mediafield"});jQuery.fn.medianode=function(c,b){if(this.length===0){return null;}return new (function(f,e,d){d=jQuery.media.utils.getSettings(d);this.display=e;this.nodeInfo={};this.incremented=false;var g=this;this.player=this.display.find(d.ids.mediaRegion).minplayer(d);if(this.player&&(d.incrementTime!==0)){this.player.display.unbind("mediaupdate").bind("mediaupdate",function(h,i){g.onMediaUpdate(i);});}this.images=[];this.addVoters=function(h){this.voter=h.find(d.ids.voter).mediavoter(d,f,false);this.uservoter=h.find(d.ids.uservoter).mediavoter(d,f,true);if(this.uservoter&&this.voter){this.uservoter.display.unbind("processing").bind("processing",function(){g.player.showBusy(2,true);});this.uservoter.display.unbind("voteGet").bind("voteGet",function(){g.player.showBusy(2,false);});this.uservoter.display.unbind("voteSet").bind("voteSet",function(j,i){g.player.showBusy(2,false);g.voter.updateVote(i);});}};this.addVoters(this.display);this.onMediaUpdate=function(h){if(!this.incremented){switch(h.type){case"update":if((d.incrementTime>0)&&(h.currentTime>d.incrementTime)){this.incremented=true;f.call(jQuery.media.commands.incrementCounter,null,null,g.nodeInfo.nid);}break;case"complete":if(d.incrementTime<0){this.incremented=true;f.call(jQuery.media.commands.incrementCounter,null,null,g.nodeInfo.nid);}break;default:break;}}};this.loadNode=function(h){return this.getNode(this.translateNode(h));};this.translateNode=function(i){var j=((typeof i)=="number")||((typeof i)=="string");if(!i){var h=d.node;if((typeof h)=="object"){h.load=false;return h;}else{return h?{nid:h,load:true}:null;}}else{if(j){return{nid:i,load:true};}else{i.load=false;return i;}}};this.getNode=function(h){if(h){if(f&&h.load){f.call(jQuery.media.commands.loadNode,function(i){g.setNode(i);},null,h.nid,{});}else{this.setNode(h);}return true;}return false;};this.setNode=function(h){if(h){this.nodeInfo=h;this.incremented=false;if(this.player&&this.nodeInfo.mediafiles){var i=this.getImage("preview");if(i){this.player.loadImage(i.path);}else{this.player.clearImage();}this.player.loadFiles(this.nodeInfo.mediafiles.media);}if(this.voter){this.voter.getVote(h);}if(this.uservoter){this.uservoter.getVote(h);}this.display.find(d.ids.field).each(function(){g.setField(this,h,a(this).attr("type"),a(this).attr("field"));});this.display.trigger("nodeload",this.nodeInfo);}};this.setField=function(j,i,h,k){if(h){switch(h){case"text":this.setTextField(j,i,k);break;case"image":this.setImageField(j,k);break;case"cck_text":this.setCCKTextField(j,i,k);break;default:break;}}};this.setTextField=function(i,h,k){var j=h[k];if(j){a(i).empty().html(j);}return true;};this.setCCKTextField=function(i,h,k){if(args.fieldType=="cck_text"){var j=h[k];if(j){a(i).empty().html(j["0"].value);}}return true;};this.onResize=function(){if(this.player){this.player.onResize();}};this.getImage=function(j){var h=this.nodeInfo.mediafiles?this.nodeInfo.mediafiles.images:null;var k=null;if(h){if(h[j]){k=h[j];}else{for(var i in h){if(h.hasOwnProperty(i)){k=h[i];break;}}}k=(typeof k==="string")?{path:k}:k;k.path=k.path?jQuery.trim(k.path):(d.baseURL+jQuery.trim(k.filepath));if(k&&k.path){k.path=k.path?jQuery.trim(k.path):(d.baseURL+jQuery.trim(k.filepath));}else{k=null;}}return k;};this.setImageField=function(i,k){var h=this.getImage(k);if(h){var j=a(i).empty().mediaimage();this.images.push(j);j.loadImage(h.path);}};})(c,this,b);};})(jQuery);