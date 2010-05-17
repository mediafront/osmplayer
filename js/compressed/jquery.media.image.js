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
(function(a){jQuery.fn.mediaimage=function(b){if(this.length===0){return null;}return new (function(c,g){this.display=c;var h=this;var e=0;var d=false;this.width=this.display.width();this.height=this.display.height();this.imgLoader=new Image();this.imgLoader.onload=function(){d=true;e=(h.imgLoader.width/h.imgLoader.height);h.resize();h.display.trigger("imageLoaded");};var f=g?'<a target="_blank" href="'+g+'"><img src=""></img></a>':'<img src=""></img>';this.image=c.empty().append(f).find("img");c.css("overflow","hidden");this.resize=function(k,i){this.width=k?k:this.width?this.width:this.display.width();this.height=i?i:this.height?this.height:this.display.height();if(this.width&&this.height&&d){this.display.css({width:this.width,height:this.height});var j=jQuery.media.utils.getScaledRect(e,{width:this.width,height:this.height});this.image.attr("src",this.imgLoader.src).css({marginLeft:j.x,marginTop:j.y,width:j.width+"px",height:j.height+"px"}).show();}};this.clear=function(){d=false;if(this.image){this.image.hide();this.image.attr("src","");}};this.refresh=function(){this.resize();};this.loadImage=function(i){this.image.hide();this.imgLoader.src=i;};})(this,b);};})(jQuery);