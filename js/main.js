function FastClick(a,b){"use strict";function c(a,b){return function(){return a.apply(b,arguments)}}var d;if(b=b||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=b.touchBoundary||10,this.layer=a,this.tapDelay=b.tapDelay||200,!FastClick.notNeeded(a)){for(var e=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],f=this,g=0,h=e.length;h>g;g++)f[e[g]]=c(f[e[g]],f);deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)}),"function"==typeof a.onclick&&(d=a.onclick,a.addEventListener("click",function(a){d(a)},!1),a.onclick=null)}}var deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),deviceIsIOSWithBadTarget=deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);FastClick.prototype.needsClick=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(a.className)},FastClick.prototype.needsFocus=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!deviceIsAndroid;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},FastClick.prototype.sendClick=function(a,b){"use strict";var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},FastClick.prototype.determineEventType=function(a){"use strict";return deviceIsAndroid&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(a){"use strict";var b;deviceIsIOS&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},FastClick.prototype.updateScrollParent=function(a){"use strict";var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(a){"use strict";return a.nodeType===Node.TEXT_NODE?a.parentNode:a},FastClick.prototype.onTouchStart=function(a){"use strict";var b,c,d;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],deviceIsIOS){if(d=window.getSelection(),d.rangeCount&&!d.isCollapsed)return!0;if(!deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(a){"use strict";var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},FastClick.prototype.onTouchMove=function(a){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(a){"use strict";return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(a){"use strict";var b,c,d,e,f,g=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,c=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,deviceIsIOSWithBadTarget&&(f=a.changedTouches[0],g=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||g,g.fastClickScrollParent=this.targetElement.fastClickScrollParent),d=g.tagName.toLowerCase(),"label"===d){if(b=this.findControl(g)){if(this.focus(g),deviceIsAndroid)return!1;g=b}}else if(this.needsFocus(g))return a.timeStamp-c>100||deviceIsIOS&&window.top!==window&&"input"===d?(this.targetElement=null,!1):(this.focus(g),this.sendClick(g,a),deviceIsIOS&&"select"===d||(this.targetElement=null,a.preventDefault()),!1);return deviceIsIOS&&!deviceIsIOS4&&(e=g.fastClickScrollParent,e&&e.fastClickLastScrollTop!==e.scrollTop)?!0:(this.needsClick(g)||(a.preventDefault(),this.sendClick(g,a)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(a){"use strict";return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0},FastClick.prototype.onClick=function(a){"use strict";var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},FastClick.prototype.destroy=function(){"use strict";var a=this.layer;deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(a){"use strict";var b,c;if("undefined"==typeof window.ontouchstart)return!0;if(c=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!deviceIsAndroid)return!0;if(b=document.querySelector("meta[name=viewport]")){if(-1!==b.content.indexOf("user-scalable=no"))return!0;if(c>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}return"none"===a.style.msTouchAction?!0:!1},FastClick.attach=function(a,b){"use strict";return new FastClick(a,b)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick,window.getComputedStyle||(window.getComputedStyle=function(a){return this.el=a,this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;return"float"==b&&(b="styleFloat"),c.test(b)&&(b=b.replace(c,function(){return arguments[2].toUpperCase()})),a.currentStyle[b]?a.currentStyle[b]:null},this}),function(a,b){function c(a){var c=b[a];b[a]=function(a){return e(c(a))}}function d(b,c,d){return(d=this).attachEvent("on"+b,function(b){var b=b||a.event;b.preventDefault=b.preventDefault||function(){b.returnValue=!1},b.stopPropagation=b.stopPropagation||function(){b.cancelBubble=!0},c.call(d,b)})}function e(a,b){if(b=a.length)for(;b--;)a[b].addEventListener=d;else a.addEventListener=d;return a}a.addEventListener||(e([b,a]),"Element"in a?a.Element.prototype.addEventListener=d:(b.attachEvent("onreadystatechange",function(){e(b.all)}),c("getElementsByTagName"),c("getElementById"),c("createElement"),e(b.all)))}(window,document);var self="undefined"!=typeof window?window:{},Prism=function(){var a=/\blang(?:uage)?-(?!\*)(\w+)\b/i,b=self.Prism={util:{type:function(a){return Object.prototype.toString.call(a).match(/\[object (\w+)\]/)[1]},clone:function(a){var c=b.util.type(a);switch(c){case"Object":var d={};for(var e in a)a.hasOwnProperty(e)&&(d[e]=b.util.clone(a[e]));return d;case"Array":return a.slice()}return a}},languages:{extend:function(a,c){var d=b.util.clone(b.languages[a]);for(var e in c)d[e]=c[e];return d},insertBefore:function(a,c,d,e){e=e||b.languages;var f=e[a],g={};for(var h in f)if(f.hasOwnProperty(h)){if(h==c)for(var i in d)d.hasOwnProperty(i)&&(g[i]=d[i]);g[h]=f[h]}return e[a]=g},DFS:function(a,c){for(var d in a)c.call(a,d,a[d]),"Object"===b.util.type(a)&&b.languages.DFS(a[d],c)}},highlightAll:function(a,c){for(var d,e=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'),f=0;d=e[f++];)b.highlightElement(d,a===!0,c)},highlightElement:function(d,e,f){for(var g,h,i=d;i&&!a.test(i.className);)i=i.parentNode;if(i&&(g=(i.className.match(a)||[,""])[1],h=b.languages[g]),h){d.className=d.className.replace(a,"").replace(/\s+/g," ")+" language-"+g,i=d.parentNode,/pre/i.test(i.nodeName)&&(i.className=i.className.replace(a,"").replace(/\s+/g," ")+" language-"+g);var j=d.textContent;if(j){j=j.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ");var k={element:d,language:g,grammar:h,code:j};if(b.hooks.run("before-highlight",k),e&&self.Worker){var l=new Worker(b.filename);l.onmessage=function(a){k.highlightedCode=c.stringify(JSON.parse(a.data),g),b.hooks.run("before-insert",k),k.element.innerHTML=k.highlightedCode,f&&f.call(k.element),b.hooks.run("after-highlight",k)},l.postMessage(JSON.stringify({language:k.language,code:k.code}))}else k.highlightedCode=b.highlight(k.code,k.grammar,k.language),b.hooks.run("before-insert",k),k.element.innerHTML=k.highlightedCode,f&&f.call(d),b.hooks.run("after-highlight",k)}}},highlight:function(a,d,e){return c.stringify(b.tokenize(a,d),e)},tokenize:function(a,c){var d=b.Token,e=[a],f=c.rest;if(f){for(var g in f)c[g]=f[g];delete c.rest}a:for(var g in c)if(c.hasOwnProperty(g)&&c[g]){var h=c[g],i=h.inside,j=!!h.lookbehind,k=0;h=h.pattern||h;for(var l=0;l<e.length;l++){var m=e[l];if(e.length>a.length)break a;if(!(m instanceof d)){h.lastIndex=0;var n=h.exec(m);if(n){j&&(k=n[1].length);var o=n.index-1+k,n=n[0].slice(k),p=n.length,q=o+p,r=m.slice(0,o+1),s=m.slice(q+1),t=[l,1];r&&t.push(r);var u=new d(g,i?b.tokenize(n,i):n);t.push(u),s&&t.push(s),Array.prototype.splice.apply(e,t)}}}}return e},hooks:{all:{},add:function(a,c){var d=b.hooks.all;d[a]=d[a]||[],d[a].push(c)},run:function(a,c){var d=b.hooks.all[a];if(d&&d.length)for(var e,f=0;e=d[f++];)e(c)}}},c=b.Token=function(a,b){this.type=a,this.content=b};if(c.stringify=function(a,d,e){if("string"==typeof a)return a;if("[object Array]"==Object.prototype.toString.call(a))return a.map(function(b){return c.stringify(b,d,a)}).join("");var f={type:a.type,content:c.stringify(a.content,d,e),tag:"span",classes:["token",a.type],attributes:{},language:d,parent:e};"comment"==f.type&&(f.attributes.spellcheck="true"),b.hooks.run("wrap",f);var g="";for(var h in f.attributes)g+=h+'="'+(f.attributes[h]||"")+'"';return"<"+f.tag+' class="'+f.classes.join(" ")+'" '+g+">"+f.content+"</"+f.tag+">"},!self.document)return self.addEventListener?(self.addEventListener("message",function(a){var c=JSON.parse(a.data),d=c.language,e=c.code;self.postMessage(JSON.stringify(b.tokenize(e,b.languages[d]))),self.close()},!1),self.Prism):self.Prism;var d=document.getElementsByTagName("script");return d=d[d.length-1],d&&(b.filename=d.src,document.addEventListener&&!d.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",b.highlightAll)),self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism),Prism.languages.markup={comment:/&lt;!--[\w\W]*?-->/g,prolog:/&lt;\?.+?\?>/,doctype:/&lt;!DOCTYPE.+?>/,cdata:/&lt;!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,inside:{tag:{pattern:/^&lt;\/?[\w:-]+/i,inside:{punctuation:/^&lt;\/?/,namespace:/^[\w-]+?:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,inside:{punctuation:/=|>|"/g}},punctuation:/\/?>/g,"attr-name":{pattern:/[\w:-]+/g,inside:{namespace:/^[\w-]+?:/}}}},entity:/&amp;#?[\da-z]{1,8};/gi},Prism.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Prism.languages.css={comment:/\/\*[\w\W]*?\*\//g,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*{))/gi,inside:{punctuation:/[;:]/g}},url:/url\((["']?).*?\1\)/gi,selector:/[^\{\}\s][^\{\};]*(?=\s*\{)/g,property:/(\b|\B)[\w-]+(?=\s*:)/gi,string:/("|')(\\?.)*?\1/g,important:/\B!important\b/gi,ignore:/&(lt|gt|amp);/gi,punctuation:/[\{\};:]/g},Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{style:{pattern:/(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/gi,inside:{tag:{pattern:/(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css}}}),Prism.languages.clike={comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,lookbehind:!0},string:/("|')(\\?.)*?\1/g,"class-name":{pattern:/((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,"boolean":/\b(true|false)\b/g,"function":{pattern:/[a-z0-9_]+\(/gi,inside:{punctuation:/\(/}},number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,operator:/[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,ignore:/&(lt|gt|amp);/gi,punctuation:/[{}[\];(),.:]/g},Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(var|let|if|else|while|do|for|return|in|instanceof|function|get|set|new|with|typeof|try|throw|catch|finally|null|break|continue|this)\b/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,lookbehind:!0}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/gi,inside:{tag:{pattern:/(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript}}}),function(a,b){function c(a,b){return a?new RegExp("(\\s|^)"+b+"(\\s|$)").test(a.className):void 0}function d(a,b){c(a,b)||(a.className+=(a.className?" ":"")+b)}function e(a,b){c(a,b)&&(a.className=a.className.replace(new RegExp("(\\s|^)"+b+"(\\s|$)")," ").replace(/^\s+|\s+$/g,""))}function f(a,b){c(a,b)?e(a,b):d(a,b)}function g(a){return"#"==a[0]&&-1==a.indexOf(" ")?b.getElementById(a.slice(1)):b.querySelector(a)}function h(a){var b=curtop=0;if(a.offsetParent){do b+=a.offsetLeft,curtop+=a.offsetTop;while(a=a.offsetParent);return{top:curtop,left:b}}}function i(){FastClick.attach(b.body),a.addEventListener?a.addEventListener("hashchange",j):a.onhashchange=j,j(),Prism.highlightAll();var c=g("#example-usage"),h=g("#example-usage-fader");h.addEventListener("click",function(){f(c,"open")}),h.addEventListener("mouseenter",function(){d(c,"hover")}),h.addEventListener("mouseleave",function(){e(c,"hover")}),d(b.body,"animate"),function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(a,b,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-170982-31","axosoft.github.io"),ga("send","pageview")}function j(){if(location.hash.length){var a=location.hash.slice(0,location.hash.length-1),b=g(a);b&&(l=h(b).top-50,TweenLite.to(siteWrap,.4,{scrollTo:l,onComplete:function(){addEventListener("scroll",k)}}))}}function k(){var a=l-scrollY;Math.abs(a)>50&&("pushState"in history?history.pushState("",b.title,location.pathname+location.search):location.hash.replace(/#.+?/,""),removeEventListener("scroll",k))}"complete"==b.readyState||"interactive"==b.readyState?i():b.addEventListener("DOMContentLoaded",i),Object.size=function(a){var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c};var l}(window,document);