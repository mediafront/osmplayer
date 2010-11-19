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
   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      close:"#mediamenuclose",
      embed:"#mediaembed",
      elink:"#mediaelink",
      email:"#mediaemail"           
   });   
   
   jQuery.fn.mediamenu = function( server, settings ) {  
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, menu, settings ) {
         settings = jQuery.media.utils.getSettings(settings);  
         var _this = this;
         this.display = menu;
         
         this.on = false;
         
         this.contents = [];
         this.prevItem = {
            id:0,
            link:null,
            contents:null
         };
         
         this.close = this.display.find( settings.ids.close );
         this.close.bind( "click", function() {
            _this.display.trigger( "menuclose" );
         });
         
         this.setMenuItem = function( link, itemId ) {
            if( this.prevItem.id != itemId ) {
               if( this.prevItem.id ) {
                  settings.template.onMenuSelect( this.prevItem.link, this.prevItem.contents, false );
               }
               var contents = this.contents[itemId];
               settings.template.onMenuSelect( link, contents, true );
               this.prevItem = {
                  id:itemId,
                  link:link,
                  contents:contents
               };
            }
         };         
         
         this.setEmbedCode = function( embed ) {
            this.setInputItem( settings.ids.embed, embed );
         };
         
         
         this.setMediaLink = function( mediaLink ) {
            this.setInputItem( settings.ids.elink , mediaLink );
         };
         
         this.setInputItem = function( id, value ) {
            var input = this.contents[id].find("input");
            input.unbind();
            input.bind("click", function() {
               $(this).select().focus();   
            });
            input.attr("value", value );            
         };
         
         var linkIndex = 0;
         this.links = this.display.find("ul li");
         this.links.each( function() {
            var link = $(this).find("a");
            var linkId = link.attr("href");
            var contents = _this.display.find(linkId);
            contents.hide();
            _this.contents[linkId] = contents; 
            
            link.bind("mouseenter", $(this), function( event ) {
               settings.template.onMenuOver( event.data );   
            });
            
            link.bind("mouseleave", $(this), function( event ) {
               settings.template.onMenuOut( event.data );   
            });
            
            link.bind("click", {
               id:linkId,
               obj:$(this)
               }, function( event ) {
               event.preventDefault(); 
               _this.setMenuItem( event.data.obj, event.data.id );
            });
            
            if( linkIndex === 0 ) {
               _this.setMenuItem( $(this), linkId );   
            }
            linkIndex++;
         });
        
         
      })( server, this, settings );
   };
})(jQuery);
