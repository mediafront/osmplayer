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
    if (this.options.build) {
      jQuery('#mediaplayer_minplayer', this.context).prepend('\
      <div id="mediaplayer_play_loader">\
        <div id="mediaplayer_busy"></div>\
        <div id="mediaplayer_bigPlay"></div>\
        <div id="mediaplayer_preview"></div>\
      </div>');
    }
    return jQuery('#mediaplayer_play_loader', this.context);
  }

  // Return the elements
  osmplayer.playLoader[template].prototype.getElements = function() {
    var elements = minplayer.playLoader.prototype.getElements.call(this);
    return jQuery.extend(elements, {
      busy:jQuery('#mediaplayer_busy', this.display),
      bigPlay:jQuery('#mediaplayer_bigPlay', this.display),
      preview:jQuery('#mediaplayer_preview', this.display)
    });
  };
})('simpleblack', osmplayer);

