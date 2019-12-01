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
    var item = null, node = null;
    for (var index in data.items) {
      if (data.items.hasOwnProperty(index)) {
        item = data.items[index];
        node = (typeof item.video !== 'undefined') ? item.video : item;
        playlist.nodes.push({
          title: node.title,
          description: node.description,
          mediafiles: {
            image: {
              'thumbnail': {
                path: node.thumbnail.sqDefault
              },
              'image': {
                path: node.thumbnail.hqDefault
              }
            },
            media: {
              'media': {
                player: 'youtube',
                id: node.id
              }
            }
          }
        });
      }
    }

    return playlist;
  }
};
