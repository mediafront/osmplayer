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
   
   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      vertical:true,
      scrollSpeed:20,
      updateTimeout:40,
      hysteresis:40,
      showScrollbar:true,
      scrollMode:"auto"  /* "auto", "span", "none" */        
   });   

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      listMask:".medialistmask",
      list:".medialist",
      scrollWrapper:".mediascrollbarwrapper",
      scrollBar:".mediascrollbar",
      scrollTrack:".mediascrolltrack",
      scrollHandle:".mediascrollhandle",
      scrollUp:".mediascrollup",
      scrollDown:".mediascrolldown"        
   });     
   
   jQuery.fn.mediascroll = function( settings ) {
      return new (function( scrollRegion, settings ) {
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = scrollRegion;
         var _this = this;
         
         this.spanMode = (settings.scrollMode == "span");          
         
         // Get the list region.
         this.listMask = scrollRegion.find( settings.ids.listMask );
         
         // Internet Exploder has some serious issues with the auto scroll.  We will just force those
         // users to use the scroll bar.
         if( this.spanMode || (settings.scrollMode == "auto") ) {
            // Add our event callbacks.
            this.listMask.bind( 'mouseenter', function( event ) {
               _this.onMouseOver( event ); 
            });    
            this.listMask.bind( 'mouseleave', function( event ) {
               _this.onMouseOut( event ); 
            });
            this.listMask.bind( 'mousemove', function( event ) {
               _this.onMouseMove( event ); 
            }); 
         }
         this.listMask.css("overflow", "hidden");   
               
         this.list = scrollRegion.find( settings.ids.list );
         
         var element = this.list.children().eq(0);
         this.elementWidth = element.width();
         this.elementHeight = element.height();
         this.elementSize = settings.vertical ? element.outerHeight(true) : element.outerWidth(true);
         
         // Early versions of jQuery have a broken clone method for IE.  This fixes that.
         if( jQuery.browser.msie && parseInt( jQuery.fn.jquery.replace(".", ""), 10 ) < 132 ) {
            this.template = $("<div></div>").append( jQuery.media.utils.cloneFix( element ) ).html();
         }
         else {
            this.template = $("<div></div>").append( element.clone() ).html();  
         }
         
         // Store the width and height.
         this.width = this.listMask.width();
         this.height = settings.vertical ? 0 : this.listMask.height();         
         
         // Empty our list.
         this.list.empty(); 
         
         // Initialize our variables.     
         this.pagePos = settings.vertical ? "pageY" : "pageX";
         this.margin = settings.vertical ? "marginTop" : "marginLeft";
         this.scrollSize = settings.vertical ? 0 : this.listMask.width();
         this.scrollButtonSize = 0;
         this.scrollMid = 0;                 
         this.mousePos = 0;
         this.listPos = 0; 
         this.scrollInterval = 0;
         this.shouldScroll = false;
         this.bottomPos = 0;
         this.ratio = 0;
         this.elements = [];
         this.listSize = 0;     

         // Add the slider control to this scroll bar.
         this.scrollBar = scrollRegion.find( settings.ids.scrollBar ).mediaslider( settings.ids.scrollHandle, settings.vertical );
         this.scrollWrapper = scrollRegion.find( settings.ids.scrollWrapper );
         this.scrollTrack = null;   
         
         // Setup the scroll up button.
         this.scrollUp = scrollRegion.find( settings.ids.scrollUp ).medialink( settings, function() {
            _this.scroll( true );
         });
         
         // Setup the scroll down button.
         this.scrollDown = scrollRegion.find( settings.ids.scrollDown ).medialink( settings, function() {
            _this.scroll( false );
         });        
         
         // Save the scroll button size.
         this.scrollButtonSize = settings.vertical ? this.scrollDown.display.outerHeight(true) : this.scrollDown.display.outerWidth(true);         
         
         if( this.scrollBar ) {
            if( settings.showScrollbar ) {
               if( settings.vertical ) {
                  this.width += this.scrollWrapper.width();
               }
               else {
                  this.height += this.scrollWrapper.height();
               }             
            }
            else {
               this.scrollWrapper.width(0).hide();
            }
            
            // Get the scroll track.
            this.scrollTrack = this.scrollBar.display.find( settings.ids.scrollTrack );  
         
            // Handle the update value event.
            this.scrollBar.display.bind("updatevalue", function( event, data ) {
               _this.setScrollPos( data * _this.bottomPos, false );
            });
            
            // Handle the set value event.
            this.scrollBar.display.bind("setvalue", function( event, data ) {
               _this.setScrollPos( data * _this.bottomPos, true );
            });     
         }        
         
         this.setScrollSize = function( newSize ) {
            if( newSize ) {
               this.scrollSize = newSize;     
               this.listMask.css( settings.vertical ? "height" : "width", this.scrollSize );                                 
               this.scrollMid = this.scrollSize / 2;  
               var activeSize = this.scrollSize - (settings.hysteresis*2);
               this.bottomPos = (this.listSize - this.scrollSize);
               this.ratio = ( (this.listSize - activeSize) / activeSize );
               this.shouldScroll = (this.bottomPos > 0);
            }
         };

         this.onResize = function( deltaX, deltaY ) {     
            this.width += deltaX;
            this.height += deltaY;       
            this.setScrollSize( settings.vertical ? (this.scrollSize + deltaY) : (this.scrollSize + deltaX)); 
            if( this.scrollBar ) {
               var trackSize = this.scrollSize - 2*this.scrollButtonSize;
               if( settings.vertical ) {
                  this.scrollBar.display.css({height:trackSize});
                  this.scrollTrack.css({height:trackSize});
                  this.scrollBar.setSize( 0, trackSize );
               }
               else {
                  this.scrollBar.display.css({width:trackSize});
                  this.scrollTrack.css({width:trackSize});
                  this.scrollBar.setSize( trackSize, 0 );               
               }
            }        
         };         
         
         // Clears this scroll region.
         this.clear = function() {
            // Reset all variables for a page refresh.
            this.mousePos = 0; 
            this.shouldScroll = false;
            this.bottomPos = 0;
            this.ratio = 0;
            this.scrolling = false;
            this.elements = [];
            this.listSize = 0;
            this.list.css( this.margin, "0px" );
            this.list.children().unbind();
            clearInterval( this.scrollInterval );
            this.list.empty();     
         };
         
         this.getOffset = function() {
            return settings.vertical ? this.listMask.offset().top : this.listMask.offset().left;
         };
         
         // Activates the scroll region.
         this.activate = function() {
            // Set the scroll size.
            this.setScrollSize( settings.vertical ? this.listMask.height() : this.listMask.width() );                                 

            // Now reset the list position.
            this.setScrollPos( this.listPos );
         };
         
         // Refreshes the scroll region.
         this.refresh = function() {
            this.setScrollSize( this.scrollSize );
         };         

         // Add an item to this scroll region.
         this.newItem = function() {     
            var newTemplate = $(this.template);
            this.list.append( newTemplate );
            var element = this.getElement( newTemplate, this.elements.length );
            
            this.listSize += element.size;
            if( settings.vertical ) {
               this.list.css({height:this.listSize, marginTop:this.listSize});      
            }
            else {
               element.obj.css({"float":"left"});
               this.list.css({width:this.listSize});
            }
            this.elements.push( element );
            return element.obj;
         };

         // Returns the cached element object with all properties.
         this.getElement = function( element, index ) {
            var size = this.elementSize;
            var pos = this.listSize;
            element.css({width:this.elementWidth, height:this.elementHeight});
            return {obj:element, size:size, position:pos, bottom:(pos+size), mid:(size/2), index:index};         
         };

         // Scroll the list up or down one element.
         this.scroll = function( up ) {
            var element = this.getElementAtPosition( up ? 0 : this.scrollSize );
            if( element ) {
               var newElement = (element.straddle || up) ? element : this.elements[ element.index + 1 ];
               if( newElement ) {
                  var _listPos = up ? newElement.position : (newElement.bottom - this.scrollSize);
                  this.setScrollPos( _listPos, true );
               }
            }
         };

         // Called when the mouse moves within the scroll region.
         this.onMouseMove = function( event ) {
            this.mousePos = event[ this.pagePos ] - this.getOffset();
            
            // If the scroll type is span, then just move the list
            // up and down according to the listSize/regionSize ratio.
            if( this.shouldScroll && this.spanMode ) {
               this.setScrollPos( (this.mousePos - settings.hysteresis) * this.ratio );
            }
         };

         // Called when the mouse enters the scroll region.
         this.onMouseOver = function( event ) {
            if( this.shouldScroll ) {
               clearInterval( this.scrollInterval );
               this.scrollInterval = setInterval( function() {
                  _this.update();   
               }, settings.updateTimeout );
            }
         };

         // Called when the mouse exits the scroll region.
         this.onMouseOut = function( event ) {
            clearInterval( this.scrollInterval );     
         };

         // This function will align the scroll region.
         this.align = function( up ) {
            var element = this.getElementAtPosition( up ? 0 : this.scrollSize );
            if( element ) {
               var _listPos = up ? element.position : (element.bottom - this.scrollSize);
               this.setScrollPos( _listPos, true );
            }
         };

         // Will set the element at the given index visible.
         this.setVisible = function( index ) {
            var element = this.elements[index];
            if( element ) {
               var newPos = this.listPos;
               if( element.position < this.listPos ) {
                  newPos = element.position;
               } else if( (element.bottom - this.listPos) > this.scrollSize ) {
                  newPos = element.bottom - this.scrollSize;
               }
               if( newPos != this.listPos ) {
                  this.setScrollPos( newPos, true );
               }  
            }
         };

         // Gets an element at a specific location in the list.
         this.getElementAtPosition = function( position ) {
            var element = null;
            var i = this.elements.length;
            while(i--) {
               element = this.elements[i];
               if( ((element.position - this.listPos) < position) && 
                   ((element.bottom - this.listPos) >= position) ) {
                  element.straddle = ((element.bottom - this.listPos) != position);
                  break;      
               }               
            }
            return element;
         };

         // Called every interval to update the scroll position.
         this.update = function() {
            var delta = this.mousePos - this.scrollMid;
            if( Math.abs(delta) > settings.hysteresis ) {
               var hyst = (delta > 0) ? -settings.hysteresis : settings.hysteresis;
               delta = settings.scrollSpeed * (( this.mousePos + hyst - this.scrollMid) / this.scrollMid);
               this.setScrollPos(this.listPos + delta);
            }
         };       

         // Sets the scroll position.
         this.setScrollPos = function( _listPos, tween ) {
            // Make sure we are greater than zero here.
            _listPos = (_listPos < 0) ? 0 : _listPos;

            // See if we should scroll and if the list position is
            // greater than the bottom position.
            if( this.shouldScroll && (_listPos > this.bottomPos) ) {
               _listPos = this.bottomPos;
            }          
            
            // Now set the list position.
            this.listPos = _listPos;

            // Set the position of the scroll bar.
            if( this.scrollBar ) {
               this.scrollBar.setPosition( this.listPos / this.bottomPos );
            }              
            
            if( tween ) {
               if( settings.vertical ) {
                  this.list.animate({marginTop: -this.listPos + "px"}, (settings.scrollSpeed*10));
               }
               else {
                  this.list.animate({marginLeft: -this.listPos + "px"}, (settings.scrollSpeed*10));
               }
            }
            else {
               this.list.css( this.margin, -this.listPos + "px" );
            }
         };               
      })( this, settings );
   };
})(jQuery);