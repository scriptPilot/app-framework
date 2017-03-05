/* Purpose: Export object with webpack configuration */

'use strict'

// Load modules
let env = require('../env')
let found = require('../lib/found')
let fs = require('fs')
let abs = require('path').resolve
let webpack = require('webpack')

// Define mode
if (env.arg.development !== true && env.arg.production !== true) {
  throw new Error('Webpack needs argument "production" or "development". Please open an issue on GitHub.')
}
let mode = env.arg.development === true ? 'development' : 'production'

// Define string with all pages (to use in main.js)
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

// Define configuration
let config = {
  entry: {
    app: [abs(__dirname, '../scripts.old/main.js')]
  },
  output: {
    path: abs(env.app, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: loaders
  },
  plugins: []
}

// Plugin: Environment variables
config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
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
    }
  })
)

// Plugin: HTML index file generation
let htmlPlugin = require('html-webpack-plugin')
config.plugins.push(
  new htmlPlugin({
    filename: 'index.html',
    template: 'index.ejs',
    title: env.cfg.title,
    iconTags: '', // favicon.ico will be loaded by browser default from root directory
    manifest: mode === 'production' ? ' manifest="manifest.appcache"' : '',
    inject: true
  })
)

// ---



config.plugins = config.plugins.concat([
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),

])

config.resolve = {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [env.proj + 'node_modules'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
config.resolveLoader = {
    fallback: [env.proj + 'node_modules']
  }
config.devtools = '#eval-source-map'
config.module.loaders.push(require('./utils').styleLoaders({ sourceMap: false }))
config.entry['app'].unshift('./scripts.old/dev-client')

module.exports = config
