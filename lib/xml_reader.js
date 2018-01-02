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