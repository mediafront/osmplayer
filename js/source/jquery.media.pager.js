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
    shuffle:false,
    loop:false,
    pageLimit:10
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    prev:"#mediaprev",
    next:"#medianext",
    loadPrev:"#medialoadprev",
    loadNext:"#medialoadnext",
    prevPage:"#mediaprevpage",
    nextPage:"#medianextpage"
  });
   
  jQuery.fn.mediapager = function( settings ){
    return new (function( pager, settings ) {
      settings = jQuery.media.utils.getSettings(settings);

      // Save the jQuery display.
      this.display = pager;
      var _this = this;

      // The active index within a page.
      this.activeIndex = -1;

      // The non-active index within a page.
      this.currentIndex = -1;

      // The active page index.
      this.activePage = 0;

      // The non-active page index.
      this.currentPage = 0;

      // The number of pages.
      this.numPages = 0;

      // The number of items on the current page.
      this.numItems = 10;

      // The number of items on the active page.
      this.activeNumItems = 10;

      // The load state for loading an index after a new page.
      this.loadState = "";

      // Used to turn on and off the pager.
      this.enabled = false;
         
      // Add our buttons...
      this.prevButton = pager.find( settings.ids.prev ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadPrev( false );
        }
      });
         
      this.nextButton = pager.find( settings.ids.next ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadNext( false );
        }
      });
         
      this.loadPrevButton = pager.find( settings.ids.loadPrev ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadPrev( true );
        }
      });
         
      this.loadNextButton = pager.find( settings.ids.loadNext ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadNext( true );
        }
      });

      this.prevPageButton = pager.find( settings.ids.prevPage ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadState = "click";
          _this.prevPage();
        }
      });
         
      this.nextPageButton = pager.find( settings.ids.nextPage ).medialink( settings, function() {
        if( _this.enabled ) {
          _this.loadState = "click";
          _this.nextPage();
        }
      });

      this.setTotalItems = function( totalItems ) {
        if ( totalItems && settings.pageLimit ) {
          this.numPages = Math.ceil(totalItems / settings.pageLimit);
          if( this.numPages == 1 ) {
            this.numItems = totalItems;
          }
        }
      };

      this.setNumItems = function( _numItems ) {
        this.numItems = _numItems;
      };

      this.reset = function() {
        this.activePage = 0;
        this.currentPage = 0;
        this.activeIndex = -1;
        this.currentIndex = -1;
        this.loadState = "";
      };

      this.loadIndex = function( setActive ) {
        var indexVar = setActive ? "activeIndex" : "currentIndex";
        var newIndex = this[indexVar];
        switch ( this.loadState ) {
          case "prev":
            this.loadState = "";
            this.loadPrev(setActive);
            return;

          case "first":
            newIndex = 0;
            break;
          case "last" :
            newIndex = (this.numItems - 1);
            break;

          case "rand" :
            newIndex = Math.floor(Math.random() * this.numItems);
            break;
            
          default:
            break;
        }

        this.loadState = "";

        if( newIndex != this[indexVar] ) {
          this.loadState = "";
          this[indexVar] = newIndex;
          this.display.trigger("loadindex", {
            index:this[indexVar],
            active:setActive
          });
        }
      };

      this.loadNext = function( setActive ) {
        if ( this.loadState ) {
          this.loadIndex( setActive );
        }
        else if ( settings.shuffle ) {
          this.loadRand();
        }
        else {
          // Increment the playlist index.
          var indexVar = setActive ? "activeIndex" : "currentIndex";
          if( setActive && ( this.activePage != this.currentPage ) ) {

            // Check to make sure we cover the crazy corner-case where the activeIndex
            // is on the last item of the previous page.  Here we don't need to load
            // a new page, but simply load the first item on the current page.
            if( (this.activeIndex == (this.activeNumItems - 1)) && (this.activePage == (this.currentPage - 1)) ) {
              this.currentIndex = this.activeIndex = 0;
              this.activePage = this.currentPage;
              this.display.trigger("loadindex", {
                index:0,
                active:true
              });
            }
            else {
              this.currentPage = this.activePage;
              this.loadState = "";
              this.display.trigger("loadpage", {
                index:this.activePage,
                active:setActive
              });
            }
          }
          else {
            this[indexVar]++;
            if ( this[indexVar] >= this.numItems ) {
              if( this.numPages > 1 ) {
                this[indexVar] = (this.numItems - 1);
                this.loadState = this.loadState ? this.loadState : "first";
                this.nextPage( setActive );
              }
              else if( !setActive || settings.loop ) {
                this[indexVar] = 0;
                this.display.trigger("loadindex", {
                  index:this[indexVar],
                  active:setActive
                });
              }
            }
            else {
              this.display.trigger("loadindex", {
                index:this[indexVar],
                active:setActive
              });
            }
          }
        }
      };

      this.loadPrev = function( setActive ) {
        var indexVar = setActive ? "activeIndex" : "currentIndex";

        if( setActive && ( this.activePage != this.currentPage ) ) {
          this.currentPage = this.activePage;
          this.loadState = "prev";
          this.display.trigger("loadpage", {
            index:this.activePage,
            active:setActive
          });
        }
        else {
          this[indexVar]--;
          if ( this[indexVar] < 0 ) {
            if( this.numPages > 1 ) {
              this[indexVar] = 0;
              this.loadState = this.loadState ? this.loadState : "last";
              this.prevPage( setActive );
            }
            else if( !setActive || settings.loop ) {
              this[indexVar] = (this.numItems - 1);
              this.display.trigger("loadindex", {
                index:this[indexVar],
                active:setActive
              });
            }
          }
          else {
            this.display.trigger( "loadindex", {
              index:this[indexVar],
              active:setActive
            } );
          }
        }
      };

      this.loadRand = function() {
        var newPage = Math.floor(Math.random() * this.numPages);

        if (newPage != this.activePage) {
          this.activePage = newPage;
          this.loadState = this.loadState ? this.loadState : "rand";
          this.display.trigger("loadpage", {
            index:this.activePage,
            active:true
          });
        }
        else {
          this.activeIndex = Math.floor(Math.random() * this.numItems);
          this.display.trigger("loadindex", {
            index:this.activeIndex,
            active:true
          });
        }
      };

      this.nextPage = function( setActive ) {
        var pageVar = setActive ? "activePage" : "currentPage";
        var pageLoaded = false;

        if ( this[pageVar] < (this.numPages - 1) ) {
          this[pageVar]++;
          pageLoaded = true;
        }
        else if ( settings.loop ) {
          this.loadState = this.loadState ? this.loadState : "first";
          this[pageVar] = 0;
          pageLoaded = true;
        }
        else {
          this.loadState = "";
        }

        // Set the page state.
        this.setPageState( setActive );

        if( pageLoaded ) {
          this.display.trigger("loadpage", {
            index:this[pageVar],
            active:setActive
          });
        }
      };

      this.prevPage = function( setActive ) {
        var pageVar = setActive ? "activePage" : "currentPage";
        var pageLoaded = false;

        if (this[pageVar] > 0) {
          this[pageVar]--;
          pageLoaded = true;
        }
        else if ( settings.loop ) {
          this.loadState = this.loadState ? this.loadState : "last";
          this[pageVar] = (this.numPages - 1);
          pageLoaded = true;
        }
        else {
          this.loadState = "";
        }

        // Set the page state.
        this.setPageState( setActive );

        if( pageLoaded ) {
          this.display.trigger("loadpage", {
            index:this[pageVar],
            active:setActive
          });
        }
      };

      this.setPageState = function( setActive ) {
        if( setActive ) {
          // If this page is active, then we want to make sure
          // we set the current page to the active page.
          this.currentPage = this.activePage;
        }
        else {
          // Store the active num items.
          this.activeNumItems = this.numItems;
        }
      };
    })( this, settings );
  };
})(jQuery);