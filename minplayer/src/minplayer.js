// Add a way to instanciate using jQuery prototype.
if (!jQuery.fn.minplayer) {

  /**
   * @constructor
   *
   * Define a jQuery minplayer prototype.
   *
   * @param {object} options The options for this jQuery prototype.
   * @return {Array} jQuery object.
   */
  jQuery.fn.minplayer = function(options) {
    return jQuery(this).each(function() {
      options = options || {};
      options.id = options.id || jQuery(this).attr('id') || Math.random();
      if (!minplayer.plugins[options.id]) {
        options.template = options.template || 'default';
        if (minplayer[options.template]) {
          new minplayer[options.template](jQuery(this), options);
        }
        else {
          new minplayer(jQuery(this), options);
        }
      }
    });
  };
}

/**
 * @constructor
 * @extends minplayer.display
 * @class The core media player class which governs the media player
 * functionality.
 *
 * <p><strong>Usage:</strong>
 * <pre><code>
 *
 *   // Create a media player.
 *   var player = jQuery("#player").minplayer({
 *
 *   });
 *
 * </code></pre>
 * </p>
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer = jQuery.extend(function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'player', context, options);
}, minplayer);

/** Derive from minplayer.display. */
minplayer.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.prototype.constructor = minplayer;

/**
 * @see minplayer.plugin.construct
 */
minplayer.prototype.construct = function() {

  // Allow them to provide arguments based off of the DOM attributes.
  jQuery.each(this.context[0].attributes, (function(player) {
    return function(index, attr) {
      player.options[attr.name] = player.options[attr.name] || attr.value;
    };
  })(this));

  // Make sure we provide default options...
  this.options = jQuery.extend({
    id: 'player',
    build: false,
    wmode: 'transparent',
    preload: true,
    autoplay: false,
    autoload: true,
    loop: false,
    width: '100%',
    height: '350px',
    debug: false,
    volume: 80,
    files: null,
    file: '',
    preview: '',
    attributes: {},
    logo: '',
    link: '',
    width: '100%',
    height: '100%'
  }, this.options);

  // Call the minplayer display constructor.
  minplayer.display.prototype.construct.call(this);

  /** The controller for this player. */
  this.controller = this.create('controller');

  /** The play loader for this player. */
  this.playLoader = this.create('playLoader');

  // Set the focus of the element based on if they click in or outside of it.
  minplayer.click(document, (function(player) {
    return function(event) {
      var target = jQuery(event.target);
      var focus = !(target.closest('#' + player.options.id).length == 0);
      minplayer.get.call(this, player.options.id, null, function(plugin) {
        plugin.onFocus(focus);
      });
    };
  })(this));

  /** Add the logo for the player. */
  if (this.options.logo && this.elements.logo) {

    var code = '';
    if (this.options.link) {
      code += '<a target="_blank" href="' + this.options.link + '">';
    }
    code += '<img src="' + this.options.logo + '" >';
    if (this.options.link) {
      code += '</a>';
    }
    this.logo = this.elements.logo.append(code);
  }

  /** Variable to store the current media player. */
  this.currentPlayer = 'html5';

  // Add key events to the window.
  this.addKeyEvents();

  // Now load these files.
  this.load(this.getFiles());

  // The player is ready.
  this.ready();
};

/**
 * We need to bind to events we are interested in.
 */
minplayer.prototype.addEvents = function() {
  minplayer.get.call(this, this.options.id, null, (function(player) {
    return function(plugin) {

      // Bind to the error event.
      plugin.bind('error', function(event, data) {

        // If an error occurs within the html5 media player, then try
        // to fall back to the flash player.
        if (player.currentPlayer == 'html5') {
          player.options.file.player = 'minplayer';
          player.loadPlayer();
        }
        else {
          player.error(data);
        }
      });

      // Bind to the fullscreen event.
      plugin.bind('fullscreen', function(event, data) {
        player.resize();
      });
    };
  })(this));
};

/**
 * Sets an error on the player.
 *
 * @param {string} error The error to display on the player.
 */
minplayer.prototype.error = function(error) {
  error = error || '';
  if (this.elements.error) {

    // Set the error text.
    this.elements.error.text(error);
    if (error) {
      this.elements.error.show();
    }
    else {
      this.elements.error.hide();
    }
  }
};

