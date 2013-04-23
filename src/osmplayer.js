// Add a way to instanciate using jQuery prototype.
if (!jQuery.fn.osmplayer) {

  /**
   * A special jQuery event to handle the player being removed from DOM.
   *
   * @this The element that is being triggered with.
   **/
  jQuery.event.special.playerdestroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler(this);
      }
    }
  };

  /**
   * @constructor
   *
   * Define a jQuery osmplayer prototype.
   *
   * @param {object} options The options for this jQuery prototype.
   * @return {Array} jQuery object.
   */
  jQuery.fn.osmplayer = function(options) {
    return jQuery(this).each(function() {
      options = options || {};
      options.id = options.id || jQuery(this).attr('id') || Math.random();
      if (!minplayer.plugins[options.id]) {
        options.template = options.template || 'default';
        if (osmplayer[options.template]) {
          new osmplayer[options.template](jQuery(this), options);
        }
        else {
          new osmplayer(jQuery(this), options);
        }
      }
    });
  };
}

/**
 * @constructor
 * @extends minplayer
 * @class The main osmplayer class.
 *
 * <p><strong>Usage:</strong>
 * <pre><code>
 *
 *   // Create a media player.
 *   var player = jQuery("#player").osmplayer({
 *
 *   });
 *
 * </code></pre>
 * </p>
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer = function(context, options) {

  // Derive from minplayer
  minplayer.call(this, context, options);
};

/** Derive from minplayer. */
osmplayer.prototype = new minplayer();

/** Reset the constructor. */
osmplayer.prototype.constructor = osmplayer;

/**
 * Creates a new plugin within this context.
 *
 * @param {string} name The name of the plugin you wish to create.
 * @param {object} base The base object for this plugin.
 * @param {object} context The context which you would like to create.
 * @return {object} The new plugin object.
 */
osmplayer.prototype.create = function(name, base, context) {
  return minplayer.prototype.create.call(this, name, 'osmplayer', context);
};

/**
 * Get the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
osmplayer.prototype.defaultOptions = function(options) {
  options.playlist = '';
  options.node = {};
  options.link = 'http://www.mediafront.org';
  options.logo = 'http://mediafront.org/assets/osmplayer/logo.png';
  minplayer.prototype.defaultOptions.call(this, options);
};

/**
 * @see minplayer.plugin.construct
 */
osmplayer.prototype.construct = function() {

  // Call the minplayer display constructor.
  minplayer.prototype.construct.call(this);

  // We need to cleanup the player when it has been destroyed.
  jQuery(this.display).bind('playerdestroyed', (function(player) {
    return function(element) {
      if (element === player.display.eq(0)[0]) {
        for (var plugin in minplayer.plugins[player.options.id]) {
          for (var index in minplayer.plugins[player.options.id][plugin]) {
            minplayer.plugins[player.options.id][plugin][index].destroy();
            delete minplayer.plugins[player.options.id][plugin][index];
          }
          minplayer.plugins[player.options.id][plugin].length = 0;
        }
        delete minplayer.plugins[player.options.id];
        minplayer.plugins[player.options.id] = null;
      }
    };
  })(this));

  /** The play queue and index. */
  this.playQueue = [];
  this.playIndex = 0;
  this.hasPlaylist = false;

  /** The playlist for this media player. */
  this.create('playlist', 'osmplayer');

  /** Get the playlist or any other playlist that connects. */
  this.get('playlist', function(playlist) {
    this.hasPlaylist = true;
    playlist.ubind(this.uuid + ':nodeLoad', (function(player) {
      return function(event, data) {
        player.loadNode(data);
      };
    })(this));
  });

  // Play each media sequentially...
  this.get('media', function(media) {
    media.ubind(this.uuid + ':ended', (function(player) {
      return function() {
        player.options.autoplay = true;
        player.playNext();
      };
    })(this));
  });

  // Load the node if one is provided.
  if (this.options.node) {
    this.loadNode(this.options.node);
  }
};

/**
 * Gets the full screen element.
 *
 * @return {object} The element that will go into fullscreen.
 */
osmplayer.prototype.fullScreenElement = function() {
  return this.elements.minplayer;
};

/**
 * Reset the osmplayer.
 *
 * @param {function} callback Called when it is done resetting.
 */
osmplayer.prototype.reset = function(callback) {

  // Empty the playqueue.
  this.playQueue.length = 0;
  this.playQueue = [];
  this.playIndex = 0;

  // Clear the playloader.
  if (this.playLoader && this.options.preview) {
    this.options.preview = '';
    this.playLoader.clear((function(player) {
      return function() {
        callback.call(player);
      };
    })(this));
  }
  else if (callback) {
    callback.call(this);
  }
};

