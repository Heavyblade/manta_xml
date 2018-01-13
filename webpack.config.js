const path = require('path');


function createConfig(target) {
  return {
      entry: './src/index.js',
      output: {
          path:     path.resolve(__dirname, 'dist'),
          filename: 'manta_xml.' + target + '.js',
          library:  'mantaXML',
          libraryTarget: target
      }
  };
}

module.exports = [
  createConfig('var'),
  createConfig('commonjs2'),
  createConfig('amd'),
  createConfig('umd')
];