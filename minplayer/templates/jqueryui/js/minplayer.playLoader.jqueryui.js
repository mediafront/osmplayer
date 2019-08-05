/** The minplayer namespace. */
var minplayer = minplayer || {};

// Define the busy object.
minplayer.playLoader = minplayer.playLoader || {};

// constructor.
minplayer.playLoader["jqueryui"] = function(context, options) {

  // Derive from busy
  minplayer.playLoader.call(this, context, options);
};

// Define the prototype for all controllers.
minplayer.playLoader["jqueryui"].prototype = new minplayer.playLoader();
minplayer.playLoader["jqueryui"].prototype.constructor = minplayer.playLoader["jqueryui"];

/**
 * Return the display for this plugin.
 */
minplayer.playLoader["jqueryui"].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the playloader template.
    this.context.prepend('\
    <div class="minplayer-jqueryui-loader-wrapper">\
      <div class="minplayer-jqueryui-big-play ui-state-default"><span></span></div>\
      <div class="minplayer-jqueryui-loader">&nbsp;</div>\
      <div class="minplayer-jqueryui-preview ui-widget-content"></div>\
    </div>');
  }

  return jQuery('.minplayer-jqueryui-loader-wrapper', this.context);
}

/**
 * Loads the preview image.
 */
minplayer.playLoader["jqueryui"].prototype.loadPreview = function() {
  if (!minplayer.playLoader.prototype.loadPreview.call(this)) {
    this.elements.preview.addClass('no-image');
  }
};

// Return the elements
minplayer.playLoader["jqueryui"].prototype.getElements = function() {
  var elements = minplayer.playLoader.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    busy:jQuery(".minplayer-jqueryui-loader", this.display),
    bigPlay:jQuery(".minplayer-jqueryui-big-play", this.display),
    preview:jQuery(".minplayer-jqueryui-preview", this.display)
  });
};
