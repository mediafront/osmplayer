(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the busy object.
  osmplayer.playlist = osmplayer.playlist || {};

  // constructor.
  osmplayer.playlist[template] = function(context, options) {

    // Derive from playlist
    osmplayer.playlist.call(this, context, options);
  };

  // Define the prototype for all controllers.
  osmplayer.playlist[template].prototype = new osmplayer.playlist();
  osmplayer.playlist[template].prototype.constructor = osmplayer.playlist[template];

  /**
   * @see minplayer.plugin#construct
   */
  osmplayer.playlist[template].prototype.construct = function() {

    this.options = jQuery.extend({
      showPlaylist: true
    }, this.options);

    osmplayer.playlist.prototype.construct.call(this);

    // Show then hide the element.
    this.showThenHide(this.elements.hideShow);

    // Make the main minplayer have the same width as the playlist.
    this.get('player', function(player) {

      // Set the size.
      var size = this.options.vertical ? 'width' : 'height';
      var position = this.options.vertical ? 'right' : 'bottom';
      var margin = this.options.vertical ? 'marginRight' : 'marginBottom';

      // Hide and show the playlist.
      this.hideShow = function(show, animate) {
        var playerPos = {}, displayPos = {};
        var displaySize = this.display[size]();
        var e = this.options.vertical ? 'e' : 's';
        var w = this.options.vertical ? 'w' : 'n';
        var from = show ? 'ui-icon-triangle-1-' + w : 'ui-icon-triangle-1-' + e;
        var to = show ? 'ui-icon-triangle-1-' + e : 'ui-icon-triangle-1-' + w;
        jQuery('span', this.elements.hideShow).removeClass(from).addClass(to);
        playerPos[position] = show ? displaySize : 0;
        if (player.elements.minplayer) {
          if (animate) {
            player.elements.minplayer.animate(playerPos, 'fast');
          }
          else {
            player.elements.minplayer.css(playerPos);
          }
        }
        displayPos[margin] = show ? 0 : -displaySize;
        if (animate) {
          this.display.animate(displayPos, 'fast', function() {
            player.resize();
          });
        }
        else {
          this.display.css(displayPos);
        }
      };

      // Show then hide the playlist.
      this.display.showMe = false;
      this.display.hideMe = (function(playlist) {
        return function(callback) {
          playlist.hideShow(false, true);
        };
      })(this);

      // Show then hide the display.
      this.showThenHide();

      // Bind when the playlist loads.
      this.ubind(this.uuid + ':playlistLoad', (function(playlist) {
        return function(event, data) {
          if (data.nodes.length === 1) {
            playlist.hideShow(false, true);
          }
          else {
            playlist.hideShow(true, true);
          }
        };
      })(this));

      // Perform the show hide functionality of the playlist.
      if (this.elements.hideShow) {
        this.elements.hideShow.bind('click', (function(playlist) {
          return function(event) {
            event.preventDefault();
            var button = jQuery('span', playlist.elements.hideShow);
            var e = playlist.options.vertical ? 'e' : 's';
            var w = playlist.options.vertical ? 'w' : 'n';
            var show = button.hasClass('ui-icon-triangle-1-' + w);
            playlist.hideShow(show, true);
          };
        })(this));
      }

      // If they wish to show the playlist.
      if (player.elements.minplayer) {
        if (this.options.showPlaylist) {

          // Set the player to have the correct margin if the playlist is present.
          if (this.options.vertical) {
            player.elements.minplayer.css('right', this.display.width() + 'px');
          }
          else {
            player.elements.minplayer.css('bottom', this.display.height() + 'px');
          }
        }
        else {

          // Hide the playlist.
          this.hideShow(false);
        }
      }
    });
  };

  /**
   * Return the display for this plugin.
   */
  osmplayer.playlist[template].prototype.getDisplay = function() {
    if (this.options.build) {
      this.context.append('\
      <div class="osmplayer-' + template + '-playlist">\
        <div class="osmplayer-' + template + '-hide-show-playlist ui-state-default">\
          <span class="ui-icon"></span>\
        </div>\
        <div class="minplayer-' + template + '-loader-wrapper">\
          <div class="minplayer-' + template + '-loader"></div>\
        </div>\
        <div class="osmplayer-' + template + '-playlist-scroll ui-widget-content">\
          <div class="osmplayer-' + template + '-playlist-list"></div>\
      </div>\
      </div>');
    }
    return jQuery('.osmplayer-' + template + '-playlist', this.context);
  };

  // Return the elements
  osmplayer.playlist[template].prototype.getElements = function() {
    var elements = osmplayer.playlist.prototype.getElements.call(this);

    // Setup the dynamic settings.
    var cName = this.options.vertical ? 'playlist-vertical' : 'playlist-horizontal';
    cName += this.options.playlistOnly ? ' playlist-only' : '';
    var show = this.options.showPlaylist;
    var icon = this.options.vertical ? (show ? 'e' : 'w') : (show ? 's' : 'n');
    var corner = this.options.vertical ? 'ui-corner-left' : 'ui-corner-top';

    // Remove the playlist if we need to.
    if (this.options.disablePlaylist || !this.options.playlist) {
      this.display.remove();
    }

    this.display.addClass(cName);
    var hideShow = jQuery('.osmplayer-' + template + '-hide-show-playlist', this.display);
    hideShow.addClass(corner);
    if (this.options.playlistOnly) {
      hideShow.hide();
      hideShow = null;
    }
    jQuery('span', hideShow).addClass('ui-icon-triangle-1-' + icon);

    return jQuery.extend(elements, {
      playlist_busy:jQuery('.minplayer-' + template + '-loader-wrapper', this.display),
      list:jQuery('.osmplayer-' + template + '-playlist-list', this.display),
      scroll:jQuery('.osmplayer-' + template + '-playlist-scroll', this.display),
      hideShow: hideShow
    });
  };
})('stretchy', osmplayer);

