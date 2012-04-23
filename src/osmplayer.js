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
      this.addToQueue(media.intro);
      this.addToQueue(media.commercial);
      this.addToQueue(media.prereel);
      this.addToQueue(media.media);
      this.addToQueue(media.postreel);
    }

    // Load the preview image.
    this.options.preview = osmplayer.getImage(node.mediafiles.image, 'preview');

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
 */
osmplayer.prototype.addToQueue = function(file) {
  if (file) {
    this.playQueue.push(this.getFile(file));
  }
};

/**
 * Returns a valid media file for this browser.
 *
 * @param {object} file The file object.
 * @return {object} The best media file.
 */
osmplayer.prototype.getFile = function(file) {
  if (file) {
    var type = typeof file;
    if (((type === 'object') || (type === 'array')) && file[0]) {
      file = this.getBestMedia(file);
    }
  }
  return file;
};

/**
 * Returns the media file with the lowest weight value provided an array of
 * media files.
 *
 * @param {object} files The media files to play.
 * @return {object} The best media file.
 */
osmplayer.prototype.getBestMedia = function(files) {
  var mFile = null;
  var i = files.length;
  while (i--) {
    var tempFile = new minplayer.file(files[i]);
    if (!mFile || (tempFile.priority > mFile.priority)) {
      mFile = tempFile;
    }
  }
  return mFile;
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
  else {
    // If there is no playlist, and no repeat, we will
    // just seek to the beginning and pause.
    this.options.autostart = false;
    this.playIndex = 0;
    this.playNext();
  }
};

/**
 * Returns an image provided image array.
 *
 * @param {object} images The images to search for.
 * @param {string} type The type of image to look for.
 * @return {object} The best image match.
 */
osmplayer.getImage = function(images, type) {
  var image = '';

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

  // Return the image path.
  return (typeof image === 'string') ? image : image.path;
};
