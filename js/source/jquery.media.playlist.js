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
      playlist:"",
      args:[],
      wildcard:"*"         
   }); 

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      pager:"#mediapager",
      scroll:"#mediascroll",
      busy:"#mediabusy",
      links:"#medialinks"       
   });   
   
   jQuery.fn.mediaplaylist = function( server, settings ) {
      if( this.length === 0 ) {
         return null;
      }
      return new (function( server, playlist, settings ) {
         settings = jQuery.media.utils.getSettings(settings);
         
         // Save the jQuery display.
         this.display = playlist;
         var _this = this;

         this.allowResize = true;
         
         // Store all of the current teasers.
         this.teasers = [];

         // The non-active selected teaser.
         this.selectedTeaser = null;

         // The active teaser.
         this.activeTeaser = null;

         // Set up our playlist args.
         this.args = settings.args;

         // Used to keep track if we should set the node active after a playlist load.
         this.setActive = true;

         // The active pager.
         this.activePager = null;

         // The attached pager bar..
         this.pager = null;
                  
         // Set up the playlist parser.
         this.parser = jQuery.media.parser( settings );

         // Get the Scroll Region.
         this.scrollRegion = playlist.find( settings.ids.scroll ).mediascroll( settings );
         this.scrollRegion.clear();

         // Store the dimensions.
         this.width = this.scrollRegion.width;
         this.height = this.scrollRegion.height;
         
         if( settings.vertical ) {
            this.display.width( this.width );
         } else {
            this.display.height( this.height );  
         }
         
         // Store the busy cursor.
         this.busy = playlist.find( settings.ids.busy );
         this.busyVisible = false;
         this.busyImg = this.busy.find("img");
         this.busyWidth = this.busyImg.width();
         this.busyHeight = this.busyImg.height();         

         // Get the links.
         this.links = playlist.find( settings.ids.links ).medialinks( settings );
         this.links.loadLinks();
         
         this.loading = function( _loading ) {
            if( this.pager ) {
               this.pager.enabled = !_loading;
            }
            if( this.activePager ) {
               this.activePager.enabled = !_loading;
            }
            if( _loading ) {
               this.busyVisible = true;
               this.busy.show();
            }
            else {
               this.busyVisible = false;
               this.busy.hide();   
            }
         };       

         this.onResize = function( deltaX, deltaY ) {
            if( this.allowResize ) {  
               this.width += deltaX;
               this.height += deltaY;
               this.pagerWidth += deltaX;
               
               this.scrollRegion.onResize( deltaX, deltaY );
               
               if( this.pager ) {
                  this.pager.display.width( this.width );
               }
               
               // Resize the busy symbol.
               this.busy.css({
                  width:this.width,
                  height:this.height
               });
               this.busyImg.css({
                  marginLeft:((this.width - this.busyWidth)/2) + "px", 
                  marginTop:((this.height - this.busyHeight)/2) + "px" 
               });                 
            }   
         };              

         // Allow mulitple pagers to control this playlist.
         this.addPager = function( newPager, active ) {
            if( newPager ) {
               // Handler for the loadindex event.
               newPager.display.bind( "loadindex", function( event, data ) {
                  if( data.active ) {
                     _this.activateTeaser( _this.teasers[data.index] );
                  }
                  else {
                     _this.selectTeaser( _this.teasers[data.index] );
                  }
               });      
      
               // Handler for the loadpage event.         
               newPager.display.bind( "loadpage", function( event, data ) {
                  _this.setActive = data.active;
                  _this.loadPlaylist( {
                     pageIndex:data.index
                  } );
               });
               
               if( active && !this.activePager ) {
                  this.activePager = newPager;   
               }
            }
            return newPager;
         };

         // Add the pager.
         this.pager = this.addPager( playlist.find( settings.ids.pager ).mediapager( settings ), false );

         // Handler for when a link is clicked.
         this.links.display.bind( "linkclick", function( event, link ) {
            _this.onLinkClick( link );
         });

         this.onLinkClick = function( link ) {
            var index = link.index;
            var newPlaylist = link.playlist;
            var newArgs = [];
            newArgs[index] = link.arg;
            
            if( this.pager ) {
               this.pager.reset();
            }
            
            if( this.activePager ) {
               this.activePager.reset();
            }
            
            this.loadPlaylist( {
               playlist:newPlaylist,
               args:newArgs
            } );
         };

         // Loads the next track.
         this.loadNext = function() {
            if( this.pager ) {
               this.pager.loadNext( true );
            }
            else if( this.activePager ) {
               this.activePager.loadNext( true );
            }
         };

         // Function to load the playlist.
         this.loadPlaylist = function( _args ) {
            var defaults = {
               playlist:settings.playlist,
               pageLimit:settings.pageLimit,
               pageIndex:(this.pager ? this.pager.activePage : 0),
               args:{}
            };          

            var playlistArgs = jQuery.extend( {}, defaults, _args );

            // Set the arguments.         
            this.setArgs( playlistArgs.args );

            // Set the busy cursor.
            this.loading( true );

            // If there is a playlist.
            if( playlistArgs.playlist ) {
               // If the playlist is an object, then just set it directly.
               if( ((typeof playlistArgs.playlist) == "object") ) {
                  settings.playlist = playlistArgs.playlist.name;
                  this.setPlaylist( playlistArgs.playlist ); 
               }
               else {
                  // See if the playlist is a URL file.
                  if( playlistArgs.playlist.match(/^http[s]?\:\/\/|\.xml$/i) ) {
                     // Parse the XML file.
                     this.parser.parseFile( playlistArgs.playlist, function( result ) {
                        _this.setPlaylist( result ); 
                     });
                  }
                  else if( server ) {
                     // Load the playlist from the server.
                     server.call( jQuery.media.commands.getPlaylist, function( result ) {
                        _this.setPlaylist( result );  
                     }, null, playlistArgs.playlist, playlistArgs.pageLimit, playlistArgs.pageIndex, this.args );
                  }
               }

               // Return that the playlist was loaded.
               return true;
            }

            // Return that the playlist was not loaded.
            return false;
         };

         // Set this playlist.
         this.setPlaylist = function( _playlist ) {
            if( _playlist && _playlist.nodes ) {
               // Now check the visibility of the parents, and add the offenders to the array.
               var invisibleParents = [];
               jQuery.media.utils.checkVisibility( this.display, invisibleParents );

               // Set the total number of items for the pager.
               if( this.pager ) {   
                  this.pager.setTotalItems( _playlist.total_rows ); 
               }
               
               // Set the total number of items for the active pager.
               if( this.activePager ) {
                  this.activePager.setTotalItems( _playlist.total_rows ); 
               } 
   
               // Empty the scroll region.
               this.scrollRegion.clear();
               
               // Reset the teasers.
               this.resetTeasers();
               
               // Iterate through all of our nodes.
               var numNodes = _playlist.nodes.length;
               for( var index=0; index < numNodes; index++ ) {
                  // Add the teaser.
                  this.addTeaser( _playlist.nodes[index], index );             
               }
   
               // Activate the scroll region.
               this.scrollRegion.activate();          
   
               // Load the next node.
               if( this.pager ) {
                  this.pager.loadNext( this.setActive );
               }
               
               if( this.activePager ) {
                  this.activePager.loadNext( this.setActive );
               }

               // Now reset the invisibilty.
               jQuery.media.utils.resetVisibility( invisibleParents );
            }
            
            // We are finished loading.
            this.loading( false );
         };

         // When a vote has been cast, we also need to update the playlist.
         this.onVoteSet = function( vote ) {
            if( vote ) {
               var i = this.teasers.length;
               while(i--) {
                  var teaser = this.teasers[i];
                  if( teaser.node.nodeInfo.nid == vote.content_id ) {
                     teaser.node.voter.updateVote( vote );
                  }
               }
            }
         };
         
         // Add a single teaser to the list.
         this.addTeaser = function( nodeInfo, index ) {
            // Setup the teaser.
            var teaser = this.scrollRegion.newItem().mediateaser( server, nodeInfo, index, settings );             
            if( teaser ) {
               // If they click on the teaser, then activate it.      
               teaser.display.bind( "click", teaser, function( event ) {
                  _this.activateTeaser( event.data );
               });  
   
               if( this.activeTeaser ) {            
                  this.activeTeaser.setActive( nodeInfo.nid == this.activeTeaser.node.nodeInfo.nid );
               }
               
               if( this.selectedTeaser ) {             
                  this.selectedTeaser.setSelected( nodeInfo.nid == this.selectedTeaser.node.nodeInfo.nid );
               }
   
               // Add this teaser to the teasers array.
               this.teasers.push( teaser ); 
            }
         };

         this.resetTeasers = function() {
            // Remove all handlers.
            var i = this.teasers.length;
            while(i--) {
               this.teasers[i].reset();   
            }
            this.teasers = [];
         };

         this.refresh = function() {
            this.scrollRegion.refresh();
            var i = this.teasers.length;
            while(i--) {
               this.teasers[i].refresh();   
            }            
         };

         // Set the arguments for this playlist.
         this.setArgs = function( _args ) {
            if( _args ) {
               // Reset the arguments.
               this.args = settings.args;

               // Loop through and add the new arguments.
               var i = _args.length;
               while(i--) {
                  var arg = _args[i];
                  if( arg && (arg != settings.wildcard) ) {
                     this.args[i] = arg;
                  }                  
               }
            }
         };

         // Selects a teaser.
         this.selectTeaser = function( teaser ) {

            // Set the current active teaser to false.
            if( this.selectedTeaser ) {
               this.selectedTeaser.setSelected( false );
            }
            
            // Store the active teaser for next time.                                   
            this.selectedTeaser = teaser;             

            if( this.selectedTeaser ) {
               // Now activate the new teaser.
               this.selectedTeaser.setSelected( true );           
                        
               // Set this item as visible in the scroll region.
               this.scrollRegion.setVisible( teaser.index ); 
            }
         };

         // Activate the teaser.
         this.activateTeaser = function( teaser ) {
            // First select the teaser.
            this.selectTeaser( teaser );
            
            // Set the current active teaser to false.
            if( this.activeTeaser ) {
               this.activeTeaser.setActive( false );
            }
            
            // Store the active teaser for next time.                                   
            this.activeTeaser = teaser;             

            if( this.activeTeaser ) {
               // Now activate the new teaser.
               this.activeTeaser.setActive( true );      
   
               // Set the active and current index to this one.
               if( this.pager ) {
                  this.pager.activeIndex = this.pager.currentIndex = teaser.index;
               }
               
               if( this.activePager ) {
                  this.activePager.activeIndex = this.activePager.currentIndex = teaser.index;
               }
               
               // Trigger an even that the teaser has been activated.
               this.display.trigger( "playlistload", teaser.node.nodeInfo );
            }
         };
      })( server, this, settings );
   };
})(jQuery);
