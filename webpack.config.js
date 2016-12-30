'use strict'

const path = require('path')
const fs = require('fs')
const thisPackage = require('./package.json')

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin').default
const ConcatWebpackPlugin = require('./build-utils/webpack-concat')

const autoprefixer = require('autoprefixer')

// Build a list of pre-compiled packages. This way we can re-use them later.
const coppies = []
// const concat = {
//   target: 'index.js',
//   files: ['build/_index.js']
// }
const externals = {}
// let packageName
// for (packageName in thisPackage.dependencies) {
//   if (['almond', 'bootstrap', 'font-awesome'].indexOf(packageName) !== -1) {
//     continue
//   }
//   const packPath = path.resolve(__dirname, `node_modules/${packageName}/`)
//   let file
//   for (file of [`dist/${packageName}.min.js`, `dist/${packageName}.js`]) {
//     try {
//       file = path.resolve(packPath, file)
//       fs.statSync(file)  // raises error if doesn't exist
//       coppies.push({from: file, to: `${packageName}.js`})
//       concat.files.push(file)
//       try {
//         fs.statSync(`${file}.map`)  // raises error if doesn't exist
//         coppies.push({from: `${file}.map`, to: `${packageName}.js.map`})
//       } catch (e) {}
//       externals[packageName] = 'amd'
//       break
//     } catch (e) {}
//   }
// }

const config = {
  context: __dirname,
  entry: {
    'kiss-getter': [path.resolve(__dirname, 'simple-cast/src/kiss-getter/index.coffee')],
    'index': [path.resolve(__dirname, 'simple-cast/src/index.jsx')],
    // This is a mess; the `styles.js` file that is generated from the
    // entry below is basically empty(apart from the UMD entry)
    // but is still generated. And it appears that there is no other
    // way to generage CSS files.
    'styles': [path.resolve(__dirname, 'simple-cast/css/style.scss')]
  },
  output: {
    path: path.resolve(__dirname, 'simple-cast/build/'),
    publicPath: '/simple-cast/build/',
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'amd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: '../../[resource-path]'
  },
  externals: [
    externals
  ],
  resolve: {
    extensions: ['', '.coffee', '.jsx', '.json', '.js', '.css', '.scss']
  },
  devtool: '#source-map',
  module: {
    loaders: [{
      test: /\.coffee$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'coffee'
    }, {
      test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // The module to load. 'babel' is short for 'babel-loader'
      query: {
        cacheDirectory: true,
        presets: ['react', 'stage-2'],
        plugins: ['babel-plugin-transform-es2015-modules-amd']
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
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new CopyWebpackPlugin(coppies, {}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.AggressiveMergingPlugin({moveToParents: true}),
    // new webpack.optimize.UglifyJsPlugin(),
    // new ConcatWebpackPlugin(concat),
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: false,
    //   compress: false,  // {
    //   //   sequences: true,
    //   //   properties: true,
    //   //   drop_debugger: true,
    //   //   conditionals: true,
    //   //   comparisons: true,
    //   //   evaluate: true,
    //   //   booleans: true,
    //   //   loops: true,
    //   //   unused: true,
    //   //   hoist_funs: true,
    //   //   if_return: true,
    //   //   join_vars: true,
    //   //   cascade: true,
    //   //   collapse_vars: true,
    //   //   negate_iife: true,
    //   //   keep_fargs: false,
    //   //   keep_fnames: false,
    //   //   dead_code: true,
    //   //   warnings: false
    //   // },
    //   beautify: true
    // })
  ]
  // node: {
  //
  // }
}
module.exports = config
