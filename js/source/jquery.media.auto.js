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
  
  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the auto server object.
    auto : function( settings ) {
      // Return a new function for this object
      return new (function( settings ) {
        this.json = jQuery.media.json( settings );
        this.rpc = jQuery.media.rpc( settings );
        this.call = function( method, onSuccess, onFailed, params, protocol ) {
          if( protocol == "json" ) {
            this.json.call( method, onSuccess, onFailed, params, protocol );
          }
          else {
            this.rpc.call( method, onSuccess, onFailed, params, protocol );
          }
        };
      })( settings );
    }
  }, jQuery.media );
})(jQuery);
