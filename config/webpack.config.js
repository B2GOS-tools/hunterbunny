var path = require('path');

const config = {
  entry: './app.coffee',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [{ test: /\.coffee$/, use: 'coffee-loader' }]
  }
};

module.exports = config;
