function checkPlayType(a,b){if("function"==typeof a.canPlayType){if("object"==typeof b){for(var c=b.length,d="";c--&&!(d=checkPlayType(a,b[c])););return d}var e=a.canPlayType(b);if("no"!==e&&""!==e)return b}return""}var minplayer=minplayer||{};!function(a){!function(){"use strict";var a="undefined"!=typeof module&&module.exports,b="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,c=function(){for(var a,b,c=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],d=0,e=c.length,f={};e>d;d++)if(a=c[d],a&&a[1]in document){for(d=0,b=a.length;b>d;d++)f[c[0][d]]=a[d];return f}return!1}(),d={request:function(a){var d=c.requestFullscreen;a=a||document.documentElement,/5\.1[\.\d]* Safari/.test(navigator.userAgent)?a[d]():a[d](b&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){document[c.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},onchange:function(){},onerror:function(){},raw:c};return c?(Object.defineProperties(d,{isFullscreen:{get:function(){return!!document[c.fullscreenElement]}},element:{enumerable:!0,get:function(){return document[c.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!document[c.fullscreenEnabled]}}}),document.addEventListener(c.fullscreenchange,function(a){d.onchange.call(d,a)}),document.addEventListener(c.fullscreenerror,function(a){d.onerror.call(d,a)}),void(a?module.exports=d:window.screenfull=d)):void(a?module.exports=!1:window.screenfull=!1)}(),a.screenfull=screenfull}(minplayer);var minplayer=minplayer||{};if(minplayer.compatibility=function(){var a=null;a=document.createElement("video"),this.videoOGG=checkPlayType(a,"video/ogg"),this.videoH264=checkPlayType(a,["video/mp4","video/h264"]),this.videoWEBM=checkPlayType(a,["video/x-webm","video/webm","application/octet-stream"]),this.videoMPEGURL=checkPlayType(a,"application/vnd.apple.mpegurl"),a=document.createElement("audio"),this.audioOGG=checkPlayType(a,"audio/ogg"),this.audioMP3=checkPlayType(a,"audio/mpeg"),this.audioMP4=checkPlayType(a,"audio/mp4")},minplayer.playTypes||(minplayer.playTypes=new minplayer.compatibility,minplayer.isAndroid=/android/gi.test(navigator.appVersion),minplayer.isIDevice=/iphone|ipad/gi.test(navigator.appVersion),minplayer.isPlaybook=/playbook/gi.test(navigator.appVersion),minplayer.isTouchPad=/hp-tablet/gi.test(navigator.appVersion),minplayer.hasTouch="ontouchstart"in window&&!minplayer.isTouchPad),!minplayer.urlVars){minplayer.urlVars={};var regEx=/[?&]+([^=&]+)=([^&]*)/gi;window.location.href.replace(regEx,function(a,b,c){minplayer.urlVars[b]=c})}var minplayer=minplayer||{};minplayer.async=function(){this.value=null,this.queue=[]},minplayer.async.prototype.get=function(a){null!==this.value?a(this.value):this.queue.push(a)},minplayer.async.prototype.set=function(a){this.value=a;var b=this.queue.length;if(b){for(;b--;)this.queue[b](a);this.queue=[]}};var minplayer=minplayer||{};minplayer.flags=function(){this.flag=0,this.ids={},this.numFlags=0},minplayer.flags.prototype.setFlag=function(a,b){this.ids.hasOwnProperty(a)||(this.ids[a]=this.numFlags,this.numFlags++),b?this.flag|=1<<this.ids[a]:this.flag&=~(1<<this.ids[a])},minplayer=minplayer||{},minplayer.plugins=minplayer.plugins||{},minplayer.queue=minplayer.queue||[],minplayer.lock=!1,minplayer.plugin=function(a,b,c,d){if(this.options=c||{},this.name=a,this.pluginReady=!1,this.queue=d||{},this.triggered={},this.lock=!1,this.uuid=0,b){this.context=jQuery(b);var e={};this.defaultOptions(e);for(var f in e)this.options.hasOwnProperty(f)||(this.options[f]=e[f]);this.initialize()}},minplayer.plugin.prototype.initialize=function(){this.construct()},minplayer.plugin.prototype.defaultOptions=function(){},minplayer.plugin.prototype.construct=function(){this.active=!0,this.addPlugin()},minplayer.plugin.prototype.destroy=function(){this.active=!1,this.unbind()},minplayer.plugin.prototype.create=function(a,b,c){var d=null;return b=b||"minplayer",window[b][a]||(b="minplayer"),c=c||this.display,window[b][a]&&(d=window[b][a],d[this.options.template]&&(d=d[this.options.template]),"function"!=typeof d&&(d=window.minplayer[a]),"function"==typeof d)?new d(c,this.options):null},minplayer.plugin.prototype.ready=function(){this.pluginReady||(this.pluginReady=!0,this.trigger("ready"),this.checkQueue())},minplayer.plugin.prototype.isValid=function(){return!!this.options.id&&this.active},minplayer.plugin.prototype.onAdded=function(){},minplayer.plugin.prototype.addPlugin=function(a,b){if(a=a||this.name,b=b||this,b.isValid()){minplayer.plugins[this.options.id]||(minplayer.plugins[this.options.id]={}),minplayer.plugins[this.options.id][a]||(minplayer.plugins[this.options.id][a]=[]);var c=minplayer.plugins[this.options.id][a].push(b);this.uuid=this.options.id+"__"+a+"__"+c,this.checkQueue(b),b.onAdded(this)}},minplayer.timers={},minplayer.plugin.prototype.poll=function(a,b,c){return minplayer.timers.hasOwnProperty(a)&&clearTimeout(minplayer.timers[a]),minplayer.timers[a]=setTimeout(function(d){return function e(){b.call(d)&&(minplayer.timers[a]=setTimeout(e,c))}}(this),c),minplayer.timers[a]},minplayer.plugin.prototype.get=function(a,b){return"function"==typeof a&&(b=a,a=null),minplayer.get.call(this,this.options.id,a,b)},minplayer.plugin.prototype.checkQueue=function(a){var b=null,c=0,d=!1;a=a||this,minplayer.lock=!0;var e=minplayer.queue.length;for(c=0;e>c;c++)minplayer.queue.hasOwnProperty(c)&&(b=minplayer.queue[c],d=!b.id&&!b.plugin,d|=b.plugin===a.name,d&=!b.id||b.id===this.options.id,d&&!b.addedto.hasOwnProperty(a.options.id)&&(b.addedto[a.options.id]=!0,d=minplayer.bind.call(b.context,b.event,this.options.id,a.name,b.callback,!0)));minplayer.lock=!1},minplayer.eventTypes={},minplayer.plugin.prototype.isEvent=function(a,b){var c=a+"__"+b;if("undefined"!=typeof minplayer.eventTypes[c])return minplayer.eventTypes[c];new RegExp("^(.*:)?"+b+"$","gi");return minplayer.eventTypes[c]=null!==a.match(b),minplayer.eventTypes[c]},minplayer.plugin.prototype.trigger=function(a,b,c){if(!this.active)return this;c||(this.triggered[a]=b);var d=0,e={},f=null;for(var g in this.queue)if(this.isEvent(g,a)){f=this.queue[g];for(d in f)f.hasOwnProperty(d)&&(e=f[d],e.callback({target:this,data:e.data},b))}return this},minplayer.plugin.prototype.ubind=function(a,b,c){return this.unbind(a),this.bind(a,b,c)},minplayer.plugin.prototype.bind=function(a,b,c){if(!this.active)return this;if("function"==typeof b&&(c=b,b=null),a&&c){this.queue[a]=this.queue[a]||[],this.queue[a].push({callback:c,data:b});for(var d in this.triggered)this.triggered.hasOwnProperty(d)&&this.isEvent(a,d)&&c({target:this,data:b},this.triggered[d]);return this}},minplayer.plugin.prototype.unbind=function(a){return this.lock&&setTimeout(function(b){return function(){b.unbind(a)}}(this),10),this.lock=!0,a?this.queue.hasOwnProperty(a)&&this.queue[a].length>0&&(this.queue[a].length=0):this.queue={},this.lock=!1,this},minplayer.addQueue=function(a,b,c,d,e){minplayer.lock?setTimeout(function(){minplayer.addQueue(a,c,b,d,e)},10):minplayer.queue.push({context:a,id:c,event:b,plugin:d,callback:e,addedto:{}})},minplayer.bind=function(a,b,c,d,e){if(!d)return!1;var f=minplayer.plugins,g=null,h=null,i=[],j=function(a,b){if(f.hasOwnProperty(a)&&f[a].hasOwnProperty(b))for(var c=f[a][b].length;c--;)i.push(f[a][b][c])};if(b&&c)j(b,c);else if(!b&&c)for(h in f)j(h,c);else if(b&&!c&&f[b])for(g in f[b])j(b,g);else if(!b&&!c)for(h in f)for(g in f[h])j(h,g);for(var k=i.length;k--;)i[k].bind(a,function(a){return function(b){d.call(a,b.target)}}(this));return e||minplayer.addQueue(this,a,b,c,d),i.length>0},minplayer.get=function(a,b,c){var d=typeof a,e=typeof b,f=typeof c;if("function"===d?(c=a,b=a=null):"function"===e?(c=b,b=a,a=null):"undefined"===e&&"undefined"===f&&(b=a,c=a=null),c="function"==typeof c?c:null)return void minplayer.bind.call(this,"ready",a,b,c);var g=minplayer.plugins,h=null;if(!(a||b||c))return g;if(a&&!b&&!c)return g[a];if(a&&b&&!c)return g[a][b];if(!a&&b&&!c){var i=[];for(h in g)if(g.hasOwnProperty(h)&&g[h].hasOwnProperty(b))for(var j=g[h][b].length;j--;)i.push(g[h][b][j]);return i}},minplayer.display=function(a,b,c,d){minplayer.plugin.call(this,a,b,c,d)},minplayer.display.prototype=new minplayer.plugin,minplayer.display.prototype.constructor=minplayer.display,minplayer.display.prototype.getDisplay=function(a){return a},minplayer.display.prototype.initialize=function(){this.display||(this.display=this.getDisplay(this.context,this.options)),this.display&&(this.options.pluginName="display",this.elements=this.getElements(),minplayer.plugin.prototype.initialize.call(this))},minplayer.display.prototype.construct=function(){if(minplayer.plugin.prototype.construct.call(this),this.autoHide=!1,this.onResize){var a=0;jQuery(window).resize(function(b){return function(){clearTimeout(a),a=setTimeout(function(){b.onResize()},200)}}(this))}},minplayer.display.prototype.onResize=!1,minplayer.display.prototype.hide=function(a){a=a||this.display,a&&(a.forceHide=!0,a.unbind().hide())},minplayer.display.prototype.fullScreenElement=function(){return this.display},minplayer.click=function(a,b){var c=!1;return a=jQuery(a),a.bind("touchstart click",function(a){c||(c=!0,setTimeout(function(){c=!1},100),b.call(this,a))}),a},minplayer.display.prototype.onFocus=function(a){this.hasFocus=this.focus=a,this.autoHide&&this.showThenHide(this.autoHide.element,this.autoHide.timeout,this.autoHide.cb)},minplayer.display.prototype.showThenHide=function(a,b,c){var d=typeof a;"undefined"===d?(c=null,a=this.display):"number"===d?(c=b,b=a,a=this.display):"function"===d&&(c=a,a=this.display),a&&(b=b||5e3,this.autoHide={element:a,timeout:b,cb:c},a.forceHide||("undefined"!=typeof a.showMe?a.showMe&&a.showMe(c):(a.show(),c&&c(!0))),a.hoverState||(jQuery(a).bind("mouseenter",function(){a.hoverState=!0}),jQuery(a).bind("mouseleave",function(){a.hoverState=!1})),clearTimeout(this.showTimer),this.showTimer=setTimeout(function(d){return function e(){a.hoverState?d.showTimer=setTimeout(e,b):"undefined"!=typeof a.hideMe?a.hideMe&&a.hideMe(c):a.hide("slow",function(){c&&c(!1)})}}(this),b))},minplayer.display.prototype.fullscreen=function(a){var b=this.isFullScreen(),c=this.fullScreenElement();b&&!a?(c.removeClass("fullscreen"),minplayer.screenfull&&minplayer.screenfull.exit(),this.trigger("fullscreen",!1)):!b&&a&&(c.addClass("fullscreen"),minplayer.screenfull&&(minplayer.screenfull.request(c[0]),minplayer.screenfull.onchange=function(a){return function(){minplayer.screenfull.isFullscreen||a.fullscreen(!1)}}(this)),this.trigger("fullscreen",!0))},minplayer.display.prototype.toggleFullScreen=function(){this.fullscreen(!this.isFullScreen())},minplayer.display.prototype.isFullScreen=function(){return this.fullScreenElement().hasClass("fullscreen")},minplayer.display.prototype.getScaledRect=function(a,b){var c={};return c.x=b.x?b.x:0,c.y=b.y?b.y:0,c.width=b.width?b.width:0,c.height=b.height?b.height:0,a&&(b.width/b.height>a?(c.height=b.height,c.width=Math.floor(b.height*a)):(c.height=Math.floor(b.width/a),c.width=b.width),c.x=Math.floor((b.width-c.width)/2),c.y=Math.floor((b.height-c.height)/2)),c},minplayer.display.prototype.getElements=function(){return{}},jQuery.fn.minplayer||(jQuery.fn.minplayer=function(a){return jQuery(this).each(function(){a=a||{},a.id=a.id||jQuery(this).attr("id")||Math.random(),minplayer.plugins[a.id]||(a.template=a.template||"default",minplayer[a.template]?new minplayer[a.template](jQuery(this),a):new minplayer(jQuery(this),a))})}),minplayer=jQuery.extend(function(a,b){minplayer.display.call(this,"player",a,b)},minplayer),minplayer.prototype=new minplayer.display,minplayer.prototype.constructor=minplayer,minplayer.prototype.defaultOptions=function(a){a.id="player",a.build=!1,a.wmode="transparent",a.preload=!0,a.autoplay=!1,a.autoload=!0,a.loop=!1,a.width="100%",a.height="350px",a.debug=!1,a.volume=80,a.files=null,a.file="",a.preview="",a.attributes={},a.plugins={},a.logo="",a.link="",a.duration=0,jQuery.each(this.context[0].attributes,function(b,c){a[c.name]=c.value}),minplayer.display.prototype.defaultOptions.call(this,a)},minplayer.prototype.construct=function(){minplayer.display.prototype.construct.call(this);var a=null;for(var b in this.options.plugins)a=this.options.plugins[b],minplayer[a]&&(a=minplayer[a],a[this.options.template]&&a[this.options.template].init?a[this.options.template].init(this):a.init&&a.init(this));if(this.options.pluginName="player",this.controller=this.create("controller"),this.playLoader=this.create("playLoader"),this.options.logo&&this.elements.logo){var c="";this.options.link&&(c+='<a target="_blank" href="'+this.options.link+'">'),c+='<img src="'+this.options.logo+'" >',this.options.link&&(c+="</a>"),this.logo=this.elements.logo.append(c)}this.currentPlayer="html5",this.addKeyEvents(),this.addEvents(),this.load(this.getFiles()),this.ready()},minplayer.prototype.setFocus=function(a){minplayer.get.call(this,this.options.id,null,function(b){b.onFocus(a)}),this.trigger("playerFocus",a)},minplayer.prototype.bindTo=function(a){a.ubind(this.uuid+":error",function(a){return function(b,c){"html5"===a.currentPlayer?(minplayer.player="minplayer",a.options.file.player="minplayer",a.loadPlayer()):a.showError(c)}}(this)),a.ubind(this.uuid+":fullscreen",function(a){return function(){a.resize()}}(this))},minplayer.prototype.addEvents=function(){var a=!1;this.display.bind("mouseenter",function(b){return function(){a=!0,b.setFocus(!0)}}(this)),this.display.bind("mouseleave",function(b){return function(){a=!1,b.setFocus(!1)}}(this));var b=!1;this.display.bind("mousemove",function(c){return function(){b||(b=setTimeout(function(){b=!1,a&&c.setFocus(!0)},300))}}(this)),minplayer.get.call(this,this.options.id,null,function(a){return function(b){a.bindTo(b)}}(this))},minplayer.prototype.showError=function(a){"object"!=typeof a&&(a=a||"",this.elements.error&&(this.elements.error.text(a),a?(this.elements.error.show(),setTimeout(function(a){return function(){a.elements.error.hide("slow")}}(this),5e3)):this.elements.error.hide()))},minplayer.prototype.addKeyEvents=function(){jQuery(document).bind("keydown",function(a){return function(b){switch(b.keyCode){case 113:case 27:a.isFullScreen()&&a.fullscreen(!1)}}}(this))},minplayer.prototype.getFiles=function(){if(this.options.files)return this.options.files;if(this.options.file)return this.options.file;var a=[],b=null;return this.elements.media&&(b=this.elements.media.attr("src"),b&&a.push({path:b}),jQuery("source",this.elements.media).each(function(){a.push({path:jQuery(this).attr("src"),mimetype:jQuery(this).attr("type"),codecs:jQuery(this).attr("codecs")})})),a},minplayer.getMediaFile=function(a){if(!a)return null;if("string"==typeof a||a.path||a.id)return new minplayer.file(a);var b=0,c=null,d=null;for(var e in a)a.hasOwnProperty(e)&&(d=new minplayer.file(a[e]),d.player&&d.priority>b&&(b=d.priority,c=d));return c},minplayer.prototype.loadPlayer=function(){if(!this.options.file||0===this.elements.display.length)return!1;if(!this.options.file.player)return!1;this.showError();var a=this.options.file.player.toString();if(!this.media||a!==this.currentPlayer){if(this.currentPlayer=a,!this.elements.display)return void this.showError("No media display found.");var b={};return this.media&&(b=this.media.queue,this.media.destroy()),pClass=minplayer.players[this.options.file.player],this.options.mediaelement=this.elements.media,this.media=new pClass(this.elements.display,this.options,b),this.media.load(this.options.file),this.display.addClass("minplayer-player-"+this.media.mediaFile.player),!0}return this.media?(this.media.options=this.options,this.display.removeClass("minplayer-player-"+this.media.mediaFile.player),this.media.load(this.options.file),this.display.addClass("minplayer-player-"+this.media.mediaFile.player),!1):void 0},minplayer.prototype.load=function(a){return this.options.files=a||this.options.files,this.options.file=minplayer.getMediaFile(this.options.files),this.loadPlayer()?(this.bindTo(this.media),this.options.file.mimetype&&!this.options.file.player?(this.showError("Cannot play media: "+this.options.file.mimetype),!1):!0):!1},minplayer.prototype.resize=function(){this.get(function(a){a.onResize&&a.onResize()})};var minplayer=minplayer||{};minplayer.image=function(a,b){this.loaded=!1,this.loader=null,this.ratio=0,this.img=null,minplayer.display.call(this,"image",a,b)},minplayer.image.prototype=new minplayer.display,minplayer.image.prototype.constructor=minplayer.image,minplayer.image.prototype.construct=function(){minplayer.display.prototype.construct.call(this),this.options.pluginName="image",this.display.css("overflow","hidden"),this.loader=new Image,this.loader.onload=function(a){return function(){a.loaded=!0,a.ratio=a.loader.width/a.loader.height,a.resize(),a.trigger("loaded")}}(this),this.ready()},minplayer.image.prototype.load=function(a){this.clear(function(){this.display.empty(),this.img=jQuery(document.createElement("img")).attr({src:""}).hide(),this.display.append(this.img),this.loader.src=a,this.img.attr("src",a)})},minplayer.image.prototype.clear=function(a){this.loaded=!1,this.img?this.img.fadeOut(150,function(b){return function(){b.img.attr("src",""),b.loader.src="",jQuery(this).remove(),a&&a.call(b)}}(this)):a&&a.call(this)},minplayer.image.prototype.resize=function(a,b){if(a=a||this.display.parent().width(),b=b||this.display.parent().height(),a&&b&&this.loaded){var c=this.getScaledRect(this.ratio,{width:a,height:b});this.img&&this.img.attr("src",this.loader.src).css({marginLeft:c.x,marginTop:c.y,width:c.width,height:c.height}),this.img.fadeIn(150)}},minplayer.image.prototype.onResize=function(){this.resize()};var minplayer=minplayer||{};minplayer.file=function(a){return a?(a="string"==typeof a?{path:a}:a,a.hasOwnProperty("isMinPlayerFile")?a:(this.isMinPlayerFile=!0,this.duration=a.duration||0,this.bytesTotal=a.bytesTotal||0,this.quality=a.quality||0,this.stream=a.stream||"",this.path=a.path||"",this.codecs=a.codecs||"",this.extension=a.extension||this.getFileExtension(),this.mimetype=a.mimetype||a.filemime||this.getMimeType(),this.type=a.type||this.getType(),this.type||(this.mimetype=this.getMimeType(),this.type=this.getType()),this.player=minplayer.player||a.player||this.getBestPlayer(),this.priority=a.priority||this.getPriority(),this.id=a.id||this.getId(),void(this.path||(this.path=this.id)))):null},minplayer.player="",minplayer.file.prototype.getBestPlayer=function(){var a=null,b=0;return jQuery.each(minplayer.players,function(c){return function(d,e){var f=e.getPriority(c);e.canPlay(c)&&f>b&&(a=d,b=f)}}(this)),a},minplayer.file.prototype.getPriority=function(){var a=1;switch(this.player&&(a=minplayer.players[this.player].getPriority(this)),this.mimetype){case"video/x-webm":case"video/webm":case"application/octet-stream":case"application/vnd.apple.mpegurl":return 10*a;case"video/mp4":case"audio/mp4":case"audio/mpeg":return 9*a;case"video/ogg":case"audio/ogg":case"video/quicktime":return 8*a;default:return 5*a}},minplayer.file.prototype.getFileExtension=function(){return this.path.substring(this.path.lastIndexOf(".")+1).toLowerCase()},minplayer.file.prototype.getMimeType=function(){switch(this.extension){case"mp4":case"m4v":case"flv":case"f4v":return"video/mp4";case"m3u8":return"application/vnd.apple.mpegurl";case"webm":return"video/webm";case"ogg":case"ogv":return"video/ogg";case"3g2":return"video/3gpp2";case"3gpp":case"3gp":return"video/3gpp";case"mov":return"video/quicktime";case"swf":return"application/x-shockwave-flash";case"oga":return"audio/ogg";case"mp3":return"audio/mpeg";case"m4a":case"f4a":return"audio/mp4";case"aac":return"audio/aac";case"wav":return"audio/vnd.wave";case"wma":return"audio/x-ms-wma";default:return"unknown"}},minplayer.file.prototype.getType=function(){var a=this.mimetype.match(/([^\/]+)(\/)/);if(a=a&&a.length>1?a[1]:"","video"===a)return"video";if("audio"===a)return"audio";switch(this.mimetype){case"application/octet-stream":case"application/x-shockwave-flash":case"application/vnd.apple.mpegurl":return"video"}return""},minplayer.file.prototype.getId=function(){var a=minplayer.players[this.player];return a&&a.getMediaId?a.getMediaId(this):""};var minplayer=minplayer||{};minplayer.playLoader=function(a,b){this.clear(),minplayer.display.call(this,"playLoader",a,b)},minplayer.playLoader.prototype=new minplayer.display,minplayer.playLoader.prototype.constructor=minplayer.playLoader,minplayer.playLoader.prototype.construct=function(){minplayer.display.prototype.construct.call(this),this.options.pluginName="playLoader",this.initializePlayLoader(),this.ready()},minplayer.playLoader.prototype.initializePlayLoader=function(){this.get("media",function(a){if(a.hasPlayLoader(this.options.preview))this.enabled=!1,this.hide(this.elements.busy),this.hide(this.elements.bigPlay),this.hide(this.elements.preview),this.hide();else{this.enabled=!0,this.options.preview||(this.options.preview=a.poster);var b=!0;this.preview&&this.preview.loader&&(b=this.preview.loader.src!==this.options.preview),b&&(a.elements.media.attr("poster",""),this.loadPreview()),this.elements.bigPlay&&minplayer.click(this.elements.bigPlay.unbind(),function(b){b.preventDefault(),jQuery(this).hide(),a.play()}),a.ubind(this.uuid+":loadstart",function(a){return function(){a.busy.setFlag("media",!0),a.bigPlay.setFlag("media",!0),a.previewFlag.setFlag("media",!0),a.checkVisibility()}}(this)),a.ubind(this.uuid+":waiting",function(a){return function(b,c,d){d||(a.busy.setFlag("media",!0),a.checkVisibility())}}(this)),a.ubind(this.uuid+":loadeddata",function(a){return function(b,c,d){d||(a.busy.setFlag("media",!1),a.checkVisibility())}}(this)),a.ubind(this.uuid+":playing",function(b){return function(c,d,e){e||(b.busy.setFlag("media",!1),b.bigPlay.setFlag("media",!1),"audio"!==a.mediaFile.type&&b.previewFlag.setFlag("media",!1),b.checkVisibility())}}(this)),a.ubind(this.uuid+":pause",function(a){return function(b,c,d){d||(a.busy.setFlag("media",!1),a.bigPlay.setFlag("media",!0),a.checkVisibility())}}(this))}})},minplayer.playLoader.prototype.clear=function(a){this.busy=new minplayer.flags,this.bigPlay=new minplayer.flags,this.previewFlag=new minplayer.flags,this.enabled=!0,this.preview?this.preview.clear(function(b){return function(){b.preview=null,a&&a()}}(this)):(this.preview=null,a&&a())},minplayer.playLoader.prototype.loadPreview=function(a){if(a=a||this.options.preview,this.options.preview=a,this.enabled&&0!==this.display.length){if(this.elements.preview){if(this.options.preview)return this.elements.preview.addClass("has-preview").show(),this.preview=new minplayer.image(this.elements.preview,this.options),this.preview.load(this.options.preview),!0;this.elements.preview.hide()}return!1}},minplayer.playLoader.prototype.checkVisibility=function(){this.enabled&&(this.busy.flag?this.elements.busy.show():this.elements.busy.hide(),this.bigPlay.flag?this.elements.bigPlay.show():this.elements.bigPlay.hide(),this.previewFlag.flag?this.elements.preview.show():this.elements.preview.hide(),(this.bigPlay.flag||this.busy.flag||this.previewFlag.flag)&&this.display.show(),this.bigPlay.flag||this.busy.flag||this.previewFlag.flag||this.display.hide())};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.base=function(a,b,c){minplayer.display.call(this,"media",a,b,c)},minplayer.players.base.prototype=new minplayer.display,minplayer.players.base.prototype.constructor=minplayer.players.base,minplayer.players.base.prototype.getElements=function(){var a=minplayer.display.prototype.getElements.call(this);return jQuery.extend(a,{media:this.options.mediaelement})},minplayer.players.base.prototype.defaultOptions=function(a){a.range={min:0,max:0},minplayer.display.prototype.defaultOptions.call(this,a)},minplayer.players.base.getPriority=function(){return 0},minplayer.players.base.getMediaId=function(){return""},minplayer.players.base.canPlay=function(){return!1},minplayer.players.base.prototype.construct=function(){minplayer.display.prototype.construct.call(this),this.elements.media&&(this.poster=this.elements.media.attr("poster")),this.options.pluginName="basePlayer",this.readyQueue=[],this.loadedQueue=[],this.mediaFile=this.options.file,this.clear(),this.setupPlayer()},minplayer.players.base.prototype.setupPlayer=function(){this.playerFound()||this.addPlayer(),this.player=this.getPlayer(),minplayer.click(this.display,function(a){return function(){a.playing?a.pause():a.play()}}(this)),jQuery(document).bind("keydown",function(a){return function(b){if(a.hasFocus)switch(b.preventDefault(),b.keyCode){case 32:case 179:a.playing?a.pause():a.play();break;case 38:a.setVolumeRelative(.1);break;case 40:a.setVolumeRelative(-.1);break;case 37:case 227:a.seekRelative(-.05);break;case 39:case 228:a.seekRelative(.05)}}}(this))},minplayer.players.base.prototype.addPlayer=function(){this.elements.media&&this.elements.media.remove(),this.elements.media=jQuery(this.createPlayer()),this.display.html(this.elements.media)},minplayer.players.base.prototype.destroy=function(){minplayer.plugin.prototype.destroy.call(this),this.clear()},minplayer.players.base.prototype.clear=function(){this.playerReady=!1,this.reset(),this.player&&(jQuery(this.player).remove(),this.player=null)},minplayer.players.base.prototype.reset=function(){this.realDuration=0,this.duration=new minplayer.async,this.currentTime=new minplayer.async,this.bytesLoaded=new minplayer.async,this.bytesTotal=new minplayer.async,this.bytesStart=new minplayer.async,this.volume=new minplayer.async,this.hasFocus=!1,this.playing=!1,this.loading=!1,this.loaded=!1,this.trigger("pause",null,!0),this.trigger("waiting",null,!0),this.trigger("progress",{loaded:0,total:0,start:0},!0),this.trigger("timeupdate",{currentTime:0,duration:0},!0)},minplayer.players.base.prototype.onReady=function(){if(!this.playerReady)if(this.setStartStop(),this.playerReady=!0,this.setVolume(this.options.volume/100),this.loading=!0,this.poll("progress",function(a){return function(){return a.loading&&a.getBytesLoaded(function(b){a.getBytesTotal(function(c){if(b||c){var d=0;a.getBytesStart(function(a){d=a}),a.trigger("progress",{loaded:b,total:c,start:d}),b>=c&&(a.loading=!1)}})}),a.loading}}(this),1e3),this.ready(),this.isReady()){for(var a in this.readyQueue)this.readyQueue[a].call(this);this.readyQueue.length=0,this.readyQueue=[],this.loaded||this.trigger("loadstart")}else this.readyQueue.length=0,this.readyQueue=[]},minplayer.players.base.prototype.parseTime=function(a){var b=0,c=0,d=0;return a?("string"!=typeof a&&(a=String(a)),b=a.match(/([0-9]+)s/i),b&&(b=parseInt(b[1],10)),c=a.match(/([0-9]+)m/i),c&&(b+=60*parseInt(c[1],10)),d=a.match(/([0-9]+)h/i),d&&(b+=3600*parseInt(d[1],10)),b||(b=a),Number(b)):0},minplayer.players.base.prototype.setStartStop=function(){return this.startTime?this.startTime:(this.startTime=0,this.offsetTime=this.parseTime(this.options.range.min),minplayer.urlVars&&(this.startTime=this.parseTime(minplayer.urlVars.seek)),this.startTime||(this.startTime=this.offsetTime),this.stopTime=this.options.range.max?this.parseTime(this.options.range.max):0,this.mediaRange=this.stopTime-this.offsetTime,this.mediaRange<0&&(this.mediaRange=0),this.startTime)},minplayer.players.base.prototype.onPlaying=function(){if(!this.playing){var a=this;this.getDuration(function(b){a.startTime&&a.startTime<b&&(a.seek(a.startTime,null,!0),a.options.autoplay&&a.play())})}this.trigger("playing"),this.hasFocus=!0,this.playing=!0,this.loaded=!0,this.poll("timeupdate",function(a){return function(){return a.playing&&a.getCurrentTime(function(b){a.getDuration(function(c){b=parseFloat(b),c=parseFloat(c),(b||c)&&a.trigger("timeupdate",{currentTime:b,duration:c})})}),a.playing}}(this),500)},minplayer.players.base.prototype.onPaused=function(){this.trigger("pause"),this.hasFocus=!1,this.playing=!1},minplayer.players.base.prototype.onComplete=function(){this.playing&&this.onPaused(),this.playing=!1,this.loading=!1,this.hasFocus=!1,this.trigger("ended")},minplayer.players.base.prototype.onLoaded=function(){this.loaded;for(var a in this.loadedQueue)this.loadedQueue[a].call(this);this.loadedQueue.length=0,this.loadedQueue=[],!this.loaded&&this.options.autoplay&&this.play(),this.loaded=!0,this.trigger("loadeddata")},minplayer.players.base.prototype.onWaiting=function(){this.trigger("waiting")},minplayer.players.base.prototype.onError=function(a){this.hasFocus=!1,this.trigger("error",a)},minplayer.players.base.prototype.isReady=function(){return this.player&&this.playerReady},minplayer.players.base.prototype.whenReady=function(a){this.isReady()?a.call(this):this.readyQueue.push(a)},minplayer.players.base.prototype.whenLoaded=function(a){this.loaded?a.call(this):this.loadedQueue.push(a)},minplayer.players.base.prototype.hasPlayLoader=function(){return!1},minplayer.players.base.prototype.hasController=function(){return!1},minplayer.players.base.prototype.playerFound=function(){return!1},minplayer.players.base.prototype.createPlayer=function(){return this.reset(),null},minplayer.players.base.prototype.getPlayer=function(){return this.player},minplayer.players.base.prototype.load=function(a,b){var c="string"==typeof this.mediaFile,d=c?this.mediaFile:this.mediaFile.path;a&&a.path!==d?(this.isReady()||this.setupPlayer(),this.reset(),this.mediaFile=a,b&&b.call(this)):this.options.autoplay&&!this.playing?this.play():this.seek(0,function(){this.pause(),this.trigger("progress",{loaded:0,total:0,start:0},!0),this.trigger("timeupdate",{currentTime:0,duration:0},!0)})},minplayer.players.base.prototype.play=function(a){this.options.autoload=!0,"undefined"==typeof this.options.originalAutoPlay&&(this.options.originalAutoPlay=this.options.autoplay),this.options.autoplay=!0,this.whenLoaded(a)},minplayer.players.base.prototype.pause=function(a){this.whenLoaded(a)},minplayer.players.base.prototype.stop=function(a){this.playing=!1,this.loading=!1,this.hasFocus=!1,this.whenLoaded(a)},minplayer.players.base.prototype.seekRelative=function(a){this.getCurrentTime(function(b){return function(c){b.getDuration(function(d){if(d){var e=0;e=a>-1&&1>a?(c/d+parseFloat(a))*d:c+parseFloat(a),b.seek(e)}})}}(this))},minplayer.players.base.prototype.seek=function(a,b,c){this.whenLoaded(function(){a=Number(a),c||(a+=this.offsetTime),this._seek(a),b&&b.call(this)})},minplayer.players.base.prototype._seek=function(){},minplayer.players.base.prototype.setVolumeRelative=function(a){this.getVolume(function(b){return function(c){c+=parseFloat(a),c=0>c?0:c,c=c>1?1:c,b.setVolume(c)}}(this))},minplayer.players.base.prototype.setVolume=function(a,b){this.trigger("volumeupdate",a),this.whenLoaded(b)},minplayer.players.base.prototype.getValue=function(a,b,c){this.whenLoaded(function(){var d=this;this[a](function(a){null!==a?c.call(d,a):d[b].get(c)})})},minplayer.players.base.prototype.getVolume=function(a){this.getValue("_getVolume","volume",a)},minplayer.players.base.prototype._getVolume=function(a){a(null)},minplayer.players.base.prototype.getCurrentTime=function(a){var b=this;this.getValue("_getCurrentTime","currentTime",function(c){b.setStartStop(),b.stopTime&&c>b.stopTime&&b.stop(function(){b.onComplete()}),c-=b.offsetTime,a(c)})},minplayer.players.base.prototype._getCurrentTime=function(a){a(null)},minplayer.players.base.prototype.getDuration=function(a){if(this.options.duration)a(this.options.duration);else{var b=this;this.getValue("_getDuration","duration",function(c){b.setStartStop(),b.realDuration=c,a(b.mediaRange?b.mediaRange:c)
})}},minplayer.players.base.prototype._getDuration=function(a){a(null)},minplayer.players.base.prototype.getBytesStart=function(a){this.getValue("_getBytesStart","bytesStart",a)},minplayer.players.base.prototype._getBytesStart=function(a){a(null)},minplayer.players.base.prototype.getBytesLoaded=function(a){this.getValue("_getBytesLoaded","bytesLoaded",a)},minplayer.players.base.prototype._getBytesLoaded=function(a){a(null)},minplayer.players.base.prototype.getBytesTotal=function(a){this.getValue("_getBytesTotal","bytesTotal",a)},minplayer.players.base.prototype._getBytesTotal=function(a){a(null)};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.dailymotion=function(a,b,c){this.quality="default",minplayer.players.base.call(this,a,b,c)},minplayer.players.dailymotion.prototype=new minplayer.players.base,minplayer.players.dailymotion.prototype.constructor=minplayer.players.dailymotion,minplayer.players.dailymotion.prototype.construct=function(){minplayer.players.base.prototype.construct.call(this),this.options.pluginName="dailymotion"},minplayer.players.dailymotion.getPriority=function(){return 10},minplayer.players.dailymotion.canPlay=function(a){if("video/dailymotion"===a.mimetype)return!0;var b=/^http(s)?\:\/\/(www\.)?(dailymotion\.com)/i;return 0===a.path.search(b)},minplayer.players.dailymotion.getMediaId=function(a){var b="^http[s]?\\:\\/\\/(www\\.)?";b+="(dailymotion\\.com\\/video/)",b+="([a-z0-9\\-]+)",b+="_*";var c=RegExp(b,"i");return 0===a.path.search(c)?a.path.match(c)[3]:a.path},minplayer.players.dailymotion.getImage=function(a,b,c){c("http://www.dailymotion.com/thumbnail/video/"+a.id)},minplayer.players.dailymotion.parseNode=function(){return{title:node.title,description:node.description,mediafiles:{image:{thumbnail:{path:node.thumbnail_small_url},image:{path:node.thumbnail_url}},media:{media:{player:"dailymotion",id:node.id}}}}},minplayer.players.dailymotion.getNode=function(a,b){var c="https://api.dailymotion.com/video/"+a.id;c+="?fields=title,id,description,thumbnail_small_url,thumbnail_url",jQuery.get(c,function(a){b(minplayer.players.dailymotion.parseNode(a.data))},"jsonp")},minplayer.players.dailymotion.prototype.onReady=function(){minplayer.players.base.prototype.onReady.call(this),this.options.autoplay||this.pause(),this.onLoaded()},minplayer.players.dailymotion.prototype.playerFound=function(){return this.display.find(this.mediaFile.type).length>0},minplayer.players.dailymotion.prototype.onQualityChange=function(a){this.quality=a.data},minplayer.players.dailymotion.prototype.hasPlayLoader=function(a){return minplayer.hasTouch||!a},minplayer.players.dailymotion.prototype.hasController=function(){return minplayer.isIDevice},minplayer.players.dailymotion.prototype.createPlayer=function(){minplayer.players.base.prototype.createPlayer.call(this);var a=document.location.protocol;if(a+="//api.dmcdn.net/all.js",0===jQuery('script[src="'+a+'"]').length){var b=document.createElement("script");b.src=a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}return this.playerId=this.options.id+"-player",this.poll(this.options.id+"_dailymotion",function(a){return function(){var b=jQuery("#"+a.playerId).length>0;if(b=b&&"DM"in window,b=b&&"function"==typeof DM.player){jQuery("#"+a.playerId).addClass("dailymotion-player");var c={};c={id:a.playerId,api:minplayer.isIDevice?0:1,wmode:"opaque",controls:minplayer.isAndroid?1:0,related:0,info:0,logo:0},a.player=new DM.player(a.playerId,{video:a.mediaFile.id,height:"100%",width:"100%",frameborder:0,params:c}),a.player.addEventListener("apiready",function(){a.onReady(a)}),a.player.addEventListener("ended",function(){a.onComplete(a)}),a.player.addEventListener("playing",function(){a.onPlaying(a)}),a.player.addEventListener("progress",function(){a.onWaiting(a)}),a.player.addEventListener("pause",function(){a.onPaused(a)}),a.player.addEventListener("error",function(){a.onError(a)})}return!b}}(this),200),jQuery(document.createElement("div")).attr({id:this.playerId})},minplayer.players.dailymotion.prototype.load=function(a,b){minplayer.players.base.prototype.load.call(this,a,function(){this.player.load(a.id),b&&b.call(this)})},minplayer.players.dailymotion.prototype.play=function(a){minplayer.players.base.prototype.play.call(this,function(){this.onWaiting(),this.player.play(),a&&a.call(this)})},minplayer.players.dailymotion.prototype.pause=function(a){minplayer.players.base.prototype.pause.call(this,function(){this.loaded&&(this.player.pause(),a&&a.call(this))})},minplayer.players.dailymotion.prototype.stop=function(a){minplayer.players.base.prototype.stop.call(this,function(){this.player.pause(),a&&a.call(this)})},minplayer.players.dailymotion.prototype._seek=function(a){this.onWaiting(),this.player.seek(a)},minplayer.players.dailymotion.prototype.setVolume=function(a,b){minplayer.players.base.prototype.setVolume.call(this,a,function(){this.loaded&&(this.player.setVolume(a),void 0!==b&&b.call(this))})},minplayer.players.dailymotion.prototype._getVolume=function(a){a(this.player.volume)},minplayer.players.dailymotion.prototype._getDuration=function(a){a(this.player.duration)},minplayer.players.dailymotion.prototype._getCurrentTime=function(a){a(this.player.currentTime)};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.html5=function(a,b,c){minplayer.players.base.call(this,a,b,c)},minplayer.players.html5.prototype=new minplayer.players.base,minplayer.players.html5.prototype.constructor=minplayer.players.html5,minplayer.players.html5.getPriority=function(){return 10},minplayer.players.html5.canPlay=function(a){switch(a.mimetype){case"video/ogg":return!!minplayer.playTypes.videoOGG;case"video/mp4":case"video/x-mp4":case"video/m4v":case"video/x-m4v":return!!minplayer.playTypes.videoH264;case"application/vnd.apple.mpegurl":return!!minplayer.playTypes.videoMPEGURL;case"video/x-webm":case"video/webm":case"application/octet-stream":return!!minplayer.playTypes.videoWEBM;case"audio/ogg":return!!minplayer.playTypes.audioOGG;case"audio/mpeg":return!!minplayer.playTypes.audioMP3;case"audio/mp4":return!!minplayer.playTypes.audioMP4;default:return!1}},minplayer.players.html5.prototype.construct=function(){minplayer.players.base.prototype.construct.call(this),this.options.pluginName="html5",this.hasEnded=!1,this.addPlayerEvents()},minplayer.players.html5.prototype.addPlayerEvent=function(a,b){this.player&&this.player.addEventListener(a,function(c){var d=a+"Event";return c[d]&&c.player.removeEventListener(a,c[d],!1),c[d]=function(a){b.call(c,a)},c[d]}(this),!1)},minplayer.players.html5.prototype.addPlayerEvents=function(){if(this.player){this.addPlayerEvent("abort",function(){this.trigger("abort")}),this.addPlayerEvent("loadstart",function(){this.onReady(),this.options.autoload||this.onLoaded()}),this.addPlayerEvent("loadeddata",function(){this.onLoaded()}),this.addPlayerEvent("loadedmetadata",function(){this.onLoaded()}),this.addPlayerEvent("canplaythrough",function(){this.onLoaded()}),this.addPlayerEvent("ended",function(){this.hasEnded=!0,this.onComplete()}),this.addPlayerEvent("pause",function(){this.onPaused()}),this.addPlayerEvent("play",function(){this.onPlaying()}),this.addPlayerEvent("playing",function(){this.onPlaying()});var a=!1;return this.addPlayerEvent("error",function(){this.hasEnded||a||!this.player||(a=!0,this.trigger("error","An error occured - "+this.player.error.code))}),this.addPlayerEvent("waiting",function(){this.onWaiting()}),this.addPlayerEvent("durationchange",function(){if(this.player){this.duration.set(this.player.duration);var a=this;this.getDuration(function(b){a.trigger("durationchange",{duration:b})})}}),this.addPlayerEvent("progress",function(a){this.bytesTotal.set(a.total),this.bytesLoaded.set(a.loaded)}),!0}return!1},minplayer.players.html5.prototype.onReady=function(){minplayer.players.base.prototype.onReady.call(this),minplayer.isAndroid&&this.onLoaded(),minplayer.isIDevice&&setTimeout(function(a){return function(){a.pause(),a.onLoaded()}}(this),1)},minplayer.players.html5.prototype.playerFound=function(){return this.display.find(this.mediaFile.type).length>0},minplayer.players.html5.prototype.createPlayer=function(){minplayer.players.base.prototype.createPlayer.call(this);var a=jQuery(document.createElement(this.mediaFile.type)).attr(this.options.attributes).append(jQuery(document.createElement("source")).attr({src:this.mediaFile.path}));a.eq(0)[0].setAttribute("width","100%"),a.eq(0)[0].setAttribute("height","100%");var b=this.options.autoload?"metadata":"none";return b=minplayer.isIDevice?"metadata":b,a.eq(0)[0].setAttribute("preload",b),this.options.autoload||a.eq(0)[0].setAttribute("autobuffer",!1),a},minplayer.players.html5.prototype.getPlayer=function(){return this.elements.media.eq(0)[0]},minplayer.players.html5.prototype.load=function(a,b){minplayer.players.base.prototype.load.call(this,a,function(){this.hasEnded=!1;var c=this.elements.media.attr("src");c||(c=jQuery("source",this.elements.media).eq(0).attr("src")),c!==a.path&&(this.addPlayer(),this.player=this.getPlayer(),this.addPlayerEvents(),this.player.src=a.path,b&&b.call(this))})},minplayer.players.html5.prototype.play=function(a){minplayer.players.base.prototype.play.call(this,function(){this.player.play(),a&&a.call(this)})},minplayer.players.html5.prototype.pause=function(a){minplayer.players.base.prototype.pause.call(this,function(){this.player.pause(),a&&a.call(this)})},minplayer.players.html5.prototype.stop=function(a){minplayer.players.base.prototype.stop.call(this,function(){this.player.pause(),a&&a.call(this)})},minplayer.players.html5.prototype.clear=function(){minplayer.players.base.prototype.clear.call(this),this.player&&(this.player.src="")},minplayer.players.html5.prototype._seek=function(a){this.player.currentTime=a},minplayer.players.html5.prototype.setVolume=function(a,b){minplayer.players.base.prototype.setVolume.call(this,a,function(){this.player.volume=a,b&&b.call(this)})},minplayer.players.html5.prototype._getVolume=function(a){a(this.player.volume)},minplayer.players.html5.prototype._getDuration=function(a){a(this.player.duration)},minplayer.players.html5.prototype._getCurrentTime=function(a){a(this.player.currentTime)},minplayer.players.html5.prototype._getBytesLoaded=function(a){var b=0;this.bytesLoaded.value?b=this.bytesLoaded.value:this.player.buffered&&this.player.buffered.length>0&&this.player.buffered.end&&this.player.duration?b=this.player.buffered.end(0):void 0!==this.player.bytesTotal&&this.player.bytesTotal>0&&void 0!==this.player.bufferedBytes&&(b=this.player.bufferedBytes),a(b)},minplayer.players.html5.prototype._getBytesTotal=function(a){var b=0;this.bytesTotal.value?b=this.bytesTotal.value:this.player.buffered&&this.player.buffered.length>0&&this.player.buffered.end&&this.player.duration?b=this.player.duration:void 0!==this.player.bytesTotal&&this.player.bytesTotal>0&&void 0!==this.player.bufferedBytes&&(b=this.player.bytesTotal),a(b)};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.flash=function(a,b,c){minplayer.players.base.call(this,a,b,c)},minplayer.players.flash.prototype=new minplayer.players.base,minplayer.players.flash.prototype.constructor=minplayer.players.flash,minplayer.players.flash.prototype.construct=function(){minplayer.players.base.prototype.construct.call(this),this.options.pluginName="flash"},minplayer.players.flash.getPriority=function(){return 0},minplayer.players.flash.canPlay=function(){return!1},minplayer.players.flash.prototype.getFlash=function(a){var b=document.createElement("script");b.src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";var c=document.getElementsByTagName("script")[0];return c.parentNode.insertBefore(b,c),setTimeout(function(b){return function c(){"undefined"!=typeof swfobject?swfobject.embedSWF(a.swf,a.id,a.width,a.height,"9.0.0",!1,a.flashvars,{allowscriptaccess:"always",allowfullscreen:"true",wmode:a.wmode,quality:"high"},{id:a.id,name:a.id,playerType:"flash"},function(a){b.player=a.ref}):setTimeout(c,200)}}(this),200),'<div id="'+a.id+'"></div>'},minplayer.players.flash.prototype.playerFound=function(){return this.display.find('object[playerType="flash"]').length>0};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.minplayer=function(a,b,c){minplayer.players.flash.call(this,a,b,c)},minplayer.players.minplayer.prototype=new minplayer.players.flash,minplayer.players.minplayer.prototype.constructor=minplayer.players.minplayer,minplayer.players.minplayer.prototype.construct=function(){minplayer.players.flash.prototype.construct.call(this),this.options.pluginName="minplayer"},window.onFlashPlayerReady=function(a){for(var b=minplayer.get(a,"media"),c=b.length;c--;)b[c].onReady()},window.onFlashPlayerUpdate=function(a,b){for(var c=minplayer.get(a,"media"),d=c.length;d--;)c[d].onMediaUpdate(b)},window.onFlashPlayerDebug=function(a){console&&console.log&&console.log(a)},minplayer.players.minplayer.getPriority=function(a){return a.stream?100:1},minplayer.players.minplayer.canPlay=function(a){if(a.stream)return!0;var b=jQuery.inArray(a.mimetype,["video/x-webm","video/webm","application/octet-stream"])>=0;return!b&&("video"===a.type||"audio"===a.type)},minplayer.players.minplayer.prototype.createPlayer=function(){this.options.swfplayer||(this.options.swfplayer="http://mediafront.org/assets/osmplayer/minplayer",this.options.swfplayer+="/flash/minplayer.swf"),minplayer.players.flash.prototype.createPlayer.call(this);var a={id:this.options.id,debug:this.options.debug,config:"nocontrols",file:this.mediaFile.path,autostart:this.options.autoplay,autoload:this.options.autoload};return this.mediaFile.stream&&(a.stream=this.mediaFile.stream),this.getFlash({swf:this.options.swfplayer,id:this.options.id+"_player",width:"100%",height:"100%",flashvars:a,wmode:this.options.wmode})},minplayer.players.minplayer.prototype.onMediaUpdate=function(a){switch(a){case"mediaMeta":this.onLoaded();break;case"mediaConnected":this.onLoaded(),this.onPaused();break;case"mediaPlaying":this.onPlaying();break;case"mediaPaused":this.onPaused();break;case"mediaComplete":this.onComplete()}},minplayer.players.minplayer.prototype.load=function(a,b){minplayer.players.flash.prototype.load.call(this,a,function(){this.loaded?this.stop(function(){this.player.loadMedia(a.path,a.stream),b&&b.call(this)}):(this.player.loadMedia(a.path,a.stream),b&&b.call(this))})},minplayer.players.minplayer.prototype.play=function(a){minplayer.players.flash.prototype.play.call(this,function(){this.player.playMedia(),a&&a.call(this)})},minplayer.players.minplayer.prototype.pause=function(a){minplayer.players.flash.prototype.pause.call(this,function(){this.player.pauseMedia(),a&&a.call(this)})},minplayer.players.minplayer.prototype.stop=function(a){minplayer.players.flash.prototype.stop.call(this,function(){this.player.stopMedia(),a&&a.call(this)})},minplayer.players.minplayer.prototype._seek=function(a){this.player.seekMedia(a)},minplayer.players.minplayer.prototype.setVolume=function(a,b){minplayer.players.flash.prototype.setVolume.call(this,a,function(){this.player.setVolume(a),b&&b.call(this)})},minplayer.players.minplayer.prototype._getVolume=function(a){a(this.player.getVolume())},minplayer.players.minplayer.prototype._getDuration=function(a){var b=this,c=0,d=function(){c=b.player.getDuration(),c?a(c):setTimeout(d,1e3)};d()},minplayer.players.minplayer.prototype._getCurrentTime=function(a){a(this.player.getCurrentTime())},minplayer.players.minplayer.prototype._getBytesLoaded=function(a){a(this.player.getMediaBytesLoaded())},minplayer.players.minplayer.prototype._getBytesTotal=function(a){a(this.player.getMediaBytesTotal())};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.youtube=function(a,b,c){this.quality="default",minplayer.players.base.call(this,a,b,c)},minplayer.players.youtube.prototype=new minplayer.players.base,minplayer.players.youtube.prototype.constructor=minplayer.players.youtube,minplayer.players.youtube.prototype.construct=function(){minplayer.players.base.prototype.construct.call(this),this.options.pluginName="youtube"},minplayer.players.youtube.getPriority=function(){return 10},minplayer.players.youtube.canPlay=function(a){if("video/youtube"===a.mimetype)return!0;var b=/^http(s)?\:\/\/(www\.)?(youtube\.com|youtu\.be)/i;return 0===a.path.search(b)},minplayer.players.youtube.getMediaId=function(a){var b="^http[s]?\\:\\/\\/(www\\.)?";b+="(youtube\\.com\\/watch\\?v=|youtu\\.be\\/)",b+="([a-zA-Z0-9_\\-]+)";var c=RegExp(b,"i");return 0===a.path.search(c)?a.path.match(c)[3]:a.path},minplayer.players.youtube.getImage=function(a,b,c){b="thumbnail"===b?"1":"0",c("https://img.youtube.com/vi/"+a.id+"/"+b+".jpg")},minplayer.players.youtube.parseNode=function(a){var b="undefined"!=typeof a.video?a.video:a;return{title:b.title,description:b.description,mediafiles:{image:{thumbnail:{path:b.thumbnail.sqDefault},image:{path:b.thumbnail.hqDefault}},media:{media:{player:"youtube",id:b.id}}}}},minplayer.players.youtube.getNode=function(a,b){var c="https://gdata.youtube.com/feeds/api/videos/"+a.id;c+="?v=2&alt=jsonc",jQuery.get(c,function(a){b(minplayer.players.youtube.parseNode(a.data))})},minplayer.players.youtube.prototype.setPlayerState=function(a){switch(a){case YT.PlayerState.CUED:break;case YT.PlayerState.BUFFERING:this.onWaiting();break;case YT.PlayerState.UNSTARTED:case YT.PlayerState.PAUSED:this.onPaused();break;case YT.PlayerState.PLAYING:this.onPlaying();break;case YT.PlayerState.ENDED:this.onComplete()}},minplayer.players.youtube.prototype.onReady=function(){minplayer.players.base.prototype.onReady.call(this),this.options.autoplay||this.pause(),this.onLoaded()},minplayer.players.youtube.prototype.playerFound=function(){var a="iframe#"+this.options.id+"-player.youtube-player",b=this.display.find(a);return b.length>0},minplayer.players.youtube.prototype.onPlayerStateChange=function(a){this.setPlayerState(a.data)},minplayer.players.youtube.prototype.onQualityChange=function(a){this.quality=a.data},minplayer.players.youtube.prototype.hasPlayLoader=function(a){return minplayer.hasTouch||!a},minplayer.players.youtube.prototype.hasController=function(){return minplayer.isIDevice},minplayer.players.youtube.prototype.createPlayer=function(){minplayer.players.base.prototype.createPlayer.call(this);var a="https://www.youtube.com/iframe_api";if(0===jQuery('script[src="'+a+'"]').length){var b=document.createElement("script");b.src=a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}return this.playerId=this.options.id+"-player",this.poll(this.options.id+"_youtube",function(a){return function(){var b=jQuery("#"+a.playerId).length>0;if(b=b&&"YT"in window,b=b&&"function"==typeof YT.Player){jQuery("#"+a.playerId).addClass("youtube-player");var c=location.protocol;c+="//"+location.hostname,c+=location.port&&":"+location.port;var d={};minplayer.isIDevice?d.origin=c:d={enablejsapi:minplayer.isIDevice?0:1,origin:c,wmode:"opaque",controls:minplayer.isAndroid?1:0,rel:0,showinfo:0},a.player=new YT.Player(a.playerId,{height:"100%",width:"100%",frameborder:0,videoId:a.mediaFile.id,playerVars:d,events:{onReady:function(b){a.onReady(b)},onStateChange:function(b){a.onPlayerStateChange(b)},onPlaybackQualityChange:function(b){a.onQualityChange(b)},onError:function(b){a.onError(b)}}})}return!b}}(this),200),jQuery(document.createElement("div")).attr({id:this.playerId})},minplayer.players.youtube.prototype.load=function(a,b){minplayer.players.base.prototype.load.call(this,a,function(){this.player.loadVideoById(a.id,0,this.quality),b&&b.call(this)})},minplayer.players.youtube.prototype.play=function(a){minplayer.players.base.prototype.play.call(this,function(){this.onWaiting(),this.player.playVideo(),a&&a.call(this)})},minplayer.players.youtube.prototype.pause=function(a){minplayer.players.base.prototype.pause.call(this,function(){this.player.pauseVideo(),a&&a.call(this)})},minplayer.players.youtube.prototype.stop=function(a){minplayer.players.base.prototype.stop.call(this,function(){this.player.stopVideo(),a&&a.call(this)})},minplayer.players.youtube.prototype._seek=function(a){this.onWaiting(),this.player.seekTo(a,!0)},minplayer.players.youtube.prototype.setVolume=function(a,b){minplayer.players.base.prototype.setVolume.call(this,a,function(){this.player.setVolume(100*a),b&&b.call(this)})},minplayer.players.youtube.prototype._getVolume=function(a){a(this.player.getVolume())},minplayer.players.youtube.prototype._getDuration=function(a){a(this.player.getDuration())},minplayer.players.youtube.prototype._getCurrentTime=function(a){a(this.player.getCurrentTime())},minplayer.players.youtube.prototype._getBytesStart=function(a){a(this.player.getVideoStartBytes())},minplayer.players.youtube.prototype._getBytesLoaded=function(a){a(this.player.getVideoBytesLoaded())},minplayer.players.youtube.prototype._getBytesTotal=function(a){a(this.player.getVideoBytesTotal())};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.vimeo=function(a,b,c){minplayer.players.base.call(this,a,b,c)},minplayer.players.vimeo.prototype=new minplayer.players.base,minplayer.players.vimeo.prototype.constructor=minplayer.players.vimeo,minplayer.players.vimeo.prototype.construct=function(){minplayer.players.base.prototype.construct.call(this),this.options.pluginName="vimeo"},minplayer.players.vimeo.getPriority=function(){return 10},minplayer.players.vimeo.canPlay=function(a){return"video/vimeo"===a.mimetype?!0:0===a.path.search(/^http(s)?\:\/\/(www\.)?vimeo\.com/i)},minplayer.players.vimeo.prototype.hasPlayLoader=function(){return minplayer.hasTouch},minplayer.players.vimeo.prototype.hasController=function(){return minplayer.hasTouch},minplayer.players.vimeo.getMediaId=function(a){var b=/^http[s]?\:\/\/(www\.)?vimeo\.com\/(\?v\=)?([0-9]+)/i;return 0===a.path.search(b)?a.path.match(b)[3]:a.path},minplayer.players.vimeo.parseNode=function(a){return{title:a.title,description:a.description,mediafiles:{image:{thumbnail:{path:a.thumbnail_small},image:{path:a.thumbnail_large}},media:{media:{player:"vimeo",id:a.id}}}}},minplayer.players.vimeo.nodes={},minplayer.players.vimeo.getNode=function(a,b){minplayer.players.vimeo.nodes.hasOwnProperty(a.id)?b(minplayer.players.vimeo.nodes[a.id]):jQuery.ajax({url:"https://vimeo.com/api/v2/video/"+a.id+".json",dataType:"jsonp",success:function(c){var d=minplayer.players.vimeo.parseNode(c[0]);minplayer.players.vimeo.nodes[a.id]=d,b(d)}})},minplayer.players.vimeo.getImage=function(a,b,c){minplayer.players.vimeo.getNode(a,function(a){c(a.mediafiles.image.image)})},minplayer.players.vimeo.prototype.reset=function(){minplayer.players.base.prototype.reset.call(this)},minplayer.players.vimeo.prototype.createPlayer=function(){minplayer.players.base.prototype.createPlayer.call(this);var a="http://a.vimeocdn.com/js/froogaloop2.min.js";if(0===jQuery('script[src="'+a+'"]').length){var b=document.createElement("script");b.src=a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}var d=document.createElement("iframe");d.setAttribute("id",this.options.id+"-player"),d.setAttribute("type","text/html"),d.setAttribute("width","100%"),d.setAttribute("height","100%"),d.setAttribute("frameborder","0"),jQuery(d).addClass("vimeo-player");var e="https://player.vimeo.com/video/";return e+=this.mediaFile.id+"?",e+=jQuery.param({wmode:"opaque",api:1,player_id:this.options.id+"-player",title:0,byline:0,portrait:0,loop:this.options.loop}),d.setAttribute("src",e),this.poll(this.options.id+"_vimeo",function(a){return function(){if(window.Froogaloop){a.player=window.Froogaloop(d);var b=0;a.player.addEvent("ready",function(){clearTimeout(b),a.onReady(),a.onError("")}),b=setTimeout(function(){a.onReady()},3e3)}return!window.Froogaloop}}(this),200),this.trigger("loadstart"),d},minplayer.players.vimeo.prototype.onReady=function(){this.player.addEvent("loadProgress",function(a){return function(b){a.duration.set(parseFloat(b.duration)),a.bytesLoaded.set(b.bytesLoaded),a.bytesTotal.set(b.bytesTotal)}}(this)),this.player.addEvent("playProgress",function(a){return function(b){a.duration.set(parseFloat(b.duration)),a.currentTime.set(parseFloat(b.seconds))}}(this)),this.player.addEvent("play",function(a){return function(){a.onPlaying()}}(this)),this.player.addEvent("pause",function(a){return function(){a.onPaused()}}(this)),this.player.addEvent("finish",function(a){return function(){a.onComplete()}}(this)),minplayer.players.base.prototype.onReady.call(this),this.onLoaded(),this.options.autoplay&&this.play()},minplayer.players.vimeo.prototype.clear=function(){this.player&&this.player.api("unload"),minplayer.players.base.prototype.clear.call(this)},minplayer.players.vimeo.prototype.load=function(a,b){minplayer.players.base.prototype.load.call(this,a,function(){this.construct(),b&&b.call(this)})},minplayer.players.vimeo.prototype.play=function(a){minplayer.players.base.prototype.play.call(this,function(){this.player.api("play"),a&&a.call(this)})},minplayer.players.vimeo.prototype.pause=function(a){minplayer.players.base.prototype.pause.call(this,function(){this.player.api("pause"),a&&a.call(this)})},minplayer.players.vimeo.prototype.stop=function(a){minplayer.players.base.prototype.stop.call(this,function(){this.player.api("unload"),a&&a.call(this)})},minplayer.players.vimeo.prototype._seek=function(a){this.player.api("seekTo",a)},minplayer.players.vimeo.prototype.setVolume=function(a,b){minplayer.players.base.prototype.setVolume.call(this,a,function(){this.volume.set(a),this.player.api("setVolume",a),b&&b.call(this)})},minplayer.players.vimeo.prototype._getVolume=function(a){this.player.api("getVolume",function(b){a(b)})},minplayer.players.vimeo.prototype._getDuration=function(a){this.player.api("getDuration",function(b){a(b)})};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.limelight=function(a,b){minplayer.players.flash.call(this,a,b)},minplayer.players.limelight.prototype=new minplayer.players.flash,minplayer.players.limelight.prototype.constructor=minplayer.players.limelight,minplayer.players.limelight.prototype.construct=function(){minplayer.players.flash.prototype.construct.call(this),this.options.pluginName="limelight"},minplayer.players.limelight.getPriority=function(){return 10},minplayer.players.limelight.canPlay=function(a){if("video/limelight"===a.mimetype)return!0;var b=/.*limelight\.com.*/i;return 0===a.path.search(b)},minplayer.players.limelight.getMediaId=function(a){var b=/.*limelight\.com.*mediaId=([a-zA-Z0-9]+)/i;return 0===a.path.search(b)?a.path.match(b)[1]:a.path},minplayer.players.limelight.prototype.register=function(){window.delvePlayerCallback=function(a,b,c){var d=a.replace("-player","");jQuery.each(minplayer.get(d,"media"),function(a,d){d.onMediaUpdate(b,c)})}},minplayer.players.limelight.prototype.onMediaUpdate=function(a,b){switch(a){case"onPlayerLoad":this.onReady();break;case"onMediaLoad":if(this.complete)return this.pause(),void this.onPaused();this.shouldSeek=this.startTime>0,this.onLoaded();break;case"onMediaComplete":this.complete=!0,this.onComplete();break;case"onPlayheadUpdate":!b.positionInMilliseconds||this.playing||this.complete||this.onPlaying(),this.complete=!1,this.shouldSeek&&this.seekValue?(this.shouldSeek=!1,this.seek(this.seekValue)):(this.duration.set(b.durationInMilliseconds/1e3),this.currentTime.set(b.positionInMilliseconds/1e3));break;case"onError":this.onError();break;case"onPlayStateChanged":b.isPlaying?this.onPlaying():b.isBusy?this.onWaiting():this.onPaused()}},minplayer.players.limelight.prototype.createPlayer=function(){minplayer.players.flash.prototype.createPlayer.call(this);var a=document.createElement("script");a.src="https://assets.delvenetworks.com/player/embed.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b),this.register();var c={deepLink:"true",autoplay:this.options.autoplay?"true":"false",startQuality:"HD"},d=null,e=this.options.channel;e||(d=/.*limelight\.com.*channelId=([a-zA-Z0-9]+)/i,0===this.mediaFile.path.search(d)&&(e=this.mediaFile.path.match(d)[1])),e&&"media"===this.mediaFile.queueType&&(c.adConfigurationChannelId=e);var f=this.options.playerForm;f||(d=/.*limelight\.com.*playerForm=([a-zA-Z0-9]+)/i,0===this.mediaFile.path.search(d)&&(f=this.mediaFile.path.match(d)[1])),f&&(c.playerForm=f),c.mediaId=this.mediaFile.id;var g=this.options.id+"-player";return setTimeout(function h(){window.hasOwnProperty("LimelightPlayerUtil")?window.LimelightPlayerUtil.initEmbed(g):setTimeout(h,1e3)},1e3),this.getFlash({swf:document.location.protocol+"//assets.delvenetworks.com/player/loader.swf",id:g,width:this.options.width,height:"100%",flashvars:c,wmode:this.options.wmode})},minplayer.players.limelight.prototype.play=function(a){minplayer.players.flash.prototype.play.call(this,function(){this.player.doPlay(),a&&a.call(this)})},minplayer.players.limelight.prototype.pause=function(a){minplayer.players.flash.prototype.pause.call(this,function(){this.player.doPause(),a&&a.call(this)})},minplayer.players.limelight.prototype.stop=function(a){minplayer.players.flash.prototype.stop.call(this,function(){this.player.doPause(),a&&a.call(this)})},minplayer.players.limelight.prototype._seek=function(a){this.seekValue=a,this.player.doSeekToSecond(a)},minplayer.players.limelight.prototype.setVolume=function(a,b){minplayer.players.flash.prototype.setVolume.call(this,a,function(){this.player.doSetVolume(a),b&&b.call(this)})},minplayer.players.limelight.prototype._getVolume=function(a){a(this.player.doGetVolume())},minplayer.players.limelight.prototype.search=function(a){this.whenReady(function(){this.player.doSearch(a)})};var minplayer=minplayer||{};minplayer.players=minplayer.players||{},minplayer.players.kaltura=function(a,b){minplayer.players.base.call(this,a,b)},minplayer.players.kaltura.prototype=new minplayer.players.base,minplayer.players.kaltura.prototype.constructor=minplayer.players.kaltura,minplayer.players.kaltura.prototype.construct=function(){minplayer.players.base.prototype.construct.call(this),this.options.pluginName="kaltura",this.adPlaying=!1},minplayer.players.kaltura.prototype.defaultOptions=function(a){a.entryId=0,a.uiConfId=0,a.partnerId=0,minplayer.players.base.prototype.defaultOptions.call(this,a)},minplayer.players.kaltura.getPriority=function(){return 10},minplayer.players.kaltura.canPlay=function(a){if("video/kaltura"===a.mimetype)return!0;var b=/.*kaltura\.com.*/i;return 0===a.path.search(b)},minplayer.players.kaltura.prototype.adStart=function(){this.adPlaying=!0,this.onPlaying()},minplayer.players.kaltura.prototype.adEnd=function(){this.adPlaying=!1},minplayer.players.kaltura.prototype.playerStateChange=function(a){if(!this.adPlaying)switch(a){case"ready":this.onLoaded();break;case"loading":case"buffering":this.onWaiting();break;case"playing":this.onPlaying();break;case"paused":this.onPaused()}},minplayer.players.kaltura.prototype.mediaReady=function(){this.onLoaded()},minplayer.players.kaltura.prototype.playerPlayEnd=function(){this.onComplete()},minplayer.players.kaltura.prototype.playUpdate=function(a){this.currentTime.set(a)},minplayer.players.kaltura.prototype.durationChange=function(a){this.duration.set(a.newValue)},minplayer.players.kaltura.prototype.getInstance=function(){if(this.instanceName)return this.instanceName;var a=this.uuid.split("__"),b="minplayer.plugins."+a[0];return b+="."+a[1],b+="["+(a[2]-1)+"]",this.instanceName=b,b},minplayer.players.kaltura.prototype.registerEvents=function(){this.player.addJsListener("adStart",this.getInstance()+".adStart"),this.player.addJsListener("adEnd",this.getInstance()+".adEnd"),this.player.addJsListener("playerStateChange",this.getInstance()+".playerStateChange"),this.player.addJsListener("durationChange",this.getInstance()+".durationChange"),this.player.addJsListener("mediaReady",this.getInstance()+".mediaReady"),this.player.addJsListener("playerUpdatePlayhead",this.getInstance()+".playUpdate"),this.player.addJsListener("playerPlayEnd",this.getInstance()+".playerPlayEnd")
},minplayer.players.kaltura.prototype.createPlayer=function(){minplayer.players.base.prototype.createPlayer.call(this);var a={},b=this;jQuery.each(["entryId","uiConfId","partnerId"],function(c,d){if(a[d]="",b.options[d])a[d]=b.options[d];else{var e=null;switch(d){case"entryId":e=/.*kaltura\.com.*entry_id\/([^\/]+)/i;break;case"uiConfId":e=/.*kaltura\.com.*uiconf_id\/([^\/]+)/i;break;case"partnerId":e=/.*kaltura\.com.*wid\/_([^\/]+)/i}e&&(a[d]=b.mediaFile.path.match(e),a[d]&&(a[d]=a[d][1]))}});var c=document.createElement("script");c.src="http://cdnapi.kaltura.com/p/",c.src+=a.partnerId,c.src+="/sp/",c.src+=a.partnerId,c.src+="00/embedIframeJs/uiconf_id/",c.src+=a.uiConfId,c.src+="/partner_id/",c.src+=a.partnerId;var d=document.getElementsByTagName("script")[0];d.parentNode.insertBefore(c,d);var e=this.options.id+"-player";return setTimeout(function f(){window.hasOwnProperty("kWidget")?kWidget.embed({targetId:e,wid:"_"+a.partnerId,uiconf_id:a.uiConfId,entry_id:a.entryId,flashvars:{autoPlay:!1},params:{wmode:"transparent"},readyCallback:function(a){b.player=jQuery("#"+a).get(0),b.registerEvents(),b.onReady()}}):setTimeout(f,1e3)},1e3),'<div id="'+e+'" style="width:100%;height:100%;"></div>'},minplayer.players.kaltura.prototype.play=function(a){minplayer.players.base.prototype.play.call(this,function(){this.player.sendNotification("doPlay"),a&&a.call(this)})},minplayer.players.kaltura.prototype.pause=function(a){minplayer.players.base.prototype.pause.call(this,function(){this.player.sendNotification("doPause"),a&&a.call(this)})},minplayer.players.kaltura.prototype.stop=function(a){minplayer.players.base.prototype.stop.call(this,function(){this.player.sendNotification("doStop"),a&&a.call(this)})},minplayer.players.kaltura.prototype._seek=function(a){this.seekValue=a,this.player.sendNotification("doSeek",a)},minplayer.players.kaltura.prototype.setVolume=function(a,b){minplayer.players.base.prototype.setVolume.call(this,a,function(){this.player.sendNotification("changeVolume",a),b&&b.call(this)})};var minplayer=minplayer||{};minplayer.controller=function(a,b){minplayer.display.call(this,"controller",a,b)},minplayer.controller.prototype=new minplayer.display,minplayer.controller.prototype.constructor=minplayer.controller,minplayer.formatTime=function(a){a=a||0;var b=0,c=0,d=0,e="";return d=Math.floor(a/3600),a-=3600*d,c=Math.floor(a/60),a-=60*c,b=Math.floor(a%60),d&&(e+=String(d),e+=":"),e+=c>=10?String(c):"0"+String(c),e+=":",e+=b>=10?String(b):"0"+String(b),{time:e,units:""}},minplayer.controller.prototype.getElements=function(){var a=minplayer.display.prototype.getElements.call(this);return jQuery.extend(a,{play:null,pause:null,fullscreen:null,seek:null,progress:null,volume:null,timer:null})},minplayer.controller.prototype.defaultOptions=function(a){a.disptime=0,minplayer.display.prototype.defaultOptions.call(this,a)},minplayer.controller.prototype.construct=function(){minplayer.display.prototype.construct.call(this),this.options.pluginName="controller",this.dragging=!1,this.vol=0,this.elements.seek&&(this.seekBar=this.elements.seek.slider({range:"min",create:function(a){jQuery(".ui-slider-range",a.target).addClass("ui-state-active")}})),this.elements.volume&&(this.volumeBar=this.elements.volume.slider({animate:!0,range:"min",orientation:"vertical"})),this.get("player",function(a){this.elements.fullscreen&&minplayer.click(this.elements.fullscreen.unbind(),function(){a.toggleFullScreen()}).css({pointer:"hand"})}),this.get("media",function(a){a.hasController()?this.hide():(this.elements.pause&&(minplayer.click(this.elements.pause.unbind(),function(b){return function(c){c.preventDefault(),b.playPause(!1,a)}}(this)),a.ubind(this.uuid+":pause",function(a){return function(){a.setPlayPause(!0)}}(this))),this.elements.play&&(minplayer.click(this.elements.play.unbind(),function(b){return function(c){c.preventDefault(),b.playPause(!0,a)}}(this)),a.ubind(this.uuid+":playing",function(a){return function(){a.setPlayPause(!1)}}(this))),this.elements.duration&&(a.ubind(this.uuid+":durationchange",function(a){return function(b,c){var d=a.options.disptime||c.duration;a.setTimeString("duration",d)}}(this)),a.getDuration(function(a){return function(b){b=a.options.disptime||b,a.setTimeString("duration",b)}}(this))),this.elements.progress&&a.ubind(this.uuid+":progress",function(a){return function(b,c){var d=c.total?c.loaded/c.total*100:0;a.elements.progress.width(d+"%")}}(this)),(this.seekBar||this.elements.timer)&&a.ubind(this.uuid+":timeupdate",function(a){return function(b,c){if(!a.dragging){var d=0;c.duration&&(d=c.currentTime/c.duration*100),a.seekBar&&a.seekBar.slider("option","value",d),a.setTimeString("timer",c.currentTime)}}}(this)),this.seekBar&&this.seekBar.slider({start:function(a){return function(){a.dragging=!0}}(this),stop:function(b){return function(c,d){b.dragging=!1,a.getDuration(function(b){a.seek(d.value/100*b)})}}(this),slide:function(b){return function(c,d){a.getDuration(function(c){var e=d.value/100*c;b.dragging||a.seek(e),b.setTimeString("timer",e)})}}(this)}),this.elements.mute&&minplayer.click(this.elements.mute,function(b){return function(c){c.preventDefault();var d=b.volumeBar.slider("option","value");d>0?(b.vol=d,b.volumeBar.slider("option","value",0),a.setVolume(0)):(b.volumeBar.slider("option","value",b.vol),a.setVolume(b.vol/100))}}(this)),this.volumeBar&&(this.volumeBar.slider({slide:function(b,c){a.setVolume(c.value/100)}}),a.ubind(this.uuid+":volumeupdate",function(a){return function(b,c){a.volumeBar.slider("option","value",100*c)}}(this)),a.getVolume(function(a){return function(b){a.volumeBar.slider("option","value",100*b)}}(this))))}),this.ready()},minplayer.controller.prototype.setPlayPause=function(a){var b="";this.elements.play&&(b=a?"inherit":"none",this.elements.play.css("display",b)),this.elements.pause&&(b=a?"none":"inherit",this.elements.pause.css("display",b))},minplayer.controller.prototype.playPause=function(a,b){var c=a?"play":"pause";this.display.trigger(c),this.setPlayPause(!a),b&&b[c]()},minplayer.controller.prototype.setTimeString=function(a,b){this.elements[a]&&this.elements[a].text(minplayer.formatTime(b).time)};var osmplayer = osmplayer || {};
(function(exports) {/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
var m = Math,
	dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

	// Style properties
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),

	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),

	// Helpers
	translateZ = has3d ? ' translateZ(0)' : '',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental
			handleClick: true,

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform && that.options.useTransform;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together!
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			translateZ = '';
		}
		
		// Set some default styles
		that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
		that.scroller.style[transitionDuration] = '0';
		that.scroller.style[transformOrigin] = '0 0';
		if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			if (that.options.wheelAction != 'none') {
				that._bind('DOMMouseScroll');
				that._bind('mousewheel');
			}
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			case TRNEND_EV: that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
			if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		if (this.zoomed) return;

		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
		} else {
			x = m.round(x);
			y = m.round(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
				y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind(TRNEND_EV);
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV, window);
		that._bind(END_EV, window);
		that._bind(CANCEL_EV, window);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length !== 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[transitionDuration] = '200ms';
			that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else if (this.options.handleClick) {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = doc.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos(400);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
		if (that.maxScrollY < 0) {
			that.scrollTo(deltaX, deltaY, 0);
		}
	},
	
	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind(TRNEND_EV);
		
		that._startAni();
	},


	/**
	*
	* Utilities
	*
	*/
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind(TRNEND_EV);
			else that._resetPos(0);
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[transitionDuration] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	*
	* Public methods
	*
	*/
	destroy: function () {
		var that = this;

		that.scroller.style[transform] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);
		
		if (!that.options.hasTouch) {
			that._unbind('DOMMouseScroll');
			that._unbind('mousewheel');
		}
		
		if (that.options.useTransition) that._unbind(TRNEND_EV);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[transitionDuration] = '0';
			that._resetPos(400);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV, window);
		this._unbind(END_EV, window);
		this._unbind(CANCEL_EV, window);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(TRNEND_EV);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[transitionDuration] = time + 'ms';
		that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

