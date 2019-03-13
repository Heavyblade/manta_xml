var mantaXML=function(t){function e(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,r){function n(t,e,r){if(1===t.length&&void 0===r)return e._root;void 0===r&&t.shift();var a=t.shift(),i=(r||e._root).children[a];return 0==t.length?i:n(t,null,i)}function a(t){var e=new c;e.addDataString(t);var r,a,i=new o(e.tagToJSON()),u=[0];for(e.size>1&&e.moveNext();!e.atEnd();){switch(e.tokenType()){case 4:r=n(u.slice(0),i),a=new s(e.tagToJSON()),a.parent=r,r.children.push(a),u.push(r.children.length-1);break;case 0:r=n(u.slice(0),i),a=new s(e.tagToJSON()),a.parent=r,r.children.push(a);break;case 6:n(u.slice(0),i).data._text=e.text();break;case 8:var h=e.text().match(/<\!\[XDATA\s*\[(cdata_\d+)\]\]>/)[1];n(u.slice(0),i).data._cdata=e.cdata[h];break;case 5:u.pop()}e.moveNext()}return i}function i(t){return a(t).toJSON()}var o=r(1).Tree,s=r(1).Node,c=r(4).xmlReader;e.xmlReader=c,e.goTo=n,e.xmlToTree=a,e.xml2JSON=i},function(t,e,r){function n(t){this.data=t,this.parent=null,this.children=[]}function a(t){var e=new n(t);this._root=e}function i(t){var e="test".constructor,r=[].constructor,n=/hola/.constructor,a={}.constructor;return null===t?"null":void 0===t?"undefined":t.constructor===e?"String":t.constructor===r?"Array":t.constructor===n?"Regexp":t.constructor===a?"Object":typeof t}var o=r(3)._;a.prototype.traverseDF=function(t){!function e(r){for(var n=0,a=r.children.length;n<a;n++)e(r.children[n]);t(r)}(this._root)},a.prototype.traverseBF=function(t){var e=new Queue;for(e.enqueue(this._root),currentTree=e.dequeue();currentTree;){for(var r=0,n=currentTree.children.length;r<n;r++)e.enqueue(currentTree.children[r]);t(currentTree),currentTree=e.dequeue()}},a.prototype.toJSON=function(){function t(e){var r={};e.data.attrs&&Object.keys(e.data.attrs).length>0&&(r._attrs=e.data.attrs),e.data._text&&(r._text=e.data._text),e.data._cdata&&(r._cdata=e.data._cdata);for(var n=0,a=e.children.length;n<a;n++){var o=e.children[n];"undefined"===i(r[o.data.nodeName])?r[o.data.nodeName]=t(o):"Array"===i(r[o.data.nodeName])?r[o.data.nodeName].push(t(o)):(r[o.data.nodeName]=[r[o.data.nodeName]],r[o.data.nodeName].push(t(o)))}return r}var e={};return e[this._root.data.nodeName]=t(this._root),e},a.prototype.find=function(t){var e=[];if("function"==typeof t)this.traverseDF(function(r){t(r.data)&&e.push(r.data)});else if("object"==typeof t){var r=[],n=t;n.attrs?o.each(Object.keys(n.attrs),function(t){r.push(function(e){return"Regexp"===i(n.attrs[t])?n.attrs[t].exec(e.attrs[t]):n.attrs[t]===e.attrs[t]})}):n.nodeName?r.push(function(t){return t.nodeName==n.nodeName}):n._text?r.push(function(t){return"Regexp"===i(n._text)?n._text.exec(t._text):n._text===t._text}):n._cdata&&r.push(function(t){return"Regexp"===i(n._cdata)?n._cdata.exec(t._cdata):n._cdata===t._cdata}),this.traverseDF(function(t){o.all(t.data,r)&&e.push(t.data)})}return e},e.Tree=a,e.Node=n},function(t,e,r){e.xmlParser=r(0).xmlToTree,e.xml2JSON=r(0).xml2JSON},function(t,e){_={intersect:function(t,e){var r;return e.length>t.length&&(r=e,e=t,t=r),t.filter(function(t){if(-1!==e.indexOf(t))return!0})},find:function(t,e){for(var r,n=t.length,a=0;a<n;a++)if(r=t[a],e(t[a]))return r;return null},each:function(t,e){for(var r=t.length,n=0;n<r;n++)e(t[n])},map:function(t,e){for(var r=[],n=t.length,a=0;a<n;a++)r.push(e(t[a]));return r},select:function(t,e){for(var r,n=[],a=t.length,i=0;i<a;i++)r=t[i],e(r)&&n.push(r);return n},all:function(t,e){for(var r=!1,n=e.length,a=0;a<n;a++)e[a](t)?r=!0:(a=1e7,r=!1);return r}},e._=_},function(t,e){function r(){this.xmlString="",this.xmlArray=[],this.pointer=0,this.size=0,this.cdata={},this.atEnd=function(){return this.pointer===this.size-1},this.name=function(){return this.getNodeName()},this.text=function(){return this.getCurrent()},this.readNext=function(){var t=this.xmlArray[this.pointer+1];return t?this.tokenType(t):0},this.tokenType=function(t){var e=t||this.getCurrent();return e.match(/<\!\[XDATA\s*\[cdata_\d+\]\]>/g)?8:e.match(/<\/([^>]*)\s*>/g)?5:e.match(/<\s*[\s\S]*?\s*\/(?=>)>/g)?0:e.match(/<([^>]*)>/g)?4:6},this.isCDATA=function(){return 8===this.tokenType()},this.isEndElement=function(){return 5===this.tokenType()},this.isStartElement=function(){return 4===this.tokenType()},this.clear=function(){this.xmlString="",this.xmlArray=[],this.pointer=0,this.size=0,this.cdata={}},this.addDataString=function(t){this.xmlString=t,this.xmlArray=_.select(this.extractCDATA(t).replace(/<\!--((?!-->).)*-->/g,"").replace(/<\!\w* ([^>]*)\s*>/g,"").replace(/<\!\[XDATA\[((?!\]\]>).)*\]\]>/g,"__#&#__<$1>__#&#__").replace(/<([\s\S]*?)>/g,"__#&#__<$1>__#&#__").split("__#&#__"),function(t){return""!==t.trim()&&null===t.match(/<\?xml/)}),this.xmlArray=_.map(this.xmlArray,function(t){return t.trim()}),this.size=this.xmlArray.length},this.findClose=function(){var t,e=this.pointer+1,r=this.name(),n=new RegExp("<s?/s?"+r+"s?>"),a=0;if(0===this.tokenType())return this.pointer;for(;(!n.exec(this.xmlArray[e])||0!=a)&&e<this.size;)t=this.xmlArray[e],4==this.tokenType(t)&&r==this.getNodeName(t)&&a++,n.exec(this.xmlArray[e])&&a--,e++;return e},this.moveNext=function(){this.pointer++},this.moveTo=function(t){this.pointer=t},this.getCurrent=function(){return this.xmlArray[this.pointer]},this.getNodeName=function(t){var e=t||this.getCurrent();return((e.match(/<\s*[^\s>\/]+:([^\s>\/]+)\s*/)||e.match(/<\s*([^\s>\/]+)\s*/)||[])[1]||"").trim()},this.getAttrs=function(){for(var t,e=this.getCurrent(),r=/([^=\s]+)='([^']+)'/g,n=/([^=\s]+)="([^"]+)"/g,a={};t=r.exec(e);)key=t[1].split(":")[1]||t[1],a[key]=t[2];for(;t=n.exec(e);)key=t[1].split(":")[1]||t[1],a[key]=t[2];return a},this.extractCDATA=function(t){var e=/<\!\[CDATA\s*\[((?!\]\]).*)\]\]>/,r=1;for(t=t.replace(/<\!\[CDATA\[\]\]>/g,"");t.match(e);)this.cdata["cdata_"+r]=t.match(e)[1],t=t.replace(e,"<![XDATA [cdata_"+r+"]]>"),r++;return t},this.tagToJSON=function(){return{nodeName:this.name(),attrs:this.getAttrs()}}}e.xmlReader=r}]);