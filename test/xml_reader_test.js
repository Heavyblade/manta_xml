var assert    = require('assert'),
    expect    = require("expect.js"),
    xmlReader = require("./../src/xml_parser").xmlReader;

describe('#xmlReader', function() {
    var xmlparser = null;

    beforeEach(function(){
        xmlparser = new xmlReader(null);
    });

    it("should take and xml and decompose it", function() {
        xmlparser.addDataString("<element1 hola='mundo'>content1</element1>");
        expect(xmlparser.size).to.be(3);

        expect(xmlparser.xmlArray[0]).to.be("<element1 hola='mundo'>");
        expect(xmlparser.xmlArray[1]).to.be("content1");
        expect(xmlparser.xmlArray[2]).to.be("</element1>");
    });

    it("should be able to remove the comments from body", function() {
        xmlparser.addDataString("<element1 hola='mundo'><!-- hola mu -> ndo - ddd > -->content1</element1>");
        expect(xmlparser.size).to.be(3);

        expect(xmlparser.xmlArray[0]).to.be("<element1 hola='mundo'>");
        expect(xmlparser.xmlArray[1]).to.be("content1");
        expect(xmlparser.xmlArray[2]).to.be("</element1>");
    });

    it("should not be affected by blank spaces", function() {
        xmlparser.addDataString("\n<element1 hola='mundo'>\n\ncontent1\n</element1>\n");
        expect(xmlparser.size).to.be(3);

        expect(xmlparser.xmlArray[0]).to.be("<element1 hola='mundo'>");
        expect(xmlparser.xmlArray[1]).to.be("content1");
        expect(xmlparser.xmlArray[2]).to.be("</element1>");
    });

    it("should be able to access the first element", function() {
        xmlparser.addDataString("<element1 hola='mundo'>content1</element1>");
        expect(xmlparser.getCurrent()).to.be("<element1 hola='mundo'>");
    });

    it("should be able to get the currentNode name", function() {
        xmlparser.addDataString("<element1 hola='mundo'>content1</element1>");
        expect(xmlparser.name()).to.be("element1");
    });

    it("should be able to get the currentNode name with white space", function() {
        xmlparser.addDataString("< element1 hola='mundo'>content1</element1>");
        expect(xmlparser.name()).to.be("element1");
    });

    it("should be able to extract attrs from xmlNode", function() {
        xmlparser.addDataString("<element1 hola='mundo'>content1</element1>");
        expect( xmlparser.getAttrs().hola ).to.be("mundo");
    });

    it("should be able to extract attrs from xmlNode with multiple attrs", function() {
        xmlparser.addDataString("<element1 hola='mundo' name='node'>content1</element1>");
        expect( xmlparser.getAttrs().hola ).to.be("mundo");
        expect( xmlparser.getAttrs().name ).to.be("node");
    });

    it("should be able to accept nested double or single quotes in attrs", function() {
        xmlparser.addDataString("<element1 hola='mu\"ndo'>content1</element1>");
        expect( xmlparser.getAttrs().hola ).to.be("mu\"ndo");
    });

    it("should be able to extract attrs from with double quotes", function() {
        xmlparser.addDataString("<element1 hola=\"mundo\" name=\"node\">content1</element1>");
        expect( xmlparser.getAttrs().hola ).to.be("mundo");
        expect( xmlparser.getAttrs().name ).to.be("node");
    });

    it('should identify open element type simple', function() {
        var xml = "<hello>";
        xmlparser.addDataString(xml);
        expect(xmlparser.name()).to.be("hello");
    });

    it("should be able to identify the node type as v7 does", function() {
        xmlparser.addDataString("<element1 hola='mundo'>content1</element1>");

        expect(xmlparser.tokenType()).to.be(4);
        xmlparser.moveNext();
        expect(xmlparser.tokenType()).to.be(6);
        xmlparser.moveNext();
        expect(xmlparser.tokenType()).to.be(5);
    });

    it("should be able to detect the end of document", function() {
        xmlparser.addDataString("<element1 hola='mundo'>content1</element1>");

        expect(xmlparser.atEnd()).to.be(false);
        xmlparser.moveNext();
        expect(xmlparser.atEnd()).to.be(false);
        xmlparser.moveNext();
        expect(xmlparser.atEnd()).to.be(true);
    });

    it("should be able to find the close tag for the current tag", function() {
        xmlparser.addDataString("<node1><node2><node3></node3>/node2></node1>");
        expect(xmlparser.findClose()).to.be(5);
    });

    it("should be able to find the close tag for the current tag", function() {
        xmlparser.addDataString("<node1><node2></node2></node1>");
        expect(xmlparser.findClose()).to.be(3);
    });

    it("should be able to find the close tag for the current tag with inner matching", function() {
        xmlparser.addDataString("<node1><node2><node1></node1></node2></node1>");
        expect(xmlparser.findClose()).to.be(5);
    });

    it("should find a closed tag for a tag in the middel of the body", function(){
        xmlparser.addDataString("<node1><node2><node3></node3></node2></node1>");
        xmlparser.moveNext();
        expect(xmlparser.findClose()).to.be(4);
    });

    it("should find a close for a self closed tag", function() {
        xmlparser.addDataString("<node1><node2><node3/><node3/><node3/></node2></node1>");
        xmlparser.moveTo(2);
        expect(xmlparser.findClose()).to.be(2);
    });

    it("should be able to extract simple strings from cdata", function() {
        var xml = `<node><![CDATA[ Within this Character Data block I can ]]></node>`;
        var removed = xmlparser.extractCDATA(xml);

        expect(removed).to.match(/cdata_1/);
        expect(xmlparser.cdata.cdata_1).to.eql(" Within this Character Data block I can ");
        expect(removed).to.eql("<node><![XDATA [cdata_1]]></node>");
    });

    it("should not try to extract cdata from commnets", function() {
        xmlparser.addDataString("<element1 hola='mundo'><!-- hola <![CDATA[ Within this Character Data block I can ]]> -->content1</element1>");
        expect(xmlparser.size).to.be(3);

        expect(xmlparser.xmlArray[0]).to.be("<element1 hola='mundo'>");
        expect(xmlparser.xmlArray[1]).to.be("content1");
        expect(xmlparser.xmlArray[2]).to.be("</element1>");
    });
});