var path = require('path'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

const dirname = path.resolve('./');
const vendorModules = [];

function createConfig(isDebug) {
  const devtool = isDebug ? 'eval-source-map' : 'source-map';
  const plugins = [new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')];

  const cssLoader = {test: /\.css$/, loader: 'style!css'};
  const sassLoader = {test: /\.scss$/, loader: 'style!css!sass'};
  const appEntry = ['./src/client/application.js'];

  if (!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    plugins.push(new ExtractTextPlugin('[name].css'));

    cssLoader.loader = ExtractTextPlugin.extract('style', 'css');
    sassLoader.loader = ExtractTextPlugin.extract('style', 'css!sass');
  }

  // -----------------
  // WEBPACK CONFIG
  return {
    devtool: devtool,
    entry: {
      application: appEntry,
      vendor: vendorModules
    },
    output: {
      path: path.join(dirname, 'public', 'build'),
      filename: '[name].js',
      publicPath: '/build/'
    },
    resolve: {
      alias: {
        shared: path.join(dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
        {test: /\.js$/, loader: 'eslint', exclude: /node_modules/},
        {test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: 'url-loader?limit=512'}, // if greater than 512k include the image inline with js
        cssLoader,
        sassLoader
      ]
    },
    plugins: plugins
  };
  // -----------------
}

module.exports = createConfig(true);
module.exports.create = createConfig;