/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Tree      = __webpack_require__(1).Tree,
    Node      = __webpack_require__(1).Node,
    xmlReader = __webpack_require__(4).xmlReader;


/*
 The arrays show how that particular branch will be represented
 <node1>                     [0]
      <node2>                [0, 0]
          <node3>            [0, 0, 0]
              <node4>        [0, 0, 0, 0]
                  hola mundo
              </node4>       [0, 0, 0]
              <node4>        [0, 0, 0, 1]
                hola mundo
              </node4>       [0, 0, 0]
          </node3>           [0, 0]
          <node3>            [0, 0, 1]
            hola2 mundo2
          </node3>           [0, 0]
      </node2>               [0]
      <node5>                [0, 1]
        <node6>              [0, 1, 0]
          Hola mundo
        </node6>             [0, 1]
      </node5>               [0]
</node1>
*/

function goTo(path, tree, node) {
    if ( path.length === 1 && node === undefined ) { return(tree._root); }
    if ( node === undefined ) { path.shift(); }

    var item  = path.shift(),
       myNode = (node || tree._root).children[item];

    return path.length == 0 ? myNode : goTo(path, null, myNode);
}

function xmlToTree(xmlString) {
    var xml = new xmlReader();
    xml.addDataString(xmlString);

    /*********************
    * Initializing the tree
    **********************/
    var tree = new Tree( xml.tagToJSON() ),
        path = [0],
        parentNode, nodeChild;

    if ( xml.size > 1) {  xml.moveNext(); }

    /*********************
     * parsing xml array
     *********************/
    while(!xml.atEnd()) {
        switch (xml.tokenType()) {
            case 4:
                    parentNode = goTo(path.slice(0), tree);
                    nodeChild  = new Node(xml.tagToJSON());
                    nodeChild.parent = parentNode;

                    parentNode.children.push(nodeChild);
                    path.push( parentNode.children.length -1 );
                    break;
            case 0:
                    parentNode = goTo(path.slice(0), tree);
                    nodeChild  = new Node(xml.tagToJSON());
                    nodeChild.parent = parentNode;

                    parentNode.children.push(nodeChild);
                    break;
            case 6:
                    goTo(path.slice(0), tree).data._text = xml.text();
                    break;
            case 8:
                    var cname = xml.text().match(/<\!\[XDATA\s*\[(cdata_\d+)\]\]>/)[1];
                    goTo(path.slice(0), tree).data._cdata = xml.cdata[cname];
                    break;
            case 5:
                    path.pop();
                    break;
        }
        xml.moveNext();
    }
    return tree;
}

function xml2JSON(xmlString) {
    return xmlToTree(xmlString).toJSON();
}

exports.xmlReader = xmlReader;
exports.goTo      = goTo;
exports.xmlToTree = xmlToTree;
exports.xml2JSON  = xml2JSON;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(3)._;

function Node(data) {
    this.data     = data;
    this.parent   = null;
    this.children = [];
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
}

Tree.prototype.traverseDF = function(callback) {

    // this is a recurse and immediately-invoking function
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }

        // step 4
        callback(currentNode);

        // step 1
    })(this._root);
};

Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();

    queue.enqueue(this._root);

    currentTree = queue.dequeue();

    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }

        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.toJSON = function() {

    function buildJSON(currentNode){
          var base = {};

          if ( currentNode.data.attrs && Object.keys(currentNode.data.attrs).length > 0 ) { base._attrs = currentNode.data.attrs; }
          if ( currentNode.data._text ) { base._text  = currentNode.data._text; }

          for (var i = 0, length = currentNode.children.length; i < length; i++) {
              var child = currentNode.children[i];

              if ( whatIsIt(base[child.data.nodeName]) === "undefined" ) {
                  base[child.data.nodeName] = buildJSON(child);
              } else if ( whatIsIt(base[child.data.nodeName]) === "Array"  ) {
                  base[child.data.nodeName].push(buildJSON(child));
              } else {
                  base[child.data.nodeName] = [base[child.data.nodeName]];
                  base[child.data.nodeName].push(buildJSON(child));
              }
          }
          return base;
    }

    var json = {};
    json[this._root.data.nodeName] =  buildJSON(this._root);

    return json;
};

