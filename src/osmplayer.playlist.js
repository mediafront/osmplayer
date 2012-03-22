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
    shuffle: false
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
  this.currentItem = 0;

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
  this.get('media', function(media) {
    media.bind('ended', (function(playlist) {
      return function(event) {
        playlist.next();
      };
    })(this));
  });

  // Load the playlist.
  this.load(0, 0);
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

  // If the playlist is an object, then go ahead and set it.
  if (typeof this.playlist == 'object') {
    this.set(this.playlist);
    this.playlist = this.playlist.endpoint;
    return;
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
        if (playlist.scroll.elements.playlist_busy) {
          playlist.scroll.elements.playlist_busy.hide();
        }
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
