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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.ids=jQuery.extend(jQuery.media.ids,{close:"#mediamenuclose",embed:"#mediaembed",elink:"#mediaelink",email:"#mediaemail"});jQuery.fn.mediamenu=function(c,b){if(this.length===0){return null;}return new (function(f,g,e){e=jQuery.media.utils.getSettings(e);var h=this;this.display=g;this.on=false;this.contents=[];this.prevItem={id:0,link:null,contents:null};this.close=this.display.find(e.ids.close);this.close.unbind("click").bind("click",function(){h.display.trigger("menuclose");});this.setMenuItem=function(j,k){if(this.prevItem.id!=k){if(this.prevItem.id&&e.template.onMenuSelect){e.template.onMenuSelect(this.prevItem.link,this.prevItem.contents,false);}var i=this.contents[k];if(e.template.onMenuSelect){e.template.onMenuSelect(j,i,true);}this.prevItem={id:k,link:j,contents:i};}};this.setEmbedCode=function(i){this.setInputItem(e.ids.embed,i);};this.setMediaLink=function(i){this.setInputItem(e.ids.elink,i);};this.setInputItem=function(k,j){var i=this.contents[k].find("input");i.unbind("click").bind("click",function(){a(this).select().focus();});i.attr("value",j);};var d=0;this.links=this.display.find("a");this.links.each(function(){var j=a(this);if(j.length>0){var k=j.attr("href");var i=h.display.find(k);i.hide();h.contents[k]=i;j.unbind("click").bind("click",{id:k,obj:j.parent()},function(l){l.preventDefault();h.setMenuItem(l.data.obj,l.data.id);});if(d===0){h.setMenuItem(j.parent(),k);}d++;}});})(c,this,b);};})(jQuery);