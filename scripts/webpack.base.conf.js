// Load configuration
var cfg = require('../config.js')
var app = require(cfg.appRoot + 'package.json')

// Load packages
var path = require('path')
var utils = require('./utils')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Set options
var cssSourceMapDev = (process.env.NODE_ENV === 'development' && cfg.dev.cssSourceMap)
var cssSourceMapProd = (process.env.NODE_ENV === 'production' && cfg.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

// Export base webpack configuration
module.exports = {
  entry: {
    app: cfg.packageRoot + 'scripts/main.js'
  },
  output: {
    path: cfg.appRoot + 'www/build-' + app.version,
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
          path.resolve(cfg.appRoot, 'pages'),
          path.resolve(cfg.appRoot, 'www')
        ]
      },
      {
        test: /\.json$/,
        loader: 'json'
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
          name: utils.assetsPath('./fonts/[name].[hash:7].[ext]')
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
