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

  // Set the plugin name within the options.
  this.options.pluginName = 'player';

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

  // Called to add events.
  this.addEvents();

  // Now load these files.
  this.load(this.getFiles());

  // The player is ready.
  this.ready();
};

/**
 * Called when an error occurs.
 *
 * @param {object} plugin The plugin you wish to bind to.
 */
minplayer.prototype.bindTo = function(plugin) {
  plugin.bind('error', (function(player) {
    return function(event, data) {
      if (player.currentPlayer == 'html5') {
        minplayer.player = 'minplayer';
        player.options.file.player = 'minplayer';
        player.loadPlayer();
      }
      else {
        player.showError(data);
      }
    };
  })(this));

  // Bind to the fullscreen event.
  plugin.bind('fullscreen', (function(player) {
    return function(event, data) {
      player.resize();
    };
  })(this));
};

/**
 * We need to bind to events we are interested in.
 */
minplayer.prototype.addEvents = function() {
  minplayer.get.call(this, this.options.id, null, (function(player) {
    return function(plugin) {
      player.bindTo(plugin);
    };
  })(this));
};

/**
 * Sets an error on the player.
 *
 * @param {string} error The error to display on the player.
 */
minplayer.prototype.showError = function(error) {
  if (typeof error !== 'object') {
    error = error || '';
    if (this.elements.error) {

      // Set the error text.
      this.elements.error.text(error);
      if (error) {
        // Show the error message.
        this.elements.error.show();

        // Only show this error for a time interval.
        setTimeout((function(player) {
          return function() {
            player.elements.error.hide('slow');
          };
        })(this), 5000);
      }
      else {
        this.elements.error.hide();
      }
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
 *
 * @param {array} files An array of files to chose from.
 * @return {object} The best media file to play in the current browser.
 */
minplayer.getMediaFile = function(files) {

  // If there are no files then return null.
  if (!files) {
    return null;
  }

  // If the file is already a file object then just return.
  if ((typeof files === 'string') || files.path || files.id) {
    return new minplayer.file(files);
  }

  // Add the files and get the best player to play.
  var bestPriority = 0, mFile = null, file = null;
  for (var i in files) {
    if (files.hasOwnProperty(i)) {
      file = new minplayer.file(files[i]);
      if (file.player && (file.priority > bestPriority)) {
        mFile = file;
      }
    }
  }

  // Return the best minplayer file.
  return mFile;
};

/**
 * Loads a media player based on the current file.
 *
 * @return {boolean} If a new player was loaded.
 */
minplayer.prototype.loadPlayer = function() {

  // Do nothing if there isn't a file or anywhere to put it.
  if (!this.options.file || (this.elements.display.length == 0)) {
    return false;
  }

  // If no player is set, then also return false.
  if (!this.options.file.player) {
    return false;
  }

  // Reset the error.
  this.showError();

  // Only destroy if the current player is different than the new player.
  var player = this.options.file.player.toString();

  // If there isn't media or if the players are different.
  if (!this.media || (player !== this.currentPlayer)) {

    // Set the current media player.
    this.currentPlayer = player;

    // Do nothing if we don't have a display.
    if (!this.elements.display) {
      this.showError('No media display found.');
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
        player.display.addClass('minplayer-player-' + media.mediaFile.player);
      };
    })(this));

    // Return that a new player is loaded.
    return true;
  }
  // If the media object already exists...
  else if (this.media) {

    // Now load the different media file.
    this.media.options = this.options;
    this.display.removeClass('minplayer-player-' + this.media.mediaFile.player);
    this.media.load(this.options.file);
    this.display.addClass('minplayer-player-' + this.media.mediaFile.player);
    return false;
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
  this.options.file = minplayer.getMediaFile(this.options.files);

  // Now load the player.
  if (this.loadPlayer()) {

    // Add the events since we now have a player.
    this.bindTo(this.media);

    // If the player isn't valid, then show an error.
    if (this.options.file.mimetype && !this.options.file.player) {
      this.showError('Cannot play media: ' + this.options.file.mimetype);
    }
  }
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
