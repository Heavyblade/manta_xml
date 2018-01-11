const path = require('path');

module.exports = {
  entry: './src/manta_xml.js',
  output: {
    filename: 'manta_xml.js',
    path: path.resolve(__dirname, 'dist')
  }
};