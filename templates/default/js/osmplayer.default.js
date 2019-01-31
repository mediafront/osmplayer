/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

// Default player.
osmplayer['default'] = function(context, options) {

  // Derive from osmplayer.
  osmplayer.call(this, context, options);
};

/**
 * Define this template prototype.
 */
osmplayer['default'].prototype = new osmplayer();
osmplayer['default'].prototype.constructor = osmplayer['default'];

/**
 * Return the display for this plugin.
 */
osmplayer['default'].prototype.getDisplay = function() {

  // If the tag is video or audio, then build out the player.
  var tag = this.context.get(0).tagName.toLowerCase();
  if (tag == 'video' || tag == 'audio') {

    // Build out the player provided the base tag.
    this.context = this.context.attr({
      'id': this.options.id + '-player',
      'class': 'minplayer-default-media'
    })
    .wrap(jQuery(document.createElement('div')).attr({
      'class': 'minplayer-default-display ui-widget-content'
    })).parent('.minplayer-default-display')
    .wrap(jQuery(document.createElement('div')).attr({
      'class': 'minplayer-default'
    })).parent('.minplayer-default')
    .prepend('\
      <div class="minplayer-default-logo"></div>\
      <div class="minplayer-default-error"></div>'
    )
    .wrap(jQuery(document.createElement('div')).attr({
      'id': this.options.id,
      'class': 'osmplayer-default player-ui'
    })).parent('.osmplayer-default');

    // Mark a flag that says this display needs to be built.
    this.options.build = true;
  }

  return this.context;
}

// Get the elements for this player.
osmplayer['default'].prototype.getElements = function() {
  var elements = osmplayer.prototype.getElements.call(this);

  // Set the width and height of this element.
  this.display.width(this.options.width);
  this.display.height(this.options.height);

  // Get the minplayer component.
  var minplayer = jQuery(".minplayer-default", this.display);
  if (this.options.playlistOnly) {
    minplayer.remove();
    minplayer = null;
  }

  // Get the playlist component.
  var playlist = jQuery('.osmplayer-default-playlist', this.display);
  if (this.options.disablePlaylist) {
    playlist.remove();
    playlist = null;
  }

  return jQuery.extend(elements, {
    player:this.display,
    minplayer: minplayer,
    display:jQuery(".minplayer-default-display", this.display),
    media:jQuery(".minplayer-default-media", this.display),
    error:jQuery('.minplayer-default-error', this.display),
    logo:jQuery('.minplayer-default-logo', this.display),
    playlist: playlist
  });
};

// Define the controller object.
osmplayer.controller = osmplayer.controller || {};

/**
 * Constructor for the minplayer.controller
 */
osmplayer.controller['default'] = function(context, options) {

  // Derive from default controller
  minplayer.controller.call(this, context, options);
};

/** Derive from controller. */
osmplayer.controller['default'].prototype = new minplayer.controller();
osmplayer.controller['default'].prototype.constructor = osmplayer.controller['default'];

/**
 * @see minplayer.plugin#construct
 */
osmplayer.controller['default'].prototype.construct = function() {
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
osmplayer.controller['default'].prototype.getDisplay = function() {

  // See if we need to build out the controller.
  if (this.options.build) {

    // Prepend the control template.
    jQuery('.minplayer-default', this.context).prepend('\
    <div class="minplayer-default-controls ui-widget-header">\
      <div class="minplayer-default-controls-left">\
        <a class="minplayer-default-play minplayer-default-button ui-state-default ui-corner-all" title="Play">\
          <span class="ui-icon ui-icon-play"></span>\
        </a>\
        <a class="minplayer-default-pause minplayer-default-button ui-state-default ui-corner-all" title="Pause">\
          <span class="ui-icon ui-icon-pause"></span>\
        </a>\
      </div>\
      <div class="minplayer-default-controls-right">\
        <div class="minplayer-default-timer">00:00</div>\
        <div class="minplayer-default-fullscreen ui-widget-content">\
          <div class="minplayer-default-fullscreen-inner ui-state-default"></div>\
        </div>\
        <div class="minplayer-default-volume">\
          <div class="minplayer-default-volume-slider"></div>\
          <a class="minplayer-default-volume-mute minplayer-default-button ui-state-default ui-corner-all" title="Mute">\
            <span class="ui-icon ui-icon-volume-on"></span>\
          </a>\
          <a class="minplayer-default-volume-unmute minplayer-default-button ui-state-default ui-corner-all" title="Unmute">\
            <span class="ui-icon ui-icon-volume-off"></span>\
          </a>\
        </div>\
      </div>\
      <div class="minplayer-default-controls-mid">\
        <div class="minplayer-default-seek">\
          <div class="minplayer-default-progress ui-state-default"></div>\
        </div>\
      </div>\
    </div>');
  }

  // Let our template know we have a controller.
  this.context.addClass('with-controller');

  return jQuery('.minplayer-default-controls', this.context);
}

// Return the elements
osmplayer.controller['default'].prototype.getElements = function() {
  var elements = minplayer.controller.prototype.getElements.call(this);
  var timer = jQuery(".minplayer-default-timer", this.display);
  return jQuery.extend(elements, {
    play: jQuery(".minplayer-default-play", this.display),
    pause: jQuery(".minplayer-default-pause", this.display),
    fullscreen: jQuery(".minplayer-default-fullscreen", this.display),
    seek: jQuery(".minplayer-default-seek", this.display),
    progress: jQuery(".minplayer-default-progress", this.display),
    volume: jQuery(".minplayer-default-volume-slider", this.display),
    mute: jQuery('.minplayer-default-volume-mute', this.display),
    timer:timer,
    duration:timer
  });
};
