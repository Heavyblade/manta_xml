// This is just a place for the library API

exports.xmlParser   = require("./xml_parser").xmlToTree;
exports.xml2JSON    = require("./xml_parser").xml2JSON;
exports.treeToXML   = require("./xml_parser").treeToXML;
exports.XMLDocument = require("./tree").Tree;
exports.Tree        = require("./tree").Tree;
exports.Node        = require("./tree").Node;
