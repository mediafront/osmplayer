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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{gateway:""});jQuery.media=jQuery.extend({},{rpc:function(b){return new (function(c){c=jQuery.media.utils.getSettings(c);var d=this;this.parseObject=function(h){var e="";if(h instanceof Date){e="<dateTime.iso8601>";e+=h.getFullYear();e+=h.getMonth();e+=h.getDate();e+="T";e+=h.getHours()+":";e+=h.getMinutes()+":";e+=h.getSeconds();e+="</dateTime.iso8601>";}else{if(h instanceof Array){e="<array><data>\n";for(var g=0;g<h.length;g++){e+="  <value>"+this.serializeToXML(h[g])+"</value>\n";}e+="</data></array>";}else{e="<struct>\n";for(var f in h){if(h.hasOwnProperty(f)){e+="  <member><name>"+f+"</name><value>";e+=this.serializeToXML(h[f])+"</value></member>\n";}}e+="</struct>";}}return e;};this.serializeToXML=function(f){switch(typeof f){case"boolean":return"<boolean>"+((f)?"1":"0")+"</boolean>";case"number":var e=parseInt(f,10);if(e==f){return"<int>"+f+"</int>";}return"<double>"+f+"</double>";case"string":return"<string>"+f+"</string>";case"object":return this.parseObject(f);}};this.parseXMLValue=function(f){var m=jQuery(f).children();var k=m.length;var n=function(i){return function(){i.push(d.parseXMLValue(this));};};var l=function(i){return function(){i[jQuery("> name",this).text()]=d.parseXMLValue(jQuery("value",this));};};for(var h=0;h<k;h++){var j=m[h];switch(j.tagName){case"boolean":return(jQuery(j).text()==1);case"int":return parseInt(jQuery(j).text(),10);case"double":return parseFloat(jQuery(j).text());case"string":return jQuery(j).text();case"array":var e=[];jQuery("> data > value",j).each(n(e));return e;case"struct":var g={};jQuery("> member",j).each(l(g));return g;case"dateTime.iso8601":return NULL;}}};this.parseXML=function(f){var e={};e.version="1.0";jQuery("methodResponse params param > value",f).each(function(g){e.result=d.parseXMLValue(this);});jQuery("methodResponse fault > value",f).each(function(g){e.error=d.parseXMLValue(this);});return e;};this.xmlRPC=function(j,h){var e='<?xml version="1.0"?>';e+="<methodCall>";e+="<methodName>"+j+"</methodName>";if(h.length>0){e+="<params>";var g=h.length;for(var f=0;f<g;f++){if(h[f]){e+="<param><value>"+this.serializeToXML(h[f])+"</value></param>";}}e+="</params>";}e+="</methodCall>";return e;};this.call=function(i,h,e,g,f){if(c.gateway){jQuery.ajax({url:c.gateway,dataType:"xml",type:"POST",data:this.xmlRPC(i,g),error:function(j,l,k){if(e){e(l);}else{console.log("Error: "+l);}},success:function(k){var j=d.parseXML(k);if(j.error){if(e){e(j.error);}else{console.dir(j.error);}}else{h(j.result);}},processData:false,contentType:"text/xml"});}else{h(null);}};})(b);}},jQuery.media);})(jQuery);