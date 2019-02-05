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
   * Return the display for this plugin.
   */
  osmplayer[template].prototype.getDisplay = function() {

    // If this is the bottom element, then we need to build.
    if (this.context.children().length == 0) {

      // Build out the player provided the base tag.
      this.context = this.context.attr({
        'id': this.options.id + '-player',
        'class': 'minplayer-' + template + '-media'
      })
      .wrap(jQuery(document.createElement('div')).attr({
        'class': 'minplayer-' + template + '-display ui-widget-content'
      })).parent('.minplayer-' + template + '-display')
      .wrap(jQuery(document.createElement('div')).attr({
        'class': 'minplayer-' + template
      })).parent('.minplayer-' + template)
      .prepend('\
        <div class="minplayer-' + template + '-logo"></div>\
        <div class="minplayer-' + template + '-error"></div>'
      )
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

    // Set the width and height of this element.
    this.display.width(this.options.width);
    this.display.height(this.options.height);

    // Get the minplayer component.
    var minplayer = jQuery('.minplayer-' + template, this.display);
    if (this.options.playlistOnly) {
      minplayer.remove();
      minplayer = null;
    }

    // Get the playlist component.
    var playlist = jQuery('.osmplayer-' + template + '-playlist', this.display);
    if (this.options.disablePlaylist) {
      playlist.remove();
      playlist = null;
    }

    return jQuery.extend(elements, {
      player:this.display,
      minplayer: minplayer,
      display:jQuery('.minplayer-' + template + '-display', this.display),
      media:jQuery('.minplayer-' + template + '-media', this.display),
      error:jQuery('.minplayer-' + template + '-error', this.display),
      logo:jQuery('.minplayer-' + template + '-logo', this.display),
      playlist: playlist
    });
  };

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
    minplayer.controller.prototype.construct.call(this);
    this.get('player', function(player) {
      minplayer.showThenHide(this.display, 5000, function(shown) {
        var op = shown ? 'addClass' : 'removeClass';
        player.display[op]('with-controller');
      });
    });
  }

  /**
   * Return the display for this plugin.
   */
  osmplayer.controller[template].prototype.getDisplay = function() {

    // See if we need to build out the controller.
    if (this.options.build) {

      // Prepend the control template.
      jQuery('.minplayer-' + template + '', this.context).prepend('\
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
