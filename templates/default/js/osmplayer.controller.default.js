(function(template, osmplayer) {

  /** The osmplayer namespace. */
  var osmplayer = osmplayer || {};

  // Define the controller object.
  osmplayer.controller = osmplayer.controller || {};

  /**
   * Constructor for the minplayer.controller
   */
  osmplayer.controller[template] = function(context, options) {

    // Derive from default controller
    minplayer.controller.call(this, context, options);
  };

  /** Derive from controller. */
  osmplayer.controller[template].prototype = new minplayer.controller();
  osmplayer.controller[template].prototype.constructor = osmplayer.controller[template];

  /**
   * @see minplayer.plugin#construct
   */
  osmplayer.controller[template].prototype.construct = function() {

    // Make sure we provide default options...
    this.options = jQuery.extend({
      volumeVertical: true
    }, this.options);

    minplayer.controller.prototype.construct.call(this);
    if (!this.options.volumeVertical || this.options.controllerOnly) {
      this.display.addClass('minplayer-controls-volume-horizontal');
      this.display.removeClass('minplayer-controls-volume-vertical');

      // Need to catch this exception so that the player will continue to
      // function.  This is a bug with Opera.
      try {
        this.volumeBar.slider("option", "orientation", "horizontal");
      }
      catch (e) {}
    }
    else {
      this.display.addClass('minplayer-controls-volume-vertical');
      this.display.removeClass('minplayer-controls-volume-horizontal');
    }

    if (!this.options.controllerOnly) {
      this.get('player', function(player) {
        this.get('media', function(media) {
          if (!media.hasController()) {
            this.showThenHide(5000, function(shown) {
              var op = shown ? 'addClass' : 'removeClass';
              player.display[op]('with-controller');
            });
          }
          else {
            player.display.addClass('with-controller');
          }
        });
      });
    }
  }

  /**
   * Return the display for this plugin.
   */
  osmplayer.controller[template].prototype.getDisplay = function() {

    // See if we need to build out the controller.
    if (this.options.build) {

      // Prepend the control template.
      jQuery('.minplayer-' + template, this.context).prepend('\
      <div class="minplayer-' + template + '-controls ui-widget-header">\
        <div class="minplayer-' + template + '-controls-left">\
          <a class="minplayer-' + template + '-play minplayer-' + template + '-button ui-state-default ui-corner-all" title="Play">\
            <span class="ui-icon ui-icon-play"></span>\
          </a>\
          <a class="minplayer-' + template + '-pause minplayer-' + template + '-button ui-state-default ui-corner-all" title="Pause">\
            <span class="ui-icon ui-icon-pause"></span>\
          </a>\
        </div>\
        <div class="minplayer-' + template + '-controls-right">\
          <div class="minplayer-' + template + '-timer">00:00</div>\
          <div class="minplayer-' + template + '-fullscreen ui-widget-content">\
            <div class="minplayer-' + template + '-fullscreen-inner ui-state-default"></div>\
          </div>\
          <div class="minplayer-' + template + '-volume">\
            <div class="minplayer-' + template + '-volume-slider"></div>\
            <a class="minplayer-' + template + '-volume-mute minplayer-' + template + '-button ui-state-default ui-corner-all" title="Mute">\
              <span class="ui-icon ui-icon-volume-on"></span>\
            </a>\
            <a class="minplayer-' + template + '-volume-unmute minplayer-' + template + '-button ui-state-default ui-corner-all" title="Unmute">\
              <span class="ui-icon ui-icon-volume-off"></span>\
            </a>\
          </div>\
        </div>\
        <div class="minplayer-' + template + '-controls-mid">\
          <div class="minplayer-' + template + '-seek">\
            <div class="minplayer-' + template + '-progress ui-state-default"></div>\
          </div>\
        </div>\
      </div>');
    }

    // Let our template know we have a controller.
    this.context.addClass('with-controller');

    return jQuery('.minplayer-' + template + '-controls', this.context);
  }

  // Return the elements
  osmplayer.controller[template].prototype.getElements = function() {
    var elements = minplayer.controller.prototype.getElements.call(this);
    var timer = jQuery('.minplayer-' + template + '-timer', this.display);
    return jQuery.extend(elements, {
      play: jQuery('.minplayer-' + template + '-play', this.display),
      pause: jQuery('.minplayer-' + template + '-pause', this.display),
      fullscreen: jQuery('.minplayer-' + template + '-fullscreen', this.display),
      seek: jQuery('.minplayer-' + template + '-seek', this.display),
      progress: jQuery('.minplayer-' + template + '-progress', this.display),
      volume: jQuery('.minplayer-' + template + '-volume-slider', this.display),
      mute: jQuery('.minplayer-' + template + '-volume-mute', this.display),
      timer:timer,
      duration:timer
    });
  };
})('default', osmplayer);
