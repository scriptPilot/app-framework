var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var list = require('list-dir')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./scripts/dev-client'].concat(baseWebpackConfig.entry[name])
})

// Define icon tags
let iconTags = ''
let iconFiles = []
let icons = list.sync(path.resolve(cfg.packageRoot, 'icons'))
for (let i = 0; i < icons.length; i++) {
  if (/^icon-([0-9]+)\.([0-9]+)\.png/.test(icons[i])) {
    let size = icons[i].match(/^icon-([0-9]+)\.([0-9]+)\.png/)[1]
    iconTags += '<link rel="icon" type="image/png" size="' + size + 'x' + size + '" href="' + (cfg.isInstalled ? 'node_modules/app-framework/' : '') + 'icons/' + icons[i] + '" />'
    iconFiles.push(icons[i])
  } else if (/^apple-touch-icon-([0-9]+)\.([0-9]+)\.png/.test(icons[i])) {
    let size = icons[i].match(/^apple-touch-icon-([0-9]+)\.([0-9]+)\.png/)[1]
    iconTags += '<link rel="apple-touch-icon" type="image/png" size="' + size + 'x' + size + '" href="' + (cfg.isInstalled ? 'node_modules/app-framework/' : '') + 'icons/' + icons[i] + '" />'
    iconFiles.push(icons[i])
  }
}

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
      iconTags: iconTags,
      manifest: '',
      inject: true
    })
  ]
})