dummyStyle = null;	// for the sake of it

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})(window, document);

})(osmplayer);// Add a way to instanciate using jQuery prototype.
if (!jQuery.fn.osmplayer) {

  /**
   * A special jQuery event to handle the player being removed from DOM.
   *
   * @this The element that is being triggered with.
   **/
  jQuery.event.special.playerdestroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler(this);
      }
    }
  };

  /**
   * @constructor
   *
   * Define a jQuery osmplayer prototype.
   *
   * @param {object} options The options for this jQuery prototype.
   * @return {Array} jQuery object.
   */
  jQuery.fn.osmplayer = function(options) {
    return jQuery(this).each(function() {
      options = options || {};
      options.id = options.id || jQuery(this).attr('id') || Math.random();
      if (!minplayer.plugins[options.id]) {
        options.template = options.template || 'default';
        if (osmplayer[options.template]) {
          new osmplayer[options.template](jQuery(this), options);
        }
        else {
          new osmplayer(jQuery(this), options);
        }
      }
    });
  };
}

/**
 * @constructor
 * @extends minplayer
 * @class The main osmplayer class.
 *
 * <p><strong>Usage:</strong>
 * <pre><code>
 *
 *   // Create a media player.
 *   var player = jQuery("#player").osmplayer({
 *
 *   });
 *
 * </code></pre>
 * </p>
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer = function(context, options) {

  // Derive from minplayer
  minplayer.call(this, context, options);
};

/** Derive from minplayer. */
osmplayer.prototype = new minplayer();

