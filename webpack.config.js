const path = require('path')

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const autoprefixer = require('autoprefixer')

const config = {
  entry: {
    'index': [path.resolve(__dirname, 'simple-cast/src/index.jsx')],
    // This is a mess; the `styles.js` file that is generated from the
    // entry below is basically empty(apart from the UMD entry)
    // but is still generated. And it appears that there is no other
    // way to generage CSS files.
    'styles': [path.resolve(__dirname, 'simple-cast/css/style.scss')]
  },
  output: {
    path: path.resolve(__dirname, 'simple-cast/build/'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '[name]',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: '../../[resource-path]'
  },
  externals: [],
  resolve: {
    extensions: ['', '.jsx', '.json', '.js', '.css', '.scss']
  },
  devtool: '#source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // The module to load. 'babel' is short for 'babel-loader'
      query: {
        cacheDirectory: true,
        presets: ['react'],
        plugins: ['babel-plugin-transform-es2015-modules-commonjs']
      }
    }, {
      test: /\.s?css/,
      exclude: /(node_modules|bower_components)/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader?sourceMap!postcss-loader')
    }]
  },
  postcss: function () {
    return [autoprefixer]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].css')
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin()
  ]
}
module.exports = config
