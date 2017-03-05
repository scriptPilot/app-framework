/* Purpose: Export object with webpack configuration */

'use strict'

// Load modules
let env = require('../env')
let found = require('../lib/found')
let fs = require('fs')
let abs = require('path').resolve
let webpack = require('webpack')

// Define mode (dev or prod)
let mode = 'development'

// Define string with all pages
var pageStr = ''
if (found(env.app, 'pages')) {
  var pageFiles = fs.readdirSync(abs(env.app, 'pages'))
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

// Define configuration
let config = {
  env:  {
    THEME: '"' + env.cfg.theme + '"',
    APP_ROOT_FROM_SCRIPTS : '"' + (env.installed ? '../../../app/' : '../app/') + '"',
    FRAMEWORK_VERSION: '"' + env.pkg.version + '"',
    FONT_FRAMEWORK7: '"' + env.cfg.loadIconFonts.framework7 + '"',
    FONT_MATERIAL: '"' + env.cfg.loadIconFonts.material + '"',
    FONT_ION: '"' + env.cfg.loadIconFonts.ion + '"',
    FONT_AWESOME: '"' + env.cfg.loadIconFonts.fontawesome + '"',
    RESET_LOCAL_STORAGE: '"' + env.cfg.resetLocalStorageOnVersionChange + '"',
    PAGES: '"' + pageStr + '"',
    NODE_ENV: '"' + mode + '"'
  },
  port: 1234
}

// Define loaders
let loaders = [
  // JS files
  {
    test: /\.js$/,
    loader: 'babel',
    include: [
      abs(__dirname, '../lib'),
      abs(__dirname, '../scripts'),
      abs(env.app, 'app')
    ]
  },
  // Vue files
  {
    test: /\.vue$/,
    loader: 'vue'
  },
  // JSON files
  {
    test: /\.json$/,
    loader: 'json'
  },
  // Image files
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    loader: 'url',
    query: {
      limit: 1,
      name: 'img/[name].[hash:7].[ext]'
    }
  },
  // Favicon
  {
    test: /favicon\.ico$/,
    loader: 'url',
    query: {
      limit: 1,
      name: '[name].[ext]'
    }
  },
  // Font files
  {
    test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
    loader: 'url',
    query: {
      limit: 1,
      name: 'fonts/[name].[hash:7].[ext]'
    }
  }
]

// Define plugins
let plugins = [
  new webpack.DefinePlugin({
    'process.env': config.env
  })
]


// ---


var HtmlWebpackPlugin = require('html-webpack-plugin')
plugins = plugins.concat([
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.ejs',
    title: env.cfg.title,
    iconTags: '', /* favicon.ico will be loaded by browser default from root directory */
    manifest: '',
    inject: true
  })
])

// Load modules
var path = require('path')
var merge = require('webpack-merge')
var list = require('fs-extra').readdirSync
var alert = require('../lib/alert')



var cfg = {
    env: config.env,
    port: 8080,
    assetsSubDirectory: '',
    assetsPublicPath: '',
    proxyTable: {},
    cssSourceMap: false
}


var utils = require('../scripts.old/utils')

// Load packages
var devWebpackConfig = {
  entry: {
    app: [abs(__dirname, '../scripts.old/main.js')]
  },
  output: {
    path: abs(env.app, 'build'),
    publicPath: process.env.NODE_ENV === 'production' ? cfg.build.assetsPublicPath : cfg.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [env.proj + 'node_modules'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  resolveLoader: {
    fallback: [env.proj + 'node_modules']
  },
  module: {
    loaders: loaders
  },
  plugins: plugins,
  vue: {
    loaders: utils.cssLoaders({ sourceMap: false }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
}

devWebpackConfig.devtools = '#eval-source-map'
devWebpackConfig.module.loaders.push(utils.styleLoaders({ sourceMap: false }))
devWebpackConfig.entry['app'].unshift('./scripts.old/dev-client')

module.exports = devWebpackConfig
