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
  this.playlist = this.create('playlist', 'osmplayer');

  // Bind when the playlists loads a node.
  this.playlist.bind('nodeLoad', (function(player) {
    return function(event, data) {

      // Load this node.
      player.loadNode(data);
    };
  })(this));
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
  if (node.mediafiles) {

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

  // The play queue.
  this.queue = [];

  // The queue position.
  this.queuepos = 0;

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
 * Stores the current playlist state in the queue.
 */
osmplayer.playlist.prototype.setQueue = function() {

  // Add this item to the queue.
  this.queue.push({
    page: this.page,
    item: this.currentItem
  });

  // Store the current queue position.
  this.queuepos = this.queue.length;
};

/**
 * Loads the next item.
 */
osmplayer.playlist.prototype.next = function() {
  var item = 0, page = this.page;

  // See if we are at the front of the queue.
  if (this.queuepos >= this.queue.length) {

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

    // Load the next item in the queue.
    this.queuepos = this.queuepos + 1;
    var currentQueue = this.queue[this.queuepos];
    this.load(currentQueue.page, currentQueue.item);
  }
};

/**
 * Loads the previous item.
 */
osmplayer.playlist.prototype.prev = function() {

  // Move back into the queue.
  this.queuepos = this.queuepos - 1;
  this.queuepos = (this.queuepos < 0) ? 0 : this.queuepos;
  var currentQueue = this.queue[this.queuepos];
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
