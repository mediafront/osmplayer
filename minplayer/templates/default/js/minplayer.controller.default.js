/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the controller object.
minplayer.controller = minplayer.controller || {};

/**
 * Constructor for the minplayer.controller
 */
minplayer.controller["default"] = function(context, options) {

  // The fade timer.
  this.timer = 0;

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
  minplayer.get.call(this, this.options.id, null, function(plugin) {
    plugin.bind('fullscreen', {obj:this}, function(event, full) {
      event.data.obj.onFullScreen(full);
    });
  });
}

/**
 * Trigger when we go into full screen.
 */
minplayer.controller["default"].prototype.onFullScreen = function(full) {
  if (full) {

    var _this = this;
    var showThenHide = function() {
      clearTimeout(_this.timer);
      _this.display.show();
      _this.timer = setTimeout(function () {
        _this.display.hide('fast');
      }, 5000);
    };

    // Bind when they move the mouse.
    jQuery(document).bind('mousemove', showThenHide);
    showThenHide();
  }
  else {

    // Unbind the show then hide function.
    this.display.show();
    clearTimeout(this.timer);
    jQuery(document).unbind('mousemove', showThenHide);
  }
};

/**
 * Return the display for this plugin.
 */
minplayer.controller["default"].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the control template.
    this.context.prepend('\
    <div class="media-player-error"></div>\
    <div class="media-player-controls">\
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
minplayer.controller["default"].prototype.getElements = function() {
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
