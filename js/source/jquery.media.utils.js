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
      utils : {
         getBaseURL : function() {
            var url = new RegExp(/^(http[s]?\:[\\\/][\\\/])([^\\\/\?]+)/);
            var results = url.exec(location.href);
            return results ? results[0] : "";
         },           
         
         getSettings : function( settings ) {
            // Make sure it exists...
            if( !settings ) {
               settings = {};
            }
                    
            // Only get the settings if they have not yet been initialized.
            if( !settings.initialized ) {
               settings = jQuery.extend( {}, jQuery.media.defaults, settings );
               settings.ids = jQuery.extend( {}, jQuery.media.ids, settings.ids );
               settings.baseURL = settings.baseURL ? settings.baseURL : jQuery.media.utils.getBaseURL();
               settings.baseURL += settings.baseURL ? "/" : "";               
               settings.initialized = true;
            }
            
            // Return the settings.
            return settings;
         },
         
         getId : function( display ) {
            return display.attr("id") ? display.attr("id") : display.attr("class") ? display.attr("class") : "mediaplayer";
         },
         
         getScaledRect : function( ratio, rect ) {
            var scaledRect = {};
            scaledRect.x = rect.x ? rect.x : 0;
            scaledRect.y = rect.y ? rect.y : 0;
            scaledRect.width = rect.width ? rect.width : 0;
            scaledRect.height = rect.height ? rect.height : 0; 

            if( ratio ) {
               var newRatio = (rect.width / rect.height);
               scaledRect.height = (newRatio > ratio) ? rect.height : Math.floor(rect.width / ratio);
               scaledRect.width = (newRatio > ratio) ? Math.floor(rect.height * ratio) : rect.width;
               scaledRect.x = Math.floor((rect.width - scaledRect.width) / 2);
               scaledRect.y = Math.floor((rect.height - scaledRect.height) / 2);
            }

            return scaledRect;         
         },

         // Checks all parents visibility, and resets them and adds those items to a passed in
         // array which can be used to reset their visibiltiy at a later point by calling
         // resetVisibility
         checkVisibility : function( display, invisibleParents ) {
            var isVisible = true;
            display.parents().each( function() {
               var jObject = jQuery(this);
               if( !jObject.is(':visible') ) {
                  isVisible = false;
                  var attrClass = jObject.attr("class");
                  invisibleParents.push( {
                     obj:jObject,
                     attr:attrClass
                  } );
                  jObject.removeClass(attrClass);
               }
            });
         },

         // Reset's the visibility of the passed in parent elements.
         resetVisibility : function( invisibleParents ) {
            // Now iterate through all of the invisible objects and rehide them.
            var i = invisibleParents.length;
            while(i--){
               invisibleParents[i].obj.addClass(invisibleParents[i].attr);
            }
         },
         
         getFlash : function( player, id, width, height, flashvars, wmode ) {
            // Get the protocol.
            var protocol = window.location.protocol; 
            if (protocol.charAt(protocol.length - 1) == ':') { 
               protocol = protocol.substring(0, protocol.length - 1); 
            } 

            // Convert the flashvars object to a string...
            var flashVarsString = "";
            for( var key in flashvars ) {
               if( flashvars.hasOwnProperty(key) ) {
                  flashVarsString += key + "=" + encodeURIComponent(flashvars[key]) + "&";
               }
            }
            flashVarsString = flashVarsString.replace(/&$/, '');

            // Get the HTML flash object string.
            var flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
            flash += 'codebase="' + protocol + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ';
            flash += 'width="' + width + '" ';
            flash += 'height="' + height + '" ';
            flash += 'id="' + id + '" ';
            flash += 'name="' + id + '"> ';
            flash += '<param name="allowScriptAccess" value="always"></param>'; 
            flash += '<param name="allowfullscreen" value="true" />';
            flash += '<param name="movie" value="' + player + '"></param>';
            flash += '<param name="wmode" value="' + wmode + '"></param>';
            flash += '<param name="quality" value="high"></param>';
            flash += '<param name="FlashVars" value="' + flashVarsString + '"></param>';
            flash += '<embed src="' + player + '" quality="high" width="' + width + '" height="' + height + '" ';
            flash += 'id="' + id + '" name="' + id + '" swLiveConnect="true" allowScriptAccess="always" wmode="' + wmode + '"';
            flash += 'allowfullscreen="true" type="application/x-shockwave-flash" FlashVars="' + flashVarsString + '" ';
            flash += 'pluginspage="' + protocol + '://www.macromedia.com/go/getflashplayer" />';
            flash += '</object>';
            return flash;
         },
         
         removeFlash : function( obj, id ) {
            if( typeof(swfobject) != "undefined" ) {
               swfobject.removeSWF( id );
            }
            else {
               var flash = obj.find('object').eq(0)[0];
               if( flash ) {
                  flash.parentNode.removeChild(flash);
               }
            }
         },
         
         // Insert flash routine.  If they have swfobject, then this function will dynamically use that instead.
         insertFlash : function( obj, player, id, width, height, flashvars, wmode, onAdded ) {
            jQuery.media.utils.removeFlash( obj, id );
            obj.children().remove();             
            obj.append('<div id="' + id + '"><p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p></div>');
            if( typeof(swfobject) != "undefined" ) {
               var params = {
                  allowScriptAccess:"always",
                  allowfullscreen:"true",
                  wmode:wmode,
                  quality:"high"
               };                              
               swfobject.embedSWF( 
                  player, 
                  id, 
                  width, 
                  height,
                  "9.0.0",
                  "expressInstall.swf",
                  flashvars,
                  params,
                  {},
                  function( swf ) {
                     onAdded( swf.ref );  
                  }
                  );
            }
            else {            
               var flash = jQuery.media.utils.getFlash( player, id, width, height, flashvars, wmode );
               var container = obj.find('#' + id).eq(0);
               if( jQuery.browser.msie ) {
                  container[0].outerHTML = flash;
                  onAdded( obj.find('object').eq(0)[0] );
               } else {
                  container.replaceWith( flash ); 
                  onAdded( obj.find('embed').eq(0)[0] );
               }
            }
         },
                  
         // Fix the clone method for jQuery 1.2.6 - 1.3.1
         cloneFix: function( obj, events ) {
            // Do the clone
            var ret = obj.map(function(){
               // IE copies events bound via attachEvent when
               // using cloneNode. Calling detachEvent on the
               // clone will also remove the events from the orignal
               // In order to get around this, we use innerHTML.
               // Unfortunately, this means some modifications to
               // attributes in IE that are actually only stored
               // as properties will not be copied (such as the
               // the name attribute on an input).
               var html = this.outerHTML;
               if ( !html ) {
                  var div = this.ownerDocument.createElement("div");
                  div.appendChild( this.cloneNode(true) );
                  html = div.innerHTML;
               }
   
               return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0];
            });
      
            // Copy the events from the original to the clone
            if ( events === true ) {
               var orig = obj.find("*").andSelf(), i = 0;
      
               ret.find("*").andSelf().each(function(){
                  if ( this.nodeName !== orig[i].nodeName ) {
                     return;
                  }
      
                  var events = jQuery.data( orig[i], "events" );
      
                  for ( var type in events ) {
                     if( events.hasOwnProperty( type ) ) {
                        for ( var handler in events[ type ] ) {
                           if( events[ type ].hasOwnProperty( handler ) ) {
                              jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
                           }
                        }
                     }
                  }
      
                  i++;
               });
            }
      
            // Return the cloned set
            return ret;
         }                                                   
      }
   }, jQuery.media );  
})(jQuery);