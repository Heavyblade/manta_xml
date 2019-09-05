define("mantaXML",[],function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){var n=r(1).Tree,a=r(1).Node,i=r(4).xmlReader;function o(t,e,r){if(1===t.length&&void 0===r)return e._root;void 0===r&&t.shift();var n=t.shift(),a=(r||e._root).children[n];return 0==t.length?a:o(t,null,a)}function s(t){var e=new i;e.addDataString(t);var r,s,u=new n(e.tagToJSON()),c=[0];for(e.size>1&&e.moveNext();!e.atEnd();){switch(e.tokenType()){case 4:r=o(c.slice(0),u),(s=new a(e.tagToJSON())).parent=r,r.children.push(s),c.push(r.children.length-1);break;case 0:r=o(c.slice(0),u),(s=new a(e.tagToJSON())).parent=r,r.children.push(s);break;case 6:o(c.slice(0),u).data._text=e.text();break;case 8:var h=e.text().match(/<\!\[XDATA\s*\[(cdata_\d+)\]\]>/)[1];o(c.slice(0),u).data._cdata=e.cdata[h];break;case 5:c.pop()}e.moveNext()}return u}e.xmlReader=i,e.goTo=o,e.xmlToTree=s,e.xml2JSON=function(t){return s(t).toJSON()},e.treeToXML=function(t){return t.toXML()}},function(t,e,r){var n=r(3)._;function a(t){this.data=t,this.parent=null,this.children=[]}function i(t){var e=new a(t);this._root=e}function o(t){var e="test".constructor,r=[].constructor,n=/hola/.constructor,a={}.constructor;return null===t?"null":void 0===t?"undefined":t.constructor===e?"String":t.constructor===r?"Array":t.constructor===n?"Regexp":t.constructor===a?"Object":typeof t}i.prototype.traverseDF=function(t){!function e(r){for(var n=0,a=r.children.length;n<a;n++)e(r.children[n]);t(r)}(this._root)},i.prototype.traverseBF=function(t){var e=new Queue;for(e.enqueue(this._root),currentTree=e.dequeue();currentTree;){for(var r=0,n=currentTree.children.length;r<n;r++)e.enqueue(currentTree.children[r]);t(currentTree),currentTree=e.dequeue()}},i.prototype.toJSON=function(){var t={};return t[this._root.data.nodeName]=function t(e){var r={};e.data.attrs&&Object.keys(e.data.attrs).length>0&&(r._attrs=e.data.attrs),e.data._text&&(r._text=e.data._text),e.data._cdata&&(r._cdata=e.data._cdata);for(var n=0,a=e.children.length;n<a;n++){var i=e.children[n];"undefined"===o(r[i.data.nodeName])?r[i.data.nodeName]=t(i):"Array"===o(r[i.data.nodeName])?r[i.data.nodeName].push(t(i)):(r[i.data.nodeName]=[r[i.data.nodeName]],r[i.data.nodeName].push(t(i)))}return r}(this._root),t},i.prototype.toXML=function(){return t=this._root,e="<"+t.data.nodeName+" ",t.data.attrs&&Object.keys(t.data.attrs).length>0&&(e+=function(t){var e,r=[];for(e in t)r.push(e+'="'+t[e]+'"');return r.join(" ")}(t.data.attrs)),e+=">",t.data._text&&(e+=t.data._text),t.data._cdata&&(e+="<![CDATA["+t.data._cdata+"]]>"),e+="</"+t.data.nodeName+">";var t,e},i.prototype.find=function(t){var e=[];if("function"==typeof t)this.traverseDF(function(r){t(r.data)&&e.push(r.data)});else if("object"==typeof t){var r=[],a=t;a.attrs?n.each(Object.keys(a.attrs),function(t){r.push(function(e){return"Regexp"===o(a.attrs[t])?a.attrs[t].exec(e.attrs[t]):a.attrs[t]===e.attrs[t]})}):a.nodeName?r.push(function(t){return t.nodeName==a.nodeName}):a._text?r.push(function(t){return"Regexp"===o(a._text)?a._text.exec(t._text):a._text===t._text}):a._cdata&&r.push(function(t){return"Regexp"===o(a._cdata)?a._cdata.exec(t._cdata):a._cdata===t._cdata}),this.traverseDF(function(t){n.all(t.data,r)&&e.push(t.data)})}return e},e.Tree=i,e.Node=a},function(t,e,r){e.xmlParser=r(0).xmlToTree,e.xml2JSON=r(0).xml2JSON,e.treeToXML=r(0).treeToXML},function(t,e){_={intersect:function(t,e){var r;return e.length>t.length&&(r=e,e=t,t=r),t.filter(function(t){if(-1!==e.indexOf(t))return!0})},find:function(t,e){for(var r,n=t.length,a=0;a<n;a++)if(r=t[a],e(t[a]))return r;return null},each:function(t,e){for(var r=t.length,n=0;n<r;n++)e(t[n])},map:function(t,e){for(var r=[],n=t.length,a=0;a<n;a++)r.push(e(t[a]));return r},select:function(t,e){for(var r,n=[],a=t.length,i=0;i<a;i++)e(r=t[i])&&n.push(r);return n},all:function(t,e){for(var r=!1,n=e.length,a=0;a<n;a++)e[a](t)?r=!0:(a=1e7,r=!1);return r}},e._=_},function(t,e){e.xmlReader=function(){this.xmlString="",this.xmlArray=[],this.pointer=0,this.size=0,this.cdata={},this.atEnd=function(){return this.pointer===this.size-1},this.name=function(){return this.getNodeName()},this.text=function(){return this.getCurrent()},this.readNext=function(){var t=this.xmlArray[this.pointer+1];return t?this.tokenType(t):0},this.tokenType=function(t){var e=t||this.getCurrent();return e.match(/<\!\[XDATA\s*\[cdata_\d+\]\]>/g)?8:e.match(/<\/([^>]*)\s*>/g)?5:e.match(/<\s*[\s\S]*?\s*\/(?=>)>/g)?0:e.match(/<([^>]*)>/g)?4:6},this.isCDATA=function(){return 8===this.tokenType()},this.isEndElement=function(){return 5===this.tokenType()},this.isStartElement=function(){return 4===this.tokenType()},this.clear=function(){this.xmlString="",this.xmlArray=[],this.pointer=0,this.size=0,this.cdata={}},this.addDataString=function(t){this.xmlString=t,this.xmlArray=_.select(this.extractCDATA(t).replace(/<\!--((?!-->).)*-->/g,"").replace(/<\!\w* ([^>]*)\s*>/g,"").replace(/<\!\[XDATA\[((?!\]\]>).)*\]\]>/g,"__#&#__<$1>__#&#__").replace(/<([\s\S]*?)>/g,"__#&#__<$1>__#&#__").split("__#&#__"),function(t){return""!==t.trim()&&null===t.match(/<\?xml/)}),this.xmlArray=_.map(this.xmlArray,function(t){return t.trim()}),this.size=this.xmlArray.length},this.findClose=function(){var t,e=this.pointer+1,r=this.name(),n=new RegExp("<s?/s?"+r+"s?>"),a=0;if(0===this.tokenType())return this.pointer;for(;(!n.exec(this.xmlArray[e])||0!=a)&&e<this.size;)t=this.xmlArray[e],4==this.tokenType(t)&&r==this.getNodeName(t)&&a++,n.exec(this.xmlArray[e])&&a--,e++;return e},this.moveNext=function(){this.pointer++},this.moveTo=function(t){this.pointer=t},this.getCurrent=function(){return this.xmlArray[this.pointer]},this.getNodeName=function(t){var e=t||this.getCurrent();return((e.match(/<\s*[^\s>\/]+:([^\s>\/]+)\s*/)||e.match(/<\s*([^\s>\/]+)\s*/)||[])[1]||"").trim()},this.getAttrs=function(){for(var t,e=this.getCurrent(),r=/([^=\s]+)='([^']+)'/g,n=/([^=\s]+)="([^"]+)"/g,a={};t=r.exec(e);)key=t[1].split(":")[1]||t[1],a[key]=t[2];for(;t=n.exec(e);)key=t[1].split(":")[1]||t[1],a[key]=t[2];return a},this.extractCDATA=function(t){var e=/<\!\[CDATA\s*\[((?!\]\]).*)\]\]>/,r=1;for(t=t.replace(/<\!\[CDATA\[\]\]>/g,"");t.match(e);)this.cdata["cdata_"+r]=t.match(e)[1],t=t.replace(e,"<![XDATA [cdata_"+r+"]]>"),r++;return t},this.tagToJSON=function(){return{nodeName:this.name(),attrs:this.getAttrs()}}}}])});