/**
 * Adds key events to the player.
 */
minplayer.prototype.addKeyEvents = function() {
  jQuery(document).bind('keydown', (function(player) {
    return function(event) {
      switch (event.keyCode) {
        case 113: // ESC
        case 27:  // Q
          if (player.isFullScreen()) {
            player.fullscreen(false);
          }
          break;
      }
    };
  })(this));
};

/**
 * Returns all the media files available for this player.
 *
 * @return {array} All the media files for this player.
 */
minplayer.prototype.getFiles = function() {

  // If they provide the files in the options, use those first.
  if (this.options.files) {
    return this.options.files;
  }

  if (this.options.file) {
    return this.options.file;
  }

  var files = [];
  var mediaSrc = null;

  // Get the files involved...
  if (this.elements.media) {
    mediaSrc = this.elements.media.attr('src');
    if (mediaSrc) {
      files.push({'path': mediaSrc});
    }
    jQuery('source', this.elements.media).each(function() {
      files.push({
        'path': jQuery(this).attr('src'),
        'mimetype': jQuery(this).attr('type'),
        'codecs': jQuery(this).attr('codecs')
      });
    });
  }

  return files;
};

/**
 * Returns the full media player object.
 * @param {array} files An array of files to chose from.
 * @return {object} The best media file to play in the current browser.
 */
minplayer.prototype.getMediaFile = function(files) {

  // If there are no files then return null.
  if (!files) {
    return null;
  }

  // If the file is a single string, then return the file object.
  if (typeof files === 'string') {
    return new minplayer.file({'path': files});
  }

  // If the file is already a file object then just return.
  if (files.path || files.id) {
    return new minplayer.file(files);
  }

  // Add the files and get the best player to play.
  var i = files.length, bestPriority = 0, mFile = null, file = null;
  while (i--) {
    file = files[i];

    // Get the minplayer file object.
    if (typeof file === 'string') {
      file = new minplayer.file({'path': file});
    }
    else {
      file = new minplayer.file(file);
    }

    // Determine the best file for this browser.
    if (file.priority > bestPriority) {
      mFile = file;
    }
  }

  // Return the best minplayer file.
  return mFile;
};

/**
 * Loads a media player based on the current file.
 */
minplayer.prototype.loadPlayer = function() {

  // Do nothing if there isn't a file or anywhere to put it.
  if (!this.options.file || (this.elements.display.length == 0)) {
    return;
  }

  if (!this.options.file.player) {
    this.error('Cannot play media: ' + this.options.file.mimetype);
    return;
  }

  // Reset the error.
  this.error();

  // Only destroy if the current player is different than the new player.
  var player = this.options.file.player.toString();

  // If there isn't media or if the players are different.
  if (!this.media || (player !== this.currentPlayer)) {

    // Set the current media player.
    this.currentPlayer = player;

    // Do nothing if we don't have a display.
    if (!this.elements.display) {
      this.error('No media display found.');
      return;
    }

    // Destroy the current media.
    var queue = {};
    if (this.media) {
      queue = this.media.queue;
      this.media.destroy();
    }

    // Get the class name and create the new player.
    pClass = minplayer.players[this.options.file.player];

    // Create the new media player.
    this.options.mediaelement = this.elements.media;
    this.media = new pClass(this.elements.display, this.options, queue);

    // Now get the media when it is ready.
    this.get('media', (function(player) {
      return function(media) {

        // Load the media.
        media.load(player.options.file);
      };
    })(this));
  }
  // If the media object already exists...
  else if (this.media) {

    // Now load the different media file.
    this.media.load(this.options.file);
  }
};

/**
 * Load a set of files or a single file for the media player.
 *
 * @param {array} files An array of files to chose from to load.
 */
minplayer.prototype.load = function(files) {

  // Set the id and class.
  var id = '', pClass = '';

  // If no file was provided, then get it.
  this.options.files = files || this.options.files;
  this.options.file = this.getMediaFile(this.options.files);

  // Now load the player.
  this.loadPlayer();

  // Add the player events.
  this.addEvents();
};

/**
 * Called when the player is resized.
 */
minplayer.prototype.resize = function() {

  // Call onRezie for each plugin.
  this.get(function(plugin) {
    if (plugin.onResize) {
      plugin.onResize();
    }
  });
};
