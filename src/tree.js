var _ = require("./utils")._;

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