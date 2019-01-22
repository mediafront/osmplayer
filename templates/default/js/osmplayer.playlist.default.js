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
  osmplayer.playlist.prototype.construct.call(this);

  // Show then hide the element.
  minplayer.showThenHide(this.elements.hideShow);

  // Make the main minplayer have the same width as the playlist.
  this.get('player', function(player) {

    // Perform the show hide functionality of the playlist.
    this.elements.hideShow.bind('click', (function(playlist, width) {
      return function(event) {
        event.preventDefault();
        var button = $('span', playlist.elements.hideShow);
        var visible = button.hasClass('ui-icon-triangle-1-e');
        var from = visible ? 'ui-icon-triangle-1-e' : 'ui-icon-triangle-1-w';
        var to = visible ? 'ui-icon-triangle-1-w' : 'ui-icon-triangle-1-e';
        $('span', playlist.elements.hideShow).removeClass(from).addClass(to);
        player.elements.minplayer.animate({
          marginRight: visible ? 0 : width
        }, 200);
        playlist.display.animate({
          right: visible ? -width : 0
        }, 200, function() {
          player.resize();
        });
      };
    })(this, this.display.width()));

    // Set the player to have the correct margin if the playlist is present.
    player.elements.minplayer.css('marginRight', this.display.width() + 'px');
  });
};

/**
 * Return the display for this plugin.
 */
osmplayer.playlist['default'].prototype.getDisplay = function() {
  if (this.options.build) {
    var vertical = this.options.vertical ? ' playlist-vertical' : '';
    this.context.append('\
      <div class="osmplayer-playlist">\
        <div class="osmplayer-hide-show-playlist ui-corner-left">\
          <span class="ui-icon ui-icon ui-icon-triangle-1-e"></span>\
        </div>\
      </div>\
    ');
  }
  return jQuery('.osmplayer-playlist', this.context);
};

// Return the elements
osmplayer.playlist['default'].prototype.getElements = function() {
  var elements = osmplayer.playlist.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    hideShow:jQuery(".osmplayer-hide-show-playlist", this.display)
  });
};
