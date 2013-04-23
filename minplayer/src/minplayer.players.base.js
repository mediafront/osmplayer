/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The base media player class where all media players derive from.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.base = function(context, options, queue) {

  // Derive from display
  minplayer.display.call(this, 'media', context, options, queue);
};

/** Derive from minplayer.display. */
minplayer.players.base.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.players.base.prototype.constructor = minplayer.players.base;

/**
 * @see minplayer.display.getElements
 * @this minplayer.players.base
 * @return {object} The elements for this display.
 */
minplayer.players.base.prototype.getElements = function() {
  var elements = minplayer.display.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    media: this.options.mediaelement
  });
};

/**
 * Get the priority of this media player.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {number} The priority of this media player.
 */
minplayer.players.base.getPriority = function(file) {
  return 0;
};

/**
 * Returns the ID for the media being played.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.base.getMediaId = function(file) {
  return '';
};

/**
 * Determine if we can play the media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.base.canPlay = function(file) {
  return false;
};

/**
 * @see minplayer.plugin.construct
 * @this minplayer.players.base
 */
minplayer.players.base.prototype.construct = function() {

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Set the poster if it exists.
  if (this.elements.media) {
    this.poster = this.elements.media.attr('poster');
  }

  // Set the plugin name within the options.
  this.options.pluginName = 'basePlayer';

  /** The ready queue for this player. */
  this.readyQueue = [];

  /** The currently loaded media file. */
  this.mediaFile = this.options.file;

  // Clear the media player.
  this.clear();

  // Now setup the media player.
  this.setupPlayer();
};

/**
 * Sets up a new media player.
 */
minplayer.players.base.prototype.setupPlayer = function() {

  // Get the player display object.
  if (!this.playerFound()) {

    // Add the new player.
    this.addPlayer();
  }

  // Get the player object...
  this.player = this.getPlayer();

  // Toggle playing if they click.
  minplayer.click(this.display, (function(player) {
    return function() {
      if (player.playing) {
        player.pause();
      }
      else {
        player.play();
      }
    };
  })(this));

  // Bind to key events...
  jQuery(document).bind('keydown', (function(player) {
    return function(event) {
      if (player.hasFocus) {
        event.preventDefault();
        switch (event.keyCode) {
          case 32:  // SPACE
          case 179: // GOOGLE play/pause button.
            if (player.playing) {
              player.pause();
            }
            else {
              player.play();
            }
            break;
          case 38:  // UP
            player.setVolumeRelative(0.1);
            break;
          case 40:  // DOWN
            player.setVolumeRelative(-0.1);
            break;
          case 37:  // LEFT
          case 227: // GOOGLE TV REW
            player.seekRelative(-0.05);
            break;
          case 39:  // RIGHT
          case 228: // GOOGLE TV FW
            player.seekRelative(0.05);
            break;
        }
      }
    };
  })(this));
};

/**
 * Adds the media player.
 */
minplayer.players.base.prototype.addPlayer = function() {

  // Remove the media element if found
  if (this.elements.media) {
    this.elements.media.remove();
  }

  // Create a new media player element.
  this.elements.media = jQuery(this.createPlayer());
  this.display.html(this.elements.media);
};

/**
 * @see minplayer.plugin.destroy.
 */
minplayer.players.base.prototype.destroy = function() {
  minplayer.plugin.prototype.destroy.call(this);
  this.clear();
};

/**
 * Clears the media player.
 */
minplayer.players.base.prototype.clear = function() {

  // Reset the ready flag.
  this.playerReady = false;

  // Reset the player.
  this.reset();

  // If the player exists, then unbind all events.
  if (this.player) {
    jQuery(this.player).remove();
    this.player = null;
  }
};

/**
 * Resets all variables.
 */
