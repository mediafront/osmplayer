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
(function(a){jQuery.fn.mediaslider=function(b,d,c){if(this.length===0){return null;}return new (function(h,e,g,f){var i=this;this.display=h.css({cursor:"pointer",position:"relative"});this.dragging=false;this.value=0;this.handle=this.display.find(e);this.pagePos=g?"pageY":"pageX";this.width=this.display.width();this.height=this.display.height();this.handleSize=g?this.handle.height():this.handle.width();this.handleOffset=g?this.handle.position().top:this.handle.position().left;this.handleMid=(this.handleSize/2);this.handlePoint=this.handleMid+this.handleOffset;this.handlePos=0;this.onResize=function(k,j){this.setSize(this.width+k,this.height+j);};this.setTrackSize=function(){this.trackSize=g?this.height:this.width;this.trackSize-=(this.handleOffset+this.handleSize);};this.setTrackSize();this.setSize=function(k,j){this.width=k?k:this.width;this.height=j?j:this.height;this.setTrackSize();this.updateValue(this.value);};this.setValue=function(j){this.setPosition(j);this.display.trigger("setvalue",this.value);};this.updateValue=function(j){this.setPosition(j);this.display.trigger("updatevalue",this.value);};this.setPosition=function(j){j=(j<0)?0:j;j=(j>1)?1:j;this.value=j;this.handlePos=f?(1-this.value):this.value;this.handlePos*=this.trackSize;if(g){this.handle.css("marginTop",this.handlePos+"px");}else{this.handle.css("marginLeft",this.handlePos+"px");}};this.display.bind("mousedown",function(j){j.preventDefault();i.dragging=true;});this.getOffset=function(){var j=g?this.display.offset().top:this.display.offset().left;return(j+(this.handleSize/2));};this.getPosition=function(j){var k=(j-this.getOffset())/this.trackSize;k=(k<0)?0:k;k=(k>1)?1:k;k=f?(1-k):k;return k;};this.display.bind("mousemove",function(j){j.preventDefault();if(i.dragging){i.updateValue(i.getPosition(j[i.pagePos]));}});this.display.bind("mouseleave",function(j){j.preventDefault();if(i.dragging){i.dragging=false;i.setValue(i.getPosition(j[i.pagePos]));}});this.display.bind("mouseup",function(j){j.preventDefault();if(i.dragging){i.dragging=false;i.setValue(i.getPosition(j[i.pagePos]));}});this.onResize(0,0);})(this,b,d,c);};})(jQuery);