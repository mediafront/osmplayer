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
      'class': 'osmplayer-default'
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
