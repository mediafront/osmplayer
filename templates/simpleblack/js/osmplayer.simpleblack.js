(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // templated player.
  osmplayer[template] = function(context, options) {

    // Derive from osmplayer.
    osmplayer.call(this, context, options);
  };

  /**
   * Define this template prototype.
   */
  osmplayer[template].prototype = new osmplayer();
  osmplayer[template].prototype.constructor = osmplayer[template];

  /**
   * The player constructor.
   */
  osmplayer[template].prototype.construct = function() {

    // Make sure we provide default options...
    this.options = jQuery.extend({
      controllerOnly: false
    }, this.options);

    osmplayer.prototype.construct.call(this);
    if (this.options.controllerOnly) {
      this.display.addClass('controller-only');
    }
  };

  /**
   * Return the display for this plugin.
   */
  osmplayer[template].prototype.getDisplay = function() {

    // If this is the bottom element, then we need to build.
    if (this.context.children().length == 0) {

      // Build out the player provided the base tag.
      this.context = this.context.attr({
        'id': this.options.id + '-player',
        'class': 'mediaplayer-' + template + '-media'
      })
      .wrap(jQuery(document.createElement('div')).attr({
        'id': 'mediaplayer_display'
      })).parent('#mediaplayer_display')
      .wrap(jQuery(document.createElement('div')).attr({
        'id': 'mediaplayer_minplayer'
      })).parent('#mediaplayer_minplayer')
      .prepend('\
        <div id="mediaplayer_busy"></div>\
        <div id="mediaplayer_bigPlay"></div>\
        <div id="mediaplayer_preview"></div>\
      ')
      .wrap(jQuery(document.createElement('div')).attr({
        'id': 'mediaplayer_node'
      })).parent('#mediaplayer_node')
      .wrap(jQuery(document.createElement('div')).attr({
        'id': 'mediaplayer'
      })).parent('#mediaplayer')
      .wrap(jQuery(document.createElement('div')).attr({
        'id': this.options.id,
        'class': 'osmplayer-' + template + ' player-ui'
      })).parent('.osmplayer-' + template);

      // Mark a flag that says this display needs to be built.
      this.options.build = true;
    }

    return this.context;
  }

  // Get the elements for this player.
  osmplayer[template].prototype.getElements = function() {
    var elements = osmplayer.prototype.getElements.call(this);
    this.display.width(this.options.width);
    this.display.height(this.options.height);
    return jQuery.extend(elements, {
      player:this.display,
      minplayer: jQuery('#mediaplayer_minplayer', this.display),
      display:jQuery('#mediaplayer_display', this.display),
      media:jQuery('.minplayer-' + template + '-media', this.display)
    });
  };
})('simpleblack', osmplayer);
