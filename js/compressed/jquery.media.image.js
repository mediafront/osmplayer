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
(function(a){jQuery.fn.mediaimage=function(c,b){if(this.length===0){return null;}return new (function(e,i,d){this.display=e;var j=this;var g=0;var f=false;this.width=this.display.width();this.height=this.display.height();this.imgLoader=new Image();this.imgLoader.onload=function(){f=true;g=(j.imgLoader.width/j.imgLoader.height);j.resize();j.display.trigger("imageLoaded");};var h=i?'<a target="_blank" href="'+i+'"><img src=""></img></a>':'<img src=""></img>';this.image=e.append(h).find("img");e.css("overflow","hidden");this.resize=function(m,k){this.width=d?this.imgLoader.width:(m?m:this.width?this.width:this.display.width());this.height=d?this.imgLoader.height:(k?k:this.height?this.height:this.display.height());if(this.width&&this.height&&f){this.display.css({width:this.width,height:this.height});var l=jQuery.media.utils.getScaledRect(g,{width:this.width,height:this.height});this.image.attr("src",this.imgLoader.src).css({marginLeft:l.x,marginTop:l.y,width:l.width+"px",height:l.height+"px"}).show();}};this.clear=function(){f=false;if(this.image){this.image.hide();this.image.attr("src","");}e.empty();};this.refresh=function(){this.resize();};this.loadImage=function(k){this.image.hide();this.imgLoader.src=k;};})(this,c,b);};})(jQuery);