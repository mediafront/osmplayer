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
(function(a){jQuery.media=jQuery.extend({},{parser:function(b){return new (function(c){var d=this;this.onLoaded=null;this.parseFile=function(e,f){this.onLoaded=f;jQuery.ajax({type:"GET",url:e,dataType:"xml",success:function(g){d.parseXML(g);},error:function(g,i,h){console.log("Error: "+i);}});};this.parseXML=function(e){var f=this.parseXSPF(e);if(f.total_rows===0){f=this.parseASX(e);}if(f.total_rows===0){f=this.parseRSS(e);}if(this.onLoaded&&f.total_rows){this.onLoaded(f);}return f;};this.parseXSPF=function(e){var g={total_rows:0,nodes:[]};var f=jQuery("playlist trackList track",e);if(f.length>0){f.each(function(h){g.total_rows++;g.nodes.push({nid:g.total_rows,title:a(this).find("title").text(),description:a(this).find("annotation").text(),mediafiles:{images:{image:{path:a(this).find("image").text()}},media:{media:{path:a(this).find("location").text()}}}});});}return g;};this.parseASX=function(e){var g={total_rows:0,nodes:[]};var f=jQuery("asx entry",e);if(f.length>0){f.each(function(h){g.total_rows++;g.nodes.push({nid:g.total_rows,title:a(this).find("title").text(),mediafiles:{images:{image:{path:a(this).find("image").text()}},media:{media:{path:a(this).find("location").text()}}}});});}return g;};this.parseRSS=function(f){var h={total_rows:0,nodes:[]};var g=jQuery("rss channel",f);if(g.length>0){var e=(g.find("generator").text()=="YouTube data API");g.find("item").each(function(i){h.total_rows++;var j={};j=e?d.parseYouTubeItem(a(this)):d.parseRSSItem(a(this));j.nid=h.total_rows;h.nodes.push(j);});}return h;};this.parseRSSItem=function(e){return{title:e.find("title").text(),mediafiles:{images:{image:{path:e.find("image").text()}},media:{media:{path:e.find("location").text()}}}};};this.parseYouTubeItem=function(f){var e=f.find("description").text();var g=f.find("link").text().replace("&feature=youtube_gdata","");return{title:f.find("title").text(),mediafiles:{images:{image:{path:jQuery("img",e).eq(0).attr("src")}},media:{media:{path:g,player:"youtube"}}}};};})(b);}},jQuery.media);})(jQuery);