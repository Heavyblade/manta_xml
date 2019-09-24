var assert    = require('assert'),
    expect    = require("expect.js"),
    Tree      = require("./../src/tree").Tree,
    Node      = require("./../src/tree").Node;


describe('Node', function() {

  it("should tell if a node is a valid node", function() {
    var node  = new Node({}),
        node2 = new Node({}),
        node3 = new Node({nodeName: "Element"});

    expect(node.validNode(node2)).to.be(false);
    expect(node.validNode(node3)).to.be(true);
  });

  it("should not add a node that is invalid", function(){
    var node  = new Node({}),
        node2 = new Node({id: "one"});

    expect(node.addChild(node2)).to.be(false);
    expect(node.children.length).to.be(0);
  });

  it("should add valid child to the tree", function(){
    var node  = new Node({}),
        node2 = new Node({nodeName: "Element"});

    expect(node.addChild(node2)).to.be(true);
    expect(node.children.length).to.be(1);
  });

  it("should be able to get attributes", function(){
    var node  = new Node({attrs: {param: 1, param2: "two"}});

    expect(node.getAttr("param")).to.be(1);
    expect(node.getAttr("param2")).to.be("two");
  });

  it("should be able to set attributes", function() {
    var node  = new Node({nodeName: "Element"});

    node.setAttr("param", 1);
    node.setAttr("param2", "two");

    expect(node.getAttr("param")).to.be(1);
    expect(node.getAttr("param2")).to.be("two");
  });

  it("should be able to delete a child node", function() {
    var node  = new Node({}),
        node2 = new Node({nodeName: "Element"}),
        node3 = new Node({nodeName: "Element2"}),
        node4 = new Node({nodeName: "Element3"});

    node.addChild(node2);
    node.addChild(node3);
    node.addChild(node4);

    expect(node.children.length).to.eql(3);
    expect(node.deleteChild(node2)).to.be(true);
    expect(node.children.length).to.eql(2);
  });

  it("should be able to set and get the _text attribute for a node", function(){
    var node = new Node();

    expect(node.getText()).to.be("");
    node.setText("Hello world");
    expect(node.getText()).to.be("Hello world");
  });

  it("should be able to set and get the _text attribute for a node", function(){
    var node = new Node();

    expect(node.getCData()).to.be("");
    node.setCData("Hello world");
    expect(node.getCData()).to.be("Hello world");
  });
});