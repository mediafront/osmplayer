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
(function(a){jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{rotatorTimeout:5000,rotatorTransition:"fade",rotatorEasing:"swing",rotatorSpeed:"slow",rotatorHover:false});jQuery.fn.mediarotator=function(b){if(this.length===0){return null;}return new (function(e,d){d=jQuery.media.utils.getSettings(d);var f=this;this.images=[];this.imageIndex=0;this.imageInterval=null;this.width=0;this.height=0;this.onImageLoaded=function(){this.width=this.images[0].imgLoader.width;this.height=this.images[0].imgLoader.height;e.css({width:this.width,height:this.height});var g=(d.rotatorTransition=="hscroll")?(2*this.width):this.width;var h=(d.rotatorTransition=="vscroll")?(2*this.height):this.height;this.display.css({width:g,height:h});};this.addImage=function(){var g=a("<div></div>").mediaimage(null,true);this.display.append(g.display);if((d.rotatorTransition=="hscroll")||(d.rotatorTransition=="vscroll")){g.display.css({"float":"left"});}else{g.display.css({position:"absolute",zIndex:(200-this.images.length),top:0,left:0});}return g;};this.loadImages=function(g){this.images=[];this.imageIndex=0;jQuery.each(g,function(h){var i=f.addImage();if(h===0){i.display.unbind("imageLoaded").bind("imageLoaded",function(){f.onImageLoaded();}).show();}i.loadImage(this);f.images.push(i);});if(d.rotatorHover){this.display.unbind("mouseenter").bind("mouseenter",function(){f.startRotator();}).unbind("mouseleave").bind("mouseleave",function(){clearInterval(f.imageInterval);});}else{this.startRotator();}};this.startRotator=function(){clearInterval(this.imageInterval);this.imageInterval=setInterval(function(){f.showNextImage();},d.rotatorTimeout);};this.showNextImage=function(){this.hideImage(this.images[this.imageIndex].display);this.imageIndex=(this.imageIndex+1)%this.images.length;this.showImage(this.images[this.imageIndex].display);};this.showImage=function(g){if(d.rotatorTransition==="fade"){g.fadeIn(d.rotatorSpeed);}else{g.css({marginLeft:0,marginTop:0}).show();}};this.hideImage=function(g){switch(d.rotatorTransition){case"fade":g.fadeOut(d.rotatorSpeed);break;case"hscroll":g.animate({marginLeft:-this.width},d.rotatorSpeed,d.rotatorEasing,function(){g.css({marginLeft:0}).remove();f.display.append(g);});break;case"vscroll":g.animate({marginTop:-this.height},d.rotatorSpeed,d.rotatorEasing,function(){g.css({marginTop:0}).remove();f.display.append(g);});break;default:g.hide();break;}};var c=[];e.find("img").each(function(){c.push(a(this).attr("src"));});e.empty().css("overflow","hidden").append(a('<div class="imagerotatorinner"></div>'));this.display=e.find(".imagerotatorinner");if(c.length){this.loadImages(c);}})(this,b);};})(jQuery);