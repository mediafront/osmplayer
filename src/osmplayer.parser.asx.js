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
