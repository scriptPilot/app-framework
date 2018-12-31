/* Purpose: Export development and production webpack configuration objects */

'use strict'

// Load modules
const env = require('./env')
const alert = require('./alert')
const found = require('./found')
const fs = require('fs-extra')
const abs = require('path').resolve
const path = require('path')
const us = require('underscore')
const webpack = require('webpack')
const rec = require('recursive-readdir-sync')

// Empty cache folder
fs.emptyDirSync(abs(env.cache, 'build'))

// Create configuration
let createConfiguration = function (mode) {
  // Copy index.ejs file to cache
  try {
    fs.copySync(abs(__dirname, '../client/index.ejs'), abs(env.cache, 'index.ejs'))
  } catch (err) {
    alert('Failed to cache index.ejs file.', 'issue')
  }

  // Check mode
  if (mode !== 'development' && mode !== 'production') {
    alert('Webpack configuration needs "production" or "development" as parameter.', 'issue')
  }

  // Define loaders
  let ExtractTextPlugin = require('extract-text-webpack-plugin')
  let loaders = [
    // JS files
    {
      test: /\.js$/,
      loader: 'babel',
      include: [
        abs(__dirname, '../client'),
        abs(__dirname, '../scripts'),
        abs(env.app)
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
    // CSS files
    {
      test: /\.css$/,
      loader: mode === 'development' ? 'vue-style-loader!css-loader' : ExtractTextPlugin.extract('css-loader' + (env.cfg.buildSourcemaps === true ? '?sourceMap' : ''))
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
    // Preloader icon image
    {
      test: /android-chrome-192x192\.png$/,
      loader: 'url',
      query: {
        limit: 1,
        name: '[name].[ext]'
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

  // Start configuration object
  let config = {
    entry: {
      init: [abs(__dirname, '../client/init.js')],
      app: [abs(__dirname, '../client/app.js')]
    },
    output: {
      path: mode === 'development' ? abs(env.app) : abs(env.cache, 'build/www'),
      filename: mode === 'development' ? '[name].js' : '[name].[hash:7].js'
    },
    resolve: {
      extensions: ['', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.common.js'
      }
    },
    module: {
      loaders: loaders
    },
    plugins: []
  }

  // Add themes on production build
  if (mode === 'production') {
    if (env.cfg.theme === 'ios-material' || env.cfg.theme === 'material-ios') {
      config.entry = us.extend({
        ios: [abs(__dirname, '../client/ios.js')],
        material: [abs(__dirname, '../client/material.js')]
      }, config.entry)
    } else {
      config.entry.app.unshift(abs(__dirname, '../client/' + env.cfg.theme + '.js'))
    }
  }

  // Get updated versions
  let frameworkVersion
  try {
    frameworkVersion = fs.readJsonSync(abs(__dirname, '../package.json')).version
  } catch (err) {
    alert('Failed to read framework version.', 'issue')
  }
  let projectVersion
  try {
    projectVersion = fs.readJsonSync(abs(env.proj, 'package.json')).version
  } catch (err) {
    alert('Failed to read project version.', 'issue')
  }

  // Get all language file names
  const languages = []
  try {
    const files = rec(abs(env.app, 'lang'))
    files.forEach((file) => {
      languages.push(path.basename(file).slice(0, -5))
    })
  } catch (err) {
    alert('Failed to list the language files.', 'issue')
  }

  // Add environment variables
  let firebaseConfigSource = mode === 'development' || env.arg.dev === true ? 'devFirebase' : 'firebase'
  let firebaseConfig = env.cfg[firebaseConfigSource]
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        PROJECT_VERSION: '"' + projectVersion + '"',
        FRAMEWORK_VERSION: '"' + frameworkVersion + '"',
        THEME: '"' + env.cfg.theme + '"',
        APP_ROOT_FROM_SCRIPTS: '"' + (path.relative(__dirname, env.app) + path.sep).replace(/\\/g, '\\\\\\\\') + '"',
        PROJECT_ROOT_FROM_SCRIPTS: '"' + (path.relative(__dirname, env.proj) + path.sep).replace(/\\/g, '\\\\\\\\') + '"',
        CACHE_ROOT_FROM_SCRIPTS: '"' + (path.relative(__dirname, env.cache) + path.sep).replace(/\\/g, '\\\\\\\\') + '"',
        USE_GLOBAL_DATA_OBJECT: '"' + env.cfg.useGlobalDataObject + '"',
        FONT_FRAMEWORK7: '"' + env.cfg.useIconFonts.framework7 + '"',
        FONT_MATERIAL: '"' + env.cfg.useIconFonts.material + '"',
        FONT_ION: '"' + env.cfg.useIconFonts.ion + '"',
        FONT_AWESOME: '"' + env.cfg.useIconFonts.fontawesome + '"',
        USE_FIREBASE_APP: '"' + (firebaseConfig.apiKey !== '' && (firebaseConfig.authDomain !== '' || firebaseConfig.databaseURL !== '' || firebaseConfig.storageBucket !== '')) + '"',
        USE_FIREBASE_AUTH: '"' + (firebaseConfig.authDomain !== '') + '"',
        USE_FIREBASE_DATABASE: '"' + (firebaseConfig.databaseURL !== '') + '"',
        USE_FIREBASE_STORAGE: '"' + (firebaseConfig.storageBucket !== '') + '"',
        RESET_LOCAL_STORAGE: '"' + env.cfg.resetLocalStorageOnVersionChange + '"',
        NODE_ENV: '"' + mode + '"',
        FIREBASE_CONFIG: '"' + firebaseConfigSource + '"',
        LANGUAGES: '"' + languages.join(',') + '"',
        CUSTOM_VUE_SCRIPT: '"' + found(env.app, 'vue.js') + '"'
      }
    })
  )

  // Optimize ordering, reduce size
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())

  // Avoid exit with error in CLI
  if (mode === 'development') {
    config.plugins.push(new webpack.NoErrorsPlugin())
  }

  // Add hot file reload in development mode
  if (mode === 'development') {
    config.entry['app'].unshift(abs(__dirname, 'dev-client.js'))
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  // Extract CSS code to extra file
  if (mode === 'production') {
    config.plugins.push(
      new ExtractTextPlugin('[name].[hash:7].css')
    )
    config.vue = {
      loaders: {
        css: ExtractTextPlugin.extract('vue-style-loader', 'css-loader' + (env.cfg.buildSourcemaps === true ? '?sourceMap' : ''))
      }
    }
  }

  // Define icon tags for production
  let iconTags = ''
  if (mode === 'production') {
    iconTags = '<meta name="theme-color" content="' + env.cfg.iconBackgroundColor + '" />' +
               '<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />' +
               '<link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32" />' +
               '<link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16" />' +
               '<link rel="manifest" href="manifest.json" />'
  }

  // Plugin: HTML index file generation
  let HtmlPlugin = require('html-webpack-plugin')
  config.plugins.push(
    new HtmlPlugin({
      chunks: ['init'],
      filename: mode === 'development' ? abs(env.app, 'index.html') : abs(env.cache, 'build/www/index.html'),
      template: abs(env.cache, 'index.ejs'),
      title: env.cfg.title,
      iconTags: iconTags, // favicon.ico will be loaded by browser default from root directory
      iconBackgroundColor: env.cfg.iconBackgroundColor,
      inject: true,
      minify: mode === 'production' ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      } : undefined
    })
  )

  // Add source maps
  if (mode === 'development') {
    config.devtool = '#source-map'
  } else if (mode === 'production' && env.cfg.buildSourcemaps === true) {
    config.devtool = '#source-map'
  } else {
    config.devtool = undefined
  }

  // Add JS compression
  if (mode === 'production') {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    )
  }

  // Add offline support
  let OfflinePlugin = require('offline-plugin')
  if (mode === 'production') {
    config.plugins.push(new OfflinePlugin({
      version: 'v' + env.pkg.version,
      autoUpdate: 1000 * 60 * 15,
      publicPath: '/',
      externals: [
        'offline-service-worker.js',
        'manifest.json',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'android-chrome-192x192.png'
      ],
      ServiceWorker: {
        output: 'offline-service-worker.js',
        events: true
      },
      AppCache: {
        directory: '',
        events: true
      }
    }))
  }

  // Return object
  return config
}

// Export configuration
module.exports = {
  development: createConfiguration('development'),
  production: createConfiguration('production')
}
