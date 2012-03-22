/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The play loader base class, which is used to control the busy
 * cursor, big play button, and the opaque background which shows when the
 * player is paused.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.playLoader = function(context, options) {

  // Define the flags that control the busy cursor.
  this.busy = new minplayer.flags();

  // Define the flags that control the big play button.
  this.bigPlay = new minplayer.flags();

  /** The preview image. */
  this.preview = null;

  // Derive from display
  minplayer.display.call(this, 'playLoader', context, options);
};

/** Derive from minplayer.display. */
minplayer.playLoader.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.playLoader.prototype.constructor = minplayer.playLoader;

/**
 * The constructor.
 */
minplayer.playLoader.prototype.construct = function() {

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Get the media plugin.
  this.get('media', function(media) {

    // Only bind if this player does not have its own play loader.
    if (!media.hasPlayLoader()) {

      // Get the poster image.
      if (!this.options.preview) {
        this.options.preview = media.elements.media.attr('poster');
      }

      // Reset the media's poster image.
      media.elements.media.attr('poster', '');

      // Load the preview image.
      this.loadPreview();

      // Trigger a play event when someone clicks on the controller.
      if (this.elements.bigPlay) {
        this.elements.bigPlay.unbind().bind('click', function(event) {
          event.preventDefault();
          jQuery(this).hide();
          media.play();
        });
      }

      // Bind to the player events to control the play loader.
      media.unbind('loadstart').bind('loadstart', (function(playLoader) {
        return function(event) {
          playLoader.busy.setFlag('media', true);
          playLoader.bigPlay.setFlag('media', true);
          if (playLoader.preview) {
            playLoader.elements.preview.show();
          }
          playLoader.checkVisibility();
        };
      })(this));
      media.bind('waiting', (function(playLoader) {
        return function(event) {
          playLoader.busy.setFlag('media', true);
          playLoader.checkVisibility();
        };
      })(this));
      media.bind('loadeddata', (function(playLoader) {
        return function(event) {
          playLoader.busy.setFlag('media', false);
          playLoader.checkVisibility();
        };
      })(this));
      media.bind('playing', (function(playLoader) {
        return function(event) {
          playLoader.busy.setFlag('media', false);
          playLoader.bigPlay.setFlag('media', false);
          if (playLoader.preview) {
            playLoader.elements.preview.hide();
          }
          playLoader.checkVisibility();
        };
      })(this));
      media.bind('pause', (function(playLoader) {
        return function(event) {
          playLoader.bigPlay.setFlag('media', true);
          playLoader.checkVisibility();
        };
      })(this));
    }
    else {

      // Hide the busy cursor.
      if (this.elements.busy) {
        this.elements.busy.unbind().hide();
      }

      // Hide the big play button.
      if (this.elements.bigPlay) {
        this.elements.bigPlay.unbind().hide();
      }

      // Hide the display.
      this.display.unbind().hide();
    }
  });

  // We are now ready.
  this.ready();
};

/**
 * Loads the preview image.
 */
minplayer.playLoader.prototype.loadPreview = function() {

  // If the preview element exists.
  if (this.elements.preview) {

    // If there is a preview to show...
    if (this.options.preview) {

      // Say that this has a preview.
      this.elements.preview.addClass('has-preview').show();

      // Create a new preview image.
      this.preview = new minplayer.image(this.elements.preview, this.options);

      // Create the image.
      this.preview.load(this.options.preview);
    }
    else {

      // Hide the preview.
      this.elements.preview.hide();
    }
  }
};

/**
 * Hide or show certain elements based on the state of the busy and big play
 * button.
 */
minplayer.playLoader.prototype.checkVisibility = function() {

  // Hide or show the busy cursor based on the flags.
  if (this.busy.flag) {
    this.elements.busy.show();
  }
  else {
    this.elements.busy.hide();
  }

  // Hide or show the big play button based on the flags.
  if (this.bigPlay.flag) {
    this.elements.bigPlay.show();
  }
  else {
    this.elements.bigPlay.hide();
  }

  // Show the control either flag is set.
  if (this.bigPlay.flag || this.busy.flag) {
    this.display.show();
  }

  // Hide the whole control if both flags are 0.
  if (!this.bigPlay.flag && !this.busy.flag) {
    this.display.hide();
  }
};