/** Reset the constructor. */
osmplayer.prototype.constructor = osmplayer;

/**
 * Creates a new plugin within this context.
 *
 * @param {string} name The name of the plugin you wish to create.
 * @param {object} base The base object for this plugin.
 * @param {object} context The context which you would like to create.
 * @return {object} The new plugin object.
 */
osmplayer.prototype.create = function(name, base, context) {
  return minplayer.prototype.create.call(this, name, 'osmplayer', context);
};

/**
 * Get the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
osmplayer.prototype.defaultOptions = function(options) {
  options.playlist = '';
  options.node = {};
  options.link = 'http://www.mediafront.org';
  options.logo = 'http://mediafront.org/assets/osmplayer/logo.png';
  minplayer.prototype.defaultOptions.call(this, options);
};

/**
 * @see minplayer.plugin.construct
 */
osmplayer.prototype.construct = function() {

  // Call the minplayer display constructor.
  minplayer.prototype.construct.call(this);

  // We need to cleanup the player when it has been destroyed.
  jQuery(this.display).bind('playerdestroyed', (function(player) {
    return function(element) {
      if (element === player.display.eq(0)[0]) {
        for (var plugin in minplayer.plugins[player.options.id]) {
          for (var index in minplayer.plugins[player.options.id][plugin]) {
            minplayer.plugins[player.options.id][plugin][index].destroy();
            delete minplayer.plugins[player.options.id][plugin][index];
          }
          minplayer.plugins[player.options.id][plugin].length = 0;
        }
        delete minplayer.plugins[player.options.id];
        minplayer.plugins[player.options.id] = null;
      }
    };
  })(this));

  /** The play queue and index. */
  this.playQueue = [];
  this.playIndex = 0;
  this.hasPlaylist = false;

  /** The playlist for this media player. */
  this.create('playlist', 'osmplayer');

  /** Get the playlist or any other playlist that connects. */
  this.get('playlist', function(playlist) {
    playlist.ubind(this.uuid + ':nodeLoad', (function(player) {
      return function(event, data) {
        player.hasPlaylist = true;
        if (!player.options.autoplay && !!data.autoplay) {
          if (typeof player.options.originalAutoPlay == 'undefined') {
            player.options.originalAutoPlay = player.options.autoplay;
          }
          player.options.autoplay = true;
        }
        player.loadNode(data);
      };
    })(this));
  });

  // Play each media sequentially...
  this.get('media', function(media) {
    media.ubind(this.uuid + ':ended', (function(player) {
      return function() {
        if (typeof player.options.originalAutoPlay == 'undefined') {
          player.options.originalAutoPlay = player.options.autoplay;
        }
        player.options.autoplay = true;
        player.playNext();
      };
    })(this));
  });

  // Load the node if one is provided.
  this.loadNode(this.options.node);
};

