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
    apiKey:"",
    api:2,
    sessid:"",
    drupalVersion:6
  });

  // Extend the media namespace
  jQuery.media = jQuery.extend( {}, {
    // Add the drupal server object.
    drupal : function( protocol, settings ) {
      // Return a new server object.
      return new (function( protocol, settings ) {
        settings = jQuery.media.utils.getSettings(settings);
        var _this = this;
   
        var hasKey = (settings.apiKey.length > 0);
        var usesKey = (settings.api == 1);
        var nodeGet = (settings.drupalVersion >= 6) ? "node.get" : "node.load";
        var autoProtocol = (settings.protocol == "auto");
   
        // Set up the commands.
        jQuery.media = jQuery.extend( {}, {
          commands : {
            connect:{command:{rpc:"system.connect", json:""}, useKey:usesKey, protocol:"rpc"},
            mail:{command:{rpc:"system.mail", json:""}, useKey:hasKey, protocol:"rpc"},
            loadNode:{command:{rpc:nodeGet, json:"mediafront_getnode"}, useKey:usesKey, protocol:"json"},
            getPlaylist:{command:{rpc:"mediafront.getPlaylist", json:"mediafront_getplaylist"}, useKey:usesKey, protocol:"json"},
            getVote:{command:{rpc:"vote.getVote", json:""}, useKey:usesKey, protocol:"rpc"},
            setVote:{command:{rpc:"vote.setVote", json:""}, useKey:hasKey, protocol:"rpc"},
            getUserVote:{command:{rpc:"vote.getUserVote", json:""}, useKey:usesKey, protocol:"rpc"},
            deleteVote:{command:{rpc:"vote.deleteVote", json:""}, useKey:hasKey, protocol:"rpc"},
            addTag:{command:{rpc:"tag.addTag", json:""}, useKey:hasKey, protocol:"rpc"},
            incrementCounter:{command:{rpc:"mediafront.incrementNodeCounter", json:""}, useKey:hasKey, protocol:"rpc"},
            setFavorite:{command:{rpc:"favorites.setFavorite", json:""}, useKey:hasKey, protocol:"rpc"},
            deleteFavorite:{command:{rpc:"favorites.deleteFavorite", json:""}, useKey:hasKey, protocol:"rpc"},
            isFavorite:{command:{rpc:"favorites.isFavorite", json:""}, useKey:usesKey, protocol:"rpc"},
            login:{command:{rpc:"user.login", json:""}, useKey:hasKey, protocol:"rpc"},
            logout:{command:{rpc:"user.logout", json:""}, useKey:hasKey, protocol:"rpc"},
            adClick:{command:{rpc:"mediafront.adClick", json:""}, useKey:hasKey, protocol:"rpc"},
            getAd:{command:{rpc:"mediafront.getAd", json:""}, useKey:usesKey, protocol:"rpc"},
            setUserStatus:{command:{rpc:"mediafront.setUserStatus", json:""}, useKey:hasKey, protocol:"rpc"}
          }
        }, jQuery.media);
   
        // Public variables.
        this.user = {};
        this.sessionId = "";
        this.onConnected = null;
        this.encoder = new jQuery.media.sha256();
            
        // Cache this... it is a little processor intensive.
        // The baseURL has an ending "/".   We need to truncate this, and then remove the "http://"
        this.baseURL = settings.baseURL.substring(0,(settings.baseURL.length - 1)).replace(/^(http[s]?\:[\\\/][\\\/])/,'');
            
        this.connect = function( onSuccess ) {
          this.onConnected = onSuccess;
          // If they provide the session Id, then we can skip this call.
          if( settings.sessid ) {
            this.onConnect({
              sessid:settings.sessid
              });
          }
          else {
            this.call( jQuery.media.commands.connect, function( result ) {
              _this.onConnect( result );
            }, null );
          }
        };
   
        this.call = function( command, onSuccess, onFailed ) {
          var args = [];
          for (var i=3; i<arguments.length; i++) {
            args.push(arguments[i]);
          }
          args = this.setupArgs( command, args );
          var type = autoProtocol ? command.protocol : settings.protocol;
          var method = command.command[type];
          if( method ) {
            protocol.call( method, onSuccess, onFailed, args, type );
          }
          else if( onSuccess ) {
            onSuccess( null );
          }
        };
   
        this.setupArgs = function( command, args ) {
          args.unshift( this.sessionId );
          if ( command.useKey ) {
            if( settings.api > 1 ) {
              var timestamp = this.getTimeStamp();
              var nonce = this.getNonce();
              var hash = this.computeHMAC( timestamp, this.baseURL, nonce, command.command.rpc, settings.apiKey);
              args.unshift( nonce );
              args.unshift( timestamp );
              args.unshift( this.baseURL );
              args.unshift( hash );
            }
            else {
              args.unshift( settings.apiKey );
            }
          }
          return args;
        };
   
        this.getTimeStamp = function() {
          return (parseInt(new Date().getTime() / 1000, 10)).toString();
        };
   
        this.getNonce = function() {
          var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
          var randomString = '';
          for (var i=0; i<10; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(rnum,rnum+1);
          }
          return randomString;
        };
   
        this.computeHMAC = function( timestamp, baseURL, nonce, command, apiKey ) {
          var input = timestamp + ";" + baseURL + ";" + nonce + ";" + command;
          return this.encoder.encrypt( apiKey, input );
        };
   
        this.onConnect = function( result ) {
          if( result ) {
            this.sessionId = result.sessid;
            this.user = result.user;
          }
          if( this.onConnected ) {
            this.onConnected( result );
          }
        };
      })( protocol, settings );
    }
  }, jQuery.media );
})(jQuery);