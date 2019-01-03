/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function($) {
  jQuery.media = jQuery.extend( {}, {
    parser : function( settings ) {
      // Return a new parser object.
      return new (function( settings ) {
        var _this = this;
        this.onLoaded = null;

        // Parse the contents from a file.
        this.parseFile = function( file, onLoaded ) {
          this.onLoaded = onLoaded;
          jQuery.ajax({
            type: "GET",
            url:file,
            dataType:"xml",
            success: function(xml) {
              _this.parseXML( xml );
            },
            error: function( XMLHttpRequest, textStatus, errorThrown ) {
              if( window.console && console.log ) {
                console.log( "Error: " + textStatus );
              }
            }
          });
        };

        // Parse an xml string.
        this.parseXML = function( xml ) {
          // Try to parse a playlist in any format...
          var playlist = this.parseXSPF( xml );
          if( playlist.total_rows === 0 ) {
            playlist = this.parseASX( xml );
          }
          if( playlist.total_rows === 0 ) {
            playlist = this.parseRSS( xml );
          }
          if( this.onLoaded && playlist.total_rows ) {
            this.onLoaded( playlist );
          }
          return playlist;
        };

        // Parse XSPF contents.
        this.parseXSPF = function( xml ) {
          var playlist = {
            total_rows:0,
            nodes:[]
          };
          var trackList = jQuery("playlist trackList track", xml);
          if( trackList.length > 0 ) {
            trackList.each( function(index) {
              playlist.total_rows++;
              playlist.nodes.push({
                nid:playlist.total_rows,
                title: $(this).find("title").text(),
                description: $(this).find("annotation").text(),
                mediafiles: {
                  image:{
                    "image":{
                      path:$(this).find("image").text()
                    }
                  },
                  media:{
                    "media":{
                      path:$(this).find("location").text()
                    }
                  }
                }
              });
            });
          }
          return playlist;
        };

        // Parse ASX contents.
        this.parseASX = function( xml ) {
          var playlist = {
            total_rows:0,
            nodes:[]
          };
          var trackList = jQuery("asx entry", xml);
          if( trackList.length > 0 ) {
            trackList.each( function(index) {
              playlist.total_rows++;
              playlist.nodes.push({
                nid:playlist.total_rows,
                title: $(this).find("title").text(),
                mediafiles: {
                  image:{
                    "image":{
                      path:$(this).find("image").text()
                    }
                  },
                  media:{
                    "media":{
                      path:$(this).find("location").text()
                    }
                  }
                }
              });
            });
          }
          return playlist;
        };

        // Parse RSS contents.
        this.parseRSS = function( xml ) {
          var playlist = {
            total_rows:0,
            nodes:[]
          };
          var channel = jQuery("rss channel", xml);
          if( channel.length > 0 ) {
            var youTube = (channel.find("generator").text() == "YouTube data API");

            // Iterate through all the items.
            channel.find("item").each( function(index) {
              playlist.total_rows++;
              var item = {};
              item = youTube ? _this.parseYouTubeItem( $(this) ) : _this.parseRSSItem( $(this) );
              item.nid = playlist.total_rows;
              playlist.nodes.push(item);
            });
          }
          return playlist;
        };

        // Parse a default RSS Item.
        this.parseRSSItem = function( item ) {
          return {
            title: item.find("title").text(),
            mediafiles: {
              image:{
                "image":{
                  path:item.find("image").text()
                }
              },
              media:{
                "media":{
                  path:item.find("location").text()
                }
              }
            }
          };
        };

        // Parse a YouTube item.
        this.parseYouTubeItem = function( item ) {
          var description = item.find("description").text();
          var media = item.find("link").text().replace("&feature=youtube_gdata", "");
          return {
            title: item.find("title").text(),
            mediafiles: {
              image:{
                "image":{
                  path:jQuery("img", description).eq(0).attr("src")
                }
              },
              media:{
                "media":{
                  path:media,
                  player:"youtube"
                }
              }
            }
          };
        };
      })( settings );
    }
  }, jQuery.media );
})(jQuery);