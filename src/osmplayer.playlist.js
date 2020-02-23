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
 * Returns the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
osmplayer.playlist.prototype.defaultOptions = function(options) {
  options.vertical = true;
  options.playlist = '';
  options.pageLimit = 10;
  options.autoNext = true;
  options.shuffle = false;
  options.loop = false;
  options.hysteresis = 40;
  options.scrollSpeed = 20;
  options.scrollMode = 'auto';
  minplayer.display.prototype.defaultOptions.call(this, options);
};

/**
 * @see minplayer.plugin#construct
 */
osmplayer.playlist.prototype.construct = function() {

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
  this.scroll = null;

  // Create our orientation variable.
  this.orient = {
    pos: this.options.vertical ? 'y' : 'x',
    pagePos: this.options.vertical ? 'pageY' : 'pageX',
    offset: this.options.vertical ? 'top' : 'left',
    wrapperSize: this.options.vertical ? 'wrapperH' : 'wrapperW',
    minScroll: this.options.vertical ? 'minScrollY' : 'minScrollX',
    maxScroll: this.options.vertical ? 'maxScrollY' : 'maxScrollX',
    size: this.options.vertical ? 'height' : 'width'
  };

  // Create the pager.
  this.pager = this.create('pager', 'osmplayer');
  this.pager.ubind(this.uuid + ':nextPage', (function(playlist) {
    return function(event) {
      playlist.nextPage();
    };
  })(this));
  this.pager.ubind(this.uuid + ':prevPage', (function(playlist) {
    return function(event) {
      playlist.prevPage();
    };
  })(this));

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Load the "next" item.
  this.hasPlaylist = this.next();

  // Say that we are ready.
  this.ready();
};

/**
 * @see minplayer.plugin.onAdded
 */
osmplayer.playlist.prototype.onAdded = function(plugin) {

  // Get the media.
  if (this.options.autoNext) {

    // Get the player from this plugin.
    plugin.get('player', (function(playlist) {
      return function(player) {
        player.ubind(playlist.uuid + ':player_ended', function(event) {
          if (playlist.hasPlaylist) {
            player.options.autoplay = true;
            playlist.next();
          }
        });
      };
    })(this));
  }
};

/**
 * Wrapper around the scroll scrollTo method.
 *
 * @param {number} pos The position you would like to set the list.
 * @param {boolean} relative If this is a relative position change.
 */
osmplayer.playlist.prototype.scrollTo = function(pos, relative) {
  if (this.scroll) {
    this.scroll.options.hideScrollbar = false;
    if (this.options.vertical) {
      this.scroll.scrollTo(0, pos, 0, relative);
    }
    else {
      this.scroll.scrollTo(pos, 0, 0, relative);
    }
    this.scroll.options.hideScrollbar = true;
  }
};

/**
 * Refresh the scrollbar.
 */
osmplayer.playlist.prototype.refreshScroll = function() {

  // Make sure that our window has the addEventListener to keep IE happy.
  if (!window.addEventListener) {
    setTimeout((function(playlist) {
      return function() {
        playlist.refreshScroll.call(playlist);
      };
    })(this), 200);
    return;
  }

  // Check the size of the playlist.
  var list = this.elements.list;
  var scroll = this.elements.scroll;

  // Destroy the scroll bar first.
  if (this.scroll) {
    this.scroll.scrollTo(0, 0);
    this.scroll.destroy();
    this.scroll = null;
    this.elements.list
        .unbind('mousemove')
        .unbind('mouseenter')
        .unbind('mouseleave');
  }

  // Need to force the width of the list.
  if (!this.options.vertical) {
    var listSize = 0;
    jQuery.each(this.elements.list.children(), function() {
      listSize += jQuery(this).outerWidth();
    });
    this.elements.list.width(listSize);
  }

  // Check to see if we should add a scroll bar functionality.
  if ((list.length > 0) &&
      (scroll.length > 0) &&
      (list[this.orient.size]() > scroll[this.orient.size]())) {

    // Setup the iScroll component.
    this.scroll = new iScroll(this.elements.scroll.eq(0)[0], {
      hScroll: !this.options.vertical,
      hScrollbar: !this.options.vertical,
      vScroll: this.options.vertical,
      vScrollbar: this.options.vertical,
      hideScrollbar: (this.options.scrollMode !== 'none')
    });

    // Use autoScroll for non-touch devices.
    if ((this.options.scrollMode == 'auto') && !minplayer.hasTouch) {

      // Bind to the mouse events for autoscrolling.
      this.elements.list.bind('mousemove', (function(playlist) {
        return function(event) {
          event.preventDefault();
          var offset = playlist.display.offset()[playlist.orient.offset];
          playlist.mousePos = event[playlist.orient.pagePos];
          playlist.mousePos -= offset;
        };
      })(this)).bind('mouseenter', (function(playlist) {
        return function(event) {
          event.preventDefault();
          playlist.scrolling = true;
          var setScroll = function() {
            if (playlist.scrolling) {
              var scrollSize = playlist.scroll[playlist.orient.wrapperSize];
              var scrollMid = (scrollSize / 2);
              var delta = playlist.mousePos - scrollMid;
              if (Math.abs(delta) > playlist.options.hysteresis) {
                var hyst = playlist.options.hysteresis;
                hyst *= (delta > 0) ? -1 : 0;
                delta = (playlist.options.scrollSpeed * (delta + hyst));
                delta /= scrollMid;
                var pos = playlist.scroll[playlist.orient.pos] - delta;
                var min = playlist.scroll[playlist.orient.minScroll] || 0;
                var max = playlist.scroll[playlist.orient.maxScroll];
                if (pos >= min) {
                  playlist.scrollTo(min);
                }
                else if (pos <= max) {
                  playlist.scrollTo(max);
                }
                else {
                  playlist.scrollTo(delta, true);
                }
              }

              // Set timeout to try again.
              setTimeout(setScroll, 30);
            }
          };
          setScroll();
        };
      })(this)).bind('mouseleave', (function(playlist) {
        return function(event) {
          event.preventDefault();
          playlist.scrolling = false;
        };
      })(this));
    }

    this.scroll.refresh();
    this.scroll.scrollTo(0, 0, 200);
  }
};

