/** The minplayer namespace. */
var minplayer = minplayer || {};

// Private function to check a single element's play type.
function checkPlayType(elem, playType) {
  if ((typeof elem.canPlayType) === 'function') {
    if (typeof playType === 'object') {
      var i = playType.length;
      var mimetype = '';
      while (i--) {
        mimetype = checkPlayType(elem, playType[i]);
        if (!!mimetype) {
          break;
        }
      }
      return mimetype;
    }
    else {
      var canPlay = elem.canPlayType(playType);
      if (('no' !== canPlay) && ('' !== canPlay)) {
        return playType;
      }
    }
  }
  return '';
}

/**
 * @constructor
 * @class This class is used to define the types of media that can be played
 * within the browser.
 * <p>
 * <strong>Usage:</strong>
 * <pre><code>
 *   var playTypes = new minplayer.compatibility();
 *
 *   if (playTypes.videoOGG) {
 *     console.log("This browser can play OGG video");
 *   }
 *
 *   if (playTypes.videoH264) {
 *     console.log("This browser can play H264 video");
 *   }
 *
 *   if (playTypes.videoWEBM) {
 *     console.log("This browser can play WebM video");
 *   }
 *
 *   if (playTypes.audioOGG) {
 *     console.log("This browser can play OGG audio");
 *   }
 *
 *   if (playTypes.audioMP3) {
 *     console.log("This browser can play MP3 audio");
 *   }
 *
 *   if (playTypes.audioMP4) {
 *     console.log("This browser can play MP4 audio");
 *   }
 * </code></pre>
 */
minplayer.compatibility = function() {
  var elem = null;

  // Create a video element.
  elem = document.createElement('video');

  /** Can play OGG video */
  this.videoOGG = checkPlayType(elem, 'video/ogg');

  /** Can play H264 video */
  this.videoH264 = checkPlayType(elem, [
    'video/mp4',
    'video/h264'
  ]);

  /** Can play WEBM video */
  this.videoWEBM = checkPlayType(elem, [
    'video/x-webm',
    'video/webm',
    'application/octet-stream'
  ]);

  // Create an audio element.
  elem = document.createElement('audio');

  /** Can play audio OGG */
  this.audioOGG = checkPlayType(elem, 'audio/ogg');

  /** Can play audio MP3 */
  this.audioMP3 = checkPlayType(elem, 'audio/mpeg');

  /** Can play audio MP4 */
  this.audioMP4 = checkPlayType(elem, 'audio/mp4');
};

if (!minplayer.playTypes) {

  /** The compatible playtypes for this browser. */
  minplayer.playTypes = new minplayer.compatibility();
}
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class This class keeps track of asynchronous get requests for certain
 * variables within the player.
 */
minplayer.async = function() {

  /** The final value of this asynchronous variable. */
  this.value = null;

  /** The queue of callbacks to call when this value is determined. */
  this.queue = [];
};

/**
 * Retrieve the value of this variable.
 *
 * @param {function} callback The function to call when the value is determined.
 * @param {function} pollValue The poll function to try and get the value every
 * 1 second if the value is not set.
 */
minplayer.async.prototype.get = function(callback, pollValue) {

  // If the value is set, then immediately call the callback, otherwise, just
  // add it to the queue when the variable is set.
  if (this.value !== null) {
    callback(this.value);
  }
  else {

    // Add this callback to the queue.
    this.queue.push(callback);
  }
};

/**
 * Sets the value of an asynchronous value.
 *
 * @param {void} val The value to set.
 */
