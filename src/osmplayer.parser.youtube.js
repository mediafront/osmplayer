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
    return (feed.search(/^http(s)?\:\/\/www\.googleapis\.com\/youtube/i) === 0);
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'jsonp';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    if(typeof(ENV) == "undefined" || typeof(ENV.youtubeApiKey) == 'undefined') throw 'YouTube API V3 requires authentication, please specify your API key in ENV.youtubeApiKey variable.';
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    //feed += '?start-index=' + (start + 1); //TODO pagination
    feed += '&maxResults=' + (numItems);
    feed += '&part=snippet';
    feed += '&key=' + ENV.youtubeApiKey;
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: data.pageInfo.resultsPerPage,
      nodes: []
    };

    // Iterate through the items and parse it.
    var node = null;
    for (var index in data.items) {
      if (data.items.hasOwnProperty(index)) {
        node = minplayer.players.youtube.parseNode(data.items[index]);
        playlist.nodes.push(node);
      }
    }

    return playlist;
  }
};
