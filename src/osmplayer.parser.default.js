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
