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
(function(a){jQuery.fn.mediaslider=function(b,c){if(this.length===0){return null;}return new (function(f,d,e){var g=this;this.display=f.css({cursor:"pointer",position:"relative"});this.dragging=false;this.value=0;this.handle=this.display.find(d);this.pagePos=e?"pageY":"pageX";this.width=this.display.width();this.height=this.display.height();this.handleSize=e?this.handle.height():this.handle.width();this.trackSize=e?this.height:this.width;this.handlePos=0;this.onResize=function(i,h){this.setSize(this.width+i,this.height+h);};this.setSize=function(i,h){this.width=i?i:this.width;this.height=h?h:this.height;this.trackSize=e?this.height:this.width;this.updateValue(this.value);};this.setValue=function(h){this.setPosition(h);this.display.trigger("setvalue",h);};this.updateValue=function(h){this.setPosition(h);this.display.trigger("updatevalue",this.value);};this.setPosition=function(h){h=(h<0)?0:h;h=(h>1)?1:h;this.value=h;this.handlePos=(this.value*(this.trackSize-this.handleSize));if(e){this.handle.css("marginTop",this.handlePos+"px");}else{this.handle.css("marginLeft",this.handlePos+"px");}};this.display.bind("mousedown",function(h){h.preventDefault();g.dragging=true;});this.getOffset=function(){var h=e?this.display.offset().top:this.display.offset().left;return(h+(this.handleSize/2));};this.getPosition=function(h){var i=(h-this.getOffset())/(this.trackSize-this.handleSize);i=(i<0)?0:i;i=(i>1)?1:i;return i;};this.display.bind("mousemove",function(h){if(g.dragging){g.updateValue(g.getPosition(h[g.pagePos]));}});this.display.bind("mouseleave",function(h){if(g.dragging){g.dragging=false;g.setValue(g.getPosition(h[g.pagePos]));}});this.display.bind("mouseup",function(h){if(g.dragging){g.dragging=false;g.setValue(g.getPosition(h[g.pagePos]));}});this.onResize(0,0);})(this,b,c);};})(jQuery);