/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the busy object.
minplayer.playLoader = minplayer.playLoader || {};

// constructor.
minplayer.playLoader["default"] = function(context, options) {

  // Derive from busy
  minplayer.playLoader.call(this, context, options);
};

// Define the prototype for all controllers.
minplayer.playLoader["default"].prototype = new minplayer.playLoader();
minplayer.playLoader["default"].prototype.constructor = minplayer.playLoader["default"];

/**
 * Return the display for this plugin.
 */
minplayer.playLoader["default"].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the playloader template.
    this.context.prepend('\
    <div class="minplayer-default-loader-wrapper">\
      <div class="minplayer-default-big-play ui-state-default"><span></span></div>\
      <div class="minplayer-default-loader">&nbsp;</div>\
      <div class="minplayer-default-preview ui-widget-content"></div>\
    </div>');
  }

  return jQuery('.minplayer-default-loader-wrapper', this.context);
}

// Return the elements
minplayer.playLoader["default"].prototype.getElements = function() {
  var elements = minplayer.playLoader.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    busy:jQuery(".minplayer-default-loader", this.display),
    bigPlay:jQuery(".minplayer-default-big-play", this.display),
    preview:jQuery(".minplayer-default-preview", this.display)
  });
};
