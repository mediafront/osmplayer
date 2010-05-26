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
      links:[],
      linksvertical:false                
   }); 

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      linkScroll:".medialinkscroll"               
   });    
   
   jQuery.fn.medialinks = function( settings ) {  
      return new (function( links, settings ) {

         // Get our settings.
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = links;
         var _this = this;
         
         // Keep track of the previous link.
         this.previousLink = null;

         // Setup the scroll region
         this.scrollRegion = links.find( settings.ids.linkScroll ).mediascroll({
            vertical:settings.linksvertical
         });
         this.scrollRegion.clear();         

         // Load the links.
         this.loadLinks = function() {
            if( links.length > 0 ) {
               this.scrollRegion.clear();
               var onLinkClick = function( event, data ) {
                  _this.setLink( data );
               };               
               
               var i = settings.links.length;
               while(i--) {
                  // Add this link to the scroll region.
                  var link = this.scrollRegion.newItem().playlistlink( settings, settings.links[i] );
                  link.bind("linkclick", onLinkClick);                  
               }   
               // Activate the scroll region.
               this.scrollRegion.activate(); 
            }
         };       

         // Set the active link.
         this.setLink = function( link ) {

            // If there is a previous link, then unactivate it.
            if( this.previousLink ) {
               this.previousLink.setActive(false);
            }

            // Add the active class to the clicked target.
            link.setActive(true);

            // Store this target for later.
            this.previousLink = link;
         };
      })( this, settings );
   };
})(jQuery);