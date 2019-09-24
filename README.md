## What ?

manta xml is a really simple library with no npm, node or browser dependencies, is a pure javascript xml parser, editor and JSON converter.

## Why ?

manta_xml was developed because out there are more and simpler javascript engines than v8, spidermonkey o chakra, simpler js engines can 'understand' javascript but had no access to C/C++ bindings, node or npm modules to take advantaje of what is already built.

## How ?

### Install

**npm**
```bash
    npm install manta_xml --save
```
**other evironments**
In the dist folder other formats are available, the common one for the purpouse of this library is to use the manta_xml.var.js, it will add a global variable name called mantaXML that exposes the xml2JSON and xmlParser and xmlToTree functions.

### Usage

#### convert xml to JSON

the xml2JSON function will take any xml string and will try to parse and convert it to an equivalent JSON object.

```javascript
    var xml2JSON = require("manta_xml").xml2JSON;

    json = xml2JSON("<node id='23'>inner text</node>");
    // {node: {attrs: {id: '23'}, _text: 'inner text'}  }
```

#### Search into the xml

To search into the xml document there is a 'find' method wich can receive a query object or a callback function to go through the xml tree and find nodes that matches the params.

**Searching by query object:**

Searching with a query object is pretty simple, you provide an object that indicates the attribute that you are going to search in and a value to match to, it can be a standar value (string, int, bool, etc) or a regex literal.


**Syntax**

```javascript
    var xmlParser = require("manta_xml").xmlParser,
        document  = xmlParser(".... some xml ...");

    document.find({attrs: {some_attribute: 'value to match'}});

    //or

    document.find(function(node) { return(node.attrs.some_attribute * 3 > 1000);  });
```

**examples**:

```javascript
// Find nodes with id attribute equal to 1234, something like <bill id='1234'>
results = document.find({attrs: {id: '1234'}})

// Find nodes with id attribute equal to 1234, something like <bill id='1234'>
// But return the result as a JSON.
results = document.find({attrs: {id: '1234'}}, true)

// Find all the bill type nodes, <bill id='123' total='20000'>
results = document.find({nodeName: 'bill'});

// Find all nodes wich name attribute start with 'ever' => <direction name='evergreen avenue' />
results = document.find({attrs: {name: /^ever/}});

// Find all nodes wich inner text includes the word 'world'<line id='12'>Hello world</line>
results = document.find({_text: /world/});

// Find all nodes in wich name attribute it's equal to 'line' and its inner text includes the word 'world' => <node1 name='line'>without world</node1><node2 name='line'>something else</node2>
results = document.find({_text: /mundo/, attrs: {name: 'line'}});

```

**Searching with callback function:**

If you need more control over the search or perform some operations, you can pass a function to the 'find' method instead of a query object, the callback function will receive a node object and should return a boolean value depending on the needed operations or comparisons.


**examples**:

```javascript

// Find all nodes with id attribute equal to 1234, something like <bill id='1234'>
results = document.find(function(node) { return(node.attrs.id && node.attrs.id === '1234'); });

// Find all the bill type nodes, <bill id='123' total='20000'>
results = document.find(function(node) { return(node.nodeName === 'factura'); });

// Find all nodes wich name attribute start with 'ever' => <direction name='evergreen avenue'/>
results = document.find(function(node) { return(node.attrs.name && node.attrs.name.match(/ever/)); });

```

**query result**: in both cases the result is the same, an array with objects that represent the matching xml nodes, this objects can be the node object it self or a JSON object representing the node like this one:

```javascript
  [{nodeName: 'node1', attrs: {id: '1'}, _text: "some text"}, {nodeName: 'node2', attrs: {id: '2', name: 'second node'}}]
```
the JSON that represents each node will always had the 'nodeName' and 'attrs' keys, and will have '_text' or '_cdata' keys if the current node wraps some text or cdata expression.

if your intention is to edit the nodes attributes, text, CData, adding or removing child nodes you need direct access to the Node object and the find function by default will give you the list of nodes.

## Build

To build the library with the multiple outputs just run.
```bash
 npm run build
```

## Testing

to test the library the mocha framework is used
```bash
 npm run test
```

## License

manta_xml has be open source under the MIT license.

* http://www.opensource.org/licenses/MIT