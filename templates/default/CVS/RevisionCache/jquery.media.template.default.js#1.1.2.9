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
      controllerOnly:false
   });   
   
   jQuery.media.templates = jQuery.extend( {}, {
      "default" : function( mediaplayer, settings ) {
         // Return the template
         return new (function( mediaplayer, settings ) {
            settings = jQuery.media.utils.getSettings(settings);
            
            // So that we can access this from any scope.
            var _this = this;
            
            // Cache all of the sizes that we care about.
            this.windowWidth = 0;
            this.windowHeight = 0;            
            this.playerWidth = 0;
            this.playerHeight = 0;            
            this.nodeWidth = 0;
            this.nodeHeight = 0;
            this.playlistWidth = 0;
            this.playlistHeight = 0;
            this.menuWidth = 0;
            this.menuHeight = 0;   
            this.controlHeight = 0; 
            this.pagerHeight = 0;            
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
            
            // The media display.
            this.mediaDisplay = null;
            
            // The logo.
            this.logo = null;
            
            // The control bar.
            this.controlBar = null;
            
            // The playlist pager.
            this.pager = null;
            
            // The media player (minplayer).
            this.player = null;
            
            // The title bar links.
            this.titleLinks = null;
           
            // The previous css state for fullscreen mode.
            this.prevState = {};
            
            // The mouse timeout for full screen mode.
            this.mouseTimeout = null;
            
            // Store if the playlist is shown or not.
            this.playlistShown = true;
            
            /**
             * Initialize our template.
             *
             * @param - The settings object.
             */          
            this.initialize = function( settings ) {  
               // Here we want to basically cache a lot of values that will be used a lot in this template.
               // By caching these values, we will speed up the execution.
               
               // A spacer used often.
               var spacer = 2;
               
               // Get all of the objects that we care about and cache them.
               this.mediaDisplay = mediaplayer.node ? (mediaplayer.node.player ? mediaplayer.node.player.media : null) : null; 
               this.controlBar = mediaplayer.node ? (mediaplayer.node.player ? mediaplayer.node.player.controller : null) : null;
               this.titleLinks = mediaplayer.titleBar ? mediaplayer.titleBar.titleLinks : null;               
               this.pager = mediaplayer.playlist ? mediaplayer.playlist.pager : null; 
               this.player = mediaplayer.node ? mediaplayer.node.player : null;
               this.logo = this.player ? this.player.logo : null;  
                
               // Get the position of the player within the dialog.
               var playerPosition = mediaplayer.display.position();
               
               // Now get all the width and height's that we care about and cache them.               
               this.pagerHeight = this.pager ? this.pager.display.height() : 0;
               this.controlHeight = this.controlBar ? this.controlBar.display.height() : 0;  
               this.menuWidth = mediaplayer.menu ? mediaplayer.menu.display.width() : 0;
               this.menuHeight = mediaplayer.menu ? mediaplayer.menu.display.height() : 0;
               this.windowWidth = $(window).width();
               this.windowHeight = $(window).height();
               
               // Base the player width and height off the dialog.
               if( mediaplayer.dialog ) {
                  this.playerWidth = mediaplayer.dialog.width();
                  this.playerHeight = mediaplayer.dialog.height() - playerPosition.top; 
               }                              
               
               // Get temporary variables of the playlist width and height...
               this.playlistWidth = mediaplayer.playlist ? mediaplayer.playlist.width : 0;
               this.playlistHeight = mediaplayer.playlist ? mediaplayer.playlist.height : 0;
               var newWidth = settings.vertical ? this.playlistWidth : this.playerWidth;
               var newHeight = settings.vertical ? this.playerHeight : this.playlistHeight;

               // Because the pager is abosolute, we need to compensate for it.
               newHeight -= this.pagerHeight;
               
               // Now set the playlist size by resizing it from nothing...
               this.resizePlaylist( newWidth - this.playlistWidth, newHeight - this.playlistHeight );               
               
               // Get temporary variables of the node width and height...
               this.nodeWidth = mediaplayer.node ? mediaplayer.node.width : 0;
               this.nodeHeight = mediaplayer.node ? mediaplayer.node.height : 0;
               newWidth = settings.vertical ? (this.playerWidth - this.playlistWidth - 1) : (this.playerWidth);
               newHeight = settings.vertical ? this.playerHeight : (this.playerHeight - this.playlistHeight - this.pagerHeight - this.controlHeight - 2*spacer);
               
               // Because the controlBar is position absolute, we need to compensate for the height.
               newHeight -= this.controlHeight;               
               
               // Make sure we resize the control bar later.
               if( this.controlBar ) {
                  this.controlBar.allowResize = false;   
               }
               
               // Now set the node size by resizing it from nothing...
               this.resizeNode( newWidth - this.nodeWidth, newHeight - this.nodeHeight );             
               
               // Set the control bar size and position.
               if( this.controlBar ) {      
                  this.controlBar.allowResize = true; 
                  this.controlBar.onResize(this.nodeWidth - this.controlBar.display.width(), 0);        
                  this.controlBar.display.css({marginTop:(this.nodeHeight+1), width:this.nodeWidth});
               }               
               
               // They want a horizontal playlist.  Make the necessary changes.
               if( !settings.disablePlaylist && mediaplayer.playlist && !settings.vertical ) {
                  var scrollRegion = mediaplayer.playlist.scrollRegion;
                  var teaserHeight = scrollRegion.elementHeight;
                  this.playlistHeight += 2*(this.pagerHeight + spacer);
                  mediaplayer.playlist.scrollRegion.scrollWrapper.css({"float":"left", "width":this.playerWidth});
                  mediaplayer.playlist.display.css({"float":"left", "width":this.playerWidth});
                  scrollRegion.display.css({"width":this.playerWidth});
                  scrollRegion.scrollWrapper.css({"width":this.playerWidth});
                  if( mediaplayer.node ) {
                     mediaplayer.playlist.display.css({marginTop:2*spacer+this.nodeHeight+this.controlHeight});
                     mediaplayer.node.display.css({marginRight:0});
                  }
               }                
               
               // If there is not playlist, get rid of right margin, and resize the controlbar.
               if( mediaplayer.node && !mediaplayer.playlist ) {
                  mediaplayer.node.display.css({marginRight:0});
                  if( this.controlBar ) {
                     this.controlBar.onResize(this.playerWidth - this.nodeWidth, 0);   
                  }
               }               
               
               // If there is no voter, then we need to decrease the right control sections size.
               var voterWidth = mediaplayer.node ? mediaplayer.node.display.find("#" + settings.prefix + "medianodevoter").width() : null;
               if( this.controlBar && !voterWidth ) {
                  var controlRight = this.controlBar.display.find("#" + settings.prefix + "mediacontrolright");
                  var controlRightWidth = controlRight.width();
                  var newWidth = 0;
                  controlRight.children().each( function() {
                     newWidth += $(this).outerWidth(true);   
                  });
                  controlRight.css("width", newWidth); 
                  this.controlBar.display.find("#" + settings.prefix + "mediacontrolcenter").css("marginRight", newWidth);
                  this.controlBar.onResize( (controlRightWidth - newWidth), 0 );                  
               }                
               
               // If there is no node, then resize the dialog...
               if( !mediaplayer.node ) {
                  if( settings.vertical ) {
                     mediaplayer.dialog.css( "width", this.playlistWidth );
                  }
                  else {
                     mediaplayer.dialog.css( "height", playerPosition.top + this.playlistHeight - 2*spacer );
                  }
               }
               
               // See if we only have a control bar.
               if( this.controlBar && settings.controllerOnly ) {
                  this.mediaDisplay.display.css({position:"absolute", zIndex:1000, marginLeft:-100000});
                  mediaplayer.dialog.css({height:(this.controlHeight + playerPosition.top)});
                  this.controlBar.display.css({marginTop:0});
                  this.controlBar.display.removeClass(settings.prefix + 'ui-corner-bottom');
                  this.controlBar.display.addClass(settings.prefix + 'ui-corner-all');
               }               
               
               // If they wish to not show the playlist by default.
               if( mediaplayer.playlist && mediaplayer.node && !settings.showPlaylist ) {
                  // Hide the playlist
                  this.showPlaylist(false);
                  
                  // Set these so that it doesn't mess up when they minimize...
                  mediaplayer.playlist.pager.display.hide();
                  mediaplayer.playlist.busy.hide();
                  mediaplayer.playlist.display.css("width", "0px");
               }
               
               // Setup an event where if they click on the media display, it will show the controls.
               if( this.mediaDisplay ) {
                  this.mediaDisplay.display.bind("click", function() {
                     if( mediaplayer.fullScreen ) {
                        _this.onFullScreenMouse();
                     }
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
            
            // Resize the playlist.
            this.resizePlaylist = function( deltaX, deltaY ) {
               // Increment our width and height's.
               this.playlistWidth += deltaX;                 
               this.playlistHeight += deltaY;      
               
               // Resize the playlist.
               if( mediaplayer.playlist ) {
                  mediaplayer.playlist.onResize( deltaX, deltaY );
               }               
            };
            
            /**
             * Returns our template settings overrides.
             *
             * @return - An associative array of our settings.  We can use this to override any
             *           default settings for the player as well as default ids.
             */
            this.getSettings = function() {
               return {};   
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
             * @param - Boolean if this operation should be tweened or not.
             */            
            this.onMaximize = function( on ) {
               var newWidth = on ? "-=" + this.playlistWidth + "px" : "+=" + this.playlistWidth + "px";
               var newHeight = on ? "-=" + this.playlistHeight + "px" : "+=" + this.playlistHeight + "px";
               var newCSS = settings.vertical ? {width:newWidth} : {height:newHeight};
               
               if( on ) {
                  mediaplayer.playlist.pager.display.hide();
                  mediaplayer.playlist.busy.hide();
               }
               else {
                  this.showPlaylist( true );
               }
               
               mediaplayer.playlist.display.animate( newCSS, 250, 'linear', function() {    
                  if( on ) {
                     _this.showPlaylist( false );
                  }
                  else {
                     mediaplayer.playlist.refresh();
                     mediaplayer.playlist.pager.display.show();
                     if( mediaplayer.playlist.busyVisible ) {
                        mediaplayer.playlist.busy.show();
                     }
                  }
               });           
            };
            
            // Hides or Shows the playlist.
            this.showPlaylist = function( show ) {
               if( show != this.playlistShown ) {
                  this.playlistShown = show;
                  var deltaX = settings.vertical ? (show ? -this.playlistWidth : this.playlistWidth) : 0;
                  var deltaY = settings.vertical ? 0 : (show ? -this.playlistHeight : this.playlistHeight);
                  if( show ) {
                     if( settings.vertical ) {
                        mediaplayer.node.display.css({marginRight:this.playlistWidth + 2});
                     }
                     mediaplayer.playlist.display.show();
                  }
                  else {
                     if( settings.vertical ) {
                        mediaplayer.node.display.css({marginRight:0});
                     }
                     mediaplayer.playlist.display.hide();
                  }
                  this.resizeNode( deltaX, deltaY ); 
                  if( this.controlBar ) {  
                     this.controlBar.display.css({marginTop:this.nodeHeight, width:this.nodeWidth});
                  }                  
               }
            };
            
            // Perform bulk css operations.
            this.setCSS = function( newCSS ) {
               if( newCSS.titleLinks && this.titleLinks ) {
                  this.titleLinks.css( newCSS.titleLinks );   
               }
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

            // Called when we are in full screen mode and the user hovers their mouse over the screen.
            this.onFullScreenMouse = function() {               
               // If they move the mouse, then show the elements.
               if( this.player ) {
                  this.player.showController(true);
               }
               
               if( this.titleLinks ) {
                  this.titleLinks.show();
               }
               
               // Clear the timeout.
               clearTimeout( this.mouseTimeout );
               
               // Setup a new timeout for 4 seconds.
               this.mouseTimeout = setTimeout( function() {
                  
                  // Hide these elements...
                  if( _this.player ) {
                     _this.player.showController(false, "slow");
                  }                  
                  
                  if( _this.titleLinks ) {
                     _this.titleLinks.hide("slow");
                  }
               }, 4000 );               
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
               var titleCSS = this.titleLinks ? {
                  marginLeft:parseInt(this.titleLinks.css("marginLeft"), 10) + deltaX 
               } : null;
               var menuCSS = mediaplayer.menu ? {
                  marginTop:parseInt(mediaplayer.menu.display.css("marginTop"), 10) + (deltaY/2),
                  marginLeft:parseInt(mediaplayer.menu.display.css("marginLeft"), 10) + (deltaX/2)
               } : null;
               
               // Set the css of these elements.
               this.setCSS({                      
                  controlBar : controlCSS,
                  titleLinks : titleCSS,
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
               
               var titleCSS = this.titleLinks ? {
                  marginTop:parseInt(this.titleLinks.css("marginTop"), 10) + deltaY,
                  marginLeft:parseInt(this.titleLinks.css("marginLeft"), 10) + deltaX
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
                  titleLinks : titleCSS,
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
                  var titleCSS = this.titleLinks ? {
                     position:this.titleLinks.css("position"),
                     marginTop:this.titleLinks.css("marginTop"),
                     marginLeft:this.titleLinks.css("marginLeft")           
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
                     titleLinks : titleCSS,
                     menu : menuCSS,
                     busy : busyCSS,
                     play : playCSS,
                     preview : previewCSS,
                     nodeWidth:this.nodeWidth,
                     nodeHeight:this.nodeHeight
                  };                  
                  
                  // Make the control bar rounded.  Looks better for full screen mode.
                  if( this.controlBar ) {
                     this.controlBar.allowResize = false;
                     this.controlBar.display.removeClass(settings.prefix + 'ui-corner-bottom');
                     this.controlBar.display.addClass(settings.prefix + 'ui-corner-all');
                  }
                  
                  // Now setup the mouse hover timeouts.
                  $(window).bind("mousemove", function() {
                     _this.onFullScreenMouse();
                  });
                  
                  // Make sure we trigger this event.
                  this.onFullScreenMouse();            
                  
                  // Show the players controls.
                  if( this.player ) {
                     this.player.showPlayerController(true);
                  }                  
                  
                  // Hide the playlist busy cursor.
                  if( mediaplayer.playlist ) {
                     mediaplayer.playlist.busy.hide();
                  }
                  
                  // Set the items as absolute...
                  this.setCSS({
                     titleLinks:{"position":"absolute"},
                     controlBar:{"position":"absolute"}
                  });
                  
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
                  
                  // Get the new css for the titleLinks...
                  if( this.titleLinks ) {
                     var titleOffset = this.titleLinks.offset();
                     titleCSS = {
                        marginTop:(this.scrollTop - titleOffset.top + 5),
                        marginLeft:((this.scrollLeft - titleOffset.left) + this.windowWidth - this.titleLinks.width() - 5)
                     };   
                  }               
                  
                  // Position our elements...
                  this.setCSS({
                     display : displayCSS,
                     controlBar : controlCSS,
                     titleLinks : titleCSS,
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
                  // Clear the timeout.
                  clearTimeout( this.mouseTimeout );
                  
                  // Remove our mouse move event from the window.
                  $(window).unbind("mousemove");
                                    
                  // Make sure the control bar and titlebar are visible.
                  if( this.titleLinks ) {
                     this.titleLinks.show();
                  }
               
                  // Hide the players controls, and show the HTML controls.
                  if( this.player ) {
                     this.player.showPlayerController(false);
                  }                                   
                  
                  // Show the playlist busy cursor if it needs to be shown.
                  if( mediaplayer.playlist && mediaplayer.playlist.busyVisible ) {
                     mediaplayer.playlist.busy.show();
                  }                  
                  
                  // Now set the css to the previous state.
                  this.setCSS( this.prevState );
                  
                  // Resize the node back the way it was.
                  this.resizeNode( (this.prevState.nodeWidth - this.windowWidth), (this.prevState.nodeHeight - this.windowHeight) );
                  
                  if( this.controlBar ) { 
                     this.controlBar.allowResize = true;
                     this.controlBar.display.removeClass(settings.prefix + 'ui-corner-all');
                     this.controlBar.display.addClass(settings.prefix + 'ui-corner-bottom'); 
                  }                  
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
               if( args.fieldType == 'cck_text' ) {
                  var field = args.node[args.fieldName];
                  if( field ) {
                     $(args.field).empty().html( field["0"].value );
                  } 
               }
               
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
             */
            this.onMenuOver = function( link ) {
            };
            
            /**
             * Called when a menu item link is hovered out.
             */
            this.onMenuOut = function( link ) {
            };
            
            /**
             * Selects or Deselects a menu item.
             */
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
            
            /**
             * Called when the link is hovered over.
             *
             * @param - The link object passed to this function.
             *
             * @return - none
             */         
            this.onLinkOver = function( link ) {
               // Add the hover class.
               link.addClass(settings.prefix + "ui-state-hover");
            };   
   
            /**
             * Called when the mouse moves out of the link.
             *
             * @param - The link object passed to this function.
             *
             * @return - none
             */           
            this.onLinkOut = function( link ) {
               // Remove the hover class.
               link.removeClass(settings.prefix + "ui-state-hover");
            };

            /**
             * Called when the user selects a link.
             *
             * @param - The link object passed to this function.
             * @param - Boolean to see if the link is selected or not.
             *
             * @return - none
             */           
            this.onLinkSelect = function( link, select ) {
               if( select ) {
                  $(link.display).addClass(settings.prefix + "active");
               }
               else {
                  $(link.display).removeClass(settings.prefix + "active");                  
               }
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
               // Add the hover class.
               $(teaser.node.display).addClass(settings.prefix + "ui-state-hover");
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
               // Remove the hover class.
               $(teaser.node.display).removeClass(settings.prefix + "ui-state-hover");
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
               if( selected ) {
                  $(teaser.node.display).addClass(settings.prefix + "ui-state-hover");
               }
               else {
                  $(teaser.node.display).removeClass(settings.prefix + "ui-state-hover");
               }
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
               if( active ) {
                  $(teaser.node.display).addClass(settings.prefix + "ui-state-active");
               }
               else {
                  $(teaser.node.display).removeClass(settings.prefix + "ui-state-active");
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
   
            /**
             * This function is currently stubbed out.
             * You can implement it and hook into the time display by 
             * reassigning this as follows...
             *
             *  this.formatTime = function( time ) {
             *  }
             */         
            this.formatTime = false;                                 
         })( mediaplayer, settings );
      }
   }, jQuery.media.templates );
})(jQuery);