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
(function(a){jQuery.fn.mediaimage=function(c,b){if(this.length===0){return null;}return new (function(e,i,d){this.display=e;var j=this;var g=0;var f=false;this.imgLoader=new Image();this.imgLoader.onload=function(){f=true;g=(j.imgLoader.width/j.imgLoader.height);j.resize();j.display.trigger("imageLoaded");};var h=i?'<a target="_blank" href="'+i+'"><img src=""></img></a>':'<img src=""></img>';this.image=e.append(h).find("img");e.css("overflow","hidden");this.resize=function(o,k){var n=d?this.imgLoader.width:(o?o:this.display.width());var l=d?this.imgLoader.height:(k?k:this.display.height());if(n&&l&&f){var m=jQuery.media.utils.getScaledRect(g,{width:n,height:l});this.image.attr("src",this.imgLoader.src).css({marginLeft:m.x,marginTop:m.y,width:m.width,height:m.height}).show();}};this.clear=function(){f=false;if(this.image){this.image.hide();this.image.attr("src","");}e.empty();};this.refresh=function(){this.resize();};this.loadImage=function(k){this.image.hide();this.imgLoader.src=k;};})(this,c,b);};})(jQuery);