/**
 * Gets the full screen element.
 *
 * @return {object} The element that will go into fullscreen.
 */
osmplayer.prototype.fullScreenElement = function() {
  return this.elements.minplayer;
};

/**
 * Reset the osmplayer.
 *
 * @param {function} callback Called when it is done resetting.
 */
osmplayer.prototype.reset = function(callback) {

  // Empty the playqueue.
  this.playQueue.length = 0;
  this.playQueue = [];
  this.playIndex = 0;

  // Clear the playloader.
  if (this.playLoader && this.options.preview) {
    this.options.preview = '';
    this.playLoader.clear((function(player) {
      return function() {
        callback.call(player);
      };
    })(this));
  }
  else if (callback) {
    callback.call(this);
  }
};

/**
 * The load node function.
 *
 * @param {object} node A media node object.
 * @return {boolean} If the node was loaded.
 */
osmplayer.prototype.loadNode = function(node) {

  // Make sure this is a valid node.
  if (!node || (node.hasOwnProperty('length') && (node.length === 0))) {
    return false;
  }

  // Reset the player.
  this.reset(function() {

    // Set the hasMedia flag.
    this.hasMedia = node && node.mediafiles && node.mediafiles.media;
    this.hasMedia = this.hasMedia || this.options.file;

    // If this node is set and has files.
    if (node && node.mediafiles) {

      // Load the media files.
      var media = node.mediafiles.media;
      if (media) {
        var file = null;
        var types = [];

        // For mobile devices, we should only show the main media.
        if (minplayer.isAndroid || minplayer.isIDevice) {
          types = ['media'];
        }
        else {
          types = ['intro', 'commercial', 'prereel', 'media', 'postreel'];
        }

        // Iterate through the types.
        jQuery.each(types, (function(player) {
          return function(key, type) {
            file = player.addToQueue(media[type]);
            if (file) {
              file.queueType = type;
            }
          };
        })(this));
      }
      else {

        // Add a class to the display to let themes handle this.
        this.display.addClass('nomedia');
      }

      // Play the next media
      this.playNext();

      // Load the preview image.
      osmplayer.getImage(node.mediafiles, 'preview', (function(player) {
        return function(image) {
          if (player.playLoader && (player.playLoader.display.length > 0)) {
            player.playLoader.enabled = true;
            player.playLoader.loadPreview(image.path);
            player.playLoader.previewFlag.setFlag('media', true);
            if (!player.hasMedia) {
              player.playLoader.busy.setFlag('media', false);
              player.playLoader.bigPlay.setFlag('media', false);
            }
            player.playLoader.checkVisibility();
          }
        };
      })(this));
    }
  });
};

