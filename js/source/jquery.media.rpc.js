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
    gateway:""
  });
  
  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the rpc object.
    rpc : function( settings ) {
      // Return a new function for this object
      return new (function( settings ) {
        settings = jQuery.media.utils.getSettings(settings);
        var _this = this;
               
        this.parseObject = function( data ) {
          var ret = "";
          if( data instanceof Date ) {
            ret = "<dateTime.iso8601>";
            ret += data.getFullYear();
            ret += data.getMonth();
            ret += data.getDate();
            ret += "T";
            ret += data.getHours() + ":";
            ret += data.getMinutes() + ":";
            ret += data.getSeconds();
            ret += "</dateTime.iso8601>";
          } else if( data instanceof Array ) {
            ret = '<array><data>'+"\n";
            for (var i=0; i < data.length; i++) {
              ret += '  <value>'+ this.serializeToXML(data[i]) +"</value>\n";
            }
            ret += '</data></array>';
          } else {
            ret = '<struct>'+"\n";
            for(var key in data ) {
              if( data.hasOwnProperty(key) ) {
                ret += "  <member><name>"+ key +"</name><value>";
                ret += this.serializeToXML(data[key]) +"</value></member>\n";
              }
            }
            ret += '</struct>';
          }
          return ret;
        };
            
        this.serializeToXML = function( data ) {
          switch( typeof data ) {
            case 'boolean':
              return '<boolean>'+ ((data) ? '1' : '0') +'</boolean>';
                     
            case 'number':
              var parsed = parseInt(data, 10);
              if(parsed == data) {
                return '<int>'+ data +'</int>';
              }
              return '<double>'+ data +'</double>';
                     
            case 'string':
              return '<string>'+ data +'</string>';
                     
            case 'object':
              return this.parseObject( data );
            default:
              break;
          }
          return '';
        };
            
        this.parseXMLValue = function( node ) {
          var childs = jQuery(node).children();
          var numChildren = childs.length;
          var newArray = function(items) {
            return function() {
              items.push( _this.parseXMLValue(this) );
            };
          };
          var newObject = function( items ) {
            return function() {
              items[jQuery( "> name", this).text()] = _this.parseXMLValue(jQuery("value", this));
            };
          };
          for(var i=0; i < numChildren; i++) {
            var element = childs[i];
            switch(element.tagName) {
              case 'boolean':
                return (jQuery(element).text() == 1);
              case 'int':
                return parseInt(jQuery(element).text(), 10);
              case 'double':
                return parseFloat(jQuery(element).text());
              case "string":
                return jQuery(element).text();
              case "array":
                var retArray = [];
                jQuery("> data > value", element).each( newArray( retArray ) );
                return retArray;
              case "struct":
                var retObj = {};
                jQuery("> member", element).each( newObject( retObj ) );
                return retObj;
              case "dateTime.iso8601":
                return NULL;
              default:
                break;
            }
          }
          return null;
        };
            
        this.parseXML = function( data ) {
          var ret = {};
          ret.version = "1.0";
          jQuery("methodResponse params param > value", data).each( function(index) {
            ret.result = _this.parseXMLValue(this);
          });
          jQuery("methodResponse fault > value", data).each( function(index) {
            ret.error = _this.parseXMLValue(this);
          });
          return ret;
        };
            
        this.xmlRPC = function( method, params ) {
          var ret = '<?xml version="1.0"?>';
          ret += '<methodCall>';
          ret += '<methodName>' + method + '</methodName>';
          if( params.length > 0 ) {
            ret += '<params>';
            var numParams = params.length;
            for(var i=0; i < numParams; i++) {
              if( params[i] ) {
                ret += "<param><value>" + this.serializeToXML(params[i]) + "</value></param>";
              }
            }
            ret += '</params>';
          }
          ret += '</methodCall>';
          return ret;
        };
            
        this.call = function( method, onSuccess, onFailed, params, protocol ) {
          if( settings.gateway ) {
            jQuery.ajax({
              "url": settings.gateway,
              "dataType": "xml",
              "type": "POST",
              "data": this.xmlRPC( method, params ),
              "error": function( XMLHttpRequest, textStatus, errorThrown ) {
                if( onFailed ) {
                  onFailed( textStatus );
                }
                else if( window.console && console.log ) {
                  console.log( "Error: " + textStatus );
                }
              },
              "success": function( msg ) {
                var xml = _this.parseXML( msg );
                if( xml.error ) {
                  if( onFailed ) {
                    onFailed( xml.error );
                  }
                  else if( window.console && console.dir ) {
                    console.dir( xml.error );
                  }
                }
                else if( onSuccess ) {
                  onSuccess( xml.result );
                }
              },
              "processData": false,
              "contentType": "text/xml"
            });
          }
          else if( onSuccess ) {
            onSuccess( null );
          }
        };
      })( settings );
    }
  }, jQuery.media );
})(jQuery);
