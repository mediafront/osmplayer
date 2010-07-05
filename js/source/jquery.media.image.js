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
   /**
    * Load and scale an image while maintining original aspect ratio.
    */
   jQuery.fn.mediaimage = function( link, fitToImage ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( container, link, fitToImage ) {
         this.display = container;
         var _this = this;
         
         var ratio = 0;                  
         var loaded = false;
         this.width = this.display.width();
         this.height = this.display.height();
         
         // Now create the image loader, and add the loaded handler.
         this.imgLoader = new Image();
         this.imgLoader.onload = function() {
            loaded = true;
            ratio = (_this.imgLoader.width / _this.imgLoader.height);
            _this.resize();
            _this.display.trigger( "imageLoaded" );
         }; 
         
         // Now add the image object.
         var code = link ? '<a target="_blank" href="' + link + '"><img src=""></img></a>' : '<img src=""></img>';
         this.image = container.append( code ).find("img");    
         
         // Set the container to not show any overflow...       
         container.css("overflow", "hidden");
         
         // Resize the image.
         this.resize = function( newWidth, newHeight ) {
            this.width = fitToImage ? this.imgLoader.width : (newWidth ? newWidth : this.width ? this.width : this.display.width());
            this.height = fitToImage ? this.imgLoader.height : (newHeight ? newHeight : this.height ? this.height : this.display.height());
            if( this.width && this.height && loaded ) {  
               // Resize the wrapper.
               this.display.css({
                  width:this.width,
                  height:this.height
                  });
               
               // Now resize the image in the container...
               var rect = jQuery.media.utils.getScaledRect( ratio, {
                  width:this.width,
                  height:this.height
                  } );
               this.image.attr( "src", this.imgLoader.src ).css({
                  marginLeft:rect.x, 
                  marginTop:rect.y, 
                  width:rect.width + "px", 
                  height:rect.height + "px"
               }).show();
            }
         };
         
         // Clears the image.
         this.clear = function() {
            loaded = false;
            if( this.image ) {
               this.image.hide();               
               this.image.attr( "src", "" );
            }
            container.empty();
         };
         
         // Refreshes the image.
         this.refresh = function() {
            this.resize();
         };
         
         // Load the image.
         this.loadImage = function( src ) {
            this.image.hide();
            this.imgLoader.src = src;
         };
      })( this, link, fitToImage );     
   };
})(jQuery);
