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

  // Clear the variables.
  this.clear();

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

  // Set the plugin name within the options.
  this.options.pluginName = 'playLoader';

  // Get the media plugin.
  this.initializePlayLoader();

  // We are now ready.
  this.ready();
};

/**
 * Initialize the playLoader.
 */
minplayer.playLoader.prototype.initializePlayLoader = function() {

  // Get the media plugin.
  this.get('media', function(media) {

    // Only bind if this player does not have its own play loader.
    if (!media.hasPlayLoader(this.options.preview)) {

      // Enable the playLoader.
      this.enabled = true;

      // Get the poster image.
      if (!this.options.preview) {
        this.options.preview = media.poster;
      }

      // Determine if we should load the image.
      var shouldLoad = true;
      if (this.preview && this.preview.loader) {
        shouldLoad = (this.preview.loader.src !== this.options.preview);
      }

      // Only load the image if it is different.
      if (shouldLoad) {
        // Reset the media's poster image.
        media.elements.media.attr('poster', '');

        // Load the preview image.
        this.loadPreview();
      }

      // Trigger a play event when someone clicks on the controller.
      if (this.elements.bigPlay) {
        minplayer.click(this.elements.bigPlay.unbind(), function(event) {
          event.preventDefault();
          jQuery(this).hide();
          media.play();
        });
      }

      // Bind to the player events to control the play loader.
      media.ubind(this.uuid + ':loadstart', (function(playLoader) {
        return function(event, data, reset) {
          playLoader.busy.setFlag('media', true);
          playLoader.bigPlay.setFlag('media', true);
          playLoader.previewFlag.setFlag('media', true);
          playLoader.checkVisibility();
        };
      })(this));
      media.ubind(this.uuid + ':waiting', (function(playLoader) {
        return function(event, data, reset) {
          if (!reset) {
            playLoader.busy.setFlag('media', true);
            playLoader.checkVisibility();
          }
        };
      })(this));
      media.ubind(this.uuid + ':loadeddata', (function(playLoader) {
        return function(event, data, reset) {
          if (!reset) {
            playLoader.busy.setFlag('media', false);
            playLoader.checkVisibility();
          }
        };
      })(this));
      media.ubind(this.uuid + ':playing', (function(playLoader) {
        return function(event, data, reset) {
          if (!reset) {
            playLoader.busy.setFlag('media', false);
            playLoader.bigPlay.setFlag('media', false);
            if (media.mediaFile.type !== 'audio') {
              playLoader.previewFlag.setFlag('media', false);
            }
            playLoader.checkVisibility();
          }
        };
      })(this));
      media.ubind(this.uuid + ':pause', (function(playLoader) {
        return function(event, data, reset) {
          if (!reset) {
            playLoader.busy.setFlag('media', false);
            playLoader.bigPlay.setFlag('media', true);
            playLoader.checkVisibility();
          }
        };
      })(this));
    }
    else {

      // Hide the display.
      this.enabled = false;
      this.hide(this.elements.busy);
      this.hide(this.elements.bigPlay);
      this.hide(this.elements.preview);
      this.hide();
    }
  });
};

/**
 * Clears the playloader.
 *
 * @param {function} callback Called when the playloader is finished clearing.
 */
minplayer.playLoader.prototype.clear = function(callback) {

  // Define the flags that control the busy cursor.
  this.busy = new minplayer.flags();

  // Define the flags that control the big play button.
  this.bigPlay = new minplayer.flags();

  // Define the flags the control the preview.
  this.previewFlag = new minplayer.flags();

  /** If the playLoader is enabled. */
  this.enabled = true;

  // If the preview is defined, then clear the image.
  if (this.preview) {

    this.preview.clear((function(playLoader) {
      return function() {

        // Reset the preview.
        playLoader.preview = null;

        // If they wish to be called back after it is cleared.
        if (callback) {
          callback();
        }
      };
    })(this));
  }
  else {

    /** The preview image. */
    this.preview = null;

    // Return the callback.
    if (callback) {
      callback();
    }
  }
};

/**
 * Loads the preview image.
 *
 * @param {string} image The image you would like to load.
 * @return {boolean} Returns true if an image was loaded, false otherwise.
 */
minplayer.playLoader.prototype.loadPreview = function(image) {

  // Get the image to load.
  image = image || this.options.preview;
  this.options.preview = image;

  // Ignore if disabled.
  if (!this.enabled || (this.display.length === 0)) {
    return;
  }

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
      return true;
    }
    else {

      // Hide the preview.
      this.elements.preview.hide();
    }
  }

  return false;
};

/**
 * Hide or show certain elements based on the state of the busy and big play
 * button.
 */
minplayer.playLoader.prototype.checkVisibility = function() {

  // Ignore if disabled.
  if (!this.enabled) {
    return;
  }

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

  if (this.previewFlag.flag) {
    this.elements.preview.show();
  }
  else {
    this.elements.preview.hide();
  }

  // Show the control either flag is set.
  if (this.bigPlay.flag || this.busy.flag || this.previewFlag.flag) {
    this.display.show();
  }

  // Hide the whole control if both flags are 0.
  if (!this.bigPlay.flag && !this.busy.flag && !this.previewFlag.flag) {
    this.display.hide();
  }
};
