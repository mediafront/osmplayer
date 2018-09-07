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
    prefix:"",
    zIndex:400,
    fluidWidth:false,
    fluidHeight:false,
    fullscreen:false
  });

  jQuery.media.ids = jQuery.extend( jQuery.media.ids, {
    loading:"#mediaplayerloading",
    player:"#mediaplayer",
    menu:"#mediamenu",
    titleBar:"#mediatitlebar",
    node:"#medianode",
    playlist:"#mediaplaylist",
    control:"#mediacontrol"
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

  // Adds a new element to the media player.
  jQuery.media.addElement = function( playerId, fromPlayer, name ) {
    if( fromPlayer && fromPlayer[name] ) {
      var toPlayer = jQuery.media.players[playerId];
      if( toPlayer ) {
        switch( name ) {
          case "playlist":
            toPlayer.addPlaylist( fromPlayer.playlist );
            break;
          case "controller":
            toPlayer.addController( fromPlayer.controller );
            break;
          default:
            break;
        }
      }
      else {
        // Otherwise, cache it for inclusion when the player is created.
        var pName = name + "s";
        if( !jQuery.media[pName][playerId] ) {
          jQuery.media[pName][playerId] = [];
        }
        jQuery.media[pName][playerId].push( fromPlayer[name] );
      }
    }
  };

  // To add a new controller to any existing or future-included players.
  jQuery.media.addController = function( playerId, fromPlayer ) {
    jQuery.media.addElement( playerId, fromPlayer, "controller" );
  };

  // To add a new playlist to any existing or future-included players.
  jQuery.media.addPlaylist = function( playerId, fromPlayer ) {
    jQuery.media.addElement( playerId, fromPlayer, "playlist" );
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

      // Store the index variable.
      var i = 0;

      // Set the template object.
      settings.template = jQuery.media.templates[settings.template]( this, settings );

      // Get all of the setting overrides used in this template.
      if( settings.template.getSettings ) {
        settings = jQuery.extend( settings, settings.template.getSettings() );
      }

      // Add some keyboard event handlers.
      $(window).keyup( function( event ) {
        switch( event.keyCode ) {
          case 0:   /* SpaceBar */
            _this.onSpaceBar();
            break;
          case 113: /* Q key */
          case 27:  /* ESC Key */
            _this.onEscKey();
            break;
          default:
            break;
        }
      });

      // Add a resize handler to the window if either our width or height is fluid.
      if( settings.fluidWidth || settings.fluidHeight ) {
        $(window).resize( function() {
          _this.onResize();
        });
      }

      // First get the communication protocol.
      if( jQuery.media[settings.protocol] ) {
        this.protocol = jQuery.media[settings.protocol]( settings );
      }

      // Load the server.
      if( jQuery.media[settings.server] ) {
        this.server = jQuery.media[settings.server]( this.protocol, settings );
      }

      // Get the menu.
      this.menu = this.dialog.find( settings.ids.menu ).mediamenu( this.server, settings );
      if( this.menu ) {
        this.menu.display.unbind("menuclose").bind( "menuclose", function() {
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

      // Our attached controller.
      this.controller = null;

      // The active controller.
      this.activeController = null;

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
          this.onFullScreen( false );
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
        element.display.unbind("menu").bind("menu", function(event) {
          _this.showMenu( !_this.menuOn );
        });

        element.display.unbind("maximize").bind("maximize", function( event ) {
          _this.maximize( !_this.maxOn );
        });

        element.display.unbind("fullscreen").bind("fullscreen", function( event ) {
          _this.onFullScreen( !_this.fullScreen );
        });
      };

      // Function to put the player in fullscreen mode.
      this.onFullScreen = function( full ) {
        this.fullScreen = full;
        if( this.node && this.node.player ) {
          this.node.player.fullScreen( this.fullScreen );
          this.onResize();

          // Check to see if this browser supports native fullscreen.
          if (window.webkitSupportsFullscreen && window.webkitSupportsFullscreen()) {
            if (full) {
              window.webkitEnterFullscreen();
            }
            else {
              window.webkitExitFullscreen();
            }
          }
        }
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
              _this.onResize();
            }
          });
        }
      }

      // Get the node and register for events.
      this.node = this.dialog.find( settings.ids.node ).medianode( this.server, settings );
      if( this.node ) {
        this.node.display.unbind("nodeload").bind( "nodeload", function( event, data ) {
          _this.onNodeLoad( data );
        });

        if( this.node.player && this.node.player.media ) {
          this.node.player.media.display.unbind("mediaupdate").bind( "mediaupdate", function( event, data ) {
            _this.onMediaUpdate( data );
          });
        }

        if( this.node.uservoter ) {
          this.node.uservoter.display.unbind("voteSet").bind( "voteSet", function( event, vote ) {
            if( _this.activePlaylist ) {
              _this.activePlaylist.onVoteSet( vote );
            }
          });
        }
      }

      // Called when the media updates.
      this.onMediaUpdate = function( data ) {
        // Call the player onMediaUpdate.
        this.node.player.onMediaUpdate( data );

        // When the media completes, have the active playlist load the next item.
        if( settings.autoNext && this.activePlaylist && (data.type == "complete") ) {
          this.activePlaylist.loadNext();
        }

        // Update our controller.
        if( this.controller ) {
          this.controller.onMediaUpdate( data );
        }

        // Update our active controller.
        if( this.activeController ) {
          this.activeController.onMediaUpdate( data );
        }

        // Set the media information in the menu.
        if( this.menu && this.node && (data.type == "meta") ) {
          this.menu.setEmbedCode( this.node.player.media.player.getEmbedCode() );
          this.menu.setMediaLink( this.node.player.media.player.getMediaLink() );
        }

        // Let the template do something...
        if( settings.template && settings.template.onMediaUpdate ) {
          settings.template.onMediaUpdate( data );
        }
      };

      // Called when the playlist is finished loading.
      this.onPlaylistLoad = function( data ) {
        if( this.node ) {
          // Let our media know that there is a playlist.
          if( this.node.player && this.node.player.media ) {
            this.node.player.media.hasPlaylist = true;
          }

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
          newPlaylist.display.unbind("playlistload").bind( "playlistload", newPlaylist, function( event, data ) {
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

      // Search these elements for the id.
      this.searchForElement = function(elementList) {

        // Iterate through the elements.
        for(var id in elementList) {

          // We need to tolerate instances.
          var reg = new RegExp( '^' + id + '(\\_[0-9]+)?$', 'i');
          if (settings.id.search(reg) === 0) {
            return elementList[id];
          }
        }
        return null;
      };

      // Add the default playlist.
      this.playlist = this.addPlaylist( this.dialog.find( settings.ids.playlist ).mediaplaylist( this.server, settings ) );

      // Allow mulitple controllers to control this media.
      this.addController = function( newController, active ) {
        if( newController ) {
          newController.display.unbind("controlupdate").bind( "controlupdate", newController, function( event, data ) {
            _this.activeController = event.data;
            if( _this.node && _this.node.player ) {
              _this.node.player.onControlUpdate( data );
            }
          });

          if( active && !this.activeController ) {
            this.activeController = newController;
          }

          this.addPlayerEvents( newController );
        }
        return newController;
      };

      // Add the control bar to the media.
      this.controller = this.addController( this.dialog.find( settings.ids.control ).mediacontrol( settings ), false );
      if( this.controller && this.node ) {
        // Add any voters to the node.
        this.node.addVoters( this.controller.display );
      }

      // Called when the player resizes.
      this.onResize = function() {
        // Call the template resize function.
        if( settings.template.onResize ) {
          settings.template.onResize();
        }

        // Resize the node.
        if( this.node ) {
          this.node.onResize();
        }

        // Resize the attached control region.
        if( this.controller ) {
          this.controller.onResize();
        }
      };

      // Function to show the built in controls or not.
      this.showNativeControls = function( show ) {
        var player = this.node ? this.node.player : null;
        if( player && player.hasControls() ) {
          player.usePlayerControls = show;
          if( show ) {
            player.busy.hide();
            player.play.hide();
            if( player.preview ) {
              player.preview.display.hide();
            }
            if( this.controller ) {
              this.controller.display.hide();
            }
          }
          else {
            player.showBusy( 1, ((this.busyFlags & 0x2) == 0x2) );
            player.showPlay( this.playVisible );
            player.showPreview( this.previewVisible );
            if( this.controller ) {
              this.controller.display.show();
            }
          }
          player.showControls( show );
        }
      };

      // Load the content into the player.
      this.loadContent = function() {

        // Now add any queued controllers...
        var controllers = this.searchForElement(jQuery.media.controllers);
        if (controllers) {
          i = controllers.length;
          while(i) {
            i--;
            this.addController( controllers[i], true );
          }
        }

        // Now add any queued playlists...
        var playlists = this.searchForElement(jQuery.media.playlists);
        if (playlists) {
          i = playlists.length;
          while(i) {
            i--;
            this.addPlaylist( playlists[i] );
          }
        }

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

        // The player looks good now.  Move the dialog back.
        this.dialog.css("position","relative");
        this.dialog.css("marginLeft",0);
        this.dialog.css("overflow","visible");

        // If they wish to default the player in fullscreen mode, do that now.
        if( settings.fullscreen ) {
          this.onFullScreen(true);
        }

        // Set our loaded flag to true.
        this.loaded = true;
        this.display.trigger( "playerLoaded", this );

        // Call all of our queued onLoaded callback functions.
        if( jQuery.media.loadCallbacks[settings.id] ) {
          var callbacks = jQuery.media.loadCallbacks[settings.id];
          var i = callbacks.length;
          while(i) {
            i--;
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
