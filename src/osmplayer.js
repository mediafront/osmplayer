// Add a way to instanciate using jQuery prototype.
if (!jQuery.fn.osmplayer) {

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
 * @see minplayer.plugin.construct
 */
osmplayer.prototype.construct = function() {

  // Make sure we provide default options...
  this.options = jQuery.extend({
    playlist: '',
    node: {},
    swfplayer: 'minplayer/flash/minplayer.swf',
    logo: 'logo.png',
    link: 'http://www.mediafront.org'
  }, this.options);

  // Call the minplayer display constructor.
  minplayer.prototype.construct.call(this);

  /** The play queue and index. */
  this.playQueue = [];
  this.playIndex = 0;

  /** The playlist for this media player. */
  this.create('playlist', 'osmplayer');

  /** Get the playlist or any other playlist that connects. */
  this.get('playlist', function(playlist) {
    playlist.bind('nodeLoad', (function(player) {
      return function(event, data) {
        player.loadNode(data);
      };
    })(this));
  });

  // Play each media sequentially...
  this.get('media', (function(player) {
    return function(media) {
      media.bind('ended', function() {
        player.options.autoplay = true;
        player.playNext();
      });
    };
  })(this));

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
 * The load node function.
 *
 * @param {object} node A media node object.
 */
osmplayer.prototype.loadNode = function(node) {
  if (node && node.mediafiles) {

    // Load the media files.
    var media = node.mediafiles.media;
    if (media) {
      this.playQueue.length = 0;
      this.playQueue = [];
      this.playIndex = 0;
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
          if (file = player.addToQueue(media[type])) {
            file.queueType = type;
          }
        };
      })(this));
    }

    // Load the preview image.
    this.options.preview = osmplayer.getImage(node.mediafiles, 'preview');

    if (this.playLoader) {
      this.playLoader.loadPreview();
    }

    // Play the next media
    this.playNext();
  }
};

/**
 * Adds a file to the play queue.
 *
 * @param {object} file The file to add to the queue.
 * @return {object} The file that was added to the queue.
 */
osmplayer.prototype.addToQueue = function(file) {
  if (file = minplayer.getMediaFile(file)) {
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
    // If there is no playlist, and no repeat, we will
    // just seek to the beginning and pause.
    this.options.autoplay = false;
    this.playIndex = 0;
    this.playNext();
  }
  else if (this.media) {
    // Stop the player and unload.
    this.media.stop();
  }
};

/**
 * Returns an image provided image array.
 *
 * @param {object} mediafiles The mediafiles to search within.
 * @param {string} type The type of image to look for.
 * @return {object} The best image match.
 */
osmplayer.getImage = function(mediafiles, type) {

  var image = '';
  var images = mediafiles.image;
  if (images) {

    // If the image type exists, then just use that one...
    if (images[type]) {
      image = images[type];
    }
    // Or try the original image...
    else if (images['image']) {
      image = images['image'];
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

  // Convert to a minplayer file.
  image = new minplayer.file(image);
  if (!image.path) {

    // Get the image from the media player...
    var mediaFile = minplayer.getMediaFile(mediafiles.media);
    if (mediaFile) {
      var player = minplayer.players[mediaFile.player];
      if (player && (typeof player.getImage === 'function')) {
        image = new minplayer.file(player.getImage(mediaFile, type));
      }
    }
  }

  // Return the image path.
  return image.path;
};
