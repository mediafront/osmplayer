/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Define the busy object.
osmplayer.playlist = osmplayer.playlist || {};

// constructor.
osmplayer.playlist['default'] = function(context, options) {

  // Derive from playlist
  osmplayer.playlist.call(this, context, options);
};

// Define the prototype for all controllers.
osmplayer.playlist['default'].prototype = new osmplayer.playlist();
osmplayer.playlist['default'].prototype.constructor = osmplayer.playlist['default'];

/**
 * @see minplayer.plugin#construct
 */
osmplayer.playlist['default'].prototype.construct = function() {

  this.options = jQuery.extend({
    showPlaylist: true
  }, this.options);

  osmplayer.playlist.prototype.construct.call(this);

  // Show then hide the element.
  minplayer.showThenHide(this.elements.hideShow);

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
      playerPos[position] = show ? displaySize : 0;
      if (animate) {
        player.elements.minplayer.animate(playerPos, 'fast');
      }
      else {
        player.elements.minplayer.css(playerPos);
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

    // Perform the show hide functionality of the playlist.
    this.elements.hideShow.bind('click', (function(playlist) {
      return function(event) {
        event.preventDefault();
        var button = jQuery('span', playlist.elements.hideShow);
        var e = playlist.options.vertical ? 'e' : 's';
        var w = playlist.options.vertical ? 'w' : 'n';
        var show = button.hasClass('ui-icon-triangle-1-' + w);
        var from = show ? 'ui-icon-triangle-1-' + w : 'ui-icon-triangle-1-' + e;
        var to = show ? 'ui-icon-triangle-1-' + e : 'ui-icon-triangle-1-' + w;
        jQuery('span', playlist.elements.hideShow).removeClass(from).addClass(to);
        playlist.hideShow(show, true);
      };
    })(this));

    // If they wish to show the playlist.
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
  });
};

/**
 * Return the display for this plugin.
 */
osmplayer.playlist['default'].prototype.getDisplay = function() {
  if (this.options.build) {
    this.context.append('\
    <div class="osmplayer-default-playlist">\
      <div class="osmplayer-default-hide-show-playlist ui-state-default">\
        <span class="ui-icon"></span>\
      </div>\
    </div>');
  }
  return jQuery('.osmplayer-default-playlist', this.context);
};

// Return the elements
osmplayer.playlist['default'].prototype.getElements = function() {
  var elements = osmplayer.playlist.prototype.getElements.call(this);

  // Setup the dynamic settings.
  var cName = this.options.vertical ? 'playlist-vertical' : 'playlist-horizontal';
  var show = this.options.showPlaylist;
  var icon = this.options.vertical ? (show ? 'e' : 'w') : (show ? 's' : 'n');
  var corner = this.options.vertical ? 'ui-corner-left' : 'ui-corner-top';

  this.display.addClass(cName);
  var hideShow = jQuery(".osmplayer-default-hide-show-playlist", this.display);
  hideShow.addClass(corner);
  jQuery('span', hideShow).addClass('ui-icon-triangle-1-' + icon);

  return jQuery.extend(elements, {
    hideShow:hideShow
  });
};
