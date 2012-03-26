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
    jQuery('.minplayer-default', this.context).prepend('\
    <div class="minplayer-default-loader-wrapper">\
      <div class="minplayer-default-big-play ui-state-default"><span></span></div>\
      <div class="minplayer-default-loader">&nbsp;</div>\
      <div class="minplayer-default-preview ui-widget-content"></div>\
    </div>');
  }

  return jQuery('.minplayer-default .minplayer-default-loader-wrapper', this.context);
}

// Return the elements
osmplayer.playLoader['default'].prototype.getElements = function() {
  var elements = minplayer.playLoader.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    busy:jQuery(".minplayer-default-loader", this.display),
    bigPlay:jQuery(".minplayer-default-big-play", this.display),
    preview:jQuery(".minplayer-default-preview", this.display)
  });
};
