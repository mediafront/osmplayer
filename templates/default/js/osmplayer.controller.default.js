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
  /*
  this.get('player', function(player) {
    minplayer.showThenHide(this.display, 5000, function(shown) {
      var op = shown ? 'addClass' : 'removeClass';
      player.display[op]('with-controller');
    });
  });
  */
}

/**
 * Return the display for this plugin.
 */
osmplayer.controller['default'].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the control template.
    jQuery('.minplayer-default', this.context).prepend('\
    <div class="minplayer-default-controls ui-widget-header">\
      <div class="minplayer-default-controls-left">\
        <a class="minplayer-default-play minplayer-default-button" title="Play"></a>\
        <a class="minplayer-default-pause minplayer-default-button" title="Pause"></a>\
      </div>\
      <div class="minplayer-default-controls-right">\
        <div class="minplayer-default-timer">00:00</div>\
        <div class="minplayer-default-fullscreen">\
          <div class="minplayer-default-fullscreen-inner"></div>\
        </div>\
        <div class="minplayer-default-volume">\
          <div class="minplayer-default-volume-slider"></div>\
          <a class="minplayer-default-volume-button" title="Mute/Unmute"></a>\
        </div>\
      </div>\
      <div class="minplayer-default-controls-mid">\
        <div class="minplayer-default-seek">\
          <div class="minplayer-default-progress"></div>\
        </div>\
      </div>\
    </div>');
  }

  // Let our template know we have a controller.
  this.context.addClass('with-controller');

  return jQuery('.minplayer-default-controls', this.context);
}

// Return the elements
osmplayer.controller['default'].prototype.getElements = function() {
  var elements = minplayer.controller.prototype.getElements.call(this);
  var timer = jQuery(".minplayer-default-timer", this.display);
  return jQuery.extend(elements, {
    play: jQuery(".minplayer-default-play", this.display),
    pause: jQuery(".minplayer-default-pause", this.display),
    fullscreen: jQuery(".minplayer-default-fullscreen", this.display),
    seek: jQuery(".minplayer-default-seek", this.display),
    progress: jQuery(".minplayer-default-progress", this.display),
    volume: jQuery(".minplayer-default-volume-slider", this.display),
    mute: jQuery('.minplayer-default-volume-button', this.display),
    timer:timer,
    duration:timer
  });
};
