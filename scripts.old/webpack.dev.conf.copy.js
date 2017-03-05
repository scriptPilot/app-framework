'use strict'

// Load modules
var path = require('path')
var abs = require('path').resolve
var found = require('../lib/found')
var merge = require('webpack-merge')
var list = require('fs-extra').readdirSync
var alert = require('../lib/alert')
//var json = require('../lib/json')

// Define installation status and root path
var isInstalled = found(__dirname, '../../../package.json')
var packageRoot = abs(__dirname, '..') + path.sep
var appRoot = isInstalled ? abs(__dirname, '../../../app') + path.sep : abs(__dirname, '../app') + path.sep
var projectRoot = (isInstalled ? abs(__dirname, '../../..') : abs(__dirname, '..')) + path.sep

// Load configuration
var pkg = require(packageRoot + 'package.json')
var app = require(appRoot + 'config.json')

/*
// Check application configuration file
let scheme = abs(packageRoot, 'config-scheme.json')
let config = appRoot + 'config.json'
let check = json.validate(scheme, config)
if (check !== true) alert(check)
*/
// Create string with array of all vue page components
var pageStr = ''
if (found(appRoot + 'pages')) {
  var pageFiles = list(appRoot + 'pages')
  for (var p = 0; p < pageFiles.length; p++) {
    if (pageFiles[p].substr(pageFiles[p].length - 4, 4) === '.vue') {
      pageFiles[p] = pageFiles[p].replace(/\\/g, '/')
      if (p > 0) {
        pageStr += ','
      }
      pageStr += pageFiles[p].substr(0, pageFiles[p].length - 4)
    }
  }
}

// Create webpack environment variables
var env = {
  THEME: '"' + app.theme + '"',
  APP_ROOT_FROM_SCRIPTS : '"' + (isInstalled ? '../../../app/' : '../app/') + '"',
  FRAMEWORK_VERSION: '"' + pkg.version + '"',
  FONT_FRAMEWORK7: '"' + app.loadIconFonts.framework7 + '"',
  FONT_MATERIAL: '"' + app.loadIconFonts.material + '"',
  FONT_ION: '"' + app.loadIconFonts.ion + '"',
  FONT_AWESOME: '"' + app.loadIconFonts.fontawesome + '"',
  RESET_LOCAL_STORAGE: '"' + app.resetLocalStorageOnVersionChange + '"',
  PAGES: '"' + pageStr + '"',
  NODE_ENV: "development"
}

var cfg = {
  build: {
    env: merge(env, {NODE_ENV: '"production"'}),
    assetsSubDirectory: '',
    assetsPublicPath: '',
    productionSourceMap: app.buildSourcemaps === true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: merge(env, {NODE_ENV: '"development"'}),
    port: 8080,
    assetsSubDirectory: '',
    assetsPublicPath: '',
    proxyTable: {},
    cssSourceMap: false
  },
  isInstalled: isInstalled,
  packageRoot: packageRoot,
  projectRoot: projectRoot,
  appRoot: appRoot
}

var app = require(cfg.appRoot + 'config.json')

var webpack = require('webpack')
var utils = require('../scripts.old/utils')

// Load packages
var baseWebpackConfig = {
  entry: {
    app: path.resolve(cfg.packageRoot, 'scripts.old/main.js')
  },
  output: {
    path: path.resolve(cfg.appRoot, 'build'),
    publicPath: process.env.NODE_ENV === 'production' ? cfg.build.assetsPublicPath : cfg.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [cfg.projectRoot + 'node_modules'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  resolveLoader: {
    fallback: [cfg.projectRoot + 'node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.resolve(cfg.packageRoot, 'scripts'),
          path.resolve(cfg.appRoot, 'www')
        ]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /favicon\.ico$/,
        loader: 'url',
        query: {
          limit: 1,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
}
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Set options
var cssSourceMapDev = (process.env.NODE_ENV === 'development' && cfg.dev.cssSourceMap)
var cssSourceMapProd = (process.env.NODE_ENV === 'production' && cfg.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./scripts.old/dev-client'].concat(baseWebpackConfig.entry[name])
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
