## What ?

manta xml is really simple library with no npm, node or browser dependencies is pure javascript xml parser and JSON converter.

## Why ?

manta_xml was developed because there are more and simpler javascript engines than v8, spidermonkey o chakra out there, simpler js engines can 'understand' javascript but had no access to C/C++ bindings or npm modules to take advantaje of that has already been done.

## How ?

### Install

```bash
npm install manta_xml
```

### Use

#### Search into the xml

Para buscar en el xml tienes la funcion 'find' que recibe una función que usara para filtrar o tambien puedes pasarle parametros con un objeto para indicar que campos quieres que busque.

Resultado: En ambos casos de busquedas el resultado será un array con objetos json que representan los nodos encontrados, por ejemplo: 

[{nodeName: 'node1', attrs: {id: '1'}}, {nodeName: 'node2', attrs: {id: '2', name: 'segundo nodo'}}] 

El json que representa un nodo siempre tendra los atributos 'nodeName' y 'attrs', y tendrá los atributos '_text' y '_cdata', dependiendo si el elemento xml en su contenido tiene texto o una expresion de CDATA.

Busqueda por parametros
la busqueda por parametros es la más simple, solo pasas a la funcion el atributo por el que estas buscando y el valor a matchear que pueder ser cualquier string, numero, boolean o incluso una expresión regular:

Parametros

attrs: Puedes indicar los atributos por los que quieres buscar y los valores que deben de tener.
_text: Pudes indicar que valor debe tener el contenido de un nodo.
nodeName: Puedes indicar que tag especifico estas buscando.
_cdata: Puedes indicar que contenido buscas en _cdata del nodo actual.
Ejemplos
var parser = new cirrusXML('...xml...'), results;

// Encuentra los nodos con el atributo id igual 1234, algo como <factura id='1234'> 
results = parser.find({attrs: {id: '1234'}})

// Encuentra los nodos de tipo factura en todo el xml, algo com <factura id='123' total='20000'> 
results = parser.find({nodeName: 'factura'});

// Encuentra los nodos cuyo atributo name comience con madri => <direcction value='madrid, calle 123'> 
results = parser.find({attrs: {name: /madri/}});

// Encuentra lods nodos que en el texto interno tengan la palabra 'mundo' => <linea id='12'>texto interno mundo</linea> 
results = parser.find({_text: /mundo/});

// Encuentra los nodos con parametro name igual linea y que el texto diga 'mundo' => <node1 name='linea'>sin mundo</node1><node2 name='linea'>con mundo</node2> 
results = parser.find({_text: /mundo/, attrs: {name: 'linea'}});

Busqueda por función
Cuando necesites un mayor control sobre como se realizará el match para la busqueda, la funcion 'find' tambien acepta una función, a la que se le entrega el node y que debera devolver un true o false de acuerdo a las condiciones que desees operando sobre el nodo.


Ejemplos:

// Encuentra los nodos con el atributo id igual 1234, algo como <factura id='1234'> 
results = parser.find(function(node) { return(node.attrs.id && node.attrs.id === '1234'); }); 

// Encuentra los nodos de tipo factura en todo el xml, algo com <factura id='123' total='20000'> 
results = parser.find(function(node) { return(node.nodeName === 'factura'); }); 

// Encuentra los nodos cuyo atributo name comience con madri => <direcction value='madrid, calle 123'> 
results = parser.find(function(node) { return(node.attrs.name && node.attrs.name.match(/madri/)); });