## What ?

manta xml is a really simple library with no npm, node or browser dependencies, is pure javascript xml parser and JSON converter.

## Why ?

manta_xml was developed because out there are more and simpler javascript engines than v8, spidermonkey o chakra, simpler js engines can 'understand' javascript but had no access to C/C++ bindings, node or npm modules to take advantaje of was alrady done.

## How ?

### Install

```bash
npm install manta_xml --save
```

### Use

#### Search into the xml

To search into the xml document there is a 'find' method wich can receibe a query object or a callback function to go through the xml tree and find nodes that matches the params.

query result: in both cases the result is the same, an array with objects that represent the matching xml nodes, like this one:

```javascript
  [{nodeName: 'node1', attrs: {id: '1'}}, {nodeName: 'node2', attrs: {id: '2', name: 'second node'}}]
```

the JSON that represents each node will always had the 'nodeName' and 'attrs' keys, and will have '_text' or '_cdata' keys if the current node wraps some text or cdata expression.


**Searching by query object:**

Searching with a query object is pretty simple, you provide an object that indicates the attribute that you are going to search in and a value to match to, it can be a standar value (string, int, bool, etc) or a regex literal.


**Syntax**

```javascript
    var parser = require("manta_xml").parseXml;

    parser.find({attrs: {some_attribute: 'value to match'}});

    //or

    parser.find(function(node) { return(node.attrs.some_attribute * 3 > 1000);  });
```


**examples**:

```javascript
// Find nodes with id attribute equal to 1234, something like <bill id='1234'>
results = parser.find({attrs: {id: '1234'}})

// Find all the bill type nodes, <bill id='123' total='20000'>
results = parser.find({nodeName: 'bill'});

// Find all nodes wich name attribute start with 'ever' => <direction name='evergreen avenue' />
results = parser.find({attrs: {name: /^ever/}});

// Find all nodes wich inner text includes the word 'world'<line id='12'>Hello world</line>
results = parser.find({_text: /world/});

// Find all nodes in wich name attribute it's equal to 'line' and its inner text includes the word 'world' => <node1 name='line'>without world</node1><node2 name='line'>something else</node2>
results = parser.find({_text: /mundo/, attrs: {name: 'line'}});
```

**Searching with callback function:**

If you need more control over the search or perform some operations, you can pass a function to the 'find' method instead of a query object, the callback function will receive a node object and should return a boolean value depending on the needed operations or comparisons.


**examples**:

```javascript

// Find all nodes with id attribute equal to 1234, something like <bill id='1234'>
results = parser.find(function(node) { return(node.attrs.id && node.attrs.id === '1234'); });

// Find all the bill type nodes, <bill id='123' total='20000'>
results = parser.find(function(node) { return(node.nodeName === 'factura'); });

// Find all nodes wich name attribute start with 'ever' => <direction name='evergreen avenue'/>
results = parser.find(function(node) { return(node.attrs.name && node.attrs.name.match(/ever/)); });

```

## Testing

to test the library the mocha framework is used
```bash
 npm run test
```

## License

manta_xml has be open source under the MIT license.

* http://www.opensource.org/licenses/MIT