minplayer.players.base.prototype.reset = function() {

  // The duration of the player.
  this.duration = new minplayer.async();

  // The current play time of the player.
  this.currentTime = new minplayer.async();

  // The amount of bytes loaded in the player.
  this.bytesLoaded = new minplayer.async();

  // The total amount of bytes for the media.
  this.bytesTotal = new minplayer.async();

  // The bytes that the download started with.
  this.bytesStart = new minplayer.async();

  // The current volume of the player.
  this.volume = new minplayer.async();

  // Reset focus.
  this.hasFocus = false;

  // We are not playing.
  this.playing = false;

  // We are not loading.
  this.loading = false;

  // If we are loaded.
  this.loaded = false;

  // Tell everyone else we reset.
  this.trigger('pause', null, true);
  this.trigger('waiting', null, true);
  this.trigger('progress', {loaded: 0, total: 0, start: 0}, true);
  this.trigger('timeupdate', {currentTime: 0, duration: 0}, true);
};

/**
 * Called when the player is ready to recieve events and commands.
 */
minplayer.players.base.prototype.onReady = function() {

  // Only continue if we are not already ready.
  if (this.playerReady) {
    return;
  }

  // Set the ready flag.
  this.playerReady = true;

  // Set the volume to the default.
  this.setVolume(this.options.volume / 100);

  // Setup the progress interval.
  this.loading = true;

  // Create a poll to get the progress.
  this.poll('progress', (function(player) {
    return function() {

      // Only do this if the play interval is set.
      if (player.loading) {

        // Get the bytes loaded asynchronously.
        player.getBytesLoaded(function(bytesLoaded) {

          // Get the bytes total asynchronously.
          player.getBytesTotal(function(bytesTotal) {

            // Trigger an event about the progress.
            if (bytesLoaded || bytesTotal) {

              // Get the bytes start, but don't require it.
              var bytesStart = 0;
              player.getBytesStart(function(val) {
                bytesStart = val;
              });

              // Trigger a progress event.
              player.trigger('progress', {
                loaded: bytesLoaded,
                total: bytesTotal,
                start: bytesStart
              });

              // Say we are not longer loading if they are equal.
              if (bytesLoaded >= bytesTotal) {
                player.loading = false;
              }
            }
          });
        });
      }

      // Keep polling as long as its loading...
      return player.loading;
    };
  })(this), 1000);

  // We are now ready.
  this.ready();

  // Make sure the player is ready or errors will occur.
  if (this.isReady()) {

    // Iterate through our ready queue.
    for (var i in this.readyQueue) {
      this.readyQueue[i].call(this);
    }

    // Empty the ready queue.
    this.readyQueue.length = 0;
    this.readyQueue = [];

    if (!this.loaded) {

      // If we are still loading, then trigger that the load has started.
      this.trigger('loadstart');
    }
  }
  else {

    // Empty the ready queue.
    this.readyQueue.length = 0;
    this.readyQueue = [];
  }
};

/**
 * Returns the amount of seconds you would like to seek.
 *
 * @return {number} The number of seconds we should seek.
 */
minplayer.players.base.prototype.getSeek = function() {
  var seconds = 0, minutes = 0, hours = 0;

  // See if they would like to seek.
  if (minplayer.urlVars && minplayer.urlVars.seek) {

    // Get the seconds.
    seconds = minplayer.urlVars.seek.match(/([0-9])s/i);
    if (seconds) {
      seconds = parseInt(seconds[1], 10);
    }

    // Get the minutes.
    minutes = minplayer.urlVars.seek.match(/([0-9])m/i);
    if (minutes) {
      seconds += (parseInt(minutes[1], 10) * 60);
    }

    // Get the hours.
    hours = minplayer.urlVars.seek.match(/([0-9])h/i);
    if (hours) {
      seconds += (parseInt(hours[1], 10) * 3600);
    }

    // If no seconds were found, then just use the raw value.
    if (!seconds) {
      seconds = minplayer.urlVars.seek;
    }
  }

  return seconds;
};

/**
 * Should be called when the media is playing.
 */
minplayer.players.base.prototype.onPlaying = function() {

  // Trigger an event that we are playing.
  this.trigger('playing');

  // Say that this player has focus.
  this.hasFocus = true;

  // Set the playInterval to true.
  this.playing = true;

  // Create a poll to get the timeupate.
  this.poll('timeupdate', (function(player) {
    return function() {

      // Only do this if the play interval is set.
      if (player.playing) {

        // Get the current time asyncrhonously.
        player.getCurrentTime(function(currentTime) {

          // Get the duration asynchronously.
          player.getDuration(function(duration) {

            // Convert these to floats.
            currentTime = parseFloat(currentTime);
            duration = parseFloat(duration);

            // Trigger an event about the progress.
            if (currentTime || duration) {

              // Trigger an update event.
              player.trigger('timeupdate', {
                currentTime: currentTime,
                duration: duration
              });
            }
          });
        });
      }

      // Keep polling as long as it is playing.
      return player.playing;
    };
  })(this), 500);
};