minplayer.async.prototype.set = function(val) {

  // Set the value.
  this.value = val;

  // Get the callback queue length.
  var i = this.queue.length;

  // Iterate through all the callbacks and call them.
  if (i) {
    while (i--) {
      this.queue[i](val);
    }

    // Reset the queue.
    this.queue = [];
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class This is a class used to keep track of flag states
 * which is used to control the busy cursor, big play button, among other
 * items in which multiple components can have an interest in hiding or
 * showing a single element on the screen.
 *
 * <p>
 * <strong>Usage:</strong>
 * <pre><code>
 *   // Declare a flags variable.
 *   var flags = new minplayer.flags();
 *
 *   // Set the flag based on two components interested in the flag.
 *   flags.setFlag("component1", true);
 *   flags.setFlag("component2", true);
 *
 *   // Print out the value of the flags. ( Prints 3 )
 *   console.log(flags.flags);
 *
 *   // Now unset a single components flag.
 *   flags.setFlag("component1", false);
 *
 *   // Print out the value of the flags.
 *   console.log(flags.flags);
 *
 *   // Unset the other components flag.
 *   flags.setFlag("component2", false);
 *
 *   // Print out the value of the flags.
 *   console.log(flags.flags);
 * </code></pre>
 * </p>
 */
minplayer.flags = function() {

  /** The flag. */
  this.flag = 0;

  /** Id map to reference id with the flag index. */
  this.ids = {};

  /** The number of flags. */
  this.numFlags = 0;
};

/**
 * Sets a flag based on boolean logic operators.
 *
 * @param {string} id The id of the controller interested in this flag.
 * @param {boolean} value The value of this flag ( true or false ).
 */
minplayer.flags.prototype.setFlag = function(id, value) {

  // Define this id if it isn't present.
  if (!this.ids.hasOwnProperty(id)) {
    this.ids[id] = this.numFlags;
    this.numFlags++;
  }

  // Use binary operations to keep track of the flag state
  if (value) {
    this.flag |= (1 << this.ids[id]);
  }
  else {
    this.flag &= ~(1 << this.ids[id]);
  }
};
/** The minplayer namespace. */
minplayer = minplayer || {};

/** Static array to keep track of all plugins. */
minplayer.plugins = minplayer.plugins || {};

/** Static array to keep track of queues. */
minplayer.queue = minplayer.queue || [];

/** Mutex lock to keep multiple triggers from occuring. */
minplayer.lock = false;

/**
 * @constructor
 * @class The base class for all plugins.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.plugin = function(name, context, options, queue) {

  /** The name of this plugin. */
  this.name = name;

  /** The ready flag. */
  this.pluginReady = false;

  /** The options for this plugin. */
  this.options = options || {};

  /** The event queue. */
  this.queue = queue || {};

  /** Keep track of already triggered events. */
  this.triggered = {};

  /** Create a queue lock. */
  this.lock = false;

  // Only call the constructor if we have a context.
  if (context) {

    /** Keep track of the context. */
    this.context = jQuery(context);

    // Construct this plugin.
    this.construct();
  }
};

/**
 * The constructor which is called once the context is set.
 * Any class deriving from the plugin class should place all context
 * dependant functionality within this function instead of the standard
 * constructor function since it is called on object derivation as well
 * as object creation.
 */
minplayer.plugin.prototype.construct = function() {

  // Adds this as a plugin.
  this.addPlugin();
};

/**
 * Destructor.
 */
minplayer.plugin.prototype.destroy = function() {

  // Unbind all events.
  this.unbind();
};

/**
 * Creates a new plugin within this context.
 *
 * @param {string} name The name of the plugin you wish to create.
 * @param {object} base The base object for this plugin.
 * @param {object} context The context which you would like to create.
 * @return {object} The new plugin object.
 */
minplayer.plugin.prototype.create = function(name, base, context) {
  var plugin = null;

  // Make sure we have a base object.
  base = base || 'minplayer';
  if (!window[base][name]) {
    base = 'minplayer';
  }

  // Make sure there is a context.
  context = context || this.display;

  // See if this plugin exists within this object.
  if (window[base][name]) {

    // Set the plugin.
    plugin = window[base][name];

    // See if a template version of the plugin exists.
    if (plugin[this.options.template]) {

      plugin = plugin[this.options.template];
    }

    // Create the new plugin.
    return new plugin(context, this.options);
  }

  return null;
};

/**
 * Plugins should call this method when they are ready.
 */
minplayer.plugin.prototype.ready = function() {

  // Keep this plugin from triggering multiple ready events.
  if (!this.pluginReady) {

    // Set the ready flag.
    this.pluginReady = true;

    // Now trigger that I am ready.
    this.trigger('ready');

    // Check the queue.
    this.checkQueue();
  }
};

/**
 * Returns if this component is valid.
 *
 * @return {boolean} TRUE if the plugin display is valid.
 */
minplayer.plugin.prototype.isValid = function() {
  return !!this.options.id;
};

/**
 * Adds a new plugin to this player.
 *
 * @param {string} name The name of this plugin.
 * @param {object} plugin A new plugin object, derived from media.plugin.
 */
minplayer.plugin.prototype.addPlugin = function(name, plugin) {
  name = name || this.name;
  plugin = plugin || this;

  // Make sure the plugin is valid.
  if (plugin.isValid()) {

    // If the plugins for this instance do not exist.
    if (!minplayer.plugins[this.options.id]) {

      // Initialize the plugins.
      minplayer.plugins[this.options.id] = {};
    }

    // Add this plugin.
    minplayer.plugins[this.options.id][name] = plugin;

    // Now check the queue for this plugin.
    this.checkQueue(plugin);
  }
};

/**
 * Create a polling timer.
 *
 * @param {function} callback The function to call when you poll.
 * @param {integer} interval The interval you would like to poll.
 */
minplayer.plugin.prototype.poll = function(callback, interval) {
  setTimeout((function(context) {
    return function callLater() {
      if (callback.call(context)) {
        setTimeout(callLater, interval);
      }
    };
  })(this), interval);
};

/**
 * Gets a plugin by name and calls callback when it is ready.
 *
 * @param {string} plugin The plugin of the plugin.
 * @param {function} callback Called when the plugin is ready.
 * @return {object} The plugin if no callback is provided.
 */
minplayer.plugin.prototype.get = function(plugin, callback) {

  // If they pass just a callback, then return all plugins when ready.
  if (typeof plugin === 'function') {
    callback = plugin;
    plugin = null;
  }

  // Return the minplayer.get equivalent.
  return minplayer.get.call(this, this.options.id, plugin, callback);
};

/**
 * Check the queue and execute it.
 *
 * @param {object} plugin The plugin object to check the queue against.
 */
minplayer.plugin.prototype.checkQueue = function(plugin) {

  // Initialize our variables.
  var q = null, i = 0, check = false, newqueue = [];

  // Normalize the plugin variable.
  plugin = plugin || this;

  // Set the lock.
  minplayer.lock = true;

  // Iterate through all the queues.
  var length = minplayer.queue.length;
  for (i = 0; i < length; i++) {

    // Get the queue.
    q = minplayer.queue[i];

    // Now check to see if this queue is about us.
    check = !q.id && !q.plugin;
    check |= (q.plugin == plugin.name) && (!q.id || (q.id == this.options.id));

    // If the check passes...
    if (check) {
      check = minplayer.bind.call(
        q.context,
        q.event,
        this.options.id,
        plugin.name,
        q.callback
      );
    }

    // Add the queue back if it doesn't check out.
    if (!check) {

      // Add this back to the queue.
      newqueue.push(q);
    }
  }

  // Set the old queue to the new queue.
  minplayer.queue = newqueue;

  // Release the lock.
  minplayer.lock = false;
};

/**
 * Trigger a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The event data object.
 * @return {object} The plugin object.
 */
minplayer.plugin.prototype.trigger = function(type, data) {
  data = data || {};
  data.plugin = this;

  // Add this to our triggered array.
  this.triggered[type] = data;

  // Check to make sure the queue for this type exists.
  if (this.queue.hasOwnProperty(type)) {

    var i = 0, queue = {};

    // Iterate through all the callbacks in this queue.
    for (i in this.queue[type]) {

      // Setup the event object, and call the callback.
      queue = this.queue[type][i];
      queue.callback({target: this, data: queue.data}, data);
    }
  }

  // Return the plugin object.
  return this;
};

/**
 * Bind to a media event.
 *
 * @param {string} type The event type.
 * @param {object} data The data to bind with the event.
 * @param {function} fn The callback function.
 * @return {object} The plugin object.
 **/
minplayer.plugin.prototype.bind = function(type, data, fn) {

  // Allow the data to be the callback.
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  // You must bind to a specific event and have a callback.
  if (!type || !fn) {
    return;
  }

  // Initialize the queue for this type.
  this.queue[type] = this.queue[type] || [];

  // Unbind any existing equivalent events.
  this.unbind(type, fn);

  // Now add this event to the queue.
  this.queue[type].push({
    callback: fn,
    data: data
  });

  // Now see if this event has already been triggered.
  if (this.triggered[type]) {

    // Go ahead and trigger the event.
    fn({target: this, data: data}, this.triggered[type]);
  }

  // Return the plugin.
  return this;
};

/**
 * Unbind a media event.
 *
 * @param {string} type The event type.
 * @param {function} fn The callback function.
 * @return {object} The plugin object.
 **/
minplayer.plugin.prototype.unbind = function(type, fn) {

  // If this is locked then try again after 10ms.
  if (this.lock) {
    setTimeout((function(plugin) {
      return function() {
        plugin.unbind(type, fn);
      };
    })(this), 10);
  }

  // Set the lock.
  this.lock = true;

  if (!type) {
    this.queue = {};
  }
  else if (!fn) {
    this.queue[type] = [];
  }
  else {
    // Iterate through all the callbacks and search for equal callbacks.
    var i = 0, queue = {};
    for (i in this.queue[type]) {
      if (this.queue[type][i].callback === fn) {
        queue = this.queue[type].splice(1, 1);
        delete queue;
      }
    }
  }

  // Reset the lock.
  this.lock = false;

  // Return the plugin.
  return this;
};

/**
 * Adds an item to the queue.
 *
 * @param {object} context The context which this is called within.
 * @param {string} event The event to trigger on.
 * @param {string} id The player ID.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the event occurs.
 */
minplayer.addQueue = function(context, event, id, plugin, callback) {

  // See if it is locked...
  if (!minplayer.lock) {
    minplayer.queue.push({
      context: context,
      id: id,
      event: event,
      plugin: plugin,
      callback: callback
    });
  }
  else {

    // If so, then try again after 10 milliseconds.
    setTimeout(function() {
      minplayer.addQueue(context, id, event, plugin, callback);
    }, 10);
  }
};

/**
 * Binds an event to a plugin instance, and if it doesn't exist, then caches
 * it for a later time.
 *
 * @param {string} event The event to trigger on.
 * @param {string} id The player ID.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the event occurs.
 * @return {boolean} If the bind was successful.
 * @this The object in context who called this method.
 */
minplayer.bind = function(event, id, plugin, callback) {

  // If no callback exists, then just return false.
  if (!callback) {
    return false;
  }

  // Get the plugins.
  var plugins = minplayer.plugins;

  // Determine the selected plugins.
  var selected = [];

  // If they provide id && plugin
  if (id && plugin && plugins[id] && plugins[id][plugin]) {
    selected.push(plugins[id][plugin]);
  }

  // If they provide no id but a plugin.
  else if (!id && plugin) {
    for (var id in plugins) {
      if (plugins[id].hasOwnProperty(plugin)) {
        selected.push(plugins[id][plugin]);
      }
    }
  }

  // If they provide an id but no plugin.
  else if (id && !plugin && plugins[id]) {
    for (var plugin in plugins[id]) {
      selected.push(plugins[id][plugin]);
    }
  }

  // If they provide niether an id or a plugin.
  else if (!id && !plugin) {
    for (var id in plugins) {
      for (var plugin in plugins[id]) {
        selected.push(plugins[id][plugin]);
      }
    }
  }

  // Iterate through the selected plugins and bind.
  var i = selected.length;
  while (i--) {
    selected[i].bind(event, (function(context, plugin) {
      return function(event, data) {
        callback.call(context, data.plugin);
      };
    })(this, selected[i]));
  }

  // See if there were any plugins selected.
  if (selected.length == 0) {

    // If not, then add it to the queue to bind later.
    minplayer.addQueue(this, event, id, plugin, callback);
  }

  // Return that this wasn't handled.
  return (selected.length > 0);
};

/**
 * The main API for minPlayer.
 *
 * Provided that this function takes three parameters, there are 8 different
 * ways to use this api.
 *
 *   id (0x100) - You want a specific player.
 *   plugin (0x010) - You want a specific plugin.
 *   callback (0x001) - You only want it when it is ready.
 *
 *   000 - You want all plugins from all players, ready or not.
 *
 *          var plugins = minplayer.get();
 *
 *   001 - You want all plugins from all players, but only when ready.
 *
 *          minplayer.get(function(plugin) {
 *            // Code goes here.
 *          });
 *
 *   010 - You want a specific plugin from all players, ready or not...
 *
 *          var medias = minplayer.get(null, 'media');
 *
 *   011 - You want a specific plugin from all players, but only when ready.
 *
 *          minplayer.get('player', function(player) {
 *            // Code goes here.
 *          });
 *
 *   100 - You want all plugins from a specific player, ready or not.
 *
 *          var plugins = minplayer.get('player_id');
 *
 *   101 - You want all plugins from a specific player, but only when ready.
 *
 *          minplayer.get('player_id', null, function(plugin) {
 *            // Code goes here.
 *          });
 *
 *   110 - You want a specific plugin from a specific player, ready or not.
 *
 *          var plugin = minplayer.get('player_id', 'media');
 *
 *   111 - You want a specific plugin from a specific player, only when ready.
 *
 *          minplayer.get('player_id', 'media', function(media) {
 *            // Code goes here.
 *          });
 *
 * @this The context in which this function was called.
 * @param {string} id The ID of the widget to get the plugins from.
 * @param {string} plugin The name of the plugin.
 * @param {function} callback Called when the plugin is ready.
 * @return {object} The plugin object if it is immediately available.
 */
minplayer.get = function(id, plugin, callback) {

  // Normalize the arguments for a better interface.
  if (typeof id === 'function') {
    callback = id;
    plugin = id = null;
  }

  if (typeof plugin === 'function') {
    callback = plugin;
    plugin = id;
    id = null;
  }

  // Make sure the callback is a callback.
  callback = (typeof callback === 'function') ? callback : null;

  // If a callback was provided, then just go ahead and bind.
  if (callback) {
    minplayer.bind.call(this, 'ready', id, plugin, callback);
    return;
  }

  // Get the plugins.
  var plugins = minplayer.plugins;

  // 0x000
  if (!id && !plugin && !callback) {
    return plugins;
  }
  // 0x100
  else if (id && !plugin && !callback) {
    return plugins[id];
  }
  // 0x110
  else if (id && plugin && !callback) {
    return plugins[id][plugin];
  }
  // 0x010
  else if (!id && plugin && !callback) {
    var plugin_types = {};
    for (var id in plugins) {
      if (plugins[id].hasOwnProperty(plugin)) {
        plugin_types[id] = plugins[id][plugin];
      }
    }
    return plugin_types;
  }
};
/** The minplayer namespace. */
minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.plugin
 * @class Base class used to provide the display and options for any component
 * deriving from this class.  Components who derive are expected to provide
 * the elements that they define by implementing the getElements method.
 *
 * @param {string} name The name of this plugin.
 * @param {object} context The jQuery context this component resides.
 * @param {object} options The options for this component.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.display = function(name, context, options, queue) {

  // Derive from plugin
  minplayer.plugin.call(this, name, context, options, queue);
};

/** Derive from minplayer.plugin. */
minplayer.display.prototype = new minplayer.plugin();

/** Reset the constructor. */
minplayer.display.prototype.constructor = minplayer.display;

/**
 * Returns the display for this component.
 *
 * @return {object} The jQuery context for this display.
 */
minplayer.display.prototype.getDisplay = function() {
  return this.context;
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.display.prototype.construct = function() {

  // Set the display.
  this.display = this.getDisplay(this.context, this.options);

  // Call the plugin constructor.
  minplayer.plugin.prototype.construct.call(this);

  // Get the display elements.
  this.elements = this.getElements();

  // Only do this if they allow resize for this display.
  if (this.onResize) {

    // Set the resize timeout and this pointer.
    var resizeTimeout = 0;

    // Add a handler to trigger a resize event.
    jQuery(window).resize((function(display) {
      return function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          display.onResize();
        }, 200);
      };
    })(this));
  }
};

/**
 * Called when the window resizes.
 */
minplayer.display.prototype.onResize = false;

/**
 * Gets the full screen element.
 *
 * @return {object} The display to be used for full screen support.
 */
minplayer.display.prototype.fullScreenElement = function() {
  return this.display;
};

/**
 * Called if you would like for your display item to show then hide.
 *
 * @param {object} element The element you would like to hide or show.
 * @param {number} timeout The timeout to hide and show.
 * @param {function} callback Called when something happens.
 */
minplayer.showThenHide = function(element, timeout, callback) {

  // If no element exists, then just return.
  if (!element) {
    return;
  }

  // Ensure we have a timeout.
  timeout = timeout || 5000;

  // If this has not yet been configured.
  if (!element.showTimer) {
    element.shown = true;
    jQuery(document).bind('mousemove', function() {
      minplayer.showThenHide(element, timeout, callback);
    });
  }

  // Clear the timeout, and then setup the show then hide functionality.
  clearTimeout(element.showTimer);

  // Show the display.
  if (!element.shown) {
    element.shown = true;
    element.show();
    if (callback) {
      callback(true);
    }
  }

  // Set a timer to hide it after the timeout.
  element.showTimer = setTimeout(function() {
    element.hide('slow', function() {
      element.shown = false;
      if (callback) {
        callback(false);
      }
    });
  }, timeout);
};

/**
 * Make this display element go fullscreen.
 *
 * @param {boolean} full Tell the player to go into fullscreen or not.
 */
minplayer.display.prototype.fullscreen = function(full) {
  var isFull = this.isFullScreen();
  var element = this.fullScreenElement();
  if (isFull && !full) {
    element.removeClass('fullscreen');
    if (screenfull) {
      screenfull.exit();
    }
    this.trigger('fullscreen', false);
  }
  else if (!isFull && full) {
    element.addClass('fullscreen');
    if (screenfull) {
      screenfull.request(element[0]);
      screenfull.onchange = (function(display) {
        return function(e) {
          if (!screenfull.isFullscreen) {
            display.fullscreen(false);
          }
        };
      })(this);
    }
    this.trigger('fullscreen', true);
  }
};

/**
 * Toggle fullscreen.
 */
minplayer.display.prototype.toggleFullScreen = function() {
  this.fullscreen(!this.isFullScreen());
};

/**
 * Checks to see if we are in fullscreen mode.
 *
 * @return {boolean} TRUE - fullscreen, FALSE - otherwise.
 */
minplayer.display.prototype.isFullScreen = function() {
  return this.fullScreenElement().hasClass('fullscreen');
};

/**
 * Returns a scaled rectangle provided a ratio and the container rect.
 *
 * @param {number} ratio The width/height ratio of what is being scaled.
 * @param {object} rect The bounding rectangle for scaling.
 * @return {object} The Rectangle object of the scaled rectangle.
 */
