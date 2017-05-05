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
      pageLink:false
   });   
  
   jQuery.fn.mediateaser = function( server, nodeInfo, _index, settings ) {  
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, nodeInfo, _index, teaser, settings ) {
         settings = jQuery.media.utils.getSettings(settings);       
         
         var _this = this;
         this.display = teaser;
         
         // If they hover over the teaser...
         this.display.bind( "mouseenter", function(event) {
            if( settings.template.onTeaserOver ) {
               settings.template.onTeaserOver( _this );
            }
         });
         
         // If they hover away from the teaser...
         this.display.bind( "mouseleave", function(event) {
            if( settings.template.onTeaserOut ) {               
               settings.template.onTeaserOut( _this );
            }
         });           
         
         // The index of this teaser
         this.index = _index;

         // Setup the node.
         this.node = this.display.medianode( server, settings ); 
         
         // Load the node information.
         if( this.node ) {
            this.node.loadNode( nodeInfo ); 
         }         
         
         // If they wish to link these teasers to actual nodes.
         if( this.node && settings.pageLink ) {
            var path = settings.baseURL;
            path += nodeInfo.path ? nodeInfo.path : ("node/" + nodeInfo.nid);
            this.node.display.wrap('<a href="' + path + '"></a>');
         }

         this.reset = function() {
            if( this.node ) {
               this.node.display.unbind(); 
            }
         };

         this.refresh = function() {
            if( this.node ) {
               this.node.onResize(0,0);   
            }   
         };

         this.setActive = function( _active ) {
            if( settings.template.onTeaserActivate ) {            
               settings.template.onTeaserActivate(this, _active);
            }          
         };
         
         this.setSelected = function( _selected ) {
            if( settings.template.onTeaserSelect ) {             
               settings.template.onTeaserSelect(this, _selected);
            }          
         }; 
         
         // Let the template setup the teaser.
         if( settings.template.onTeaserLoad ) {             
            settings.template.onTeaserLoad( this );
         }                                 
      })( server, nodeInfo, _index, this, settings );
   };
})(jQuery);