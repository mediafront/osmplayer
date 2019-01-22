/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Define the busy object.
osmplayer.playLoader = osmplayer.playLoader || {};

// constructor.
osmplayer.playLoader['default'] = function(context, options) {

  // Derive from playLoader
  minplayer.playLoader.call(this, context, options);
};

// Define the prototype for all controllers.
osmplayer.playLoader['default'].prototype = new minplayer.playLoader();
osmplayer.playLoader['default'].prototype.constructor = osmplayer.playLoader['default'];

/**
 * Return the display for this plugin.
 */
osmplayer.playLoader['default'].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the playloader template.
    jQuery('.media-player', this.context).prepend('\
    <div class="media-player-play-loader">\
      <div class="media-player-big-play"><span></span></div>\
      <div class="media-player-loader">&nbsp;</div>\
      <div class="media-player-preview"></div>\
    </div>');
  }

  return jQuery('.media-player-play-loader', this.context);
}

// Return the elements
osmplayer.playLoader['default'].prototype.getElements = function() {
  var elements = minplayer.playLoader.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    busy:jQuery(".media-player-loader", this.display),
    bigPlay:jQuery(".media-player-big-play", this.display),
    preview:jQuery(".media-player-preview", this.display)
  });
};
