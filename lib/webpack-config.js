/* Purpose: Export development and production webpack configuration objects */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let fs = require('fs-extra')
let abs = require('path').resolve
let webpack = require('webpack')

// Empty cache folder
fs.emptyDirSync(abs(env.cache, 'build'))

// Create configuration
let createConfiguration = function (mode) {
  // Define mode
  if (mode === '') {
    if (mode !== 'development' && mode !== 'production') {
      alert('Webpack configuration needs "production" or "development" as parameter.', 'issue')
    }
  }

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
  let ExtractTextPlugin = require('extract-text-webpack-plugin')
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
      app: [abs(__dirname, '../lib/main.js')]
    },
    output: {
      path: mode === 'development' ? abs(env.proj) : abs(env.cache, 'build/www'),
      publicPath: mode === 'development' ? '' : '',
      filename: '[name].[hash:7].js'
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

  // Add environment variables
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        THEME: '"' + env.cfg.theme + '"',
        APP_ROOT_FROM_SCRIPTS: '"' + (env.installed ? '../../../app/' : '../app/') + '"',
        CACHE_ROOT_FROM_SCRIPTS: '"' + (env.installed ? '../../../node_modules/.app-framework-cache/' : '../node_modules/.app-framework-cache/') + '"',
        FRAMEWORK_VERSION: '"' + env.pkg.version + '"',
        FONT_FRAMEWORK7: '"' + env.cfg.loadIconFonts.framework7 + '"',
        FONT_MATERIAL: '"' + env.cfg.loadIconFonts.material + '"',
        FONT_ION: '"' + env.cfg.loadIconFonts.ion + '"',
        FONT_AWESOME: '"' + env.cfg.loadIconFonts.fontawesome + '"',
        RESET_LOCAL_STORAGE: '"' + env.cfg.resetLocalStorageOnVersionChange + '"',
        PAGES: '"' + pageStr + '"',
        NODE_ENV: '"' + mode + '"',
        DEV_BUILD: '"' + (env.arg.dev === true) + '"'
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
    config.entry['app'].unshift(abs(__dirname, '../lib/dev-client.js'))
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
  } else {
    iconTags = ''
  }

  // Plugin: HTML index file generation
  let HtmlPlugin = require('html-webpack-plugin')
  config.plugins.push(
    new HtmlPlugin({
      // filename: mode === 'development' ? 'index.html' : abs(env.proj, 'build/index.html'),
      filename: 'index.html',
      template: abs(__dirname, '../index.ejs'),
      title: env.cfg.title,
      iconTags: mode === 'development' ? '' : iconTags, // favicon.ico will be loaded by browser default from root directory
      manifest: mode === 'production' ? ' manifest="manifest.appcache"' : '',
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
    config.devtool = '#eval-source-map'
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

  // Add cache manifest
  if (mode === 'production') {
    let AppCachePlugin = require('appcache-webpack-plugin')
    config.plugins.push(
      new AppCachePlugin({
        cache: null,
        network: ['*'],
        fallback: null,
        settings: null,
        exclude: [/\.(js|css)\.map$/],
        output: 'manifest.appcache'
      })
    )
  }

  // Return object
  return config
}

// Export configuration
module.exports = {
  development: createConfiguration('development'),
  production: createConfiguration('production')
}