/**
 * Should be called when the media is paused.
 */
minplayer.players.base.prototype.onPaused = function() {

  // Trigger an event that we are paused.
  this.trigger('pause');

  // Remove focus.
  this.hasFocus = false;

  // Say we are not playing.
  this.playing = false;
};

/**
 * Should be called when the media is complete.
 */
minplayer.players.base.prototype.onComplete = function() {
  if (this.playing) {
    this.onPaused();
  }

  // Stop the intervals.
  this.playing = false;
  this.loading = false;
  this.hasFocus = false;
  this.trigger('ended');
};

/**
 * Should be called when the media is done loading.
 */
minplayer.players.base.prototype.onLoaded = function() {

  // See if we are loaded.
  var isLoaded = this.loaded;

  // If we should autoplay, then just play now.
  if (!this.loaded && this.options.autoplay) {
    this.play();
  }

  // We are now loaded.
  this.loaded = true;

  // Trigger this event.
  this.trigger('loadeddata');

  // See if they would like to seek.
  if (!isLoaded) {
    var seek = this.getSeek();
    if (seek) {
      this.getDuration((function(player) {
        return function(duration) {
          if (seek < duration) {
            player.seek(seek);
            player.play();
          }
        };
      })(this));
    }
  }
};

/**
 * Should be called when the player is waiting.
 */
minplayer.players.base.prototype.onWaiting = function() {
  this.trigger('waiting');
};

/**
 * Called when an error occurs.
 *
 * @param {string} errorCode The error that was triggered.
 */
minplayer.players.base.prototype.onError = function(errorCode) {
  this.hasFocus = false;
  this.trigger('error', errorCode);
};

/**
 * @see minplayer.players.base#isReady
 * @return {boolean} Checks to see if the Flash is ready.
 */
minplayer.players.base.prototype.isReady = function() {

  // Return that the player is set and the ready flag is good.
  return (this.player && this.playerReady);
};

/**
 * Calls the callback when this player is ready.
 *
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.whenReady = function(callback) {

  // If the player is ready, then call the callback.
  if (this.isReady()) {
    callback.call(this);
  }
  else {

    // Add this to the ready queue.
    this.readyQueue.push(callback);
  }
};

/**
 * Determines if the player should show the playloader.
 *
 * @param {string} preview The preview image.
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.base.prototype.hasPlayLoader = function(preview) {
  return false;
};

/**
 * Determines if the player should show the controller.
 *
 * @return {bool} If this player implements its own controller.
 */
minplayer.players.base.prototype.hasController = function() {
  return false;
};

/**
 * Returns if the media player is already within the DOM.
 *
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.base.prototype.playerFound = function() {
  return false;
};

/**
 * Creates the media player and inserts it in the DOM.
 *
 * @return {object} The media player entity.
 */
minplayer.players.base.prototype.createPlayer = function() {
  this.reset();
  return null;
};

/**
 * Returns the media player object.
 *
 * @return {object} The media player object.
 */
minplayer.players.base.prototype.getPlayer = function() {
  return this.player;
};

/**
 * Loads a new media player.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.load = function(file, callback) {

  // Store the media file for future lookup.
  var isString = (typeof this.mediaFile === 'string');
  var path = isString ? this.mediaFile : this.mediaFile.path;
  if (file && (file.path !== path)) {

    // If the player is not ready, then setup.
    if (!this.isReady()) {
      this.setupPlayer();
    }

    // Reset the media and set the media file.
    this.reset();
    this.mediaFile = file;
    if (callback) {
      callback.call(this);
    }
  }
};

/**
 * Play the loaded media file.
 *
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.play = function(callback) {
  this.options.autoload = true;
  this.options.autoplay = true;
  this.whenReady(callback);
};

/**
 * Pause the loaded media file.
 *
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.pause = function(callback) {
  this.whenReady(callback);
};

/**
 * Stop the loaded media file.
 *
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.stop = function(callback) {
  this.playing = false;
  this.loading = false;
  this.hasFocus = false;
  this.whenReady(callback);
};

/**
 * Seeks to relative position.
 *
 * @param {number} pos Relative position.  -1 to 1 (percent), > 1 (seconds).
 */