/**
 * Adds a new node to the playlist.
 *
 * @param {object} node The node that you would like to add to the playlist.
 */
osmplayer.playlist.prototype.addNode = function(node) {

  // Get the current index for this node.
  var index = this.nodes.length;

  // Create the teaser object.
  var teaser = this.create('teaser', 'osmplayer', this.elements.list);

  // Set the node for this teaser.
  teaser.setNode(node);

  // Bind to when it loads.
  teaser.ubind(this.uuid + ':nodeLoad', (function(playlist) {
    return function(event, data) {
      playlist.loadItem(index);
    };
  })(this));

  // Add this to our nodes array.
  this.nodes.push(teaser);
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
    if ((((this.page + 1) * this.options.pageLimit) >= this.totalItems) ||
        (this.totalItems == playlist.nodes.length)) {
      this.pager.nextPage.hide();
    }
    else {
      this.pager.nextPage.show();
    }

    var teaser = null;
    var numNodes = playlist.nodes.length;
    this.elements.list.empty();
    this.nodes = [];

    // Iterate through all the nodes.
    for (var index = 0; index < numNodes; index++) {

      // Add this node to the playlist.
      this.addNode(playlist.nodes[index]);

      // If the index is equal to the loadIndex.
      if (loadIndex === index) {
        this.loadItem(index);
      }
    }

    // Refresh the sizes.
    this.refreshScroll();

    // Trigger that the playlist has loaded.
    this.trigger('playlistLoad', playlist);
  }

  // Show that we are no longer busy.
  if (this.elements.playlist_busy) {
    this.elements.playlist_busy.hide();
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
 *
 * @return {boolean} TRUE if loaded, FALSE if not.
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
      return this.load(page, item);
    }
    else {

      // Otherwise, increment the current item by one.
      item = (this.currentItem + 1);
      if (item >= this.nodes.length) {
        return this.load(page + 1, 0);
      }
      else {
        return this.loadItem(item);
      }
    }
  }
  else {

    // Load the next item in the playqueue.
    this.playqueuepos = this.playqueuepos + 1;
    var currentQueue = this.playqueue[this.playqueuepos];
    return this.load(currentQueue.page, currentQueue.item);
  }
};

/**
 * Loads the previous item.
 *
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.prev = function() {

  // Move back into the playqueue.
  this.playqueuepos = this.playqueuepos - 1;
  this.playqueuepos = (this.playqueuepos < 0) ? 0 : this.playqueuepos;
  var currentQueue = this.playqueue[this.playqueuepos];
  if (currentQueue) {
    return this.load(currentQueue.page, currentQueue.item);
  }
  return false;
};

/**
 * Loads a playlist node.
 *
 * @param {number} index The index of the item you would like to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
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
    return true;
  }

  return false;
};

/**
 * Loads the next page.
 *
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.nextPage = function(loadIndex) {
  return this.load(this.page + 1, loadIndex);
};

/**
 * Loads the previous page.
 *
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.prevPage = function(loadIndex) {
  return this.load(this.page - 1, loadIndex);
};

/**
 * Loads a playlist.
 *
 * @param {integer} page The page to load.
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.load = function(page, loadIndex) {

  // If the playlist and pages are the same, then no need to load.
  if ((this.playlist == this.options.playlist) && (page == this.page)) {
    return this.loadItem(loadIndex);
  }

  // Set the new playlist.
  this.playlist = this.options.playlist;

  // Return if there aren't any playlists to play.
  if (!this.playlist) {
    return false;
  }

  // Determine if we need to loop.
  var maxPages = Math.floor(this.totalItems / this.options.pageLimit);
  if (page > maxPages) {
    if (this.options.loop) {
      page = 0;
      loadIndex = 0;
    }
    else {
      return false;
    }
  }

  // Say that we are busy.
  if (this.elements.playlist_busy) {
    this.elements.playlist_busy.show();
  }

  // Normalize the page.
  page = page || 0;
  page = (page < 0) ? 0 : page;

  // Set the queue.
  this.setQueue();

  // Set the new page.
  this.page = page;

  // Hide or show the page based on if we are on the first page.
  if (this.page === 0) {
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
    return true;
  }

  // Get the highest priority parser.
  var parser = osmplayer.parser['default'];
  for (var name in osmplayer.parser) {
    if (osmplayer.parser.hasOwnProperty(name)) {
      if (osmplayer.parser[name].valid(this.playlist)) {
        if (osmplayer.parser[name].priority > parser.priority) {
          parser = osmplayer.parser[name];
        }
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
        if (playlist.elements.playlist_busy) {
          playlist.elements.playlist_busy.hide();
        }
        playlist.trigger('error', textStatus);
      };
    })(this)
  };

  // Set the data if applicable.
  var dataType = parser.getType();
  if (dataType) {
    request.dataType = dataType;
  }

  // Perform an ajax callback.
  jQuery.ajax(request);

  // Return that we did something.
  return true;
};
