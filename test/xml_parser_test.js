var assert    = require('assert'),
    expect    = require("expect.js"),
    xmlReader = require("./../src/xml_parser").xmlReader,
    Tree      = require("./../src/tree").Tree,
    Node      = require("./../src/tree").Node,
    goTo      = require("./../src/xml_parser").goTo,
    xml2JSON  = require("./../src/manta_xml").xml2JSON,
    xmlToTree = require("./../src/manta_xml").xmlToTree;


describe('xml to JSON', function() {

    describe("#goTo", function() {
        it("should be able to navigate to first element", function() {
            var baseTree = new Tree({id: 0});

            baseTree._root.children.push( new Node({id: 1}) );
            expect(goTo([0], baseTree).data.id).to.be(0);
        });

        it("should be able to navigate to a deep node", function() {
            var baseTree = new Tree({id: 0});

            baseTree._root.children.push( new Node({id: 1}) );
            baseTree._root.children[0].children.push( new Node({id: 2}) );
            baseTree._root.children[0].children.push( new Node({id: 3}) );

            expect(goTo([0, 0, 1], baseTree).data.id).to.be(3);
        });
    });

    describe("#xmlToTree", function() {
        it("should be able to build a tree data structure from xml", function() {
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><node1 id='1'><node2 id='2'><node3 id='3'></node3></node2></node1>";

            xmlTree = xmlToTree(xml);
            expect(goTo([0, 0, 0], xmlTree).data.attrs.id).to.be('3');
        });

        it("should be able to parse arrays inside tags", function() {
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><node1 id='1'><node2 id='2'><node3 id='3'></node3><node3 id='4'></node3></node2></node1>";

            xmlTree = xmlToTree(xml);
            expect(goTo([0, 0, 0], xmlTree).data.attrs.id).to.be('3');
            expect(goTo([0, 0, 1], xmlTree).data.attrs.id).to.be('4');
        });

        it("should be able to attach the correct body text to the node", function() {
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><node1 id='1'><node2 id='2'><node3 id='3'>hola</node3><node3 id='4'>mundo</node3></node2></node1>";

            xmlTree = xmlToTree(xml);
            expect(goTo([0, 0, 0], xmlTree).data._text).to.be('hola');
            expect(goTo([0, 0, 1], xmlTree).data._text).to.be('mundo');
        });

        it("should be able to parse a one node xml", function() {
            var xml = "<element1>content1</element1>";
            xmlTree = xmlToTree(xml);
            expect(goTo([0], xmlTree).data._text).to.be('content1');
        });

        it("should be able to parse CDATA as text attr", function(){
            var xml = "<node1 id='10'><![CDATA [this is cdata]]>hello world</node1>";
            xmlTree = xmlToTree(xml);

            expect(goTo([0], xmlTree).data._cdata).to.be('this is cdata');
            expect(goTo([0], xmlTree).data._text).to.be('hello world');
        });

        it("should be able to find nodes based on function", function() {
            var xml = "<node1><node2 id='hola'><node3 name='john'>doe</node3></node2><node2>World</node2></node1>";

            xmlTree = xmlToTree(xml);
            var nodes = xmlTree.find(function(data) { return (data.attrs.name || "").match(/john/);});
            expect(nodes[0].nodeName).to.be("node3");
        });

        it("should be able to find nodes by its nodeName", function(){
            var xml = "<node1><node2 id='hola'><node3 name='john'>doe</node3></node2><node2>World</node2></node1>";
            xmlTree = xmlToTree(xml);
            var nodes = xmlTree.find({nodeName: "node2"});

            expect(nodes.length).to.be(2);
        });

        it("should be able to find items by its attributes", function() {
            var xml = "<node1><node2 id='hola'><node3 name='john'>doe</node3></node2><node2>World</node2></node1>";
            xmlTree = xmlToTree(xml);

            var nodes = xmlTree.find({attrs: {name: "john"}});
            expect(nodes[0].nodeName).to.be("node3");
        });

        it("should be able to find nodes by regex on conditions", function() {
            var xml = "<node1><node2 id='hola'><node3 name='john'>doe</node3></node2><node2>World</node2></node1>";
            var nodes = xmlTree.find({attrs: {name: /hn/}});
            expect(nodes[0].nodeName).to.be("node3");
        });

        it("should be able to find node by its text equal and regex", function() {
            var xml = "<node1><node2 id='hola'><node3 name='john'>doe</node3></node2><node2>World</node2></node1>";
            var nodes = xmlTree.find({_text: "World"});
            var nodes2 = xmlTree.find({_text: /WO/i});

            expect(nodes[0].nodeName).to.be("node2");
            expect(nodes2[0].nodeName).to.be("node2");
        });

        it("should be able to find node by multiple items at the same time", function() {
            var xml = "<node1><node2 id='hola'><node3 name='john'>World</node3></node2><node2 arr='some_name'>World</node2></node1>";
            var nodes = xmlTree.find({_text: /WO/i, attrs: {name: 'john'}});

            expect(nodes.length).to.be(1);
            expect(nodes[0].nodeName).to.be("node3");
        });
    });

    describe("#xml2JSON", function() {
        it("should convert an xml to an equivalent json", function() {
            var json = xml2JSON("<element1>content1</element1>");
            expect(json).to.eql({element1: {_text: "content1"}});
        });

        it("should convert a xml with nested nodes", function() {
            var xml  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><node1 id='1'><node2 id='2'><node3 id='3'></node3></node2></node1>",
                json = xml2JSON(xml);

            expect(json).to.eql({node1: {_attrs: {id: '1'}, node2: {_attrs: {id: '2'}, node3: {_attrs: {id: '3'}}}}});
        });

        it("should convert a xml with array nodes", function() {
            var xml  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><node1 id='1'><node2 id='2'><node3 id='3'></node3><node3 id='4'></node3></node2></node1>",
                json = xml2JSON(xml);

            expect(json).to.eql({node1: {_attrs: {id: '1'}, node2: {_attrs: {id: '2'}, node3: [{_attrs: {id: '3'}}, {_attrs: {id: '4'}}]  }}});
        });
        it("should parse self referencing objects", function() {
            var json = xml2JSON("<element1/>");
            expect(json).to.eql({element1: {}});
        });

        it("should parse a self referncing object with siblings", function() {
           var json = xml2JSON("<element1>content1<element2/></element1>");
            expect(json).to.eql({element1: {_text: 'content1', element2: {}}});
        });

        it("should get attributes for an start element", function() {
            var json = xml2JSON("<element1 hola='mundo'>content1</element1>");
            expect(json).to.eql({element1: { _attrs: {hola: "mundo"}, _text: "content1"}});
        });

        it("should handle attrs with inner elements", function(){
            var json = xml2JSON('<hola valor1="nombre" valor2="nombre2"><other>mundo</other></hola>');
            expect(json).to.eql({hola: { _attrs: {valor1:"nombre", valor2:"nombre2"}, other: {_text: "mundo"}}});
        });

        it("should parse special characters on node name", function() {
            var json = xml2JSON("<m:element1>content1<element2/></element1>");
            expect(json).to.eql({element1: { _text: "content1", element2: {}}});
        });
    });
});
