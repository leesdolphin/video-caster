const path = require('path')

const config = {
  entry: {
    'index': [path.resolve(__dirname, 'simple-cast/src/index.jsx')],
  },
  output: {
    path: __dirname,
    filename: 'simple-cast/build/[name].js',
    libraryTarget: 'umd',
    library: '[name]',
    umdNamedDefine: true
  },
  externals: [],
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // The module to load. "babel" is short for "babel-loader"
      query: {
        presets: ['react', 'es2015']
      }
    }]
  }
}
module.exports = config