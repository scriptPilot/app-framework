var cfg = require('./config.js')
var app = require(cfg.appRoot + 'config.json')

var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./scripts/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: cfg.dev.cssSourceMap })
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': cfg.dev.env
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs',
      title: app.title,
      iconTags: '', /* favicon.ico will be loaded by browser default from root directory */
      manifest: '',
      inject: true
    })
  ]
})