minplayer.players.base.prototype.seekRelative = function(pos) {

  // Get the current time asyncrhonously.
  this.getCurrentTime((function(player) {
    return function(currentTime) {

      // Get the duration asynchronously.
      player.getDuration(function(duration) {

        // Only do this if we have a duration.
        if (duration) {

          // Get the position.
          var seekPos = 0;
          if ((pos > -1) && (pos < 1)) {
            seekPos = ((currentTime / duration) + parseFloat(pos)) * duration;
          }
          else {
            seekPos = (currentTime + parseFloat(pos));
          }

          // Set the seek value.
          player.seek(seekPos);
        }
      });
    };
  })(this));
};

/**
 * Seek the loaded media.
 *
 * @param {number} pos The position to seek the minplayer. 0 to 1.
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.seek = function(pos, callback) {
  this.whenReady(callback);
};

/**
 * Gets a value from the player.
 *
 * @param {string} getter The getter method on the player.
 * @param {function} callback The callback function.
 */
minplayer.players.base.prototype.getValue = function(getter, callback) {
  if (this.isReady()) {
    var value = this.player[getter]();
    if ((value !== undefined) && (value !== null)) {
      callback(value);
    }
  }
};

/**
 * Set the volume of the loaded minplayer.
 *
 * @param {number} vol -1 to 1 - The relative amount to increase or decrease.
 */
minplayer.players.base.prototype.setVolumeRelative = function(vol) {

  // Get the volume
  this.getVolume((function(player) {
    return function(newVol) {
      newVol += parseFloat(vol);
      newVol = (newVol < 0) ? 0 : newVol;
      newVol = (newVol > 1) ? 1 : newVol;
      player.setVolume(newVol);
    };
  })(this));
};

/**
 * Set the volume of the loaded minplayer.
 *
 * @param {number} vol The volume to set the media. 0 to 1.
 * @param {function} callback Called when it is done performing this operation.
 */
minplayer.players.base.prototype.setVolume = function(vol, callback) {
  this.trigger('volumeupdate', vol);
  this.whenReady(callback);
};

/**
 * Get the volume from the loaded media.
 *
 * @param {function} callback Called when the volume is determined.
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.base.prototype.getVolume = function(callback) {
  return this.volume.get(callback);
};

/**
 * Get the current time for the media being played.
 *
 * @param {function} callback Called when the time is determined.
 * @return {number} The volume of the media; 0 to 1.
 */
minplayer.players.base.prototype.getCurrentTime = function(callback) {
  return this.currentTime.get(callback);
};

/**
 * Return the duration of the loaded media.
 *
 * @param {function} callback Called when the duration is determined.
 * @return {number} The duration of the loaded media.
 */
minplayer.players.base.prototype.getDuration = function(callback) {
  if (this.options.duration) {
    callback(this.options.duration);
  }
  else {
    return this.duration.get(callback);
  }
};

/**
 * Return the start bytes for the loaded media.
 *
 * @param {function} callback Called when the start bytes is determined.
 * @return {int} The bytes that were started.
 */
minplayer.players.base.prototype.getBytesStart = function(callback) {
  return this.bytesStart.get(callback);
};

/**
 * Return the bytes of media loaded.
 *
 * @param {function} callback Called when the bytes loaded is determined.
 * @return {int} The amount of bytes loaded.
 */
minplayer.players.base.prototype.getBytesLoaded = function(callback) {
  return this.bytesLoaded.get(callback);
};

/**
 * Return the total amount of bytes.
 *
 * @param {function} callback Called when the bytes total is determined.
 * @return {int} The total amount of bytes for this media.
 */
minplayer.players.base.prototype.getBytesTotal = function(callback) {
  return this.bytesTotal.get(callback);
};
