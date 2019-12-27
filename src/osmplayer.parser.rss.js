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
    var node = {}, title = '', desc = '', img = '', media = '';

    // Get the title.
    title = item.find('title');
    if (title.length) {
      node.title = title.text();
    }

    // Get the description.
    desc = item.find('annotation');
    if (desc.length) {
      node.description = desc.text();
    }

    // Add the media files.
    node.mediafiles = {};

    // Get the image.
    img = item.find('image');
    if (img.length) {
      node.mediafiles.image = {
        image: {
          path: img.text()
        }
      };
    }

    // Get the media.
    media = item.find('location');
    if (media.length) {
      node.mediafiles.media = {
        media: {
          path: media.text()
        }
      };
    }

    // Add this node to the playlist.
    playlist.nodes.push(node);
  }
};
