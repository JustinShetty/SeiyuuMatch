const path = require('path');

module.exports = {
  entry: './js/main.jsx',
  output: {
    path: path.join(__dirname, '/static/js/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // Test for js or jsx files
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          // Convert ES6 syntax to ES5 for browser compatibility
          presets: ['@babel/env', '@babel/react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