/**
 * The load node function.
 *
 * @param {object} node A media node object.
 * @return {boolean} If the node was loaded.
 */
osmplayer.prototype.loadNode = function(node) {

  // Make sure this is a valid node.
  if (!node || (node.hasOwnProperty('length') && (node.length === 0))) {
    return false;
  }

  // Reset the player.
  this.reset(function() {

    // Set the hasMedia flag.
    this.hasMedia = node && node.mediafiles && node.mediafiles.media;

    // If this node is set and has files.
    if (node && node.mediafiles) {

      // Load the media files.
      var media = node.mediafiles.media;
      if (media) {
        var file = null;
        var types = [];

        // For mobile devices, we should only show the main media.
        if (minplayer.isAndroid || minplayer.isIDevice) {
          types = ['media'];
        }
        else {
          types = ['intro', 'commercial', 'prereel', 'media', 'postreel'];
        }

        // Iterate through the types.
        jQuery.each(types, (function(player) {
          return function(key, type) {
            file = player.addToQueue(media[type]);
            if (file) {
              file.queueType = type;
            }
          };
        })(this));
      }
      else {

        // Add a class to the display to let themes handle this.
        this.display.addClass('nomedia');
      }

      // Play the next media
      this.playNext();

      // Load the preview image.
      osmplayer.getImage(node.mediafiles, 'preview', (function(player) {
        return function(image) {
          if (player.playLoader && (player.playLoader.display.length > 0)) {
            player.playLoader.enabled = true;
            player.playLoader.loadPreview(image.path);
            player.playLoader.previewFlag.setFlag('media', true);
            if (!player.hasMedia) {
              player.playLoader.busy.setFlag('media', false);
              player.playLoader.bigPlay.setFlag('media', false);
            }
            player.playLoader.checkVisibility();
          }
        };
      })(this));
    }
  });
};

/**
 * Adds a file to the play queue.
 *
 * @param {object} file The file to add to the queue.
 * @return {object} The file that was added to the queue.
 */
osmplayer.prototype.addToQueue = function(file) {
  file = minplayer.getMediaFile(file);
  if (file) {
    this.playQueue.push(file);
  }
  return file;
};

/**
 * Plays the next media file in the queue.
 */
osmplayer.prototype.playNext = function() {
  if (this.playQueue.length > this.playIndex) {
    this.load(this.playQueue[this.playIndex]);
    this.playIndex++;
  }
  else if (this.options.repeat) {
    this.playIndex = 0;
    this.playNext();
  }
  else if (this.playQueue.length > 0) {

    // If we have a playlist, let them handle what to do next.
    if (this.hasPlaylist && this.options.autoNext) {
      this.trigger('player_ended');
    }
    else {
      // If there is no playlist, and no repeat, we will
      // just seek to the beginning and pause.
      this.options.autoplay = false;
      this.playIndex = 0;
      this.playNext();
    }
  }
  else if (this.media) {
    this.media.stop();

    // If there is no media found, then clear the player.
    if (!this.hasMedia) {
      this.media.clear();
    }
  }
};

/**
 * Returns a node.
 *
 * @param {object} node The node to get.
 * @param {function} callback Called when the node is retrieved.
 */
osmplayer.getNode = function(node, callback) {
  if (node && node.mediafiles && node.mediafiles.media) {
    var mediaFile = minplayer.getMediaFile(node.mediafiles.media.media);
    if (mediaFile) {
      var player = minplayer.players[mediaFile.player];
      if (player && (typeof player.getNode === 'function')) {
        player.getNode(mediaFile, function(node) {
          callback(node);
        });
      }
    }
  }
};

/**
 * Returns an image provided image array.
 *
 * @param {object} mediafiles The mediafiles to search within.
 * @param {string} type The type of image to look for.
 * @param {function} callback Called when the image is retrieved.
 */
osmplayer.getImage = function(mediafiles, type, callback) {

  var image = '';
  var images = mediafiles.image;
  if (images) {

    // If the image type exists, then just use that one...
    if (images[type]) {
      image = images[type];
    }
    // Or try the original image...
    else if (images.image) {
      image = images.image;
    }
    // Otherwise, just try ANY image...
    else {

      // Or, just pick the first one available.
      for (type in images) {
        if (images.hasOwnProperty(type)) {
          image = images[type];
          break;
        }
      }
    }
  }

  // If the image exists, then callback with that image.
  if (image) {
    callback(new minplayer.file(image));
  }
  else {
    // Get the image from the media player...
    var mediaFile = minplayer.getMediaFile(mediafiles.media.media);
    if (mediaFile) {
      var player = minplayer.players[mediaFile.player];
      if (player && (typeof player.getImage === 'function')) {
        player.getImage(mediaFile, type, function(src) {
          callback(new minplayer.file(src));
        });
      }
    }
  }
};
