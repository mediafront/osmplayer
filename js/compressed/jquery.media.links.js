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
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{links:[],linksvertical:false});jQuery.media.ids=jQuery.extend(jQuery.media.ids,{linkScroll:"#medialinkscroll"});jQuery.fn.medialinks=function(b){return new (function(c,d){d=jQuery.media.utils.getSettings(d);this.display=c;var e=this;this.previousLink=null;this.scrollRegion=c.find(d.ids.linkScroll).mediascroll({vertical:d.linksvertical});this.scrollRegion.clear();this.loadLinks=function(){if(c.length>0){this.scrollRegion.clear();var f=function(i,j){e.setLink(j);};var g=d.links.length;while(g--){var h=this.scrollRegion.newItem().playlistlink(d,d.links[g]);h.bind("linkclick",f);}this.scrollRegion.activate();}};this.setLink=function(f){if(this.previousLink){this.previousLink.setActive(false);}f.setActive(true);this.previousLink=f;};})(this,b);};})(jQuery);