minplayer.display.prototype.getScaledRect = function(ratio, rect) {
  var scaledRect = {};
  scaledRect.x = rect.x ? rect.x : 0;
  scaledRect.y = rect.y ? rect.y : 0;
  scaledRect.width = rect.width ? rect.width : 0;
  scaledRect.height = rect.height ? rect.height : 0;
  if (ratio) {
    if ((rect.width / rect.height) > ratio) {
      scaledRect.height = rect.height;
      scaledRect.width = Math.floor(rect.height * ratio);
    }
    else {
      scaledRect.height = Math.floor(rect.width / ratio);
      scaledRect.width = rect.width;
    }
    scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
    scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
  }
  return scaledRect;
};

/**
 * Returns all the jQuery elements that this component uses.
 *
 * @return {object} An object which defines all the jQuery elements that
 * this component uses.
 */
minplayer.display.prototype.getElements = function() {
  return {};
};

/**
 * From https://github.com/sindresorhus/screenfull.js
 */
/*global Element:true*/
(function(window, document) {
  'use strict';
  var methods = (function() {
    var methodMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenchange',
        'fullscreen',
        'fullscreenElement'
      ],
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitIsFullScreen',
        'webkitCurrentFullScreenElement'
      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozfullscreenchange',
        'mozFullScreen',
        'mozFullScreenElement'
      ]
    ];
    for (var i = 0, l = methodMap.length; i < l; i++) {
      var val = methodMap[i];
      if (val[1] in document) {
        return val;
      }
    }
  })();

  if (!methods) {
    return window.screenfull = false;
  }

  var keyboardAllowed = 'ALLOW_KEYBOARD_INPUT' in Element;

  var screenfull = {
    init: function() {
      document.addEventListener(methods[2], function(e) {
        screenfull.isFullscreen = document[methods[3]];
        screenfull.element = document[methods[4]];
        screenfull.onchange(e);
      });
      return this;
    },
    isFullscreen: document[methods[3]],
    element: document[methods[4]],
    request: function(elem) {
      elem = elem || document.documentElement;
      elem[methods[0]](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      // Work around Safari 5.1 bug: reports support for keyboard in fullscreen
      // even though it doesn't.
      if (!document.isFullscreen) {
        elem[methods[0]]();
      }
    },
    exit: function() {
      document[methods[1]]();
    },
    toggle: function(elem) {
      if (this.isFullscreen) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    onchange: function() {}
  };

  window.screenfull = screenfull.init();
})(window, document);
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
 * Define a way to debug.
 */
minplayer.console = console || {log: function(data) {}};

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

  // Add the player events.
  this.addEvents();

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
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class A class to easily handle images.
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.image = function(context, options) {

  // Determine if the image is loaded.
  this.loaded = false;

  // The image loader.
  this.loader = null;

  // The ratio of the image.
  this.ratio = 0;

  // The image element.
  this.img = null;

  // Derive from display
  minplayer.display.call(this, 'image', context, options);
};

/** Derive from minplayer.display. */
minplayer.image.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.image.prototype.constructor = minplayer.image;

/**
 * @see minplayer.plugin.construct
 */
minplayer.image.prototype.construct = function() {

  // Call the media display constructor.
  minplayer.display.prototype.construct.call(this);

  // Set the container to not show any overflow...
  this.display.css('overflow', 'hidden');

  /** The loader for the image. */
  this.loader = new Image();

  /** Register for when the image is loaded within the loader. */
  this.loader.onload = (function(image) {
    return function() {
      image.loaded = true;
      image.ratio = (image.loader.width / image.loader.height);
      image.resize();
      image.trigger('loaded');
    };
  })(this);

  // We are now ready.
  this.ready();
};

/**
 * Loads an image.
 *
 * @param {string} src The source of the image to load.
 */
minplayer.image.prototype.load = function(src) {

  // First clear the previous image.
  this.clear(function() {

    // Create the new image, and append to the display.
    this.display.empty();
    this.img = jQuery(document.createElement('img')).attr({src: ''}).hide();
    this.display.append(this.img);
    this.loader.src = src;
    this.img.attr('src', src);
  });
};

/**
 * Clears an image.
 *
 * @param {function} callback Called when the image is done clearing.
 */
minplayer.image.prototype.clear = function(callback) {
  this.loaded = false;
  if (this.img) {
    this.img.fadeOut((function(image) {
      return function() {
        image.img.attr('src', '');
        image.loader.src = '';
        jQuery(this).remove();
        callback.call(image);
      };
    })(this));
  }
  else {
    callback.call(this);
  }
};

/**
 * Resize the image provided a width and height or nothing.
 *
 * @param {integer} width (optional) The width of the container.
 * @param {integer} height (optional) The height of the container.
 */
minplayer.image.prototype.resize = function(width, height) {
  width = width || this.display.width();
  height = height || this.display.height();
  if (width && height && this.loaded) {

    // Get the scaled rectangle.
    var rect = this.getScaledRect(this.ratio, {
      width: width,
      height: height
    });

    // Now set this image to the new size.
    if (this.img) {
      this.img.attr('src', this.loader.src).css({
        marginLeft: rect.x,
        marginTop: rect.y,
        width: rect.width,
        height: rect.height
      });
    }

    // Show the container.
    this.img.fadeIn();
  }
};

/**
 * @see minplayer.display#onResize
 */
