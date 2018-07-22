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
(function(a){jQuery.fn.mediaimage=function(c,b){if(this.length===0){return null;}return new (function(e,h,d){this.display=e;var i=this;var g=0;var f=false;this.imgLoader=new Image();this.imgLoader.onload=function(){f=true;g=(i.imgLoader.width/i.imgLoader.height);i.resize();i.display.trigger("imageLoaded");};e.css("overflow","hidden");this.loaded=function(){return this.imgLoader.complete;};this.resize=function(n,j){var m=d?this.imgLoader.width:(n?n:this.display.width());var k=d?this.imgLoader.height:(j?j:this.display.height());if(m&&k&&f){var l=jQuery.media.utils.getScaledRect(g,{width:m,height:k});if(this.image){this.image.attr("src",this.imgLoader.src).css({marginLeft:l.x,marginTop:l.y,width:l.width,height:l.height});}this.image.fadeIn();}};this.clear=function(){f=false;if(this.image){this.image.attr("src","");this.imgLoader.src="";this.image.fadeOut(function(){if(h){a(this).parent().remove();}else{a(this).remove();}});}};this.refresh=function(){this.resize();};this.loadImage=function(j){this.clear();this.image=a(document.createElement("img")).attr({src:""}).hide();if(h){this.display.append(a(document.createElement("a")).attr({target:"_blank",href:h}).append(this.image));}else{this.display.append(this.image);}this.imgLoader.src=j;};})(this,c,b);};})(jQuery);