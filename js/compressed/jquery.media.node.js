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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{node:""});jQuery.media.ids=jQuery.extend(jQuery.media.ids,{voter:".mediavoter",uservoter:".mediauservoter",mediaRegion:".mediaregion",field:".mediafield"});jQuery.fn.medianode=function(c,b){if(this.length===0){return null;}return new (function(f,e,d){d=jQuery.media.utils.getSettings(d);this.display=e;this.nodeInfo={};var g=this;this.player=this.display.find(d.ids.mediaRegion).minplayer(d);this.images=[];this.waiting=false;this.width=this.display.width();this.height=this.display.height();this.voter=this.display.find(d.ids.voter).mediavoter(d,f,false);this.uservoter=this.display.find(d.ids.uservoter).mediavoter(d,f,true);if(this.uservoter&&this.voter){this.uservoter.display.bind("processing",function(){g.waiting=true;g.player.busy.show();});this.uservoter.display.bind("voteGet",function(){if(g.waiting){g.waiting=false;g.player.busy.hide();}});this.uservoter.display.bind("voteSet",function(i,h){if(g.waiting){g.waiting=false;g.player.busy.hide();}g.voter.updateVote(h);});}this.loadNode=function(h){this.getNode(this.translateNode(h));};this.translateNode=function(i){var j=((typeof i)=="number")||((typeof i)=="string");if(!i){var h=d.node;if((typeof h)=="object"){h.load=false;return h;}else{return h?{nid:h,load:true}:null;}}else{if(j){return{nid:i,load:true};}else{i.load=false;return i;}}};this.onResize=function(j,h){if(this.player){this.player.onResize(j,h);}var k=this.images.length;while(k--){this.images[k].refresh();}};this.getNode=function(h){if(h){if(f&&h.load){f.call(jQuery.media.commands.loadNode,function(i){g.setNode(i);},null,h.nid,{});}else{this.setNode(h);}}};this.setNode=function(h){if(h){this.nodeInfo=h;if(this.player&&this.nodeInfo.mediafiles){if(this.player.loadFiles(this.nodeInfo.mediafiles.media)){this.player.playNext();}var i=this.getImage("preview");if(i){this.player.loadImage(i.path);}else{this.player.clearImage();}}if(this.voter){this.voter.getVote(h);}if(this.uservoter){this.uservoter.getVote(h);}this.display.find(d.ids.field).each(function(){g.setField(this,h,a(this).attr("type"),a(this).attr("field"));});this.display.trigger("nodeload",this.nodeInfo);}};this.setField=function(j,i,h,k){if(h){switch(h){case"text":this.setTextField(j,i,k);return true;case"image":return this.setImageField(j,k);default:if(d.template.setField){return d.template.setField({node:i,field:j,fieldType:h,fieldName:k});}else{return true;}}}};this.setTextField=function(i,h,k){var j=h[k];if(j){a(i).empty().html(j);}};this.getImage=function(j){var h=this.nodeInfo.mediafiles?this.nodeInfo.mediafiles.images:null;var k=null;if(h){if(h[j]){k=h[j];}else{for(var i in h){if(h.hasOwnProperty(i)){k=h[i];break;}}}k=(typeof k==="string")?{path:k}:k;k.path=k.path?jQuery.trim(k.path):(d.baseURL+jQuery.trim(k.filepath));if(k&&k.path){k.path=k.path?jQuery.trim(k.path):(d.baseURL+jQuery.trim(k.filepath));}else{k=null;}}return k;};this.setImageField=function(j,l){var h=true;var i=this.getImage(l);if(i){var k=a(j).empty().mediaimage();this.images.push(k);k.loadImage(i.path);h=false;}return h;};})(c,this,b);};})(jQuery);