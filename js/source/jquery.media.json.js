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
  
  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the json server object.
    json : function( settings ) {
      // Return a new function for this object
      return new (function( settings ) {
        var _this = this;
            
        // ************************************************
        // This code is from http://kelpi.com/script/a85cbb
        // ************************************************
            
        // A character conversion map
        var m = {
          '\b':'\\b',
          '\t':'\\t',
          '\n':'\\n',
          '\f':'\\f',
          '\r':'\\r',
          '"':'\\"',
          '\\':'\\\\'
        };
            
        // Map type names to functions for serializing those types
        var s = {
          'boolean': function (x) {
            return String(x);
          },
          'null': function (x) {
            return "null";
          },
          number: function (x) {
            return isFinite(x) ? String(x) : 'null';
          },
          string: function (x) {
            if (/["\\\x00-\x1f]/.test(x)) {
              x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if (c) {
                  return c;
                }
                c = b.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
              });
            }
            return '"' + x + '"';
          },
          array: function (x) {
            var a = ['['], b, f, i, l = x.length, v;
            for (i = 0; i < l; i += 1) {
              v = x[i];
              f = s[typeof v];
              if (f) {
                v = f(v);
                if (typeof v == 'string') {
                  if (b) {
                    a[a.length] = ',';
                  }
                  a[a.length] = v;
                  b = true;
                }
              }
            }
            a[a.length] = ']';
            return a.join('');
          },
          object: function (x) {
            if (x) {
              if (x instanceof Array) {
                return s.array(x);
              }
              var a = ['{'], b, f, i, v;
              for( i in x ) {
                if( x.hasOwnProperty(i) ) {
                  v = x[i];
                  f = s[typeof v];
                  if(f) {
                    v = f(v);
                    if (typeof v == 'string') {
                      if (b) {
                        a[a.length] = ',';
                      }
                      a.push(s.string(i), ':', v);
                      b = true;
                    }
                  }
                }
              }
              a[a.length] = '}';
              return a.join('');
            }
            return 'null';
          }
        };
            
        // Public function to serialize any object to JSON format.
        this.serializeToJSON = function( o ) {
          return s.object(o);
        };
            
        //************************************************
        // End of code from http://kelpi.com/script/a85cbb
        //************************************************
                            
        this.call = function( method, onSuccess, onFailed, params, protocol ) {
          if( settings.baseURL ) {
            // Add json functionality here.
            jQuery.ajax({
              "url": settings.baseURL + method,
              "dataType": "json",
              "type": "POST",
              "data": {
                methodName:method,
                params:this.serializeToJSON(params)
              },
              "error": function( XMLHttpRequest, textStatus, errorThrown ) {
                if( onFailed ) {
                  onFailed( textStatus );
                }
                else if( window.console && console.log ) {
                  console.log( "Error: " + textStatus );
                }
              },
              "success": function( data ) {
                if( onSuccess ) {
                  onSuccess( data );
                }
              }
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
