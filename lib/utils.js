_ = {
    intersect: function(a,b) {
        var t;

        if (b.length > a.length) {
            t = b;
            b = a;
            a = t;
        }

        return a.filter(function (e) {
                    if (b.indexOf(e) !== -1) return true;
                });
    },
    find: function(array, filter) {
        var z      = array.length,
          item;

        for( var i=0; i < z; i++ ) {
          item = array[i];
          if ( filter(array[i]) ) { return(item); }
        }
        return(null);
    },
    each: function(array, callback) {
        var x = [],
          z = array.length,
          record;

        for( var i=0; i < z; i++ ) { callback(array[i]); }
    },
    map: function(array, callback) {
        var x = [],
          z = array.length,
          record;

        for( var i=0; i < z; i++ ) {x.push(callback(array[i])); }
        return x;
    },
    select: function(array, callback) {
      var x = [],
        z = array.length,
        record;

      for( var i=0; i < z; i++ ) {
        record = array[i];
        if ( callback(record) ) { x.push(record); }
      }
      return(x);
    },
    all: function(data, functions) {
        var result = false,
            z      = functions.length;

        for(var i=0; i < z; i++) {
            if (functions[i](data)) {
                result = true;
             } else {
                 i = 10000000;
                 result = false;
             }
        }

        return result;
    }
};

exports._ = _;