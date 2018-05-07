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
  jQuery.media = jQuery.media ? jQuery.media : {};
   
  // Set up our defaults for this component.
  jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
    prefix:"",
    controllerOnly:false,
    playlistOnly:false
  });
   
  jQuery.media.templates = jQuery.extend( {}, {
    "default" : function( mediaplayer, settings ) {
      // Return the template
      return new (function( mediaplayer, settings ) {

        settings = jQuery.media.utils.getSettings(settings);
        var _this = this;

        this.player = null;
        this.titleLinks = null;
        this.nodeWidth = 0;
        this.nodeHeight = 0;
        this.dialogWidth = 0;
        this.dialogHeight = 0;
        this.controlHeight = 0;
        this.showController = true;
        this.isFireFox = (typeof document.body.style.MozBoxShadow === 'string');
        
        this.initialize = function( settings ) {
          this.nodeWidth = mediaplayer.display.width();
          this.nodeHeight = mediaplayer.display.height();
          this.dialogWidth = mediaplayer.dialog.width();
          this.dialogHeight = mediaplayer.dialog.height();
          this.controlHeight = mediaplayer.controller ? mediaplayer.controller.display.height() : 0;
          this.player = mediaplayer.node ? mediaplayer.node.player : null;
          this.titleLinks = mediaplayer.titleBar ? mediaplayer.titleBar.titleLinks : null;

          // Set the playlist height for IE.
          this.setPlaylistHeight();
        };

        this.setPlaylistHeight = function() {
          // Stupid IE hack.
          if( settings.vertical && mediaplayer.playlist && mediaplayer.playlist.scrollRegion ) {
            var pHeight = mediaplayer.playlist.display.height();
            if( pHeight ) {
              var pagerHeight = mediaplayer.playlist.pager ? mediaplayer.playlist.pager.display.height() : 0;
              mediaplayer.playlist.scrollRegion.display.height( pHeight - pagerHeight );
            }
          }
        };

        this.onResize = function() {
          this.setPlaylistHeight();
        };

        this.onMenu = function( on ) {
          if( mediaplayer.menu ) {
            if( on ) {
              mediaplayer.menu.display.show( "normal" );
            }
            else {
              mediaplayer.menu.display.hide( "normal" );
            }
          }
        };

        this.onMaximize = function( on ) {
          var position = mediaplayer.display.position();
          position = settings.vertical ? position.left : position.top;
          var newCSS = settings.vertical ? 
            on ? {width:(this.dialogWidth - position) +"px"} : {width:this.nodeWidth+"px"} :
            on ? {height:(this.dialogHeight - position) +"px"} : {height:this.nodeHeight+"px"} ;
          mediaplayer.display.animate(newCSS, 250, 'linear', function() {
            mediaplayer.onResize();
          });
        };

        /**
         * This is only needed for Firefox.         *
         */
        this.setFullScreenPos = function() {
          var offset = this.player.media.display.offset();
          var marginLeft = parseInt(this.player.media.display.css("marginLeft"),10);
          var marginTop = parseInt(this.player.media.display.css("marginTop"),10);
          this.player.media.display.css({
            marginLeft:($(document).scrollLeft() - offset.left + marginLeft) + "px",
            marginTop:($(document).scrollTop() - offset.top + marginTop) + "px",
            width:$(window).width(),
            height:$(window).height()
          });
        };

        this.onFullScreen = function( on ) {
          if( on ) {
            if( this.player ) {
              // Make sure
              $(window).bind("mousemove", function() {
                if( !_this.player.hasControls() && _this.showController ) {
                  jQuery.media.utils.showThenHide( mediaplayer.controller.display, "display", "fast", "slow" );
                }
                jQuery.media.utils.showThenHide( _this.titleLinks, "links", "fast", "slow" );
              });

              if( !this.player.hasControls() && this.showController ) {
                jQuery.media.utils.showThenHide( mediaplayer.controller.display, "display", "fast", "slow" );
                jQuery.media.utils.stopHideOnOver( mediaplayer.controller.display, "display" );
              }

              jQuery.media.utils.showThenHide( this.titleLinks, "links", "fast", "slow" );
              jQuery.media.utils.stopHideOnOver( this.titleLinks, "links" );
            }
            
            mediaplayer.dialog.addClass(settings.prefix + "mediafullscreen");
            mediaplayer.dialog.find("#" + settings.prefix + "mediamaxbutton").hide();
            mediaplayer.showNativeControls(true);

            if( this.player && this.player.media ) {

              /**
               * Firefox Hack...  Firefox has a nasty bug where it will reload flash if it
               * overflows the containing element when it its CSS properties "position" or "overflow"
               * are set ( which is needed for full screen ).  Because of this, we will just use this
               * hacked version of fullscreen mode.
               */
              if( this.isFireFox ) {
                this.setFullScreenPos();

                // Called when the window is scrolled.
                var scrollTimeout = 0;
                $(window).bind('scroll', function() {
                  clearTimeout( scrollTimeout );
                  scrollTimeout = setTimeout( function() {
                    _this.setFullScreenPos();
                  }, 100);
                });

                // Called when the window resizes.
                var resizeTimeout = 0;
                $(window).bind('resize', function() {
                  clearTimeout( resizeTimeout );
                  resizeTimeout = setTimeout( function() {
                    _this.setFullScreenPos();
                  }, 100);
                });
              }
              else {
                this.player.media.display.css({
                  position:"fixed",
                  overflow:"hidden"
                });
              }
            }
          }
          else {
            $(window).unbind("mousemove");
            jQuery.media.utils.stopHide( mediaplayer.controller.display, "display" );
            jQuery.media.utils.stopHide( this.titleLinks,"links" );
            if( this.showController ) {
              mediaplayer.controller.display.show();
            }
            if( this.titleLinks ) {
              this.titleLinks.show();
            }
            
            mediaplayer.dialog.find("#" + settings.prefix + "mediamaxbutton").show();
            mediaplayer.dialog.removeClass(settings.prefix + "mediafullscreen");
            mediaplayer.showNativeControls(false);

            if( this.player && this.player.media ) {
              if( this.isFireFox ) {
                $(window).unbind('scroll');
                $(window).unbind('resize');
                this.player.media.display.css({
                  marginLeft:"0px",
                  marginTop:"0px",
                  width:"100%",
                  height:"100%"
                });
              }
              else {
                this.player.media.display.css({
                  position:"absolute",
                  overflow:"inherit"
                });
              }
            }
          }

          mediaplayer.onResize();
        };

        this.onMenuSelect = function( link, contents, selected ) {
          if( selected ) {
            contents.show("normal");
            link.addClass(settings.prefix + 'ui-tabs-selected ' + settings.prefix + 'ui-state-active');
          }
          else {
            contents.hide("normal");
            link.removeClass(settings.prefix + 'ui-tabs-selected ' + settings.prefix + 'ui-state-active');
          }
        };

        this.onLinkOver = function( link ) {
          // Add the hover class.
          link.addClass(settings.prefix + "ui-state-hover");
        };

        this.onLinkOut = function( link ) {
          // Remove the hover class.
          link.removeClass(settings.prefix + "ui-state-hover");
        };

        this.onLinkSelect = function( link, select ) {
          if( select ) {
            $(link.display).addClass(settings.prefix + "active");
          }
          else {
            $(link.display).removeClass(settings.prefix + "active");
          }
        };

        this.onTeaserOver = function( teaser ) {
          // Add the hover class.
          $(teaser.node.display).addClass(settings.prefix + "ui-state-hover");
        };

        this.onTeaserOut = function( teaser ) {
          // Remove the hover class.
          $(teaser.node.display).removeClass(settings.prefix + "ui-state-hover");
        };

        this.onTeaserSelect = function( teaser, selected ) {
          if( selected ) {
            $(teaser.node.display).addClass(settings.prefix + "ui-state-hover");
          }
          else {
            $(teaser.node.display).removeClass(settings.prefix + "ui-state-hover");
          }
        };

        this.onTeaserActivate = function( teaser, active ) {
          if( active ) {
            $(teaser.node.display).addClass(settings.prefix + "ui-state-active");
          }
          else {
            $(teaser.node.display).removeClass(settings.prefix + "ui-state-active");
          }
        };

        this.onMediaUpdate = function( data ) {
          if( mediaplayer.fullScreen && data.type == "playerready" ) {
            mediaplayer.showNativeControls(true);
          }

          if( mediaplayer.controller && mediaplayer.node ) {
            if( data.type == "reset" ) {
              this.showController = true;
              mediaplayer.controller.display.show();
              mediaplayer.node.display.css("bottom", this.controlHeight + "px");
            }
            else if( data.type == "nomedia" ) {
              this.showController = false;
              mediaplayer.controller.display.hide();
              mediaplayer.node.display.css("bottom", "0px");
            }
          }
        };

        /**
         * Template function used to update a vote value.
         *
         * @param - The voter object.
         * @param - The current vote value.
         * @param - If this is a hover update.
         */
        this.updateVote = function( voter, voteValue, hover ) {
          var lastValue = 0;

          // Iterate through our votes.
          var i = voter.votes.length;
          while(i--) {
            var vote = voter.votes[i];

            // Remove all states ( empty star ).
            vote.display.removeClass( hover ? (settings.prefix + "ui-state-highlight") : (settings.prefix + "ui-state-active") );
            vote.display.removeClass( hover ? "" : (settings.prefix + "ui-state-active") );

            // See if we need to add a full state...
            if( voteValue >= vote.vote ) {
              // Add the full state ( full star )...
              vote.display.addClass( hover ? (settings.prefix + "ui-state-highlight") : (settings.prefix + "ui-state-active") );
            }

            // Store the this value for the next iteration.
            lastValue = vote.vote;
          }
        };

        this.formatTime = false;
      })( mediaplayer, settings );
    }
  }, jQuery.media.templates );
})(jQuery);