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
      protocol:"auto",
      server:"drupal",
      template:"default",
      baseURL:"",
      debug:false,
      draggable:false,
      resizable:false,
      showPlaylist:true,
      autoNext:true,
      prefix:""
   });    

   jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
      loading:"#mediaplayerloading",
      player:"#mediaplayer",
      menu:"#mediamenu",
      titleBar:"#mediatitlebar",
      node:"#medianode",
      playlist:"#mediaplaylist"   
   });   
   
   // Initialize our players, playlists, and controllers.   
   jQuery.media.players = {};
   jQuery.media.loadCallbacks = {};
   jQuery.media.playlists = {}; 
   jQuery.media.controllers = {};   
   
   // Use this function to trigger when the player has finished registering and loaded.
   jQuery.media.onLoaded = function( playerId, callback ) {
      var player = jQuery.media.players[playerId];
      if( player && player.display && player.loaded ) {
         callback( player );
      }
      else {
         if( !jQuery.media.loadCallbacks[playerId] ) {
            jQuery.media.loadCallbacks[playerId] = [];
         }
         jQuery.media.loadCallbacks[playerId].push( callback );
      }
   };

   // To add a new controller to any existing or future-included players.
   jQuery.media.addController = function( playerId, fromPlayer ) {
      // Check to make sure the fromPlayer has a controller.
      if( fromPlayer && fromPlayer.node && fromPlayer.node.player && fromPlayer.node.player.controller ) {
         // If the player already exists, then add it directly to the player.
         var toPlayer = jQuery.media.players[playerId];
         if( toPlayer && toPlayer.node && toPlayer.node.player ) {
            toPlayer.node.player.addController( fromPlayer.node.player.controller );
         }
         else {
            // Otherwise, cache it for inclusion when the player is created.
            if( !jQuery.media.controllers[playerId] ) {
               jQuery.media.controllers[playerId] = [];
            }
            jQuery.media.controllers[playerId].push( fromPlayer.node.player.controller );
         } 
      }     
   };
   
   // To add a new playlist to any existing or future-included players.
   jQuery.media.addPlaylist = function( playerId, fromPlayer ) {
      // Make sure the fromPlayer has a playlist.
      if( fromPlayer && fromPlayer.playlist ) {
         // If the player already exists, then add it directly to the player.
         var toPlayer = jQuery.media.players[playerId];
         if( toPlayer ) {
            toPlayer.addPlaylist( fromPlayer.playlist );
         }
         else {
            // Otherwise, cache it for inclusion when the player is created.
            if( !jQuery.media.playlists[playerId] ) {
               jQuery.media.playlists[playerId] = [];
            }
            jQuery.media.playlists[playerId].push( fromPlayer.playlist );
         } 
      }
   };
   
   // The main entry point into the player. 
   jQuery.fn.mediaplayer = function( settings ) {
      if( this.length === 0 ) {
         return null;
      }
      // Return the media Media Player
      return new (function( player, settings ) {         
         // Get the settings.
         settings = jQuery.media.utils.getSettings( settings );
         
         // Get the id if it has not been set.
         if( !settings.id ) {
            settings.id = jQuery.media.utils.getId( player );
         }         
         
         // Save the dialog.
         this.dialog = player;                     
        
         // Save the jQuery display.                                        
         this.display = this.dialog.find( settings.ids.player );
         var _this = this;          

         // Fix a really strange issue where if any of the parent elements are invisible
         // when this player's template is initializing, it would crash due to the issue
         // with calling the position() function on an invisible object.  This seems to fix
         // that issue.
         var invisibleParents = [];

         // Now check the visibility of the parents, and add the offenders to the array.
         jQuery.media.utils.checkVisibility( this.display, invisibleParents );

         // Add this player to the players object.
         jQuery.media.players[settings.id] = this;

         // Variable to keep track if this player has finished loading.
         this.loaded = false;
         
         // Set the template object.
         settings.template = jQuery.media.templates[settings.template]( this, settings );
         
         // Get all of the setting overrides used in this template.
         if( settings.template.getSettings ) {
            settings = jQuery.extend( settings, settings.template.getSettings() );
         }
         
         // Add some keyboard event handlers.
         $(window).keypress( function( event ) {
            switch( event.keyCode ) {
               case 0:   /* SpaceBar */
                  _this.onSpaceBar();
                  break;
               case 27:  /* ESC Key */
                  _this.onEscKey();
                  break;
            }
         });
         
         // First get the communication protocol.
         if( jQuery.media[settings.protocol] ) {
            this.protocol = jQuery.media[settings.protocol]( settings );
         }
         
         // Load the server.
         if( jQuery.media[settings.server] ) {
            this.server = jQuery.media[settings.server]( this.protocol, settings );
         }

         // Set the width and height properties.
         this.width = this.dialog.width();
         this.height = this.dialog.height();

         // Get the menu.
         this.menu = this.display.find( settings.ids.menu ).mediamenu( this.server, settings );
         if( this.menu ) {
            this.menu.display.bind( "menuclose", function() {
               _this.showMenu( false );   
            });
         }
         
         // Setup our booleans.
         this.menuOn = false;
         this.maxOn = !settings.showPlaylist;
         this.fullScreen = false;
         
         // The attached playlist.
         this.playlist = null;
         
         // The active playlist.
         this.activePlaylist = null;
         
         // Hide or Show the menu.
         this.showMenu = function( show ) {
            if( settings.template.onMenu ) {
               this.menuOn = show;
               settings.template.onMenu( this.menuOn );
            }         
         };
         
         // Called when the user presses the ESC key.
         this.onEscKey = function() {
            // If they are in full screen mode, then escape when they press the ESC key.
            if( this.fullScreen ) {
               this.fullScreen = false;
               if( this.node && this.node.player ) {
                  this.node.player.fullScreen( this.fullScreen );
               }              
            }            
         };
         
         // When they press the space bar, we will toggle the player play/pause state.
         this.onSpaceBar = function() {
            if( this.fullScreen && this.node && this.node.player ) {            
               this.node.player.togglePlayPause();
            }
         };

         // Adds the media player events to a given element.
         this.addPlayerEvents = function( element ) {
            // Trigger on the menu.
            element.display.bind("menu", function(event) {
               _this.showMenu( !_this.menuOn );
            });

            element.display.bind("maximize", function( event ) {
               _this.maximize( !_this.maxOn );
            });

            element.display.bind("fullscreen", function( event ) {
               _this.fullScreen = !_this.fullScreen;
               if( _this.node && _this.node.player ) {
                  _this.node.player.fullScreen( _this.fullScreen );
               }
            });
         };

         // Setup the title bar.
         this.titleBar = this.dialog.find( settings.ids.titleBar ).mediatitlebar( settings );
         if( this.titleBar ) {
            // Add the player events to the titlebar.
            this.addPlayerEvents( this.titleBar );
         
            // If they have jQuery UI, make this draggable.
            if( settings.draggable && this.dialog.draggable ) {
               this.dialog.draggable({
                  handle: settings.ids.titleBar,
                  containment: 'document'
               });
            }         
   
            // If they have jQuery UI, make this resizable.         
            if( settings.resizable && this.dialog.resizable ) {
               this.dialog.resizable({
                  alsoResize: this.display,
                  containment: 'document',
                  resize: function(event) {
                     _this.setSize( _this.dialog.width(), _this.dialog.height() );
                  }
               });            
            }
         }         

         // Get the node and register for events.
         this.node = this.display.find( settings.ids.node ).medianode( this.server, settings );
         if( this.node ) {
            // Add the player events to the node.
            this.addPlayerEvents( this.node );

            this.node.display.bind( "nodeload", function( event, data ) {
               _this.onNodeLoad( data );
            });
            
            if( this.node.player && this.node.player.media ) {
               this.node.player.media.display.bind( "mediaupdate", function( event, data ) {
                  _this.onMediaUpdate( data );
               });
            }            
            
            if( this.node.uservoter ) {
               this.node.uservoter.display.bind( "voteSet", function( event, vote ) {
                  if( _this.activePlaylist ) {
                     _this.activePlaylist.onVoteSet( vote ); 
                  }
               });
            }
         }
         
         // Called when the media updates.
         this.onMediaUpdate = function( data ) {
            // When the media completes, have the active playlist load the next item.
            if( settings.autoNext && this.activePlaylist && (data.type == "complete") ) {
               this.activePlaylist.loadNext();
            }                   
            
            // Set the media information in the menu.
            if( this.menu && this.node && (data.type == "meta") ) {
               this.menu.setEmbedCode( this.node.player.media.player.getEmbedCode() );
               this.menu.setMediaLink( this.node.player.media.player.getMediaLink() );
            }
         };

         // Called when the playlist is finished loading.
         this.onPlaylistLoad = function( data ) {
            if( this.node ) {
               this.node.loadNode( data );
            }
            
            // Allow the template to do something when the playlist is loaded.
            if( settings.template.onPlaylistLoad ) {            
               settings.template.onPlaylistLoad( data );  
            }                   
         };
         
         // Called when the main node is loaded.
         this.onNodeLoad = function( data ) {           
            // Allow the template to do something when the node is loaded.
            if( settings.template.onNodeLoad ) {             
               settings.template.onNodeLoad( data );  
            }                       
         };

         // Called when the player resizes.
         this.onResize = function( deltaX, deltaY ) {
            // Call the template resize function.
            if( settings.template.onResize ) {             
               settings.template.onResize( deltaX, deltaY );  
            } 
            
            // Only resize the connected playlist.
            if( this.playlist ) {
               this.playlist.onResize( deltaX, deltaY );   
            }
            
            // Resize the node.
            if( this.node ) {
               this.node.onResize( deltaX, deltaY );
            }
         }; 

         // Maximize the player.
         this.maximize = function( on ) {
            // Don't want to maximize in fullscreen mode.
            if( !this.fullScreen ) {
               if( settings.template.onMaximize && (on != this.maxOn) ) {
                  this.maxOn = on;
                  settings.template.onMaximize( this.maxOn );   
               }  
            }
         };

         // Allow multiple playlists to be associated with this single player using this API.
         this.addPlaylist = function( newPlaylist ) {     
            if( newPlaylist ) {
               newPlaylist.display.bind( "playlistload", newPlaylist, function( event, data ) {
                  // Set this as the active playlist.
                  _this.activePlaylist = event.data;
                  _this.onPlaylistLoad( data );
               });
               
               // Check to see if this playlist has already loaded... If so, then we need to
               // go ahead and load the active teaser into this player.
               if( !this.activePlaylist && newPlaylist.activeTeaser ) {
                  this.activePlaylist = newPlaylist;
                  this.onPlaylistLoad( newPlaylist.activeTeaser.node.nodeInfo );
               }
            }
            return newPlaylist;
         };

         // Add the default playlist.
         this.playlist = this.addPlaylist( this.display.find( settings.ids.playlist ).mediaplaylist( this.server, settings ) );
         
         // Now add any queued playlists...
         if( jQuery.media.playlists[settings.id] ) {
            var playlists = jQuery.media.playlists[settings.id];
            var i = playlists.length;
            while(i--) {
               this.addPlaylist( playlists[i] );
            }
         }         
         
         // Allow the player to be resized.
         this.setSize = function( newWidth, newHeight ) {
            // Only call onResize if the width or height changes.
            newWidth = newWidth ? newWidth : this.width;
            newHeight = newHeight ? newHeight : this.height;
            if( (newWidth != this.width) || (newHeight != this.height) ) {
               // Determine the delta's
               var deltaX = (newWidth - this.width);
               var deltaY = (newHeight - this.height);
               
               // Set the width and height properties.
               this.width = newWidth;
               this.height = newHeight;   
               
               this.dialog.css({
                  width:this.width,
                  height:this.height
               });
               
               // Call the resize function.             
               this.onResize( deltaX, deltaY );
            }          
         };

         // Load the content into the player.
         this.loadContent = function() {
            var playlistLoaded = false;

            if( this.playlist ) {
               playlistLoaded = this.playlist.loadPlaylist();
            }

            // Don't load the node if there is a plalist loaded.
            if( !playlistLoaded && this.node ) {
               // Make sure to transfer any playlist settings over to the node.
               if( this.node.player && this.node.player.media ) {
                  this.node.player.media.settings.repeat = (settings.loop || settings.repeat);
               }

               this.node.loadNode(); 
            }
         }; 

         this.initializeTemplate = function() {
            // Initialize our template.
            if( settings.template.initialize ) {
               settings.template.initialize( settings );
            }

            // Now reset the visibility of the parents.
            jQuery.media.utils.resetVisibility( invisibleParents );
         };

         this.load = function() {            
            // Initialize our template.
            this.initializeTemplate();
            
            // Resize the player.
            this.onResize( 0, 0 );
            
            // The player looks good now.  Move the dialog back.
            this.dialog.css("position","relative");
            this.dialog.css("marginLeft",0);  
            this.dialog.css("overflow","visible");

            // Set our loaded flag to true.
            this.loaded = true;
            this.display.trigger( "playerLoaded", this );

            // Call all of our queued onLoaded callback functions.
            if( jQuery.media.loadCallbacks[settings.id] ) {
               var callbacks = jQuery.media.loadCallbacks[settings.id];
               var i = callbacks.length;
               while(i--) {
                  callbacks[i]( this );
               }
            }

            // Connect to the server.
            this.server.connect( function( result ) {
               _this.loadContent();
            });                         
         };     
         
         this.load();     
      })( this, settings );
   };
})(jQuery);
