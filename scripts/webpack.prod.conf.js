// Load packages
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var list = require('list-dir')
var merge = require('webpack-merge')
var isThere = require('is-there')
var deleteFiles = require('delete')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var AppCachePlugin = require('appcache-webpack-plugin')
var OnBuildPlugin = require('on-build-webpack')
var replace = require('replace-in-file')
var copy = require('cpx')
var write = require('write')
var ico = require('to-ico')
var fs = require('fs')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Load configuration
var cfg = require('./config.js')
var pkg = require(cfg.packageRoot + 'package.json')

// Update copyright year in license
replace.sync({
  files: path.resolve(__dirname, '../LICENSE'),
  replace: /Copyright \(c\) ([0-9]{4}) scriptPilot/,
  with: 'Copyright (c) ' + (new Date()).getFullYear() + ' scriptPilot'
})

// Update version in demo app
if (!cfg.isInstalled) {
  var demoApp = require(cfg.appRoot + 'package.json')
  demoApp.version = pkg.version
  saveJSON.writeFileSync(cfg.appRoot + 'package.json', demoApp)
}

// Load app configuration
var app = require(cfg.appRoot + 'package.json')

// Define icon tags and save manifest json
let manifest = {
  name: app.title,
  icons: [],
  theme_color: app.iconBackgroundColor,
  background_color: app.iconBackgroundColor,
  display: 'standalone'
}
let iconTags = '<meta name="theme-color" content="' + app.iconBackgroundColor + '" />' +
               '<link rel="manifest" src="manifest.json" />'
let iconFiles = []
let icons = list.sync(path.resolve(cfg.packageRoot, 'icons'))
for (let i = 0; i < icons.length; i++) {
  if (/^icon-([0-9]+)\.([0-9]+)\.png/.test(icons[i])) {
    let size = icons[i].match(/^icon-([0-9]+)\.([0-9]+)\.png/)[1]
    iconTags += '<link rel="icon" type="image/png" size="' + size + 'x' + size + '" href="icons/' + icons[i] + '" />'
    iconFiles.push(icons[i])
    manifest.icons.push({
      src: 'icons/' + icons[i],
      sizes: size + 'x' + size,
      type: 'image/png'
    })
  } else if (/^apple-touch-icon-([0-9]+)\.([0-9]+)\.png/.test(icons[i])) {
    let size = icons[i].match(/^apple-touch-icon-([0-9]+)\.([0-9]+)\.png/)[1]
    iconTags += '<link rel="apple-touch-icon" type="image/png" size="' + size + 'x' + size + '" href="icons/' + icons[i] + '" />'
    iconFiles.push(icons[i])
  }
}
let iconFile = isThere(path.resolve(cfg.appRoot, app.iconImage)) ? path.resolve(cfg.appRoot, app.iconImage) : path.resolve(cfg.packageRoot, 'demo-app/images/icon.png')
ico([fs.readFileSync(iconFile)])
  .then(buf => {
    fs.writeFileSync(path.resolve(cfg.appRoot, 'www/build-' + app.version, 'favicon.ico'), buf),
    {
      resize: true
    }
  })
iconTags += '<link rel="icon" href="favicon.ico" type="image/x-icon" />' +
            '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />'
write.sync(path.resolve(cfg.appRoot, 'www/build-' + app.version, 'manifest.json'), JSON.stringify(manifest))

// Define production webpack configuration
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: cfg.build.productionSourceMap, extract: true })
  },
  devtool: cfg.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: path.resolve(cfg.appRoot, 'www/build-' + app.version),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: cfg.build.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': cfg.build.env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new HtmlWebpackPlugin({
      filename: path.resolve(cfg.appRoot, 'www/build-' + app.version + '/index.html'),
      template: 'index.ejs',
      title: app.title,
      iconTags: iconTags,
      manifest: ' manifest="manifest.appcache"',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new AppCachePlugin({
      cache: null,
      network: ['*'],
      fallback: null,
      settings: null,
      exclude: [/\.(js|css)\.map$/],
      output: 'manifest.appcache'
    }),
    new OnBuildPlugin(function (stats) {
      // Copy icons files
      for (let i = 0; i < iconFiles.length; i++) {
        copy.copySync(path.resolve(cfg.packageRoot, 'icons', iconFiles[i]), path.resolve(cfg.appRoot, 'www/build-' + app.version + '/icons'))
      }

      // Compress images
      let images = list(path.resolve(cfg.appRoot, 'www/build-' + app.version + '/img'))
      for (let i = 0; i < images.length; i++) {
        console.log('Compress ' + images[i])
      }

      // Update version in .htaccess file after successful build
      replace.sync({
        files: cfg.appRoot + 'www/.htaccess',
        replace: /\/build-([0-9]+)\.([0-9]+)\.([0-9]+)\//g,
        with: '/build-' + app.version + '/'
      })

      // Delete .babelrc file
      if (cfg.isInstalled && isThere(cfg.projectRoot + '.babelrc')) {
        deleteFiles.sync([cfg.projectRoot + '.babelrc'], {force: true})
      }
    })
  ]
})

// Optionally, add compression plugin
if (cfg.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        cfg.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig
