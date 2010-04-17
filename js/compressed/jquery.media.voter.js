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
(function(a){jQuery.fn.mediavoter=function(b,d,c){if(this.length===0){return null;}return new (function(f,e,h,g){this.display=f;var i=this;this.nodeId=0;this.votes=[];this.tag=this.display.attr("tag");this.display.find("div").each(function(){if(g){a(this).css("cursor","pointer");a(this).bind("click",function(j){i.setVote(parseInt(a(this).attr("vote"),10));});a(this).bind("mouseenter",function(j){i.updateVote({value:parseInt(a(this).attr("vote"),10)},true);});}i.votes.push({vote:parseInt(a(this).attr("vote"),10),display:a(this)});});this.votes.sort(function(k,j){return(k.vote-j.vote);});if(g){this.display.bind("mouseleave",function(j){i.updateVote({value:0},true);});}this.updateVote=function(j,k){if(j&&e.template.updateVote){e.template.updateVote(this,j.value,k);}};this.getVote=function(k){if(k&&k.nid){this.nodeId=parseInt(k.nid,10);if(k.vote){var j=g?k.vote.uservote:k.vote.vote;this.updateVote(k.vote.vote,false);this.display.trigger("voteGet",j);}else{if(h&&k.nid&&(this.display.length>0)){this.display.trigger("processing");var l=g?jQuery.media.commands.getUserVote:jQuery.media.commands.getVote;h.call(l,function(m){i.updateVote(m,false);i.display.trigger("voteGet",m);},null,"node",this.nodeId,this.tag);}}}};this.setVote=function(j){if(h&&this.nodeId){this.display.trigger("processing");this.updateVote({value:j},false);h.call(jQuery.media.commands.setVote,function(k){i.display.trigger("voteSet",k);},null,"node",this.nodeId,j,this.tag);}};this.deleteVote=function(){if(h&&this.nodeId){this.display.trigger("processing");h.call(jQuery.media.commands.deleteVote,function(j){i.updateVote(j,false);i.display.trigger("voteDelete",j);},null,"node",this.nodeId,this.tag);}};})(this,b,d,c);};})(jQuery);