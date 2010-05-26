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
   jQuery.fn.mediavoter = function( settings, server, userVote ) {
      if( this.length === 0 ) { return null; }
      return new (function( voteObj, settings, server, userVote ) {
         // Save the jQuery display.
         this.display = voteObj;
         var _this = this;
         
         // The node id.
         this.nodeId = 0;
         
         // Store all of our votes.
         this.votes = [];
         
         // Get the tag for the voting.
         this.tag = this.display.attr("tag");
         
         // Setup each vote element.  
         this.display.find("div").each( function() {
            if( userVote ) {
               $(this).css("cursor", "pointer");
               $(this).bind( "click", function( event ) {
                  _this.setVote( parseInt($(this).attr("vote"), 10) );
               });
               $(this).bind( "mouseenter", function( event ) {
                  _this.updateVote( {value: parseInt($(this).attr("vote"), 10)}, true );      
               });
            }
            _this.votes.push( { vote:parseInt($(this).attr("vote"), 10), display:$(this) } );
         });

         // Sort the votes based on numerical order.
         this.votes.sort( function( voteA, voteB ) {
            return (voteA.vote - voteB.vote);
         });          
         
         // If this is a uservoter, then add the mouse leave event.
         if( userVote ) {
            this.display.bind( "mouseleave", function( event ) {
               _this.updateVote( {value:0}, true );
            });
         }        
         
         // Update a vote value.
         this.updateVote = function( vote, hover ) {
            if( vote && settings.template.updateVote ) {            
               settings.template.updateVote( this, vote.value, hover ); 
            }  
         };
         
         // Get the vote from the server.
         this.getVote = function( nodeInfo ) {
            if( nodeInfo && nodeInfo.nid ) {
               this.nodeId = parseInt(nodeInfo.nid, 10);
               if( nodeInfo.vote ) {
                  var vote = userVote ? nodeInfo.vote.uservote : nodeInfo.vote.vote;
                  this.updateVote( nodeInfo.vote.vote, false );  
                  this.display.trigger( "voteGet", vote );
               }
               else {
                  if( server && nodeInfo.nid && (this.display.length > 0) ) {
                     this.display.trigger( "processing" );
                     var cmd = userVote ? jQuery.media.commands.getUserVote : jQuery.media.commands.getVote;
                     server.call( cmd, function( vote ) {
                        _this.updateVote( vote, false );
                        _this.display.trigger( "voteGet", vote );
                     }, null, "node", this.nodeId, this.tag );
                  }
               }
            }
         };
         
         // Set the current vote.
         this.setVote = function( voteValue ) {
            if( server && this.nodeId ) {
               this.display.trigger( "processing" );
               this.updateVote( {value:voteValue}, false );         
               server.call( jQuery.media.commands.setVote, function( vote ) {
                  _this.display.trigger( "voteSet", vote );            
               }, null, "node", this.nodeId, voteValue, this.tag );
            }
         };
         
         // Delete the current vote.
         this.deleteVote = function() {
            if( server && this.nodeId ) {
               this.display.trigger( "processing" );
               server.call( jQuery.media.commands.deleteVote, function( vote ) {
                  _this.updateVote( vote, false );
                  _this.display.trigger( "voteDelete", vote );
               }, null, "node", this.nodeId, this.tag );
            }
         };
      })( this, settings, server, userVote );
   };
})(jQuery);