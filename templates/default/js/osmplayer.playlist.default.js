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

    // Set the size.
    var size = this.options.vertical ? 'width' : 'height';
    var position = this.options.vertical ? 'right' : 'bottom';
    var margin = this.options.vertical ? 'marginRight' : 'marginBottom';

    // Perform the show hide functionality of the playlist.
    this.elements.hideShow.bind('click', (function(playlist, displaySize) {
      return function(event) {
        event.preventDefault();
        var button = $('span', playlist.elements.hideShow);
        var e = playlist.options.vertical ? 'e' : 's';
        var w = playlist.options.vertical ? 'w' : 'n';
        var visible = button.hasClass('ui-icon-triangle-1-' + e);
        var from = visible ? 'ui-icon-triangle-1-' + e : 'ui-icon-triangle-1-' + w;
        var to = visible ? 'ui-icon-triangle-1-' + w : 'ui-icon-triangle-1-' + e;
        $('span', playlist.elements.hideShow).removeClass(from).addClass(to);

        var playerPos = {}, displayPos = {};
        playerPos[position] = visible ? 0 : displaySize;
        player.elements.minplayer.animate(playerPos, 200);
        displayPos[margin] = visible ? -displaySize : 0;
        playlist.display.animate(displayPos, 200, function() {
          player.resize();
        });
      };
    })(this, this.display[size]()));

    // Set the player to have the correct margin if the playlist is present.
    if (this.options.vertical) {
      player.elements.minplayer.css('right', this.display.width() + 'px');
    }
    else {
      player.elements.minplayer.css('bottom', this.display.height() + 'px');
    }
  });
};

/**
 * Return the display for this plugin.
 */
osmplayer.playlist['default'].prototype.getDisplay = function() {
  if (this.options.build) {
    var cName = this.options.vertical ? 'playlist-vertical' : 'playlist-horizontal';
    var icon = this.options.vertical ? 'e' : 's';
    var corner = this.options.vertical ? 'ui-corner-left' : 'ui-corner-top';
    this.context.append('\
      <div class="osmplayer-playlist ' + cName + '">\
        <div class="osmplayer-hide-show-playlist ' + corner + '">\
          <span class="ui-icon ui-icon ui-icon-triangle-1-' + icon + '"></span>\
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