Tree.prototype.find = function(callback) {
    var results = [];

    if (typeof(callback) === "function") {
        this.traverseDF(function(node){
            if (callback(node.data)) { results.push(node.data); }
        });
    } else if(typeof(callback) === "object") {
        var checkers = [],
            params   = callback;

        if(params.attrs) {
            _.each(Object.keys(params.attrs), function(key){
                checkers.push(function(data) {
                    if ( whatIsIt(params.attrs[key]) === "Regexp"  ) {
                        return params.attrs[key].exec(data.attrs[key]);
                    } else {
                        return params.attrs[key] === data.attrs[key];
                    }
                 });
            });
        } else if (params.nodeName) {
            checkers.push(function(data) {
                return data.nodeName == params.nodeName;
            });
        } else if (params._text) {
            checkers.push(function(data) {
                if ( whatIsIt(params._text) === "Regexp"  ) {
                    return params._text.exec(data._text);
                } else {
                    return params._text === data._text;
                }
            });
        } else if (params._cdata) {
            checkers.push(function(data) {
                if ( whatIsIt(params._cdata) === "Regexp"  ) {
                    return params._cdata.exec(data._cdata);
                } else {
                    return params._cdata === data._cdata;
                }
            });
        }

        this.traverseDF(function(node){
            if (_.all(node.data, checkers)) { results.push(node.data); }
        });
    }

    return results;
};

function whatIsIt(object) {
    var stringConstructor = "test".constructor,
        arrayConstructor  = [].constructor,
        regexConstructor  = (/hola/).constructor,
        objectConstructor = {}.constructor;

    if (object === null) { return "null"; }
    else if (object === undefined)                     { return "undefined"; }
    else if (object.constructor === stringConstructor) { return "String";    }
    else if (object.constructor === arrayConstructor)  { return "Array";     }
    else if (object.constructor === regexConstructor)  { return "Regexp";    }
    else if (object.constructor === objectConstructor) { return "Object";    }
    else { return typeof(object); }
}

exports.Tree = Tree;
exports.Node = Node;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// This is just a place for the library API

exports.xmlToTree = __webpack_require__(0).xmlToTree;
exports.xml2JSON  = __webpack_require__(0).xml2JSON;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

_ = {
    intersect: function(a,b) {
        var t;

        if (b.length > a.length) {
            t = b;
            b = a;
            a = t;
        }

        return a.filter(function (e) {
                    if (b.indexOf(e) !== -1) return true;
                });
    },
    find: function(array, filter) {
        var z      = array.length,
          item;

        for( var i=0; i < z; i++ ) {
          item = array[i];
          if ( filter(array[i]) ) { return(item); }
        }
        return(null);
    },
    each: function(array, callback) {
        var x = [],
          z = array.length,
          record;

        for( var i=0; i < z; i++ ) { callback(array[i]); }
    },
    map: function(array, callback) {
        var x = [],
          z = array.length,
          record;

        for( var i=0; i < z; i++ ) {x.push(callback(array[i])); }
        return x;
    },
    select: function(array, callback) {
      var x = [],
        z = array.length,
        record;

      for( var i=0; i < z; i++ ) {
        record = array[i];
        if ( callback(record) ) { x.push(record); }
      }
      return(x);
    },
    all: function(data, functions) {
        var result = false,
            z      = functions.length;

        for(var i=0; i < z; i++) {
            if (functions[i](data)) {
                result = true;
             } else {
                 i = 10000000;
                 result = false;
             }
        }

        return result;
    }
};

