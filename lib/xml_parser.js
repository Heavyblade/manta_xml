var Tree      = require("./tree").Tree,
    Node      = require("./tree").Node,
    xmlReader = require("./xml_reader").xmlReader;


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
