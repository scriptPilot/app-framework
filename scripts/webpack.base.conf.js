'use strict'

// Load configuration
var cfg = require('./config.js')

// Load packages
var path = require('path')
var utils = require('./utils')
var fs = require('fs-extra')

// Set options
var cssSourceMapDev = (process.env.NODE_ENV === 'development' && cfg.dev.cssSourceMap)
var cssSourceMapProd = (process.env.NODE_ENV === 'production' && cfg.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

// Export base webpack configuration
module.exports = {
  entry: {
    app: path.resolve(cfg.packageRoot, 'scripts/main.js')
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
