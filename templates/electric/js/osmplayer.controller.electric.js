/** The minplayer namespace. */
var osmplayer = osmplayer || {};

// Define the controller object.
osmplayer.controller = osmplayer.controller || {};

/**
 * Constructor for the osmplayer.controller
 */
osmplayer.controller["electric"] = function(context, options) {

  // Derive from base controller
  minplayer.controller.call(this, context, options);
};

/** Derive from controller. */
osmplayer.controller["electric"].prototype = new minplayer.controller();
osmplayer.controller["electric"].prototype.constructor = osmplayer.controller["electric"];

/**
 * @see osmplayer.plugin#construct
 */
osmplayer.controller["electric"].prototype.construct = function() {
  minplayer.controller.prototype.construct.call(this);
  this.showThenHide();
}

/**
 * Return the display for this plugin.
 */
osmplayer.controller["electric"].prototype.getDisplay = function() {

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
osmplayer.controller["electric"].prototype.getElements = function() {
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
