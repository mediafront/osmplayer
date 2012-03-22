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