/**
 * Adds a file to the play queue.
 *
 * @param {object} file The file to add to the queue.
 * @return {object} The file that was added to the queue.
 */
osmplayer.prototype.addToQueue = function(file) {
  file = minplayer.getMediaFile(file);
  if (file) {
    this.playQueue.push(file);
  }
  return file;
};

/**
 * Plays the next media file in the queue.
 */
osmplayer.prototype.playNext = function() {
  if (this.playQueue.length > this.playIndex) {
    this.load(this.playQueue[this.playIndex]);
    this.playIndex++;
  }
  else if (this.options.repeat) {
    this.playIndex = 0;
    this.playNext();
  }
  else if (this.playQueue.length > 0) {

    // If we have a playlist, let them handle what to do next.
    if (this.hasPlaylist && this.options.autoNext) {
      this.trigger('player_ended');
    }
    else {
      // If there is no playlist, and no repeat, we will
      // just seek to the beginning and pause.
      this.options.autoplay = false;
      this.playIndex = 0;
      this.playNext();
    }
  }
  else if (this.media) {

    // Reset the autoplay variable.
    if (typeof this.options.originalAutoPlay != 'undefined') {
      this.options.autoplay = this.options.originalAutoPlay;
    }

    this.media.stop();

    // Load the media again.
    if (this.options.file) {
      this.load();
    }
    else {
      this.loadNode();
    }
  }
};

