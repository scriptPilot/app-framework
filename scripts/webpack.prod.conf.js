// Load packages
var saveJSON = require('jsonfile')
saveJSON.spaces = 2
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var isThere = require('is-there')
var deleteFiles = require('delete')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ImageminPlugin = require('imagemin-webpack-plugin').default
var AppCachePlugin = require('appcache-webpack-plugin')
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var OnBuildPlugin = require('on-build-webpack')
var replace = require('replace-in-file')

// Load configuration
var cfg = require('./config.js')
var pkg = require(cfg.packageRoot + 'package.json')

// Update copyright year in license
replace.sync({
  files: path.resolve(__dirname, '../LICENSE'),
  replace: /Copyright \(c\) ([0-9]{4}) scriptPilot/,
  with: 'Copyright (c) ' + (new Date()).getFullYear() + ' scriptPilot'
})

// Update versions in demo app
if (!cfg.isInstalled) {
  var demoApp = require(cfg.appRoot + 'package.json')
  demoApp.version = pkg.version
  demoApp.devDependencies['app-framework'] = '^' + pkg.version
  saveJSON.writeFileSync(cfg.appRoot + 'package.json', demoApp)
}

// Load app configuration
var app = require(cfg.appRoot + 'package.json')

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
    new FaviconsWebpackPlugin({
      logo: path.resolve(cfg.appRoot, app.faviconIcon),
      background: app.faviconBackgroundColor,
      title: app.title,
      prefix: 'img/icons-[hash:7]/',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      },
      persistentCache: true,
      emitStats: false
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(cfg.appRoot, 'www/build-' + app.version + '/index.html'),
      template: 'index.ejs',
      title: app.title,
      manifest: ' manifest="manifest.appcache"',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new ImageminPlugin({
      svgo: null
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
