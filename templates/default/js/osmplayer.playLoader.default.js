(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the busy object.
  osmplayer.playLoader = osmplayer.playLoader || {};

  // constructor.
  osmplayer.playLoader[template] = function(context, options) {

    // Derive from playLoader
    minplayer.playLoader.call(this, context, options);
  };

  // Define the prototype for all controllers.
  osmplayer.playLoader[template].prototype = new minplayer.playLoader();
  osmplayer.playLoader[template].prototype.constructor = osmplayer.playLoader[template];

  /**
   * Return the display for this plugin.
   */
  osmplayer.playLoader[template].prototype.getDisplay = function() {

    // See if we need to build out the controller.
    if (this.options.build) {

      // Prepend the playloader template.
      jQuery('.minplayer-' + template + '', this.context).prepend('\
      <div class="minplayer-' + template + '-loader-wrapper">\
        <div class="minplayer-' + template + '-big-play ui-state-default"><span></span></div>\
        <div class="minplayer-' + template + '-loader">&nbsp;</div>\
        <div class="minplayer-' + template + '-preview ui-widget-content"></div>\
      </div>');
    }

    return jQuery('.minplayer-' + template + ' .minplayer-' + template + '-loader-wrapper', this.context);
  }

  /**
   * Loads the preview image.
   */
  osmplayer.playLoader[template].prototype.loadPreview = function(image) {
    if (!minplayer.playLoader.prototype.loadPreview.call(this, image)) {
      this.elements.preview.addClass('no-image');
    }
  };

  // Return the elements
  osmplayer.playLoader[template].prototype.getElements = function() {
    var elements = minplayer.playLoader.prototype.getElements.call(this);
    return jQuery.extend(elements, {
      busy:jQuery('.minplayer-' + template + '-loader', this.display),
      bigPlay:jQuery('.minplayer-' + template + '-big-play', this.display),
      preview:jQuery('.minplayer-' + template + '-preview', this.display)
    });
  };
})('default', osmplayer);

