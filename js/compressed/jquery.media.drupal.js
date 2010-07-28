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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{apiKey:"",api:2,sessid:"",drupalVersion:6});jQuery.media=jQuery.extend({},{drupal:function(c,b){return new (function(i,h){h=jQuery.media.utils.getSettings(h);var j=this;var e=(h.apiKey.length>0);var g=(h.api==1);var d=(h.drupalVersion>=6)?"node.get":"node.load";var f=(h.protocol=="auto");jQuery.media=jQuery.extend({},{commands:{connect:{command:{rpc:"system.connect",json:""},useKey:g,protocol:"rpc"},mail:{command:{rpc:"system.mail",json:""},useKey:e,protocol:"rpc"},loadNode:{command:{rpc:d,json:"mediafront_getnode"},useKey:g,protocol:"json"},getPlaylist:{command:{rpc:"mediafront.getPlaylist",json:"mediafront_getplaylist"},useKey:g,protocol:"json"},getVote:{command:{rpc:"vote.getVote",json:""},useKey:g,protocol:"rpc"},setVote:{command:{rpc:"vote.setVote",json:""},useKey:e,protocol:"rpc"},getUserVote:{command:{rpc:"vote.getUserVote",json:""},useKey:g,protocol:"rpc"},deleteVote:{command:{rpc:"vote.deleteVote",json:""},useKey:e,protocol:"rpc"},addTag:{command:{rpc:"tag.addTag",json:""},useKey:e,protocol:"rpc"},incrementCounter:{command:{rpc:"mediafront.incrementNodeCounter",json:""},useKey:e,protocol:"rpc"},setFavorite:{command:{rpc:"favorites.setFavorite",json:""},useKey:e,protocol:"rpc"},deleteFavorite:{command:{rpc:"favorites.deleteFavorite",json:""},useKey:e,protocol:"rpc"},isFavorite:{command:{rpc:"favorites.isFavorite",json:""},useKey:g,protocol:"rpc"},login:{command:{rpc:"user.login",json:""},useKey:e,protocol:"rpc"},logout:{command:{rpc:"user.logout",json:""},useKey:e,protocol:"rpc"},adClick:{command:{rpc:"mediafront.adClick",json:""},useKey:e,protocol:"rpc"},getAd:{command:{rpc:"mediafront.getAd",json:""},useKey:g,protocol:"rpc"},setUserStatus:{command:{rpc:"mediafront.setUserStatus",json:""},useKey:e,protocol:"rpc"}}},jQuery.media);this.user={};this.sessionId="";this.onConnected=null;this.encoder=new jQuery.media.sha256();this.baseURL=h.baseURL.substring(0,(h.baseURL.length-1)).replace(/^(http[s]?\:[\\\/][\\\/])/,"");this.connect=function(k){this.onConnected=k;if(h.sessid){this.onConnect({sessid:h.sessid});}else{this.call(jQuery.media.commands.connect,function(l){j.onConnect(l);},null);}};this.call=function(p,o,m){var k=[];for(var l=3;l<arguments.length;l++){k.push(arguments[l]);}k=this.setupArgs(p,k);var n=f?p.protocol:h.protocol;var q=p.command[n];if(q){i.call(q,o,m,k,n);}else{if(o){o(null);}}};this.setupArgs=function(o,k){k.unshift(this.sessionId);if(o.useKey){if(h.api>1){var m=this.getTimeStamp();var l=this.getNonce();var n=this.computeHMAC(m,this.baseURL,l,o.command.rpc,h.apiKey);k.unshift(l);k.unshift(m);k.unshift(this.baseURL);k.unshift(n);}else{k.unshift(h.apiKey);}}return k;};this.getTimeStamp=function(){return(parseInt(new Date().getTime()/1000,10)).toString();};this.getNonce=function(){var n="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";var l="";for(var m=0;m<10;m++){var k=Math.floor(Math.random()*n.length);l+=n.substring(k,k+1);}return l;};this.computeHMAC=function(n,m,l,p,o){var k=n+";"+m+";"+l+";"+p;return this.encoder.encrypt(o,k);};this.onConnect=function(k){if(k){this.sessionId=k.sessid;this.user=k.user;}if(this.onConnected){this.onConnected(k);}};})(c,b);}},jQuery.media);})(jQuery);