/**
 * Returns a node.
 *
 * @param {object} node The node to get.
 * @param {function} callback Called when the node is retrieved.
 */
osmplayer.getNode = function(node, callback) {
  if (node && node.mediafiles && node.mediafiles.media) {
    var mediaFile = minplayer.getMediaFile(node.mediafiles.media.media);
    if (mediaFile) {
      var player = minplayer.players[mediaFile.player];
      if (player && (typeof player.getNode === 'function')) {
        player.getNode(mediaFile, function(node) {
          callback(node);
        });
      }
    }
  }
};

/**
 * Returns an image provided image array.
 *
 * @param {object} mediafiles The mediafiles to search within.
 * @param {string} type The type of image to look for.
 * @param {function} callback Called when the image is retrieved.
 */
osmplayer.getImage = function(mediafiles, type, callback) {

  var image = '';
  var images = mediafiles.image;
  if (images) {

    // If the image type exists, then just use that one...
    if (images[type]) {
      image = images[type];
    }
    // Or try the original image...
    else if (images.image) {
      image = images.image;
    }
    // Otherwise, just try ANY image...
    else {

      // Or, just pick the first one available.
      for (type in images) {
        if (images.hasOwnProperty(type)) {
          image = images[type];
          break;
        }
      }
    }
  }

  // If the image exists, then callback with that image.
  if (image) {
    callback(new minplayer.file(image));
  }
  else {
    // Get the image from the media player...
    var mediaFile = minplayer.getMediaFile(mediafiles.media.media);
    if (mediaFile) {
      var player = minplayer.players[mediaFile.player];
      if (player && (typeof player.getImage === 'function')) {
        player.getImage(mediaFile, type, function(src) {
          callback(new minplayer.file(src));
        });
      }
    }
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The default parser object.
 *
 * @return {object} The default parser.
 **/
osmplayer.parser['default'] = {

  // The priority for this parser.
  priority: 1,

  // This parser is always valid.
  valid: function(feed) {
    return true;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'json';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    feed += '?start-index=' + start;
    feed += '&max-results=' + numItems;
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    return data;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The youtube parser object.
 *
 * @return {object} The youtube parser.
 **/
osmplayer.parser.youtube = {

  // The priority for this parser.
  priority: 10,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    return (feed.search(/^http(s)?\:\/\/gdata\.youtube\.com/i) === 0);
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'jsonp';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    feed += '?start-index=' + (start + 1);
    feed += '&max-results=' + (numItems);
    feed += '&v=2&alt=jsonc';
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    data = data.data;
    var playlist = {
      total_rows: data.totalItems,
      nodes: []
    };

    // Iterate through the items and parse it.
    var node = null;
    for (var index in data.items) {
      if (data.items.hasOwnProperty(index)) {
        node = minplayer.players.youtube.parseNode(data.items[index]);
        playlist.nodes.push(node);
      }
    }

    return playlist;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The rss parser object.
 *
 * @return {object} The rss parser.
 **/
osmplayer.parser.rss = {

  // The priority for this parser.
  priority: 8,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    return feed.match(/\.rss$/i) !== null;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'xml';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: 0,
      nodes: []
    };
    jQuery('rss channel', data).find('item').each(function(index) {
      osmplayer.parser.rss.addRSSItem(playlist, jQuery(this));
    });
    return playlist;
  },

  // Parse an RSS item.
  addRSSItem: function(playlist, item) {
    playlist.total_rows++;
    var node = {}, title = '', desc = '', img = '', media = '';

    // Get the title.
    title = item.find('title');
    if (title.length) {
      node.title = title.text();
    }

    // Get the description.
    desc = item.find('annotation');
    if (desc.length) {
      node.description = desc.text();
    }

    // Add the media files.
    node.mediafiles = {};

    // Get the image.
    img = item.find('image');
    if (img.length) {
      node.mediafiles.image = {
        image: {
          path: img.text()
        }
      };
    }

    // Get the media.
    media = item.find('location');
    if (media.length) {
      node.mediafiles.media = {
        media: {
          path: media.text()
        }
      };
    }

    // Add this node to the playlist.
    playlist.nodes.push(node);
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The asx parser object.
 *
 * @return {object} The asx parser.
 **/
osmplayer.parser.asx = {

  // The priority for this parser.
  priority: 8,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    return feed.match(/\.asx$/i) !== null;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'xml';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: 0,
      nodes: []
    };
    jQuery('asx entry', data).each(function(index) {
      osmplayer.parser.rss.addRSSItem(playlist, jQuery(this));
    });
    return playlist;
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/** The parser object. */
osmplayer.parser = osmplayer.parser || {};

/**
 * The xsfp parser object.
 *
 * @return {object} The xsfp parser.
 **/
osmplayer.parser.xsfp = {

  // The priority for this parser.
  priority: 8,

  // Return if this is a valid youtube feed.
  valid: function(feed) {
    feed = feed.replace(/(.*)\??(.*)/i, '$1');
    return feed.match(/\.xml$/i) !== null;
  },

  // Returns the type of request to make.
  getType: function(feed) {
    return 'xml';
  },

  // Returns the feed provided the start and numItems.
  getFeed: function(feed, start, numItems) {
    return feed;
  },

  // Parse the feed.
  parse: function(data) {
    var playlist = {
      total_rows: 0,
      nodes: []
    };
    jQuery('playlist trackList track', data).each(function(index) {
      osmplayer.parser.rss.addRSSItem(playlist, jQuery(this));
    });
    return playlist;
  }
};
/**
 * @constructor
 * @extends minplayer.display
 * @class This class creates the playlist functionality for the minplayer.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.playlist = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'playlist', context, options);
};

/** Derive from minplayer.display. */
osmplayer.playlist.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.playlist.prototype.constructor = osmplayer.playlist;

/**
 * Returns the default options for this plugin.
 *
 * @param {object} options The default options for this plugin.
 */
osmplayer.playlist.prototype.defaultOptions = function(options) {
  options.vertical = true;
  options.playlist = '';
  options.pageLimit = 10;
  options.autoNext = true;
  options.shuffle = false;
  options.loop = false;
  options.hysteresis = 40;
  options.scrollSpeed = 20;
  options.scrollMode = 'auto';
  minplayer.display.prototype.defaultOptions.call(this, options);
};

/**
 * @see minplayer.plugin#construct
 */
osmplayer.playlist.prototype.construct = function() {

  /** The nodes within this playlist. */
  this.nodes = [];

  // Current page.
  this.page = -1;

  // The total amount of nodes.
  this.totalItems = 0;

  // The current loaded item index.
  this.currentItem = -1;

  // The play playqueue.
  this.playqueue = [];

  // The playqueue position.
  this.playqueuepos = 0;

  // The current playlist.
  this.playlist = this.options.playlist;

  // Create the scroll bar.
  this.scroll = null;

  // Create our orientation variable.
  this.orient = {
    pos: this.options.vertical ? 'y' : 'x',
    pagePos: this.options.vertical ? 'pageY' : 'pageX',
    offset: this.options.vertical ? 'top' : 'left',
    wrapperSize: this.options.vertical ? 'wrapperH' : 'wrapperW',
    minScroll: this.options.vertical ? 'minScrollY' : 'minScrollX',
    maxScroll: this.options.vertical ? 'maxScrollY' : 'maxScrollX',
    size: this.options.vertical ? 'height' : 'width'
  };

  // Create the pager.
  this.pager = this.create('pager', 'osmplayer');
  this.pager.ubind(this.uuid + ':nextPage', (function(playlist) {
    return function(event) {
      playlist.nextPage();
    };
  })(this));
  this.pager.ubind(this.uuid + ':prevPage', (function(playlist) {
    return function(event) {
      playlist.prevPage();
    };
  })(this));

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Load the "next" item.
  this.hasPlaylist = this.next();

  // Say that we are ready.
  this.ready();
};

/**
 * @see minplayer.plugin.onAdded
 */
osmplayer.playlist.prototype.onAdded = function(plugin) {

  // Get the media.
  if (this.options.autoNext) {

    // Get the player from this plugin.
    plugin.get('player', (function(playlist) {
      return function(player) {
        player.ubind(playlist.uuid + ':player_ended', function(event) {
          if (playlist.hasPlaylist) {
            if (typeof player.options.originalAutoPlay == 'undefined') {
              player.options.originalAutoPlay = player.options.autoplay;
            }
            player.options.autoplay = true;
            playlist.next();
          }
        });
      };
    })(this));
  }
};

/**
 * Wrapper around the scroll scrollTo method.
 *
 * @param {number} pos The position you would like to set the list.
 * @param {boolean} relative If this is a relative position change.
 */
osmplayer.playlist.prototype.scrollTo = function(pos, relative) {
  if (this.scroll) {
    this.scroll.options.hideScrollbar = false;
    if (this.options.vertical) {
      this.scroll.scrollTo(0, pos, 0, relative);
    }
    else {
      this.scroll.scrollTo(pos, 0, 0, relative);
    }
    this.scroll.options.hideScrollbar = true;
  }
};

/**
 * Refresh the scrollbar.
 */
osmplayer.playlist.prototype.refreshScroll = function() {

  // Make sure that our window has the addEventListener to keep IE happy.
  if (!window.addEventListener) {
    setTimeout((function(playlist) {
      return function() {
        playlist.refreshScroll.call(playlist);
      };
    })(this), 200);
    return;
  }

  // Check the size of the playlist.
  var list = this.elements.list;
  var scroll = this.elements.scroll;

  // Destroy the scroll bar first.
  if (this.scroll) {
    this.scroll.scrollTo(0, 0);
    this.scroll.destroy();
    this.scroll = null;
    this.elements.list
        .unbind('mousemove')
        .unbind('mouseenter')
        .unbind('mouseleave');
  }

  // Need to force the width of the list.
  if (!this.options.vertical) {
    var listSize = 0;
    jQuery.each(this.elements.list.children(), function() {
      listSize += jQuery(this).outerWidth();
    });
    this.elements.list.width(listSize);
  }

  // Check to see if we should add a scroll bar functionality.
  if ((list.length > 0) &&
      (scroll.length > 0) &&
      (list[this.orient.size]() > scroll[this.orient.size]())) {

    // Setup the osmplayer.iScroll component.
    this.scroll = new osmplayer.iScroll(this.elements.scroll.eq(0)[0], {
      hScroll: !this.options.vertical,
      hScrollbar: !this.options.vertical,
      vScroll: this.options.vertical,
      vScrollbar: this.options.vertical,
      hideScrollbar: (this.options.scrollMode !== 'none')
    });

    // Use autoScroll for non-touch devices.
    if ((this.options.scrollMode == 'auto') && !minplayer.hasTouch) {

      // Bind to the mouse events for autoscrolling.
      this.elements.list.bind('mousemove', (function(playlist) {
        return function(event) {
          event.preventDefault();
          var offset = playlist.display.offset()[playlist.orient.offset];
          playlist.mousePos = event[playlist.orient.pagePos];
          playlist.mousePos -= offset;
        };
      })(this)).bind('mouseenter', (function(playlist) {
        return function(event) {
          event.preventDefault();
          playlist.scrolling = true;
          var setScroll = function() {
            if (playlist.scrolling) {
              var scrollSize = playlist.scroll[playlist.orient.wrapperSize];
              var scrollMid = (scrollSize / 2);
              var delta = playlist.mousePos - scrollMid;
              if (Math.abs(delta) > playlist.options.hysteresis) {
                var hyst = playlist.options.hysteresis;
                hyst *= (delta > 0) ? -1 : 0;
                delta = (playlist.options.scrollSpeed * (delta + hyst));
                delta /= scrollMid;
                var pos = playlist.scroll[playlist.orient.pos] - delta;
                var min = playlist.scroll[playlist.orient.minScroll] || 0;
                var max = playlist.scroll[playlist.orient.maxScroll];
                if (pos >= min) {
                  playlist.scrollTo(min);
                }
                else if (pos <= max) {
                  playlist.scrollTo(max);
                }
                else {
                  playlist.scrollTo(delta, true);
                }
              }

              // Set timeout to try again.
              setTimeout(setScroll, 30);
            }
          };
          setScroll();
        };
      })(this)).bind('mouseleave', (function(playlist) {
        return function(event) {
          event.preventDefault();
          playlist.scrolling = false;
        };
      })(this));
    }

    this.scroll.refresh();
    this.scroll.scrollTo(0, 0, 200);
  }
};

/**
 * Adds a new node to the playlist.
 *
 * @param {object} node The node that you would like to add to the playlist.
 */
osmplayer.playlist.prototype.addNode = function(node) {

  // Get the current index for this node.
  var index = this.nodes.length;

  // Create the teaser object.
  var teaser = this.create('teaser', 'osmplayer', this.elements.list);

  // Set the node for this teaser.
  teaser.setNode(node);

  // Bind to when it loads.
  teaser.ubind(this.uuid + ':nodeLoad', (function(playlist) {
    return function(event, data) {
      playlist.loadItem(index, true);
    };
  })(this));

  // Add this to our nodes array.
  this.nodes.push(teaser);
};

/**
 * Sets the playlist.
 *
 * @param {object} playlist The playlist object.
 * @param {integer} loadIndex The index of the item to load.
 */
osmplayer.playlist.prototype.set = function(playlist, loadIndex) {

  // Check to make sure the playlist is an object.
  if (typeof playlist !== 'object') {
    this.trigger('error', 'Playlist must be an object to set');
    return;
  }

  // Check to make sure the playlist has correct format.
  if (!playlist.hasOwnProperty('total_rows')) {
    this.trigger('error', 'Unknown playlist format.');
    return;
  }

  // Make sure the playlist has some rows.
  if (playlist.total_rows && playlist.nodes.length) {

    // Set the total rows.
    this.totalItems = playlist.total_rows;
    this.currentItem = 0;

    // Show or hide the next page if there is or is not a next page.
    if ((((this.page + 1) * this.options.pageLimit) >= this.totalItems) ||
        (this.totalItems == playlist.nodes.length)) {
      this.pager.nextPage.hide();
    }
    else {
      this.pager.nextPage.show();
    }

    var teaser = null;
    var numNodes = playlist.nodes.length;
    this.elements.list.empty();
    this.nodes = [];

    // Iterate through all the nodes.
    for (var index = 0; index < numNodes; index++) {

      // Add this node to the playlist.
      this.addNode(playlist.nodes[index]);

      // If the index is equal to the loadIndex.
      if (loadIndex === index) {
        this.loadItem(index);
      }
    }

    // Refresh the sizes.
    this.refreshScroll();

    // Trigger that the playlist has loaded.
    this.trigger('playlistLoad', playlist);
  }

  // Show that we are no longer busy.
  if (this.elements.playlist_busy) {
    this.elements.playlist_busy.hide();
  }
};

/**
 * Stores the current playlist state in the playqueue.
 */
osmplayer.playlist.prototype.setQueue = function() {

  // Add this item to the playqueue.
  this.playqueue.push({
    page: this.page,
    item: this.currentItem
  });

  // Store the current playqueue position.
  this.playqueuepos = this.playqueue.length;
};

/**
 * Loads the next item.
 *
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.next = function() {
  var item = 0, page = this.page;

  // See if we are at the front of the playqueue.
  if (this.playqueuepos >= this.playqueue.length) {

    // If this is shuffle, then load a random item.
    if (this.options.shuffle) {
      item = Math.floor(Math.random() * this.totalItems);
      page = Math.floor(item / this.options.pageLimit);
      item = item % this.options.pageLimit;
      return this.load(page, item);
    }
    else {

      // Otherwise, increment the current item by one.
      item = (this.currentItem + 1);
      if (item >= this.nodes.length) {
        return this.load(page + 1, 0);
      }
      else {
        return this.loadItem(item);
      }
    }
  }
  else {

    // Load the next item in the playqueue.
    this.playqueuepos = this.playqueuepos + 1;
    var currentQueue = this.playqueue[this.playqueuepos];
    return this.load(currentQueue.page, currentQueue.item);
  }
};

/**
 * Loads the previous item.
 *
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.prev = function() {

  // Move back into the playqueue.
  this.playqueuepos = this.playqueuepos - 1;
  this.playqueuepos = (this.playqueuepos < 0) ? 0 : this.playqueuepos;
  var currentQueue = this.playqueue[this.playqueuepos];
  if (currentQueue) {
    return this.load(currentQueue.page, currentQueue.item);
  }
  return false;
};

/**
 * Loads a playlist node.
 *
 * @param {number} index The index of the item you would like to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.loadItem = function(index, autoplay) {
  if (index < this.nodes.length) {
    this.setQueue();

    // Get the teaser at the current index and deselect it.
    var teaser = this.nodes[this.currentItem];
    teaser.select(false);
    this.currentItem = index;

    // Get the new teaser and select it.
    teaser = this.nodes[index];
    teaser.select(true);
    teaser.node.autoplay = !!autoplay;
    this.trigger('nodeLoad', teaser.node);
    return true;
  }

  return false;
};

/**
 * Loads the next page.
 *
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.nextPage = function(loadIndex) {
  return this.load(this.page + 1, loadIndex);
};

/**
 * Loads the previous page.
 *
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.prevPage = function(loadIndex) {
  return this.load(this.page - 1, loadIndex);
};

/**
 * Loads a playlist.
 *
 * @param {integer} page The page to load.
 * @param {integer} loadIndex The index of the item to load.
 * @return {boolean} TRUE if loaded, FALSE if not.
 */
osmplayer.playlist.prototype.load = function(page, loadIndex) {

  // If the playlist and pages are the same, then no need to load.
  if ((this.playlist == this.options.playlist) && (page == this.page)) {
    return this.loadItem(loadIndex);
  }

  // Set the new playlist.
  this.playlist = this.options.playlist;

  // Return if there aren't any playlists to play.
  if (!this.playlist) {
    return false;
  }

  // Determine if we need to loop.
  var maxPages = Math.floor(this.totalItems / this.options.pageLimit);
  if (page > maxPages) {
    if (this.options.loop) {
      page = 0;
      loadIndex = 0;
    }
    else {
      return false;
    }
  }

  // Say that we are busy.
  if (this.elements.playlist_busy) {
    this.elements.playlist_busy.show();
  }

  // Normalize the page.
  page = page || 0;
  page = (page < 0) ? 0 : page;

  // Set the queue.
  this.setQueue();

  // Set the new page.
  this.page = page;

  // Hide or show the page based on if we are on the first page.
  if (this.page === 0) {
    this.pager.prevPage.hide();
  }
  else {
    this.pager.prevPage.show();
  }

  // If the playlist is an object, then go ahead and set it.
  if (typeof this.playlist == 'object') {
    this.set(this.playlist, loadIndex);
    if (this.playlist.endpoint) {
      this.playlist = this.options.playlist = this.playlist.endpoint;
    }
    return true;
  }

  // Get the highest priority parser.
  var parser = osmplayer.parser['default'];
  for (var name in osmplayer.parser) {
    if (osmplayer.parser.hasOwnProperty(name)) {
      if (osmplayer.parser[name].valid(this.playlist)) {
        if (osmplayer.parser[name].priority > parser.priority) {
          parser = osmplayer.parser[name];
        }
      }
    }
  }

  // The start index.
  var start = this.page * this.options.pageLimit;

  // Get the feed from the parser.
  var feed = parser.getFeed(
    this.playlist,
    start,
    this.options.pageLimit
  );

  // Build our request.
  var request = {
    type: 'GET',
    url: feed,
    success: (function(playlist) {
      return function(data) {
        playlist.set(parser.parse(data), loadIndex);
      };
    })(this),
    error: (function(playlist) {
      return function(XMLHttpRequest, textStatus, errorThrown) {
        if (playlist.elements.playlist_busy) {
          playlist.elements.playlist_busy.hide();
        }
        playlist.trigger('error', textStatus);
      };
    })(this)
  };

  // Set the data if applicable.
  var dataType = parser.getType();
  if (dataType) {
    request.dataType = dataType;
  }

  // Perform an ajax callback.
  jQuery.ajax(request);

  // Return that we did something.
  return true;
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides pager functionality.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.pager = function(context, options) {

  // Derive from display
  minplayer.display.call(this, 'pager', context, options);
};

/** Derive from minplayer.display. */
osmplayer.pager.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.pager.prototype.constructor = osmplayer.pager;

/**
 * @see minplayer.plugin#construct
 */
osmplayer.pager.prototype.construct = function() {

  // Call the minplayer plugin constructor.
  minplayer.display.prototype.construct.call(this);

  // Setup the prev button.
  if (this.elements.prevPage) {
    this.prevPage = this.elements.prevPage.click((function(pager) {
      return function(event) {
        event.preventDefault();
        pager.trigger('prevPage');
      };
    })(this));
  }

  // Setup the next button.
  if (this.elements.nextPage) {
    this.nextPage = this.elements.nextPage.click((function(pager) {
      return function(event) {
        event.preventDefault();
        pager.trigger('nextPage');
      };
    })(this));
  }
};
/** The osmplayer namespace. */
var osmplayer = osmplayer || {};

/**
 * @constructor
 * @extends minplayer.display
 * @class This class provides teaser functionality.
 *
 * @param {object} context The jQuery context.
 * @param {object} options This components options.
 */
osmplayer.teaser = function(context, options) {

  /** The preview image. */
  this.preview = null;

  // Derive from display
  minplayer.display.call(this, 'teaser', context, options);
};

/** Derive from minplayer.display. */
osmplayer.teaser.prototype = new minplayer.display();

/** Reset the constructor. */
osmplayer.teaser.prototype.constructor = osmplayer.teaser;

/**
 * Selects the teaser.
 *
 * @param {boolean} selected TRUE if selected, FALSE otherwise.
 */
osmplayer.teaser.prototype.select = function(selected) {
};

/**
 * Sets the node.
 *
 * @param {object} node The node object to set.
 */
osmplayer.teaser.prototype.setNode = function(node) {

  // Add this to the node info for this teaser.
  this.node = node;

  // Set the title of the teaser.
  if (this.elements.title) {
    if (node.title) {
      this.elements.title.text(node.title);
    }
    else {
      osmplayer.getNode(node, (function(teaser) {
        return function(node) {
          teaser.elements.title.text(node.title);
        };
      })(this));
    }
  }

  // Load the thumbnail image if it exists.
  if (node.mediafiles) {
    osmplayer.getImage(node.mediafiles, 'thumbnail', (function(teaser) {
      return function(image) {
        if (image && teaser.elements.image) {
          teaser.preview = new minplayer.image(teaser.elements.image);
          teaser.preview.load(image.path);
        }
      };
    })(this));
  }

  // Bind when they click on this teaser.
  this.display.unbind('click').click((function(teaser) {
    return function(event) {
      event.preventDefault();
      teaser.trigger('nodeLoad', teaser.node);
    };
  })(this));
};
