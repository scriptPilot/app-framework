"use strict"

var pkg = require('./package.json')
var project = pkg.appPath == '../../' ? require('../../package.json') : require('./package.json');
var app = pkg.appPath == '../../' ? require('../../package.json') : require('./hello-world-app/package.json');
pkg.projectPath = pkg.appPath == '../../' ? '../../' : './';
/*
var saveJson = require('jsonfile').writeFileSync
saveJson('project.temp', project)
saveJson('app.temp', app)
*/
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack  = require('webpack');
const path = require('path') ;

var HtmlWebpackPlugin = require('html-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');

module.exports = {

    entry: {
        app : './main.js',
    },
    
    output: {       
        path  : pkg.projectPath + 'build-' + project.version + '/',
        publicPath: '',
        filename: 'bundle_[hash].js'
    },
    
    
    resolve:{
        alias: {          
            vue: 'vue/dist/vue.js'
        }
    },
    
    resolveLoader:{
        root: path.join(__dirname, 'node_modules'),
    },
    
    watch: NODE_ENV=='development',

    watchOptions : {      
      aggregateTimeout : 100
    },

    devtool: NODE_ENV=='development' ? "cheap-inline-module-source-map" : null ,

    module : {
        loaders : [
          {
            test:/\.vue$/,
            loader: 'vue'
          },
          {
            test:/\.js$/,
            loader: 'babel',
            exclude: /node_modules/
          },
          {
            test: /\.css$/, loader: "style-loader!css-loader"
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
              'file?name=images/[name]_[hash].[ext]',
              'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
          },
          {
            test: /\.(eot|ttf|woff|woff2)$/i,
            loader: 'file-loader?name=fonts/[name]_[hash].[ext]'
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
    },
    babel: {
        presets: ['es2015']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.ejs',
        title: app.title,
        cache: false,
        minify: {
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          removeComments: true        
        }
      }),
      new AppCachePlugin({
        cache: null,
        network: ['*'],
        fallback: null,
        settings: null,
        exclude: [/\.js\.map$/],
        output: 'manifest.appcache'
      })
    ]
    
};


if (NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ])
}