exports._ = _;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function xmlReader() {
    this.xmlString = "";
    this.xmlArray  = [];
    this.pointer   = 0;
    this.size      = 0;
    this.cdata     = {};

    // **************************************
    // Velneo v7 interface
    // **************************************
    this.atEnd       = function() { return((this.pointer) === this.size-1); };
    this.name        = function() { return(this.getNodeName()); };
    this.text        = function() { return(this.getCurrent());  };
    this.readNext    = function() {
                          var nextElement = this.xmlArray[this.pointer+1];
                          return( nextElement ? this.tokenType(nextElement) : 0);
                       };
    this.tokenType  = function(element) {
        var current = element || this.getCurrent();

        if ( current.match(/<\!\[XDATA\s*\[cdata_\d+\]\]>/g) )  { return(8); }
        else if (current.match(/<\/([^>]*)\s*>/g))              { return(5); }
        else if (current.match(/<\s*[\s\S]*?\s*\/(?=>)>/g) )    { return(0); }
        else if (current.match(/<([^>]*)>/g))                   { return(4); }
        else { return (6); }
    };

    this.isCDATA = function() {
        return this.tokenType() === 8;
    };

    this.isEndElement = function() {
        return this.tokenType() === 5;
    };

    this.isStartElement = function() {
        return this.tokenType() === 4;
    };

    this.clear = function() {
        this.xmlString = "";
        this.xmlArray  = [];
        this.pointer   = 0;
        this.size      = 0;
        this.cdata     = {};
    };

    this.addDataString = function(xmlString) {
        var isXmlHeader,
            separator = "__#&#__";

        this.xmlString = xmlString;
        this.xmlArray  = _.select(this.extractCDATA(xmlString)
                                      .replace(/<\!--((?!-->).)*-->/g, "")
                                      .replace(/<\!\w* ([^>]*)\s*>/g, "")
                                      .replace(/<\!\[XDATA\[((?!\]\]>).)*\]\]>/g, separator + "<$1>" + separator)
                                      .replace(/<([\s\S]*?)>/g, separator + "<$1>" + separator)
                                      .split(separator),
                                      function(el) {
                                            return( el.trim() !== "" && el.match(/<\?xml/) === null );
                                      });
        this.xmlArray  = _.map(this.xmlArray, function(el) { return(el.trim()); });
        this.size      = this.xmlArray.length;
    };

    // **************************************
    // Private methods
    // **************************************
    this.findClose   = function() {
        var next            = this.pointer + 1,
            currentNodeName = this.name(),
            closedRegx      = new RegExp("<\s?\/\s?" + currentNodeName + "\s?>"),
            toIgnore        = 0,
            nextElement;

        if ( this.tokenType() === 0 ) { return(this.pointer); }

        while ( !(closedRegx.exec(this.xmlArray[next]) && toIgnore == 0) && next < this.size ) {
            nextElement = this.xmlArray[next];
            if ( this.tokenType(nextElement) == 4 && currentNodeName == this.getNodeName(nextElement) ) { toIgnore++; }
            if ( closedRegx.exec(this.xmlArray[next]) ) { toIgnore--; }
            next++;
        }

        return(next);
    };
    this.moveNext    = function() { this.pointer++; };
    this.moveTo      = function(to) { this.pointer = to; };
    this.getCurrent  = function() { return(this.xmlArray[this.pointer]); };
    this.getNodeName = function(element) {
        var el = element || this.getCurrent();
        return( ((el.match(/<\s*[^\s>\/]+:([^\s>\/]+)\s*/) || el.match(/<\s*([^\s>\/]+)\s*/) || [])[1] || "").trim() );
    };
    this.getAttrs   = function() {
        var element = this.getCurrent(),
          regxSing  = /\s+([^=\s]+)='([^=']+)'/g,
          regxDoub  = /\s+([^=\s]+)="([^="]+)"/g,
          attrs     = {},
          param;

        while (param = regxSing.exec(element)) {
            key = param[1].split(":")[1] || param[1];
            attrs[key] = param[2];
        }

        while (param = regxDoub.exec(element)) {
            key = param[1].split(":")[1] || param[1];
            attrs[key] = param[2];
        }

        return (attrs);
    };

    this.extractCDATA = function(xmlString) {
        var regx  = /<\!\[CDATA\s*\[((?!\]\]).*)\]\]>/,
            count = 1;

        while(xmlString.match(regx)) {
            this.cdata["cdata_" + count] = xmlString.match(regx)[1];
            xmlString = xmlString.replace(regx, "<![XDATA [cdata_" + count + "]]>");
            count++;
        }
        return xmlString;
    };

    this.tagToJSON = function() {
        return {nodeName: this.name(), attrs: this.getAttrs()};
    };
}

exports.xmlReader = xmlReader;

/***/ })
/******/ ]);