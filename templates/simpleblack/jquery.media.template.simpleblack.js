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
 *
 *  This file serves as a starting point for new template designs.  Below you will
 *  see a listing of all media player "hooks" that can be implemented by the
 *  template to customize the functionality of this template.
 */
(function($) {
   jQuery.media = jQuery.media ? jQuery.media : {};

   // Set up our defaults for this component.
   jQuery.media.defaults = jQuery.extend( jQuery.media.defaults, {
      /**
       * You can use this to define some parameters for this template.
       * Each parameter will look like the following...
       *
       *   param1:"defaultValue",
       *   param2:"defaultValue"
       **/
   });

   jQuery.media.templates = jQuery.extend( {}, {

      /**
       * When you create a new template, you will need to change the "default"
       * to the name of your new template.  For example, if my template is called
       * "custom", then I will need to change the "default" below to say "custom".
       * It is also important to note that the name of this file should also represet
       * the name of your template.  So, for the "custom" template, this file should
       * be called jquery.media.template.custom.js.
       */
      "simpleblack" : function( mediaplayer, settings ) {
         return new (function( mediaplayer, settings ) {

            // Setup the settings object so that it can be used within this template.
            settings = jQuery.media.utils.getSettings(settings);

            // So that we can access this from any scope.
            var _this = this;

            this.controlTimer = null; 
            this.prevState = null;
            
            this.mediaDisplay = null;
            this.controlBar = null;   
            this.player = null;        
            this.logo = null;
            
            this.playerWidth = 0;
            this.playerHeight = 0;            
            this.windowWidth = 0;
            this.windowHeight = 0;             
            this.nodeWidth = 0;
            this.nodeHeight = 0;
            this.menuWidth = 0;
            this.menuHeight = 0; 
            this.controlHeight = 0;                        
            this.scrollTop = 0;
            this.scrollLeft = 0;            

            // Called when the window resizes.
            $(window).bind('resize', function() {
               var newWidth = $(window).width();
               var newHeight = $(window).height();
               var deltaX = newWidth - _this.windowWidth;
               var deltaY = newHeight - _this.windowHeight;
               _this.windowWidth = newWidth;
               _this.windowHeight = newHeight;
               if( mediaplayer && mediaplayer.fullScreen ) {
                  _this.onFullScreenResize( deltaX, deltaY );
               }
            }); 

            // Called when the window is scrolled.
            $(window).bind('scroll', function() {
               if( mediaplayer && mediaplayer.fullScreen ) {
                  _this.onFullScreenScroll();
               }              
            });

            /**
             * Called just before the mediaplayer is ready to show this template to the user.
             * This function is used to initialize the template given the current state of
             * settings passed to the player.  You can use this function to initialize variables,
             * change width's and height's of elements based on certain parameters passed to the
             * media player.
             *
             * @param - The settings object.
             */
            this.initialize = function( settings ) {
               
               // Get the player elements.
               this.mediaDisplay = mediaplayer.node ? (mediaplayer.node.player ? mediaplayer.node.player.media : null) : null; 
               this.controlBar = mediaplayer.node ? (mediaplayer.node.player ? mediaplayer.node.player.controller : null) : null;
               this.player = mediaplayer.node ? mediaplayer.node.player : null;
               this.logo = this.logo = this.player ? this.player.logo : null; 

               // Get the position of the player within the dialog.
               var playerPosition = mediaplayer.display.position();

               // Get temporary variables of the node width and height...
               this.nodeWidth = mediaplayer.node ? mediaplayer.node.width : 0;
               this.nodeHeight = mediaplayer.node ? mediaplayer.node.height : 0;
               this.menuWidth = mediaplayer.menu ? mediaplayer.menu.display.width() : 0;
               this.menuHeight = mediaplayer.menu ? mediaplayer.menu.display.height() : 0;  
               this.controlHeight = this.controlBar ? this.controlBar.display.height() : 0;                              
               this.windowWidth = $(window).width();
               this.windowHeight = $(window).height();

               // Base the player width and height off the dialog.
               if( mediaplayer.dialog ) {
                  this.playerWidth = mediaplayer.dialog.width();
                  this.playerHeight = mediaplayer.dialog.height() - playerPosition.top; 
               }

               // Show the control bar, and then hide it after 5 seconds of inactivity.
               this.showControlBar();
               
               // Setup the volume bar behavior.
               if( this.controlBar && this.controlBar.volumeBar && this.controlBar.mute ) {
                  this.controlBar.mute.display.bind("mouseenter", function() {
                     _this.controlBar.volumeBar.display.show("slow");
                  });
               }
            };

            // Resize the node.
            this.resizeNode = function( deltaX, deltaY ) {
               // Increment our node width and height's
               this.nodeWidth += deltaX;  
               this.nodeHeight += deltaY;                           

               if( mediaplayer.node ) {
                  // Resize the node.
                  mediaplayer.node.onResize( deltaX, deltaY ); 
               }
               
               // Resize our node overlays.
               this.resizeOverlays();
            };

            // Resize our node overlays.
            this.resizeOverlays = function() {
               // Just center the menu.
               this.setCSS({
                  menu : {
                     marginTop:((this.nodeHeight - this.menuHeight) / 2) + "px",
                     marginLeft:((this.nodeWidth - this.menuWidth) / 2) + "px"                     
                  }
               });               
            };

            // Perform bulk css operations.
            this.setCSS = function( newCSS ) {
               if( newCSS.controlBar && this.controlBar ) {
                  this.controlBar.display.css( newCSS.controlBar ); 
               }
               if( newCSS.display && this.mediaDisplay ) {
                  this.mediaDisplay.display.css( newCSS.display );
               } 
               if( newCSS.busy && this.player && this.player.busy ) {
                  this.player.busy.css( newCSS.busy );
               }
               if( newCSS.play && this.player && this.player.play ) {
                  this.player.play.css( newCSS.play );   
               }
               if( newCSS.preview && this.player && this.player.preview ) {
                  this.player.preview.display.css( newCSS.preview );
               }
               if( newCSS.menu && mediaplayer.menu ) {
                  mediaplayer.menu.display.css( newCSS.menu );   
               }
               if( newCSS.logo && this.logo ) {
                  this.logo.display.css( newCSS.logo );   
               }
            };

            /**
             * When we show our control bar, we want to add a timeout so that it will disappear if they have not
             * moved the mouse over the player in a while.
             */
            this.showControlBar = function() {
               if( this.controlBar ) {
                  this.controlBar.display.show();
                  this.logo.display.hide();
                  clearTimeout( this.controlTimer );
                  this.controlTimer = setTimeout( function() {
                     _this.controlBar.display.hide("slow");
                     _this.logo.display.show("slow");
                  }, 5000);
               }
            };

            /**
             * Add a timer for the control bar to hide itself after a certain time period has
             * expired
             */
            mediaplayer.display.bind("mousemove", function() {
               _this.showControlBar();
            }); 

            /**
             * Returns our template settings overrides.  This is used to force a particular
             * setting to be a certain value if the user does not provide that parameter.
             *
             * @return - An associative array of our settings.  We can use this to override any
             *           default settings for the player as well as default ids.
             */
            this.getSettings = function() {
               return {
                  volumeVertical:true
               };
            };

            /**
             * Called when the user presses the menu button.
             *
             * @param - If the menu should be on (true) or off (false).
             */
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

            /**
             * Called when the user presses the maximize button.
             *
             * @param - If the player should be maximized (true) or not (false).
             */
            this.onMaximize = function( on ) {
            };

            // We want to change the size of the full screen player when resized.
            this.onFullScreenResize = function( deltaX, deltaY ) {
               // Resize the node...
               this.resizeNode( (this.windowWidth - this.nodeWidth), (this.windowHeight - this.nodeHeight) ); 
               
               // Get the new position of these elements.
               var controlCSS = this.controlBar ? {
                  marginTop:parseInt(this.controlBar.display.css("marginTop"), 10) + deltaY,
                  marginLeft:parseInt(this.controlBar.display.css("marginLeft"), 10) + (deltaX/2)
               } : null;
               var menuCSS = mediaplayer.menu ? {
                  marginTop:parseInt(mediaplayer.menu.display.css("marginTop"), 10) + (deltaY/2),
                  marginLeft:parseInt(mediaplayer.menu.display.css("marginLeft"), 10) + (deltaX/2)
               } : null;
               
               // Set the css of these elements.
               this.setCSS({                      
                  controlBar : controlCSS,
                  menu : menuCSS
               });               
            };

            // We want the player to track their scroll on full screen.
            this.onFullScreenScroll = function() {
               // Now we can set the postion of the elements.
               var newScrollTop = $(window).scrollTop() - 1;
               var newScrollLeft = $(window).scrollLeft() - 1; 
               
               // Determine the change in scroll.
               var deltaX = newScrollLeft - this.scrollLeft;
               var deltaY = newScrollTop - this.scrollTop;
               
               this.scrollTop = newScrollTop;
               this.scrollleft = newScrollLeft;
               
               // Find the new position of the full screen elements.
               var displayCSS = this.mediaDisplay ? {
                  marginTop:parseInt(this.mediaDisplay.display.css("marginTop"), 10) + deltaY,
                  marginLeft:parseInt(this.mediaDisplay.display.css("marginLeft"), 10) + deltaX
               } : null;
               
               var controlCSS = this.controlBar ? {
                  marginTop:parseInt(this.controlBar.display.css("marginTop"), 10) + deltaY,
                  marginLeft:parseInt(this.controlBar.display.css("marginLeft"), 10) + deltaX
               } : null;
               
               var menuCSS = mediaplayer.menu ? {
                  marginTop:parseInt(mediaplayer.menu.display.css("marginTop"), 10) + deltaY,
                  marginLeft:parseInt(mediaplayer.menu.display.css("marginLeft"), 10) + deltaX                  
               } : null;   
               
               var logoCSS = this.logo ? {
                  marginTop:parseInt(this.logo.display.css("marginTop"), 10) + deltaY,
                  marginLeft:parseInt(this.logo.display.css("marginLeft"), 10) + deltaX                  
               } : null;               
               
               // Set the css of these elements.
               this.setCSS({                      
                  display : displayCSS,
                  controlBar : controlCSS,
                  menu : menuCSS,
                  busy : displayCSS,
                  play : displayCSS,
                  logo : logoCSS
               });
            };

            /**
             * Called when the user presses the fullscreen button.
             *
             * @param - If the player is in fullscreen (true) or normal mode (false).
             */
            this.onFullScreen = function( on ) {
               if( on ) {
                  // Store the current display settings..
                  var displayCSS = this.mediaDisplay ? {
                     marginTop:this.mediaDisplay.display.css("marginTop"),
                     marginLeft:this.mediaDisplay.display.css("marginLeft")
                  } : null;
                  var controlCSS = this.controlBar ? {
                     position:this.controlBar.display.css("position"),
                     marginTop:this.controlBar.display.css("marginTop"),
                     marginLeft:this.controlBar.display.css("marginLeft")
                  } : null;
                  var menuCSS = mediaplayer.menu ? {
                     marginTop:mediaplayer.menu.display.css("marginTop"),
                     marginLeft:mediaplayer.menu.display.css("marginLeft")
                  } : null;
                  var busyCSS = (this.player && this.player.busy) ? {
                     marginTop:this.player.busy.css("marginTop"),
                     marginLeft:this.player.busy.css("marginLeft")
                  } : null;
                  var playCSS = (this.player && this.player.play) ? {
                     marginTop:this.player.play.css("marginTop"),
                     marginLeft:this.player.play.css("marginLeft")
                  } : null;
                  var previewCSS = (this.player && this.player.preview) ? {
                     marginTop:this.player.preview.display.css("marginTop"),
                     marginLeft:this.player.preview.display.css("marginLeft")
                  } : null;

                  // Store the previous state of our elements.
                  this.prevState = {
                     display : displayCSS,
                     controlBar : controlCSS,
                     menu : menuCSS,
                     busy : busyCSS,
                     play : playCSS,
                     preview : previewCSS,
                     nodeWidth:this.nodeWidth,
                     nodeHeight:this.nodeHeight
                  };

                  // Show the players controls.
                  if( this.player ) {
                     this.player.showPlayerController(true);
                  }  

                  // Now we can set the postion of the elements.
                  this.scrollTop = $(window).scrollTop() - 1;
                  this.scrollLeft = $(window).scrollLeft() - 1;

                  // Get the new css for the display...
                  if( this.mediaDisplay ) {
                     var displayOffset = this.mediaDisplay.display.offset();
                     displayCSS = {
                        marginTop:(this.scrollTop - displayOffset.top),
                        marginLeft:(this.scrollLeft - displayOffset.left)
                     };
                  }

                  // Get the new css for the controlBar...
                  if( this.controlBar ) {
                     var controlOffset = this.controlBar.display.offset();
                     controlCSS = {
                        marginTop:(this.scrollTop - controlOffset.top + this.nodeHeight) + (0.95*(this.windowHeight - this.controlHeight)),
                        marginLeft:(this.scrollLeft - controlOffset.left) + ((this.windowWidth - this.nodeWidth) / 2)
                     };
                  }

                  // Position our elements...
                  this.setCSS({
                     display : displayCSS,
                     controlBar : controlCSS,
                     busy : displayCSS,
                     play : displayCSS,
                     preview : displayCSS
                  }, true );

                  // Now resize the node.
                  this.onFullScreenResize( 0, 0 );

                  // The menu is special since it is a centered, absolute positioned element.
                  if( mediaplayer.menu ) {
                     var menuOffset = mediaplayer.menu.display.offset();
                     mediaplayer.menu.display.css({
                        marginTop:(displayCSS.marginTop + (this.scrollTop - menuOffset.top) + ((this.windowHeight - this.menuHeight) / 2)),
                        marginLeft:(displayCSS.marginLeft + (this.scrollLeft - menuOffset.left) + ((this.windowWidth - this.menuWidth) / 2))
                     });
                  }
               }
               else {

                  // Hide the players controls, and show the HTML controls.
                  if( this.player ) {
                     this.player.showPlayerController(false);
                  }

                  // Now set the css to the previous state.
                  this.setCSS( this.prevState );

                  // Resize the node back the way it was.
                  this.resizeNode( (this.prevState.nodeWidth - this.windowWidth), (this.prevState.nodeHeight - this.windowHeight) );
               }
            };

            /**
             * Allows the template to handle media events.
             *
             * @param - The media event.
             *             event.type - The event type.
             *             event.data - The data passed from this event.
             */
            this.onMediaUpdate = function( event ) {
            };

            /**
             * Allows the template to handle control bar events.
             *
             * @param - The control event.
             *             event.type - The event type.
             *             event.data - The data passed from this event.
             */
            this.onControlUpdate = function( event ) {
            };

            /**
             * Called when the player resizes.
             *
             * @param - The change in X size.
             * @param - The change in Y size.
             */
            this.onResize = function( deltaX, deltaY ) {
               this.playerWidth += deltaX;
               this.playerHeight += deltaY;   
               this.resizeNode( deltaX, 0 );                
            };

            /**
             * Sets a given field within a node.
             *
             * @param - The arguments passed to this function.
             *    args.node - The node information for this node.
             *    args.field - The field object for this field.
             *    args.fieldType - The type of field that we are dealing with.
             *    args.fieldName - The name of this field.
             *
             * @return - TRUE on Success
             */
            this.setField = function( args ) {
               return true;
            };

            /**
             * Allows the template to do something custom when the node has finished loading.
             *
             * @param - The node object.
             */
            this.onNodeLoad = function( node ) {
            };

            /**
             * Allows the template to do something custom when the playlist has finished loading.
             *
             * @param - The playlist object
             */
            this.onPlaylistLoad = function( playlist ) {
            };

            /**
             * Called when a menu item link is hovered over.
             *
             * @param - The link jQuery object
             */
            this.onMenuOver = function( link ) {
            };

            /**
             * Called when a menu item link is hovered out.
             *
             * @param - The link jQuery object
             */
            this.onMenuOut = function( link ) {
            };

            /**
             * Selects or Deselects a menu item.
             *
             * @param - The link jQuery object
             */
            this.onMenuSelect = function( link, contents, selected ) {
               if( selected ) {
                  contents.show("normal");
                  link.addClass('active');
               }
               else {
                  contents.hide("normal");
                  link.removeClass('active');
               }
            };

            /**
             * Called when the link is hovered over.
             *
             * @param - The link jQuery object.
             *
             * @return - none
             */
            this.onLinkOver = function( link ) {
            };

            /**
             * Called when the mouse moves out of the link.
             *
             * @param - The link jQuery object.
             *
             * @return - none
             */
            this.onLinkOut = function( link ) {
            };

            /**
             * Called when the user selects a link.
             *
             * @param - The link jQuery object.
             * @param - Boolean to see if the link is selected or not.
             *
             * @return - none
             */
            this.onLinkSelect = function( link, select ) {
            };

             /**
             * Called when the teaser has loaded..
             *
             * @param - The teaser object passed to this function.
             *    teaser.node - The teaser node object.
             *    teaser.index - The index in the playlist array.
             *
             * @return - none
             */
            this.onTeaserLoad = function( teaser ) {
            };

            /**
             * Called when the teaser is hovered over.
             *
             * @param - The teaser object passed to this function.
             *    teaser.node - The teaser node object.
             *    teaser.index - The index in the playlist array.
             *
             * @return - none
             */
            this.onTeaserOver = function( teaser ) {
            };

            /**
             * Called when the mouse moves out of the teaser.
             *
             * @param - The teaser object passed to this function.
             *    teaser.node - The teaser node object.
             *    teaser.index - The index in the playlist array.
             *
             * @return - none
             */
            this.onTeaserOut = function( teaser ) {
            };

            /**
             * Called when a teaser has been selected.
             *
             * @param - The teaser object passed to this function.
             *    teaser.node - The teaser node object.
             *    teaser.index - The index in the playlist array.
             *
             * @param - Boolean to determine if the teaser is selected or not.
             *
             * @return - none
             */
            this.onTeaserSelect = function( teaser, selected ) {
            };

            /**
             * Called when a teaser has been activated.
             *
             * @param - The teaser object passed to this function.
             *    teaser.node - The teaser node object.
             *    teaser.index - The index in the playlist array.
             *
             * @param - Boolean to determine if the teaser is active or not.
             *
             * @return - none
             */
            this.onTeaserActivate = function( teaser, active ) {
            };

            /**
             * Template function used to update a vote value.
             *
             * @param - The voter object.
             * @param - The current vote value.
             * @param - If this is a hover update.
             */
            this.updateVote = function( voter, voteValue, hover ) {
            };

            /**
             * This function is currently stubbed out.
             * You can implement it and hook into the time display by
             * reassigning this as follows...
             *
             *  this.formatTime = function( time ) {
             *  }
             *
             *  You can see the default implementation of this function
             *  by opening js/source/jquery.media.control.js on the line
             *  after it says this.formatTime = ...
             */
            this.formatTime = false;
         })( mediaplayer, settings );
      }
   }, jQuery.media.templates );
})(jQuery);
