/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Define the controller object.
osmplayer.controller = osmplayer.controller || {};

/**
 * Constructor for the minplayer.controller
 */
osmplayer.controller['default'] = function(context, options) {

  // Derive from default controller
  minplayer.controller.call(this, context, options);
};

/** Derive from controller. */
osmplayer.controller['default'].prototype = new minplayer.controller();
osmplayer.controller['default'].prototype.constructor = osmplayer.controller['default'];

/**
 * @see minplayer.plugin#construct
 */
osmplayer.controller['default'].prototype.construct = function() {
  minplayer.controller.prototype.construct.call(this);
  this.get('player', function(player) {
    minplayer.showThenHide(this.display, 5000, function(shown) {
      if (shown) {
        player.logo.addClass('with-controller');
      }
      else {
        player.logo.removeClass('with-controller');
      }
    });
  });
}

/**
 * Return the display for this plugin.
 */
osmplayer.controller['default'].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the control template.
    jQuery('.media-player', this.context).prepend('\
    <div class="media-player-controls ui-state-default">\
      <div class="media-player-controls-left">\
        <a class="media-player-play" title="Play"></a>\
        <a class="media-player-pause" title="Pause"></a>\
      </div>\
      <div class="media-player-controls-right">\
        <div class="media-player-timer">00:00</div>\
        <div class="media-player-fullscreen">\
          <div class="media-player-fullscreen-inner"></div>\
        </div>\
        <div class="media-player-volume">\
          <div class="media-player-volume-slider"></div>\
          <a class="media-player-volume-button" title="Mute/Unmute"></a>\
        </div>\
      </div>\
      <div class="media-player-controls-mid">\
        <div class="media-player-seek">\
          <div class="media-player-progress"></div>\
        </div>\
      </div>\
    </div>');
  }

  return jQuery('.media-player-controls', this.context);
}

// Return the elements
osmplayer.controller['default'].prototype.getElements = function() {
  var elements = minplayer.controller.prototype.getElements.call(this);
  var timer = jQuery(".media-player-timer", this.display);
  return jQuery.extend(elements, {
    play: jQuery(".media-player-play", this.display),
    pause: jQuery(".media-player-pause", this.display),
    fullscreen: jQuery(".media-player-fullscreen", this.display),
    seek: jQuery(".media-player-seek", this.display),
    progress: jQuery(".media-player-progress", this.display),
    volume: jQuery(".media-player-volume-slider", this.display),
    timer:timer,
    duration:timer
  });
};
