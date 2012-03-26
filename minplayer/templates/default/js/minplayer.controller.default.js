/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the controller object.
minplayer.controller = minplayer.controller || {};

/**
 * Constructor for the minplayer.controller
 */
minplayer.controller["default"] = function(context, options) {

  // Derive from base controller
  minplayer.controller.call(this, context, options);
};

/** Derive from controller. */
minplayer.controller["default"].prototype = new minplayer.controller();
minplayer.controller["default"].prototype.constructor = minplayer.controller["default"];

/**
 * @see minplayer.plugin#construct
 */
minplayer.controller["default"].prototype.construct = function() {
  minplayer.controller.prototype.construct.call(this);
  this.get('player', function(player) {
    minplayer.showThenHide(this.display, 5000, function(shown) {
      var op = shown ? 'addClass' : 'removeClass';
      player.display[op]('with-controller');
    });
  });
}

/**
 * Return the display for this plugin.
 */
minplayer.controller["default"].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the control template.
    this.context.prepend('\
    <div class="minplayer-default-controls ui-widget-header">\
      <div class="minplayer-default-controls-left">\
        <a class="minplayer-default-play minplayer-default-button ui-state-default ui-corner-all" title="Play">\
          <span class="ui-icon ui-icon-play"></span>\
        </a>\
        <a class="minplayer-default-pause minplayer-default-button ui-state-default ui-corner-all" title="Pause">\
          <span class="ui-icon ui-icon-pause"></span>\
        </a>\
      </div>\
      <div class="minplayer-default-controls-right">\
        <div class="minplayer-default-timer">00:00</div>\
        <div class="minplayer-default-fullscreen ui-widget-content">\
          <div class="minplayer-default-fullscreen-inner ui-state-default"></div>\
        </div>\
        <div class="minplayer-default-volume">\
          <div class="minplayer-default-volume-slider"></div>\
          <a class="minplayer-default-volume-mute minplayer-default-button ui-state-default ui-corner-all" title="Mute">\
            <span class="ui-icon ui-icon-volume-on"></span>\
          </a>\
          <a class="minplayer-default-volume-unmute minplayer-default-button ui-state-default ui-corner-all" title="Unmute">\
            <span class="ui-icon ui-icon-volume-off"></span>\
          </a>\
        </div>\
      </div>\
      <div class="minplayer-default-controls-mid">\
        <div class="minplayer-default-seek">\
          <div class="minplayer-default-progress ui-state-default"></div>\
        </div>\
      </div>\
    </div>');
  }

  // Let our template know we have a controller.
  this.context.addClass('with-controller');

  return jQuery('.minplayer-default-controls', this.context);
}

// Return the elements
minplayer.controller["default"].prototype.getElements = function() {
  var elements = minplayer.controller.prototype.getElements.call(this);
  var timer = jQuery(".minplayer-default-timer", this.display);
  return jQuery.extend(elements, {
    play: jQuery(".minplayer-default-play", this.display),
    pause: jQuery(".minplayer-default-pause", this.display),
    fullscreen: jQuery(".minplayer-default-fullscreen", this.display),
    seek: jQuery(".minplayer-default-seek", this.display),
    progress: jQuery(".minplayer-default-progress", this.display),
    volume: jQuery(".minplayer-default-volume-slider", this.display),
    mute: jQuery('.minplayer-default-volume-mute', this.display),
    timer:timer,
    duration:timer
  });
};
