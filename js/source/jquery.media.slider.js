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
(function($) {
  jQuery.fn.mediaslider = function( handleId, vertical, inverted ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( control, handleId, vertical, inverted ) {
      var _this = this;
      this.display = control.css({
        cursor:"pointer"
      });
      this.dragging = false;
      this.value = 0;
      this.handle = this.display.find(handleId);
      this.pagePos = vertical ? "pageY" : "pageX";
      this.handlePos = 0;

      // Only if there is a handle.
      if( this.handle.length > 0 ) {
        this.handleSize = vertical ? this.handle.height() : this.handle.width();
        this.handleMid = (this.handleSize/2);
      }
         
      this.onResize = function() {
        this.setTrackSize();
        this.updateValue( this.value );
      };

      this.setTrackSize = function() {
        this.trackSize = vertical ? this.display.height() : this.display.width();
        this.trackSize -= this.handleSize;
        this.trackSize = (this.trackSize > 0) ? this.trackSize : 1;
      };
         
      this.setValue = function( _value ) {
        this.setPosition( _value );
        this.display.trigger( "setvalue", this.value );
      };
         
      this.updateValue = function( _value ) {
        this.setPosition( _value );
        this.display.trigger( "updatevalue", this.value );
      };
         
      this.setPosition = function( _value ) {
        _value = (_value < 0) ? 0 : _value;
        _value = (_value > 1) ? 1 : _value;
        this.value = _value;
        this.handlePos = inverted ? (1-this.value) : this.value;
        this.handlePos *= this.trackSize;
        this.handle.css( (vertical ? "marginTop" : "marginLeft"), this.handlePos );
      };
         
      this.display.unbind("mousedown").bind("mousedown", function( event ) {
        event.preventDefault();
        _this.dragging = true;
      });
         
      this.getOffset = function() {
        var offset = vertical ? this.display.offset().top : this.display.offset().left;
        return (offset + (this.handleSize / 2));
      };
         
      this.getPosition = function( pagePos ) {
        var pos = (pagePos - this.getOffset()) / this.trackSize;
        pos = (pos < 0) ? 0 : pos;
        pos = (pos > 1) ? 1 : pos;
        pos = inverted ? (1-pos) : pos;
        return pos;
      };
         
      this.display.unbind("mousemove").bind("mousemove", function( event ) {
        event.preventDefault();
        if( _this.dragging ) {
          _this.updateValue( _this.getPosition( event[_this.pagePos] ) );
        }
      });

      this.display.unbind("mouseleave").bind("mouseleave", function( event ) {
        event.preventDefault();
        if( _this.dragging ) {
          _this.dragging = false;
          _this.setValue( _this.getPosition( event[_this.pagePos] ) );
        }
      });
         
      this.display.unbind("mouseup").bind("mouseup", function( event ) {
        event.preventDefault();
        if( _this.dragging ) {
          _this.dragging = false;
          _this.setValue( _this.getPosition( event[_this.pagePos] ) );
        }
      });
         
      this.onResize();

    })( this, handleId, vertical, inverted );
  };
})(jQuery);