minplayer.image.prototype.onResize = function() {

  // Resize the image to fit.
  this.resize();
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @class A wrapper class used to provide all the data necessary to control an
 * individual file within this media player.
 *
 * @param {object} file A media file object with minimal required information.
 */
minplayer.file = function(file) {
  this.duration = file.duration || 0;
  this.bytesTotal = file.bytesTotal || 0;
  this.quality = file.quality || 0;
  this.stream = file.stream || '';
  this.path = file.path || '';
  this.codecs = file.codecs || '';

  // These should be provided, but just in case...
  this.extension = file.extension || this.getFileExtension();
  this.mimetype = file.mimetype || file.filemime || this.getMimeType();
  this.type = file.type || this.getType();

  // Fail safe to try and guess the mimetype and media type.
  if (!this.type) {
    this.mimetype = this.getMimeType();
    this.type = this.getType();
  }

  // Get the player.
  this.player = file.player || this.getBestPlayer();
  this.priority = file.priority || this.getPriority();
  this.id = file.id || this.getId();
};

/**
 * Returns the best player for the job.
 *
 * @return {string} The best player to play the media file.
 */
minplayer.file.prototype.getBestPlayer = function() {
  var bestplayer = null, bestpriority = 0;
  jQuery.each(minplayer.players, (function(file) {
    return function(name, player) {
      var priority = player.getPriority();
      if (player.canPlay(file) && (priority > bestpriority)) {
        bestplayer = name;
        bestpriority = priority;
      }
    };
  })(this));
  return bestplayer;
};

/**
 * The priority of this file is determined by the priority of the best
 * player multiplied by the priority of the mimetype.
 *
 * @return {integer} The priority of the media file.
 */
minplayer.file.prototype.getPriority = function() {
  var priority = 1;
  if (this.player) {
    priority = minplayer.players[this.player].getPriority();
  }
  switch (this.mimetype) {
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
      return priority * 10;
    case 'video/mp4':
    case 'audio/mp4':
    case 'audio/mpeg':
      return priority * 9;
    case 'video/ogg':
    case 'audio/ogg':
    case 'video/quicktime':
      return priority * 8;
    default:
      return priority * 5;
  }
};

/**
 * Returns the file extension of the file path.
 *
 * @return {string} The file extension.
 */
minplayer.file.prototype.getFileExtension = function() {
  return this.path.substring(this.path.lastIndexOf('.') + 1).toLowerCase();
};

/**
 * Returns the proper mimetype based off of the extension.
 *
 * @return {string} The mimetype of the file based off of extension.
 */
minplayer.file.prototype.getMimeType = function() {
  switch (this.extension) {
    case 'mp4': case 'm4v': case 'flv': case 'f4v':
      return 'video/mp4';
    case'webm':
      return 'video/webm';
    case 'ogg': case 'ogv':
      return 'video/ogg';
    case '3g2':
      return 'video/3gpp2';
    case '3gpp':
    case '3gp':
      return 'video/3gpp';
    case 'mov':
      return 'video/quicktime';
    case'swf':
      return 'application/x-shockwave-flash';
    case 'oga':
      return 'audio/ogg';
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a': case 'f4a':
      return 'audio/mp4';
    case 'aac':
      return 'audio/aac';
    case 'wav':
      return 'audio/vnd.wave';
    case 'wma':
      return 'audio/x-ms-wma';
    default:
      return 'unknown';
  }
};

/**
 * The type of media this is: video or audio.
 *
 * @return {string} "video" or "audio" based on what the type of media this
 * is.
 */
minplayer.file.prototype.getType = function() {
  switch (this.mimetype) {
    case 'video/mp4':
    case 'video/webm':
    case 'application/octet-stream':
    case 'video/x-webm':
    case 'video/ogg':
    case 'video/3gpp2':
    case 'video/3gpp':
    case 'video/quicktime':
      return 'video';
    case 'audio/mp3':
    case 'audio/mp4':
    case 'audio/ogg':
    case 'audio/mpeg':
      return 'audio';
    default:
      return '';
  }
};

/**
 * Returns the ID for this media file.
 *
 * @return {string} The id for this media file which is provided by the player.
 */
minplayer.file.prototype.getId = function() {
  var player = minplayer.players[this.player];
  return (player && player.getMediaId) ? player.getMediaId(this) : '';
};
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
 * @return {number} The priority of this media player.
 */
minplayer.players.base.getPriority = function() {
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

  /** The currently loaded media file. */
  this.mediaFile = this.options.file;

  // Clear the media player.
  this.clear();

  // Get the player display object.
  if (!this.playerFound()) {

    // Add the new player.
    this.addPlayer();
  }

  // Get the player object...
  this.player = this.getPlayer();

  // Set the focus of the element based on if they click in or outside of it.
  jQuery(document).bind('click', (function(player) {
    return function(event) {
      if (jQuery(event.target).closest('#' + player.options.id).length == 0) {
        player.hasFocus = false;
      }
      else {
        player.hasFocus = true;
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
  this.elements.media = jQuery(this.create());
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
    jQuery(this.player).unbind();
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

  // Tell everyone else we reset.
  this.trigger('pause');
  this.trigger('waiting');
  this.trigger('progress', {loaded: 0, total: 0, start: 0});
  this.trigger('timeupdate', {currentTime: 0, duration: 0});
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
  this.poll((function(player) {
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

  // Trigger that the load has started.
  this.trigger('loadstart');
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
  this.poll((function(player) {
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
  })(this), 1000);
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

  // If we should autoplay, then just play now.
  if (this.options.autoplay) {
    this.play();
  }

  this.trigger('loadeddata');
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
 * Determines if the player should show the playloader.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.base.prototype.hasPlayLoader = function() {
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
minplayer.players.base.prototype.create = function() {
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
 * @return {boolean} If this action was performed.
 */
minplayer.players.base.prototype.load = function(file) {

  // Store the media file for future lookup.
  var isString = (typeof this.mediaFile == 'string');
  var path = isString ? this.mediaFile : this.mediaFile.path;
  if (file && this.isReady() && (file.path != path)) {
    this.reset();
    this.mediaFile = file;
    return true;
  }

  return false;
};

/**
 * Play the loaded media file.
 * @return {boolean} If this action was performed.
 */
minplayer.players.base.prototype.play = function() {
  return this.isReady();
};

/**
 * Pause the loaded media file.
 * @return {boolean} If this action was performed.
 */
minplayer.players.base.prototype.pause = function() {
  return this.isReady();
};

/**
 * Stop the loaded media file.
 * @return {boolean} If this action was performed.
 */
minplayer.players.base.prototype.stop = function() {
  this.playing = false;
  this.loading = false;
  this.hasFocus = false;
  return this.isReady();
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
 * @return {boolean} If this action was performed.
 */
minplayer.players.base.prototype.seek = function(pos) {
  return this.isReady();
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
 * @return {boolean} If this action was performed.
 */
minplayer.players.base.prototype.setVolume = function(vol) {
  this.trigger('volumeupdate', vol);
  return this.isReady();
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
  return this.duration.get(callback);
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
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The HTML5 media player implementation.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.html5 = function(context, options, queue) {

  // Derive players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.html5.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.html5.prototype.constructor = minplayer.players.html5;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.html5.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.html5.canPlay = function(file) {
  switch (file.mimetype) {
    case 'video/ogg':
      return !!minplayer.playTypes.videoOGG;
    case 'video/mp4':
    case 'video/x-mp4':
    case 'video/m4v':
    case 'video/x-m4v':
      return !!minplayer.playTypes.videoH264;
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
      return !!minplayer.playTypes.videoWEBM;
    case 'audio/ogg':
      return !!minplayer.playTypes.audioOGG;
    case 'audio/mpeg':
      return !!minplayer.playTypes.audioMP3;
    case 'audio/mp4':
      return !!minplayer.playTypes.audioMP4;
    default:
      return false;
  }
};

/**
 * @see minplayer.plugin.construct
 */
minplayer.players.html5.prototype.construct = function() {

  // Call base constructor.
  minplayer.players.base.prototype.construct.call(this);

  // Add the player events.
  this.addEvents();
};

/**
 * Add events.
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.addEvents = function() {

  // Check if the player exists.
  if (this.player) {

    // Unbind all current events on this player.
    jQuery(this.player).unbind();

    // Add the events to this player.
    this.player.addEventListener('abort', (function(player) {
      return function() {
        player.trigger('abort');
      };
    })(this), false);
    this.player.addEventListener('loadstart', (function(player) {
      return function() {
        player.onReady();
      };
    })(this), false);
    this.player.addEventListener('loadeddata', (function(player) {
      return function() {
        player.onLoaded();
      };
    })(this), false);
    this.player.addEventListener('loadedmetadata', (function(player) {
      return function() {
        player.onLoaded();
      };
    })(this), false);
    this.player.addEventListener('canplaythrough', (function(player) {
      return function() {
        player.onLoaded();
      };
    })(this), false);
    this.player.addEventListener('ended', (function(player) {
      return function() {
        player.onComplete();
      };
    })(this), false);
    this.player.addEventListener('pause', (function(player) {
      return function() {
        player.onPaused();
      };
    })(this), false);
    this.player.addEventListener('play', (function(player) {
      return function() {
        player.onPlaying();
      };
    })(this), false);
    this.player.addEventListener('playing', (function(player) {
      return function() {
        player.onPlaying();
      };
    })(this), false);
    this.player.addEventListener('error', (function(player) {
      return function() {
        player.trigger('error', 'An error occured - ' + this.error.code);
      };
    })(this), false);
    this.player.addEventListener('waiting', (function(player) {
      return function() {
        player.onWaiting();
      };
    })(this), false);
    this.player.addEventListener('durationchange', (function(player) {
      return function() {
        player.duration.set(this.duration);
        player.trigger('durationchange', {duration: this.duration});
      };
    })(this), false);
    this.player.addEventListener('progress', (function(player) {
      return function(event) {
        player.bytesTotal.set(event.total);
        player.bytesLoaded.set(event.loaded);
      };
    })(this), false);

    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.html5.prototype.playerFound = function() {
  return (this.display.find(this.mediaFile.type).length > 0);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.html5.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);
  var element = jQuery(document.createElement(this.mediaFile.type))
  .attr(this.options.attributes)
  .append(
    jQuery(document.createElement('source')).attr({
      'src': this.mediaFile.path
    })
  );

  // Fix the fluid width and height.
  element.eq(0)[0].setAttribute('width', '100%');
  element.eq(0)[0].setAttribute('height', '100%');
  return element;
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.html5.prototype.getPlayer = function() {
  return this.elements.media.eq(0)[0];
};

/**
 * @see minplayer.players.base#load
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.load = function(file) {

  // See if a load is even necessary.
  if (minplayer.players.base.prototype.load.call(this, file)) {

    // Get the current source.
    var src = this.elements.media.attr('src');
    if (!src) {
      src = jQuery('source', this.elements.media).eq(0).attr('src');
    }

    // Only swap out if the new file is different from the source.
    if (src != file.path) {

      // Add a new player.
      this.addPlayer();

      // Set the new player.
      this.player = this.getPlayer();

      // Add the events again.
      this.addEvents();

      // Set the autoload.
      var option = this.options.autoload ? 'auto' : 'metadata';
      this.elements.media.attr('preload', option);

      // Change the source...
      var code = '<source src="' + file.path + '">';
      this.elements.media.removeAttr('src').empty().html(code);
      return true;
    }
  }

  return false;
};

/**
 * @see minplayer.players.base#play
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.play = function() {
  if (minplayer.players.base.prototype.play.call(this)) {
    this.player.play();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#pause
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.pause = function() {
  if (minplayer.players.base.prototype.pause.call(this)) {
    this.player.pause();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#stop
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.stop = function() {
  if (minplayer.players.base.prototype.stop.call(this)) {
    this.player.pause();
    this.player.src = '';
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#seek
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.seek = function(pos) {
  if (minplayer.players.base.prototype.seek.call(this, pos)) {
    this.player.currentTime = pos;
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#setVolume
 * @return {boolean} If this action was performed.
 */
minplayer.players.html5.prototype.setVolume = function(vol) {
  if (minplayer.players.base.prototype.setVolume.call(this, vol)) {
    this.player.volume = vol;
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.html5.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.player.volume);
  }
};

/**
 * @see minplayer.players.base#getDuration
 */
minplayer.players.html5.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    callback(this.player.duration);
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.html5.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.player.currentTime);
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.html5.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    var loaded = 0;

    // Check several different possibilities.
    if (this.bytesLoaded.value) {
      loaded = this.bytesLoaded.value;
    }
    else if (this.player.buffered &&
        this.player.buffered.length > 0 &&
        this.player.buffered.end &&
        this.player.duration) {
      loaded = this.player.buffered.end(0);
    }
    else if (this.player.bytesTotal != undefined &&
             this.player.bytesTotal > 0 &&
             this.player.bufferedBytes != undefined) {
      loaded = this.player.bufferedBytes;
    }

    // Return the loaded amount.
    callback(loaded);
  }
};

/**
 * @see minplayer.players.base#getBytesTotal
 */
minplayer.players.html5.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {

    var total = 0;

    // Check several different possibilities.
    if (this.bytesTotal.value) {
      total = this.bytesTotal.value;
    }
    else if (this.player.buffered &&
        this.player.buffered.length > 0 &&
        this.player.buffered.end &&
        this.player.duration) {
      total = this.player.duration;
    }
    else if (this.player.bytesTotal != undefined &&
             this.player.bytesTotal > 0 &&
             this.player.bufferedBytes != undefined) {
      total = this.player.bytesTotal;
    }

    // Return the loaded amount.
    callback(total);
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The Flash media player class to control the flash fallback.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.flash = function(context, options, queue) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.flash.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.flash.prototype.constructor = minplayer.players.flash;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.flash.getPriority = function() {
  return 0;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.flash.canPlay = function(file) {
  return false;
};

/**
 * API to return the Flash player code provided params.
 *
 * @param {object} params The params used to populate the Flash code.
 * @return {object} A Flash DOM element.
 */
minplayer.players.flash.getFlash = function(params) {
  // Get the protocol.
  var protocol = window.location.protocol;
  if (protocol.charAt(protocol.length - 1) == ':') {
    protocol = protocol.substring(0, protocol.length - 1);
  }

  // Convert the flashvars object to a string...
  var flashVars = jQuery.param(params.flashvars);

  // Set the codebase.
  var codebase = protocol + '://fpdownload.macromedia.com';
  codebase += '/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0';

  // Get the HTML flash object string.
  var flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
  flash += 'codebase="' + codebase + '" ';
  flash += 'playerType="flash" ';
  flash += 'width="' + params.width + '" ';
  flash += 'height="' + params.height + '" ';
  flash += 'id="' + params.id + '" ';
  flash += 'name="' + params.id + '"> ';
  flash += '<param name="allowScriptAccess" value="always"></param>';
  flash += '<param name="allowfullscreen" value="true" />';
  flash += '<param name="movie" value="' + params.swf + '"></param>';
  flash += '<param name="wmode" value="' + params.wmode + '"></param>';
  flash += '<param name="quality" value="high"></param>';
  flash += '<param name="FlashVars" value="' + flashVars + '"></param>';
  flash += '<embed src="' + params.swf + '" ';
  flash += 'quality="high" ';
  flash += 'width="' + params.width + '" height="' + params.height + '" ';
  flash += 'id="' + params.id + '" name="' + params.id + '" ';
  flash += 'swLiveConnect="true" allowScriptAccess="always" ';
  flash += 'wmode="' + params.wmode + '"';
  flash += 'allowfullscreen="true" type="application/x-shockwave-flash" ';
  flash += 'FlashVars="' + flashVars + '" ';
  flash += 'pluginspage="' + protocol;
  flash += '://www.macromedia.com/go/getflashplayer" />';
  flash += '</object>';
  return flash;
};

/**
 * @see minplayer.players.base#playerFound
 * @return {boolean} TRUE - if the player is in the DOM, FALSE otherwise.
 */
minplayer.players.flash.prototype.playerFound = function() {
  return (this.display.find('object[playerType="flash"]').length > 0);
};

/**
 * @see minplayer.players.base#getPlayer
 * @return {object} The media player object.
 */
minplayer.players.flash.prototype.getPlayer = function() {
  // IE needs the object, everyone else just needs embed.
  var object = jQuery.browser.msie ? 'object' : 'embed';
  return jQuery(object, this.display).eq(0)[0];
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class The Flash media player class to control the flash fallback.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.minplayer = function(context, options, queue) {

  // Derive from players flash.
  minplayer.players.flash.call(this, context, options, queue);
};

/** Derive from minplayer.players.flash. */
minplayer.players.minplayer.prototype = new minplayer.players.flash();

/** Reset the constructor. */
minplayer.players.minplayer.prototype.constructor = minplayer.players.minplayer;

/**
 * Called when the Flash player is ready.
 *
 * @param {string} id The media player ID.
 */
window.onFlashPlayerReady = function(id) {
  var media = minplayer.get(id, 'media');
  if (media) {
    media.onReady();
  }
};

/**
 * Called when the Flash player updates.
 *
 * @param {string} id The media player ID.
 * @param {string} eventType The event type that was triggered.
 */
window.onFlashPlayerUpdate = function(id, eventType) {
  var media = minplayer.get(id, 'media');
  if (media) {
    media.onMediaUpdate(eventType);
  }
};

/**
 * Used to debug from the Flash player to the browser console.
 *
 * @param {string} debug The debug string.
 */
window.onFlashPlayerDebug = function(debug) {
  minplayer.console.log(debug);
};

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.minplayer.getPriority = function() {
  return 1;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.minplayer.canPlay = function(file) {
  switch (file.mimetype) {
    case 'video/mp4':
    case 'video/x-mp4':
    case 'video/m4v':
    case 'video/x-m4v':
    case 'video/x-webm':
    case 'video/webm':
    case 'application/octet-stream':
    case 'video/quicktime':
    case 'video/3gpp2':
    case 'video/3gpp':
    case 'application/x-shockwave-flash':
    case 'audio/mpeg':
    case 'audio/mp4':
    case 'audio/aac':
    case 'audio/vnd.wave':
    case 'audio/x-ms-wma':
      return true;

    default:
      return false;
  }
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.minplayer.prototype.create = function() {

  // Make sure we provide default options...
  this.options = jQuery.extend({
    swfplayer: 'flash/minplayer.swf'
  }, this.options);

  minplayer.players.flash.prototype.create.call(this);

  // The flash variables for this flash player.
  var flashVars = {
    'id': this.options.id,
    'debug': this.options.debug,
    'config': 'nocontrols',
    'file': this.mediaFile.path,
    'autostart': this.options.autoplay,
    'autoload': this.options.autoload
  };

  // Return a flash media player object.
  return minplayer.players.flash.getFlash({
    swf: this.options.swfplayer,
    id: this.options.id + '_player',
    width: '100%',
    height: '100%',
    flashvars: flashVars,
    wmode: this.options.wmode
  });
};

/**
 * Called when the Flash player has an update.
 *
 * @param {string} eventType The event that was triggered in the player.
 */
minplayer.players.minplayer.prototype.onMediaUpdate = function(eventType) {
  switch (eventType) {
    case 'mediaMeta':
      this.onLoaded();
      break;
    case 'mediaPlaying':
      if (this.minplayerloaded) {
        this.onPlaying();
      }
      break;
    case 'mediaPaused':
      this.minplayerloaded = true;
      this.onPaused();
      break;
    case 'mediaComplete':
      this.onComplete();
      break;
  }
};

/**
 * Resets all variables.
 */
minplayer.players.minplayer.prototype.reset = function() {
  minplayer.players.flash.prototype.reset.call(this);
  this.minplayerloaded = this.options.autoplay;
};

/**
 * @see minplayer.players.base#load
 * @return {boolean} If this action was performed.
 */
minplayer.players.minplayer.prototype.load = function(file) {
  if (minplayer.players.flash.prototype.load.call(this, file)) {
    this.minplayerloaded = this.options.autoplay;
    this.player.loadMedia(file.path, file.stream);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#play
 * @return {boolean} If this action was performed.
 */
minplayer.players.minplayer.prototype.play = function() {
  if (minplayer.players.flash.prototype.play.call(this)) {
    this.player.playMedia();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#pause
 * @return {boolean} If this action was performed.
 */
minplayer.players.minplayer.prototype.pause = function() {
  if (minplayer.players.flash.prototype.pause.call(this)) {
    this.player.pauseMedia();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#stop
 * @return {boolean} If this action was performed.
 */
minplayer.players.minplayer.prototype.stop = function() {
  if (minplayer.players.flash.prototype.stop.call(this)) {
    this.player.stopMedia();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#seek
 * @return {boolean} If this action was performed.
 */
minplayer.players.minplayer.prototype.seek = function(pos) {
  if (minplayer.players.flash.prototype.seek.call(this, pos)) {
    this.player.seekMedia(pos);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#setVolume
 * @return {boolean} If this action was performed.
 */
minplayer.players.minplayer.prototype.setVolume = function(vol) {
  if (minplayer.players.flash.prototype.setVolume.call(this, vol)) {
    this.player.setVolume(vol);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.minplayer.prototype.getVolume = function(callback) {
  if (this.isReady()) {
    callback(this.player.getVolume());
  }
};

/**
 * @see minplayer.players.flash#getDuration
 */
minplayer.players.minplayer.prototype.getDuration = function(callback) {
  if (this.isReady()) {

    // Check to see if it is immediately available.
    var duration = this.player.getDuration();
    if (duration) {
      callback(duration);
    }
    else {

      // If not, then poll every second for the duration.
      this.poll((function(player) {
        return function() {
          duration = player.player.getDuration();
          if (duration) {
            callback(duration);
          }
          return !duration;
        };
      })(this), 1000);
    }
  }
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.minplayer.prototype.getCurrentTime = function(callback) {
  if (this.isReady()) {
    callback(this.player.getCurrentTime());
  }
};

/**
 * @see minplayer.players.base#getBytesLoaded
 */
minplayer.players.minplayer.prototype.getBytesLoaded = function(callback) {
  if (this.isReady()) {
    callback(this.player.getMediaBytesLoaded());
  }
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.minplayer.prototype.getBytesTotal = function(callback) {
  if (this.isReady()) {
    callback(this.player.getMediaBytesTotal());
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The YouTube media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.youtube = function(context, options, queue) {

  /** The quality of the YouTube stream. */
  this.quality = 'default';

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.youtube.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.youtube.prototype.constructor = minplayer.players.youtube;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.youtube.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.youtube.canPlay = function(file) {

  // Check for the mimetype for youtube.
  if (file.mimetype === 'video/youtube') {
    return true;
  }

  // If the path is a YouTube path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?youtube\.com/i) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.youtube.getMediaId = function(file) {
  var regex = /^http[s]?\:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.match(regex)[2];
  }
  else {
    return file.path;
  }
};

/**
 * Register this youtube player so that multiple players can be present
 * on the same page without event collision.
 */
minplayer.players.youtube.prototype.register = function() {

  /**
   * Register the standard youtube api ready callback.
   */
  window.onYouTubePlayerAPIReady = function() {

    // Iterate over each media player.
    jQuery.each(minplayer.get(null, 'player'), function(id, player) {

      // Make sure this is the youtube player.
      if (player.currentPlayer == 'youtube') {

        // Create a new youtube player object for this instance only.
        var playerId = id + '-player';

        // Set this players media.
        player.media.player = new YT.Player(playerId, {
          events: {
            'onReady': function(event) {
              player.media.onReady(event);
            },
            'onStateChange': function(event) {
              player.media.onPlayerStateChange(event);
            },
            'onPlaybackQualityChange': function(newQuality) {
              player.media.onQualityChange(newQuality);
            },
            'onError': function(errorCode) {
              player.media.onError(errorCode);
            }
          }
        });
      }
    });
  }
};

/**
 * Translates the player state for the YouTube API player.
 *
 * @param {number} playerState The YouTube player state.
 */
minplayer.players.youtube.prototype.setPlayerState = function(playerState) {
  switch (playerState) {
    case YT.PlayerState.CUED:
      break;
    case YT.PlayerState.BUFFERING:
      this.onWaiting();
      break;
    case YT.PlayerState.PAUSED:
      this.onPaused();
      break;
    case YT.PlayerState.PLAYING:
      this.onPlaying();
      break;
    case YT.PlayerState.ENDED:
      this.onComplete();
      break;
    default:
      break;
  }
};

/**
 * Called when an error occurs.
 *
 * @param {string} event The onReady event that was triggered.
 */
minplayer.players.youtube.prototype.onReady = function(event) {
  minplayer.players.base.prototype.onReady.call(this);
  if (!this.options.autoplay) {
    this.pause();
  }
  this.onLoaded();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.youtube.prototype.playerFound = function() {
  var iframe = this.display.find('iframe#' + this.options.id + '-player');
  return (iframe.length > 0);
};

/**
 * Called when the player state changes.
 *
 * @param {object} event A JavaScript Event.
 */
minplayer.players.youtube.prototype.onPlayerStateChange = function(event) {
  this.setPlayerState(event.data);
};

/**
 * Called when the player quality changes.
 *
 * @param {string} newQuality The new quality for the change.
 */
minplayer.players.youtube.prototype.onQualityChange = function(newQuality) {
  this.quality = newQuality.data;
};

/**
 * Determines if the player should show the playloader.
 *
 * @return {bool} If this player implements its own playLoader.
 */
minplayer.players.youtube.prototype.hasPlayLoader = function() {
  return true;
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.youtube.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);

  // Insert the YouTube iframe API player.
  var tag = document.createElement('script');
  tag.src = 'http://www.youtube.com/player_api?enablejsapi=1';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Now register this player.
  this.register();

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');

  // Get the source.
  var src = 'http://www.youtube.com/embed/';
  src += this.mediaFile.id + '?';

  // Determine the origin of this script.
  var origin = location.protocol;
  origin += '//' + location.hostname;
  origin += (location.port && ':' + location.port);

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'controls': 0,
    'enablejsapi': 1,
    'origin': origin
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.base#load
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.load = function(file) {
  if (minplayer.players.base.prototype.load.call(this, file)) {
    this.player.loadVideoById(file.id, 0, this.quality);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#play
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.play = function() {
  if (minplayer.players.base.prototype.play.call(this)) {
    this.player.playVideo();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#pause
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.pause = function() {
  if (minplayer.players.base.prototype.pause.call(this)) {
    this.player.pauseVideo();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#stop
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.stop = function() {
  if (minplayer.players.base.prototype.stop.call(this)) {
    this.player.stopVideo();
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#seek
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.seek = function(pos) {
  if (minplayer.players.base.prototype.seek.call(this, pos)) {
    this.player.seekTo(pos, true);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#setVolume
 * @return {boolean} If this action was performed.
 */
minplayer.players.youtube.prototype.setVolume = function(vol) {
  if (minplayer.players.base.prototype.setVolume.call(this, vol)) {
    this.player.setVolume(vol * 100);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.youtube.prototype.getVolume = function(callback) {
  this.getValue('getVolume', callback);
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.youtube.prototype.getDuration = function(callback) {
  this.getValue('getDuration', callback);
};

/**
 * @see minplayer.players.base#getCurrentTime
 */
minplayer.players.youtube.prototype.getCurrentTime = function(callback) {
  this.getValue('getCurrentTime', callback);
};

/**
 * @see minplayer.players.base#getBytesStart.
 */
minplayer.players.youtube.prototype.getBytesStart = function(callback) {
  this.getValue('getVideoStartBytes', callback);
};

/**
 * @see minplayer.players.base#getBytesLoaded.
 */
minplayer.players.youtube.prototype.getBytesLoaded = function(callback) {
  this.getValue('getVideoBytesLoaded', callback);
};

/**
 * @see minplayer.players.base#getBytesTotal.
 */
minplayer.players.youtube.prototype.getBytesTotal = function(callback) {
  this.getValue('getVideoBytesTotal', callback);
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/** All the media player implementations */
minplayer.players = minplayer.players || {};

/**
 * @constructor
 * @extends minplayer.players.base
 * @class The vimeo media player.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 * @param {object} queue The event queue to pass events around.
 */
minplayer.players.vimeo = function(context, options, queue) {

  // Derive from players base.
  minplayer.players.base.call(this, context, options, queue);
};

/** Derive from minplayer.players.base. */
minplayer.players.vimeo.prototype = new minplayer.players.base();

/** Reset the constructor. */
minplayer.players.vimeo.prototype.constructor = minplayer.players.vimeo;

/**
 * @see minplayer.players.base#getPriority
 * @return {number} The priority of this media player.
 */
minplayer.players.vimeo.getPriority = function() {
  return 10;
};

/**
 * @see minplayer.players.base#canPlay
 * @return {boolean} If this player can play this media type.
 */
minplayer.players.vimeo.canPlay = function(file) {

  // Check for the mimetype for vimeo.
  if (file.mimetype === 'video/vimeo') {
    return true;
  }

  // If the path is a vimeo path, then return true.
  return (file.path.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i) === 0);
};

/**
 * Return the ID for a provided media file.
 *
 * @param {object} file A {@link minplayer.file} object.
 * @return {string} The ID for the provided media.
 */
minplayer.players.vimeo.getMediaId = function(file) {
  var regex = /^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;
  if (file.path.search(regex) === 0) {
    return file.path.match(regex)[3];
  }
  else {
    return file.path;
  }
};

/**
 * @see minplayer.players.base#reset
 */
minplayer.players.vimeo.prototype.reset = function() {

  // Reset the flash variables..
  minplayer.players.base.prototype.reset.call(this);
};

/**
 * @see minplayer.players.base#create
 * @return {object} The media player entity.
 */
minplayer.players.vimeo.prototype.create = function() {
  minplayer.players.base.prototype.create.call(this);

  // Insert the Vimeo Froogaloop player.
  var tag = document.createElement('script');
  tag.src = 'http://a.vimeocdn.com/js/froogaloop2.min.js';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Create the iframe for this player.
  var iframe = document.createElement('iframe');
  iframe.setAttribute('id', this.options.id + '-player');
  iframe.setAttribute('type', 'text/html');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('frameborder', '0');

  // Get the source.
  var src = 'http://player.vimeo.com/video/';
  src += this.mediaFile.id + '?';

  // Add the parameters to the src.
  src += jQuery.param({
    'wmode': 'opaque',
    'api': 1,
    'player_id': this.options.id + '-player',
    'title': 0,
    'byline': 0,
    'portrait': 0,
    'autoplay': this.options.autoplay,
    'loop': this.options.loop
  });

  // Set the source of the iframe.
  iframe.setAttribute('src', src);

  // Now register this player when the froogaloop code is loaded.
  this.poll((function(player) {
    return function() {
      if (window.Froogaloop) {
        player.player = window.Froogaloop(iframe);
        player.player.addEvent('ready', function() {
          player.onReady();
        });
      }
      return !window.Froogaloop;
    };
  })(this), 200);

  // Trigger that the load has started.
  this.trigger('loadstart');

  // Return the player.
  return iframe;
};

/**
 * @see minplayer.players.base#onReady
 */
minplayer.players.vimeo.prototype.onReady = function(player_id) {

  // Add the other listeners.
  this.player.addEvent('loadProgress', (function(player) {
    return function(progress) {
      player.duration.set(parseFloat(progress.duration));
      player.bytesLoaded.set(progress.bytesLoaded);
      player.bytesTotal.set(progress.bytesTotal);
    };
  })(this));

  this.player.addEvent('playProgress', (function(player) {
    return function(progress) {
      player.duration.set(parseFloat(progress.duration));
      player.currentTime.set(parseFloat(progress.seconds));
    };
  })(this));

  this.player.addEvent('play', (function(player) {
    return function() {
      player.onPlaying();
    };
  })(this));

  this.player.addEvent('pause', (function(player) {
    return function() {
      player.onPaused();
    };
  })(this));

  this.player.addEvent('finish', (function(player) {
    return function() {
      player.onComplete();
    };
  })(this));

  minplayer.players.base.prototype.onReady.call(this);
  this.onLoaded();
};

/**
 * Checks to see if this player can be found.
 * @return {bool} TRUE - Player is found, FALSE - otherwise.
 */
minplayer.players.vimeo.prototype.playerFound = function() {
  var iframe = this.display.find('iframe#' + this.options.id + '-player');
  return (iframe.length > 0);
};

/**
 * @see minplayer.players.base#play
 * @return {boolean} If this action was performed.
 */
minplayer.players.vimeo.prototype.play = function() {
  if (minplayer.players.base.prototype.play.call(this)) {
    this.player.api('play');
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#pause
 * @return {boolean} If this action was performed.
 */
minplayer.players.vimeo.prototype.pause = function() {
  if (minplayer.players.base.prototype.pause.call(this)) {
    this.player.api('pause');
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#stop
 * @return {boolean} If this action was performed.
 */
minplayer.players.vimeo.prototype.stop = function() {
  if (minplayer.players.base.prototype.stop.call(this)) {
    this.player.api('unload');
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#seek
 * @return {boolean} If this action was performed.
 */
minplayer.players.vimeo.prototype.seek = function(pos) {
  if (minplayer.players.base.prototype.seek.call(this, pos)) {
    this.player.api('seekTo', pos);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#setVolume
 * @return {boolean} If this action was performed.
 */
minplayer.players.vimeo.prototype.setVolume = function(vol) {
  if (minplayer.players.base.prototype.setVolume.call(this, vol)) {
    this.volume.set(vol);
    this.player.api('setVolume', vol);
    return true;
  }

  return false;
};

/**
 * @see minplayer.players.base#getVolume
 */
minplayer.players.vimeo.prototype.getVolume = function(callback) {
  this.player.api('getVolume', function(vol) {
    callback(vol);
  });
};

/**
 * @see minplayer.players.base#getDuration.
 */
minplayer.players.vimeo.prototype.getDuration = function(callback) {
  if (this.isReady()) {
    if (this.duration.value) {
      callback(this.duration.value);
    }
    else {
      this.player.api('getDuration', function(duration) {
        callback(duration);
      });
    }
  }
};
/** The minplayer namespace. */
var minplayer = minplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This is the base minplayer controller.  Other controllers can derive
 * from the base and either build on top of it or simply define the elements
 * that this base controller uses.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
minplayer.controller = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'controller', context, options);
};

/** Derive from minplayer.display. */
minplayer.controller.prototype = new minplayer.display();

/** Reset the constructor. */
minplayer.controller.prototype.constructor = minplayer.controller;

/**
 * A static function that will format a time value into a string time format.
 *
 * @param {integer} time An integer value of time.
 * @return {string} A string representation of the time.
 */
minplayer.formatTime = function(time) {
  time = time || 0;
  var seconds = 0, minutes = 0, hour = 0, timeString = '';

  hour = Math.floor(time / 3600);
  time -= (hour * 3600);
  minutes = Math.floor(time / 60);
  time -= (minutes * 60);
  seconds = Math.floor(time % 60);

  if (hour) {
    timeString += String(hour);
    timeString += ':';
  }

  timeString += (minutes >= 10) ? String(minutes) : ('0' + String(minutes));
  timeString += ':';
  timeString += (seconds >= 10) ? String(seconds) : ('0' + String(seconds));
  return {time: timeString, units: ''};
};

/**
 * @see minplayer.display#getElements
 * @return {object} The elements defined by this display.
 */
minplayer.controller.prototype.getElements = function() {
  var elements = minplayer.display.prototype.getElements.call(this);
  return jQuery.extend(elements, {
    play: null,
    pause: null,
    fullscreen: null,
    seek: null,
    progress: null,
    volume: null,
    timer: null
  });
};

/**
 * @see minplayer.plugin#construct
 */
minplayer.controller.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Keep track of if we are dragging...
  this.dragging = false;

  // Keep track of the current volume.
  this.vol = 0;

  // If they have a seek bar.
  if (this.elements.seek) {

    // Create the seek bar slider control.
    this.seekBar = this.elements.seek.slider({
      range: 'min',
      create: function(event, ui) {
        jQuery('.ui-slider-range', event.target).addClass('ui-state-active');
      }
    });
  }

  // If they have a volume bar.
  if (this.elements.volume) {

    // Create the volume bar slider control.
    this.volumeBar = this.elements.volume.slider({
      range: 'min',
      orientation: 'vertical'
    });
  }

  // Get the player plugin.
  this.get('player', function(player) {

    // If they have a fullscreen button.
    if (this.elements.fullscreen) {

      // Bind to the click event.
      this.elements.fullscreen.unbind().bind('click', function(e) {

        // Toggle fullscreen mode.
        player.toggleFullScreen();
      }).css({'pointer' : 'hand'});
    }
  });

  // Get the media plugin.
  this.get('media', function(media) {

    // If they have a pause button
    if (this.elements.pause) {

      // Bind to the click on this button.
      this.elements.pause.unbind().bind('click', (function(controller) {
        return function(event) {
          event.preventDefault();
          controller.playPause(false, media);
        };
      })(this));

      // Bind to the pause event of the media.
      media.bind('pause', (function(controller) {
        return function(event) {
          controller.setPlayPause(true);
        };
      })(this));
    }

    // If they have a play button
    if (this.elements.play) {

      // Bind to the click on this button.
      this.elements.play.unbind().bind('click', (function(controller) {
        return function(event) {
          event.preventDefault();
          controller.playPause(true, media);
        };
      })(this));

      // Bind to the play event of the media.
      media.bind('playing', (function(controller) {
        return function(event) {
          controller.setPlayPause(false);
        };
      })(this));
    }

    // If they have a duration, then trigger on duration change.
    if (this.elements.duration) {

      // Bind to the duration change event.
      media.bind('durationchange', (function(controller) {
        return function(event, data) {
          controller.setTimeString('duration', data.duration);
        };
      })(this));

      // Set the timestring to the duration.
      media.getDuration((function(controller) {
        return function(duration) {
          controller.setTimeString('duration', duration);
        };
      })(this));
    }

    // If they have a progress element.
    if (this.elements.progress) {

      // Bind to the progress event.
      media.bind('progress', (function(controller) {
        return function(event, data) {
          var percent = data.total ? (data.loaded / data.total) * 100 : 0;
          controller.elements.progress.width(percent + '%');
        };
      })(this));
    }

    // If they have a seek bar or timer, bind to the timeupdate.
    if (this.seekBar || this.elements.timer) {

      // Bind to the time update event.
      media.bind('timeupdate', (function(controller) {
        return function(event, data) {
          if (!controller.dragging) {
            var value = 0;
            if (data.duration) {
              value = (data.currentTime / data.duration) * 100;
            }

            // Update the seek bar if it exists.
            if (controller.seekBar) {
              controller.seekBar.slider('option', 'value', value);
            }

            controller.setTimeString('timer', data.currentTime);
          }
        };
      })(this));
    }

    // If they have a seekBar element.
    if (this.seekBar) {

      // Register the events for the control bar to control the media.
      this.seekBar.slider({
        start: (function(controller) {
          return function(event, ui) {
            controller.dragging = true;
          };
        })(this),
        stop: (function(controller) {
          return function(event, ui) {
            controller.dragging = false;
            media.getDuration(function(duration) {
              media.seek((ui.value / 100) * duration);
            });
          };
        })(this),
        slide: (function(controller) {
          return function(event, ui) {
            media.getDuration(function(duration) {
              var time = (ui.value / 100) * duration;
              if (!controller.dragging) {
                media.seek(time);
              }
              controller.setTimeString('timer', time);
            });
          };
        })(this)
      });
    }

    // Setup the mute button.
    if (this.elements.mute) {
      this.elements.mute.click((function(controller) {
        return function(event) {
          event.preventDefault();
          var value = controller.volumeBar.slider('option', 'value');
          if (value > 0) {
            controller.vol = value;
            controller.volumeBar.slider('option', 'value', 0);
            media.setVolume(0);
          }
          else {
            controller.volumeBar.slider('option', 'value', controller.vol);
            media.setVolume(controller.vol / 100);
          }
        };
      })(this));
    }

    // Setup the volume bar.
    if (this.volumeBar) {

      // Create the slider.
      this.volumeBar.slider({
        slide: function(event, ui) {
          media.setVolume(ui.value / 100);
        }
      });

      media.bind('volumeupdate', (function(controller) {
        return function(event, vol) {
          controller.volumeBar.slider('option', 'value', (vol * 100));
        };
      })(this));

      // Set the volume to match that of the player.
      media.getVolume((function(controller) {
        return function(vol) {
          controller.volumeBar.slider('option', 'value', (vol * 100));
        };
      })(this));
    }
  });

  // We are now ready.
  this.ready();
};

/**
 * Sets the play and pause state of the control bar.
 *
 * @param {boolean} state TRUE - Show Play, FALSE - Show Pause.
 */
minplayer.controller.prototype.setPlayPause = function(state) {
  var css = '';
  if (this.elements.play) {
    css = state ? 'inherit' : 'none';
    this.elements.play.css('display', css);
  }
  if (this.elements.pause) {
    css = state ? 'none' : 'inherit';
    this.elements.pause.css('display', css);
  }
};

/**
 * Plays or pauses the media.
 *
 * @param {bool} state true => play, false => pause.
 * @param {object} media The media player object.
 */
minplayer.controller.prototype.playPause = function(state, media) {
  var type = state ? 'play' : 'pause';
  this.display.trigger(type);
  this.setPlayPause(!state);
  if (media) {
    media[type]();
  }
};

/**
 * Sets the time string on the control bar.
 *
 * @param {string} element The name of the element to set.
 * @param {number} time The total time amount to set.
 */
minplayer.controller.prototype.setTimeString = function(element, time) {
  if (this.elements[element]) {
    this.elements[element].text(minplayer.formatTime(time).time);
  }
};
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

    // If the image type exists, then just use that one.
    if (images[type]) {
      image = images[type];
    }
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
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The default parser object.
 *
 * @return {object} The default parser.
 **/
osmplayer.parser['default'] = {

  // The priority for this parser.
  priority: 1,

  // This parser is always valid.
  valid: function(feed) {
    return true;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'json';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    feed += '?start-index=' + start;
    feed += '&max-results=' + numItems;
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    return data;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The youtube parser object.
 *
 * @return {object} The youtube parser.
 **/
osmplayer.parser.youtube = {

  // The priority for this parser.
  priority: 10,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    return (feed.search(/^http(s)?\:\/\/gdata\.youtube\.com/i) === 0);
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'jsonp';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    feed += '?start-index=' + (start + 1);
    feed += '&max-results=' + (numItems);
    feed += '&v=2&alt=jsonc';
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    data = data.data;
    var playlist = {
      total_rows: data.totalItems,
      nodes: []
    };

    // Iterate through the items and parse it.
    for (var index in data.items) {
      var item = data.items[index];
      playlist.nodes.push({
        title: item.title,
        description: item.description,
        mediafiles: {
          image: {
            'thumbnail': {
              path: item.thumbnail.sqDefault
            },
            'image': {
              path: item.thumbnail.hqDefault
            }
          },
          media: {
            'media': {
              player: 'youtube',
              id: item.id
            }
          }
        }
      });
    }

    return playlist;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The rss parser object.
 *
 * @return {object} The rss parser.
 **/
osmplayer.parser.rss = {

  // The priority for this parser.
  priority: 8,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    return feed.match(/\.rss$/i) !== null;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'xml';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: 0,
      nodes: []
    };
    jQuery('rss channel', data).find('item').each(function(index) {
      osmplayer.parser.rss.addRSSItem(playlist, jQuery(this));
    });
    return playlist;
  },

  // Parse an RSS item.
  addRSSItem: function(playlist, item) {
    playlist.total_rows++;
    playlist.nodes.push({
      title: item.find('title').text(),
      description: item.find('annotation').text(),
      mediafiles: {
        image: {
          'image': {
            path: item.find('image').text()
          }
        },
        media: {
          'media': {
            path: item.find('location').text()
          }
        }
      }
    });
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The asx parser object.
 *
 * @return {object} The asx parser.
 **/
osmplayer.parser.asx = {

  // The priority for this parser.
  priority: 8,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    return feed.match(/\.asx$/i) !== null;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'xml';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: 0,
      nodes: []
    };
    jQuery('asx entry', data).each(function(index) {
      osmplayer.parser.rss.addRSSItem(playlist, jQuery(this));
    });
    return playlist;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The xsfp parser object.
 *
 * @return {object} The xsfp parser.
 **/
osmplayer.parser.xsfp = {

  // The priority for this parser.
  priority: 8,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    return feed.match(/\.xml$/i) !== null;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'xml';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: 0,
      nodes: []
    };
    jQuery('playlist trackList track', data).each(function(index) {
      osmplayer.parser.rss.addRSSItem(playlist, jQuery(this));
    });
    return playlist;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class creates the playlist functionality for the minplayer.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.playlist = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'playlist', context, options);
};

/** Derive from minplayer.display. */
osmplayer.playlist.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.playlist.prototype.constructor = osmplayer.playlist;

/**
 * @see minplayer.plugin#construct
 */
osmplayer.playlist.prototype.construct = function() {

  // Make sure we provide default options...
  this.options = jQuery.extend({
    vertical: true,
    playlist: '',
    pageLimit: 10,
    autoNext: true,
    shuffle: false,
    loop: false
  }, this.options);

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  /** The nodes within this playlist. */
  this.nodes = [];

  // Current page.
  this.page = -1;

  // The total amount of nodes.
  this.totalItems = 0;

  // The current loaded item index.
  this.currentItem = -1;

  // The play playqueue.
  this.playqueue = [];

  // The playqueue position.
  this.playqueuepos = 0;

  // The current playlist.
  this.playlist = this.options.playlist;

  // Create the scroll bar.
  this.scroll = this.create('scroll', 'osmplayer');

  // Create the pager.
  this.pager = this.create('pager', 'osmplayer');
  this.pager.bind('nextPage', (function(playlist) {
    return function(event) {
      playlist.nextPage();
    };
  })(this));
  this.pager.bind('prevPage', (function(playlist) {
    return function(event) {
      playlist.prevPage();
    };
  })(this));

  // Get the media.
  if (this.options.autoNext) {
    this.get('media', function(media) {
      media.bind('ended', (function(playlist) {
        return function(event) {
          media.options.autoplay = true;
          playlist.next();
        };
      })(this));
    });
  }

  // Load the "next" item.
  this.next();

  // Say that we are ready.
  this.ready();
};

/**
 * Sets the playlist.
 *
 * @param {object} playlist The playlist object.
 * @param {integer} loadIndex The index of the item to load.
 */
osmplayer.playlist.prototype.set = function(playlist, loadIndex) {

  // Check to make sure the playlist is an object.
  if (typeof playlist !== 'object') {
    this.trigger('error', 'Playlist must be an object to set');
    return;
  }

  // Check to make sure the playlist has correct format.
  if (!playlist.hasOwnProperty('total_rows')) {
    this.trigger('error', 'Unknown playlist format.');
    return;
  }

  // Make sure the playlist has some rows.
  if (playlist.total_rows && playlist.nodes.length) {

    // Set the total rows.
    this.totalItems = playlist.total_rows;
    this.currentItem = 0;

    // Show or hide the next page if there is or is not a next page.
    if (((this.page + 1) * this.options.pageLimit) >= this.totalItems) {
      this.pager.nextPage.hide();
    }
    else {
      this.pager.nextPage.show();
    }

    var teaser = null;
    var numNodes = playlist.nodes.length;
    this.scroll.elements.list.empty();
    this.nodes = [];

    // Iterate through all the nodes.
    for (var index = 0; index < numNodes; index++) {

      // Create the teaser object.
      teaser = this.create('teaser', 'osmplayer', this.scroll.elements.list);
      teaser.setNode(playlist.nodes[index]);
      teaser.bind('nodeLoad', (function(playlist, index) {
        return function(event, data) {
          playlist.loadItem(index);
        };
      })(this, index));

      // Add this to our nodes array.
      this.nodes.push(teaser);

      // If the index is equal to the loadIndex.
      if (loadIndex === index) {
        this.loadItem(index);
      }
    }

    // Refresh the sizes.
    this.scroll.refresh();

    // Trigger that the playlist has loaded.
    this.trigger('playlistLoad', playlist);
  }

  // Show that we are no longer busy.
  if (this.scroll.elements.playlist_busy) {
    this.scroll.elements.playlist_busy.hide();
  }
};

/**
 * Stores the current playlist state in the playqueue.
 */
osmplayer.playlist.prototype.setQueue = function() {

  // Add this item to the playqueue.
  this.playqueue.push({
    page: this.page,
    item: this.currentItem
  });

  // Store the current playqueue position.
  this.playqueuepos = this.playqueue.length;
};

/**
 * Loads the next item.
 */
osmplayer.playlist.prototype.next = function() {
  var item = 0, page = this.page;

  // See if we are at the front of the playqueue.
  if (this.playqueuepos >= this.playqueue.length) {

    // If this is shuffle, then load a random item.
    if (this.options.shuffle) {
      item = Math.floor(Math.random() * this.totalItems);
      page = Math.floor(item / this.options.pageLimit);
      item = item % this.options.pageLimit;
      this.load(page, item);
    }
    else {

      // Otherwise, increment the current item by one.
      item = (this.currentItem + 1);
      if (item >= this.nodes.length) {
        this.load(page + 1, 0);
      }
      else {
        this.loadItem(item);
      }
    }
  }
  else {

    // Load the next item in the playqueue.
    this.playqueuepos = this.playqueuepos + 1;
    var currentQueue = this.playqueue[this.playqueuepos];
    this.load(currentQueue.page, currentQueue.item);
  }
};

/**
 * Loads the previous item.
 */
osmplayer.playlist.prototype.prev = function() {

  // Move back into the playqueue.
  this.playqueuepos = this.playqueuepos - 1;
  this.playqueuepos = (this.playqueuepos < 0) ? 0 : this.playqueuepos;
  var currentQueue = this.playqueue[this.playqueuepos];
  if (currentQueue) {
    this.load(currentQueue.page, currentQueue.item);
  }
};

/**
 * Loads a playlist node.
 *
 * @param {number} index The index of the item you would like to load.
 */
osmplayer.playlist.prototype.loadItem = function(index) {
  if (index < this.nodes.length) {
    this.setQueue();

    // Get the teaser at the current index and deselect it.
    var teaser = this.nodes[this.currentItem];
    teaser.select(false);
    this.currentItem = index;

    // Get the new teaser and select it.
    teaser = this.nodes[index];
    teaser.select(true);
    this.trigger('nodeLoad', teaser.node);
  }
};

/**
 * Loads the next page.
 *
 * @param {integer} loadIndex The index of the item to load.
 */
osmplayer.playlist.prototype.nextPage = function(loadIndex) {
  this.load(this.page + 1, loadIndex);
};

/**
 * Loads the previous page.
 *
 * @param {integer} loadIndex The index of the item to load.
 */
osmplayer.playlist.prototype.prevPage = function(loadIndex) {
  this.load(this.page - 1, loadIndex);
};

/**
 * Loads a playlist.
 *
 * @param {integer} page The page to load.
 * @param {integer} loadIndex The index of the item to load.
 */
osmplayer.playlist.prototype.load = function(page, loadIndex) {

  // If the playlist and pages are the same, then no need to load.
  if ((this.playlist == this.options.playlist) && (page == this.page)) {
    this.loadItem(loadIndex);
  }

  // Set the new playlist.
  this.playlist = this.options.playlist;

  // Determine if we need to loop.
  var maxPages = Math.floor(this.totalItems / this.options.pageLimit);
  if (page > maxPages) {
    if (this.options.loop) {
      page = 0;
      loadIndex = 0;
    }
    else {
      return;
    }
  }

  // Say that we are busy.
  if (this.scroll.elements.playlist_busy) {
    this.scroll.elements.playlist_busy.show();
  }

  // Normalize the page.
  page = page || 0;
  page = (page < 0) ? 0 : page;

  // Set the queue.
  this.setQueue();

  // Set the new page.
  this.page = page;

  // Hide or show the page based on if we are on the first page.
  if (this.page == 0) {
    this.pager.prevPage.hide();
  }
  else {
    this.pager.prevPage.show();
  }

  // If the playlist is an object, then go ahead and set it.
  if (typeof this.playlist == 'object') {
    this.set(this.playlist, loadIndex);
    if (this.playlist.endpoint) {
      this.playlist = this.options.playlist = this.playlist.endpoint;
    }
    return;
  }

  // Get the highest priority parser.
  var parser = osmplayer.parser['default'];
   for (var name in osmplayer.parser) {
    if (osmplayer.parser[name].valid(this.playlist)) {
      if (osmplayer.parser[name].priority > parser.priority) {
        parser = osmplayer.parser[name];
      }
    }
  }

  // The start index.
  var start = this.page * this.options.pageLimit;

  // Get the feed from the parser.
  var feed = parser.getFeed(
    this.playlist,
    start,
    this.options.pageLimit
  );

  // Build our request.
  var request = {
    type: 'GET',
    url: feed,
    success: (function(playlist) {
      return function(data) {
        playlist.set(parser.parse(data), loadIndex);
      };
    })(this),
    error: (function(playlist) {
      return function(XMLHttpRequest, textStatus, errorThrown) {
        if (playlist.scroll.elements.playlist_busy) {
          playlist.scroll.elements.playlist_busy.hide();
        }
        playlist.trigger('error', textStatus);
      }
    })(this)
  };

  // Set the data if applicable.
  var dataType = '';
  if (dataType = parser.getType()) {
    request.dataType = dataType;
  }

  // Perform an ajax callback.
  jQuery.ajax(request);
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides the scroll functionality for the playlists.
 *
 * We can calculate how the scrollbar controls the playlist using the
 * following diagram / equations.
 *  ___ ____________
 *  |  |            |\
 *  |  |    list    | \
 *  |  |            |y \
 *  |  |            |   \
 *  |  |____________|    \ _ _____
 *  |  |            |\    | |    |
 *  |  |            | \   | |    |
 *  |  |            |  \  | |x   |
 *  |  |            |   \ | |    |
 *  |  |            |    \|_|_   |
 *  |  |            |     | | |  |
 *  l  |   window   |     | | h  w
 *  |  |            |     |_|_|  |
 *  |  |            |    /| |    |
 *  |  |            |   / | |    |
 *  |  |            |  / v| |    |
 *  |  |            | /   | |    |
 *  |  |____________|/    |_|____|
 *  |  |            |    /
 *  |  |            |   /
 *  |  |            |  /
 *  |  |            | /
 *  |__|____________|/
 *
 *  l - The list height.
 *  h - Handle Bar height.
 *  w - Window height.
 *  x - The distance from top of window to the top of the handle.
 *  y - The disatnce from the top of the list to the top of the window.
 *  v - The distance from bottom of window to the bottom of the handle.
 *
 *  jQuery UI provides "v".  We already know "l", "h", "w".  We can then
 *  calculate the relationship between the scroll bar handle position to the
 *  list position using the following equations.
 *
 *  x = (w - (v + h))
 *  y = ((l - w)/(w - h)) * x
 *
 *   -- or --
 *
 *  y = ((l - w)/(w - h)) * (w - (v + h))
 *
 *  We can statically calculate the ((l - w)/(w - h)) as a ratio and use
 *  that to speed up calculations as follows.
 *
 *  ratio = ((l - w)/(w - h));
 *
 *  So, our translation equations are as follows...
 *
 *    y = ratio * (w - (v + h))
 *    v = w - (h + (y / ratio))
 *
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.scroll = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'scroll', context, options);
};

/** Derive from minplayer.display. */
osmplayer.scroll.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.scroll.prototype.constructor = osmplayer.scroll;

/**
 * @see minplayer.plugin#construct
 */
osmplayer.scroll.prototype.construct = function() {

  // Make sure we provide default options...
  this.options = jQuery.extend({
    vertical: true,
    hysteresis: 40,
    scrollSpeed: 20,
    scrollMode: 'auto'
  }, this.options);

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Make this component orientation agnostic.
  this.pos = this.options.vertical ? 'pageY' : 'pageX';
  this.offset = this.options.vertical ? 'top' : 'left';
  this.margin = this.options.vertical ? 'marginTop' : 'marginLeft';
  this.size = this.options.vertical ? 'height' : 'width';
  this.outer = this.options.vertical ? 'outerHeight' : 'outerWidth';

  this.getMousePos = function(event) {
    return (event[this.pos] - this.display.offset()[this.offset]);
  };
  this.getPos = function(handlePos) {
    if (this.options.vertical) {
      return this.ratio * (this.scrollSize - (handlePos + this.handleSize));
    }
    else {
      return this.ratio * handlePos;
    }
  };
  this.getHandlePos = function(pos) {
    if (this.options.vertical) {
      return this.scrollSize - (this.handleSize + (pos / this.ratio));
    }
    else {
      return (pos / this.ratio);
    }
  };

  // If they have a scroll bar.
  if (this.elements.scroll) {

    // Get the values of our variables.
    var scroll = this.elements.scroll;
    this.handleSize = 0;
    this.scrollTop = 0;
    this.mousePos = 0;

    // Refresh the scroll.
    this.refresh();

    // Create the scroll bar slider control.
    this.scroll = scroll.slider({
      orientation: this.options.vertical ? 'vertical' : 'horizontal',
      max: this.scrollSize,
      create: (function(scroll, vertical) {
        return function(event, ui) {
          var handle = jQuery('.ui-slider-handle', event.target);
          scroll.handleSize = handle[scroll.outer]();
          scroll.scrollTop = (scroll.scrollSize - scroll.handleSize);
          var initValue = vertical ? scroll.scrollTop : 0;
          jQuery(this).slider('option', 'value', initValue);
        };
      })(this, this.options.vertical),
      slide: (function(scroll, vertical) {
        return function(event, ui) {
          // Get the new position.
          var pos = scroll.getPos(ui.value);

          // Ensure it doesn't go over the limits.
          if (vertical && (pos < 0)) {
            scroll.scroll.slider('option', 'value', scroll.scrollTop);
            return false;
          }
          else if (!vertical && (ui.value > scroll.scrollTop)) {
            scroll.scroll.slider('option', 'value', scroll.scrollTop);
            return false;
          }

          // Set our list position.
          scroll.elements.list.css(scroll.margin, -pos + 'px');
          return true;
        };
      })(this, this.options.vertical)
    });

    // If they wish to have auto scroll mode.
    if (this.options.scrollMode == 'auto') {

      // Bind to the mouse events.
      this.elements.list.bind('mousemove', (function(scroll) {

        // Return our event function.
        return function(event) {
          event.preventDefault();
          scroll.mousePos = event[scroll.pos];
          scroll.mousePos -= scroll.display.offset()[scroll.offset];
        };

      })(this)).bind('mouseenter', (function(scroll) {

        // Return our event function.
        return function(event) {
          event.preventDefault();
          scroll.scrolling = true;
          setTimeout(function setScroll() {
            if (scroll.scrolling) {

              // Get the delta.
              var delta = scroll.mousePos - scroll.scrollMid;

              // Determine if we are within our hysteresis.
              if (Math.abs(delta) > scroll.options.hysteresis) {

                // Get the hysteresis and delta.
                var hyst = scroll.options.hysteresis;
                hyst *= (delta > 0) ? -1 : 0;
                delta = (scroll.options.scrollSpeed * (delta + hyst));
                delta /= scroll.scrollMid;

                // Get the scroll position.
                var pos = scroll.elements.list.css(scroll.margin);
                pos = parseFloat(pos) - delta;
                pos = (pos > 0) ? 0 : pos;

                // Get the maximum top position.
                var top = -scroll.listSize + scroll.scrollSize;
                pos = (pos < top) ? top : pos;

                // Set the new scroll position.
                scroll.elements.list.css(scroll.margin, pos + 'px');

                // Set the scroll position.
                pos = scroll.getHandlePos(-pos);
                scroll.scroll.slider('option', 'value', pos);
              }

              // Set timeout to try again.
              setTimeout(setScroll, 20);
            }
          }, 20);
        };

      })(this)).bind('mouseleave', (function(scroll) {

        // Return our event function.
        return function(event) {
          event.preventDefault();
          scroll.scrolling = false;
        };

      })(this));
    }
  }
};

/**
 * Refreshes the scroll list.
 */
osmplayer.scroll.prototype.refresh = function() {

  // The list size.
  if (this.options.vertical) {
    this.listSize = this.elements.list.height();
  }
  else {
    this.listSize = 0;
    jQuery.each(this.elements.list.children(), (function(scroll) {
      return function() {
        scroll.listSize += jQuery(this)[scroll.outer]();
      };
    })(this));

    // Set the list size.
    this.elements.list[this.size](this.listSize);
  }

  // Refresh the list.
  this.onResize();

  // Set the scroll position.
  if (this.scroll) {
    this.elements.list.css(this.margin, '0px');
    this.scroll.slider('option', 'value', this.getHandlePos(0));
  }
};

/**
 * Refresh all the variables that may change.
 */
osmplayer.scroll.prototype.onResize = function() {
  this.scrollSize = this.elements.scroll[this.size]();
  this.scrollMid = this.scrollSize / 2;
  this.scrollTop = (this.scrollSize - this.handleSize);
  this.ratio = (this.listSize - this.scrollSize);
  this.ratio /= (this.scrollSize - this.handleSize);
  if (this.scroll) {
    this.scroll.slider('option', 'max', this.scrollSize);
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides pager functionality.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.pager = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'pager', context, options);
};

/** Derive from minplayer.display. */
osmplayer.pager.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.pager.prototype.constructor = osmplayer.pager;

/**
 * @see minplayer.plugin#construct
 */
osmplayer.pager.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Setup the prev button.
  this.prevPage = this.elements.prevPage.click((function(pager) {
    return function(event) {
      event.preventDefault();
      pager.trigger('prevPage');
    };
  })(this));

  // Setup the next button.
  this.nextPage = this.elements.nextPage.click((function(pager) {
    return function(event) {
      event.preventDefault();
      pager.trigger('nextPage');
    };
  })(this));
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides teaser functionality.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.teaser = function(context, options) {

  /** The preview image. */
  this.preview = null;

  // Derive from display
  minplayer.display.call(this, 'teaser', context, options);
};

/** Derive from minplayer.display. */
osmplayer.teaser.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.teaser.prototype.constructor = osmplayer.teaser;

/**
 * Selects the teaser.
 *
 * @param {boolean} selected TRUE if selected, FALSE otherwise.
 */
osmplayer.teaser.prototype.select = function(selected) {
};

/**
 * Sets the node.
 *
 * @param {object} node The node object to set.
 */
osmplayer.teaser.prototype.setNode = function(node) {

  // Add this to the node info for this teaser.
  this.node = node;

  // Set the title of the teaser.
  if (this.elements.title) {
    this.elements.title.text(node.title);
  }

  // Load the thumbnail image if it exists.
  var image = osmplayer.getImage(node.mediafiles.image, 'thumbnail');
  if (image) {
    if (this.elements.image) {
      this.preview = new minplayer.image(this.elements.image);
      this.preview.load(image);
    }
  }

  // Bind when they click on this teaser.
  this.display.unbind('click').click((function(teaser) {
    return function(event) {
      event.preventDefault();
      teaser.trigger('nodeLoad', teaser.node);
    };
  })(this));
};
