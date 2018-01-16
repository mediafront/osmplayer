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
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    rotatorTimeout:5000,
    rotatorTransition:"fade",
    rotatorEasing:"swing",
    rotatorSpeed:"slow",
    rotatorHover:false
  });

  jQuery.fn.mediarotator = function( settings ) {
    if( this.length === 0 ) {
      return null;
    }
    return new (function( rotator, settings ) {
      settings = jQuery.media.utils.getSettings(settings);
      var _this = this;
      this.images = [];
      this.imageIndex = 0;
      this.imageInterval = null;
      this.width = 0;
      this.height = 0;
         
      this.onImageLoaded = function() {
        this.width = this.images[0].imgLoader.width;
        this.height = this.images[0].imgLoader.height;
        rotator.css({
          width:this.width,
          height:this.height
        });
        var sliderWidth = (settings.rotatorTransition == "hscroll") ? (2*this.width) : this.width;
        var sliderHeight = (settings.rotatorTransition == "vscroll") ? (2*this.height) : this.height;
        this.display.css({
          width:sliderWidth,
          height:sliderHeight
        });
      };
         
      this.addImage = function() {
        var image = $("<div></div>").mediaimage(null, true);
        this.display.append( image.display );
            
        if( (settings.rotatorTransition == "hscroll") || (settings.rotatorTransition == "vscroll") ) {
          image.display.css({
            "float":"left"
          });
        }
        else {
          image.display.css({
            position:"absolute",
            zIndex:(200 - this.images.length),
            top:0,
            left:0
          });
        }
        return image;
      };
         
      this.loadImages = function( _images ) {
        this.images = [];
        this.imageIndex = 0;
            
        jQuery.each( _images, function( index ) {
          var image = _this.addImage();
          if( index === 0 ) {
            image.display.unbind("imageLoaded").bind("imageLoaded", function() {
              _this.onImageLoaded();
            }).show();
          }
          image.loadImage( this );
          _this.images.push( image );
        });
            
        if( settings.rotatorHover ) {
          this.display.unbind("mouseenter").bind( "mouseenter", function() {
            _this.startRotator();
          }).unbind("mouseleave").bind( "mouseleave", function() {
            clearInterval( _this.imageInterval );
          });
        }
        else {
          this.startRotator();
        }
      };
      
      this.startRotator = function() {
        clearInterval( this.imageInterval );
        this.imageInterval = setInterval( function() {
          _this.showNextImage();
        }, settings.rotatorTimeout );
      };
         
      this.showNextImage = function() {
        this.hideImage( this.images[this.imageIndex].display );
        this.imageIndex = (this.imageIndex + 1) % this.images.length;
        this.showImage( this.images[this.imageIndex].display );
      };
      
      this.showImage = function( image ) {
        if( settings.rotatorTransition === 'fade' ) {
          image.fadeIn(settings.rotatorSpeed);
        }
        else {
          image.css({
            marginLeft:0,
            marginTop:0
          }).show();
        }
      };
         
      this.hideImage = function( image ) {
        switch( settings.rotatorTransition ) {
          case "fade":
            image.fadeOut(settings.rotatorSpeed);
            break;
          case "hscroll":
            image.animate({
              marginLeft:-this.width
            }, settings.rotatorSpeed, settings.rotatorEasing, function() {
              image.css({
                marginLeft:0
              }).remove();
              _this.display.append( image );
            });
            break;
          case "vscroll":
            image.animate({
              marginTop:-this.height
            }, settings.rotatorSpeed, settings.rotatorEasing, function() {
              image.css({
                marginTop:0
              }).remove();
              _this.display.append( image );
            });
            break;
          default:
            image.hide();
            break;
        }
      };
   
      // Find all the images in the rotator container.
      var _images = [];
      rotator.find("img").each( function() {
        _images.push( $(this).attr("src") );
      });
         
      // Empty the container and setup the inner rotator.
      rotator.empty().css("overflow", "hidden").append( $('<div class="imagerotatorinner"></div>') );
      this.display = rotator.find(".imagerotatorinner");

      // If they provided images, then we will want to load them.
      if( _images.length ) {
        this.loadImages( _images );
      }
    })( this, settings );
  };
})(jQuery);