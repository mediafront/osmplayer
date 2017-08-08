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
   jQuery.media = jQuery.media ? jQuery.media : {};   
   
   // Set up our defaults for this component.
   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      prefix:"",
      controllerOnly:false
   });   
   
   jQuery.media.templates = jQuery.extend( {}, {
      "shockblack" : function( mediaplayer, settings ) {
         // Return the template
         return new (function( mediaplayer, settings ) {
            settings = jQuery.media.utils.getSettings(settings);
            
            // So that we can access this from any scope.
            var _this = this;

            /**
             * Initialize our template.
             *
             * @param - The settings object.
             */
            this.initialize = function( settings ) {
              
              
            };
   
            /**
             * This function is currently stubbed out.
             * You can implement it and hook into the time display by 
             * reassigning this as follows...
             *
             *  this.formatTime = function( time ) {
             *  }
             */         
            this.formatTime = false;                                 
         })( mediaplayer, settings );
      }
   }, jQuery.media.templates );
})(jQuery);