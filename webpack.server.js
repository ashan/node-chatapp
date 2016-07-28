var path = require('path');
var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');

function createConfig(isDebug) {
  const plugins = [];
  if(!isDebug){
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  // -----------------
  // WEBPACK CONFIG
  return {
    target: 'node',
    externals: [nodeExternals()],
    plugins: plugins,
    devtool: 'source-map',
    entry: [
      './src/server/server.js'
    ],
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'server.js'
    },
    resolve: {
      alias: {
        shared: path.join(__dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modulues/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
        {
          test: /\.js$/,
          exclude: /node_modulues/,
          loader: 'eslint-loader'
        }]
    }
  };
  // -----------------

}

module.exports = createConfig(true);
module.exports.create = createConfig;
