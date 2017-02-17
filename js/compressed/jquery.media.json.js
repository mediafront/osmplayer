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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media=jQuery.extend({},{json:function(b){return new (function(e){var f=this;var c={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};var d={"boolean":function(g){return String(g);},"null":function(g){return"null";},number:function(g){return isFinite(g)?String(g):"null";},string:function(g){if(/["\\\x00-\x1f]/.test(g)){g=g.replace(/([\x00-\x1f\\"])/g,function(i,h){var j=c[h];if(j){return j;}j=h.charCodeAt();return"\\u00"+Math.floor(j/16).toString(16)+(j%16).toString(16);});}return'"'+g+'"';},array:function(h){var k=["["],g,o,n,j=h.length,m;for(n=0;n<j;n+=1){m=h[n];o=d[typeof m];if(o){m=o(m);if(typeof m=="string"){if(g){k[k.length]=",";}k[k.length]=m;g=true;}}}k[k.length]="]";return k.join("");},object:function(h){if(h){if(h instanceof Array){return d.array(h);}var j=["{"],g,m,l,k;for(l in h){if(h.hasOwnProperty(l)){k=h[l];m=d[typeof k];if(m){k=m(k);if(typeof k=="string"){if(g){j[j.length]=",";}j.push(d.string(l),":",k);g=true;}}}}j[j.length]="}";return j.join("");}return"null";}};this.serializeToJSON=function(g){return d.object(g);};this.call=function(k,j,g,i,h){if(e.baseURL){jQuery.ajax({url:e.baseURL+k,dataType:"json",type:"POST",data:{methodName:k,params:this.serializeToJSON(i)},error:function(l,n,m){if(g){g(n);}else{console.log("Error: "+n);}},success:function(l){j(l);}});}else{j(null);}};})(b);}},jQuery.media);})(jQuery);