var isThere = require('is-there');
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

var project = isThere('../../package.json') ? require('../../package.json') : require('./package.json')
var app = isThere('../../package.json') ? require('../../package.json') : require('./hello-world-app/package.json')

saveJSON.writeFileSync('./project.temp', project)
saveJSON.writeFileSync('./app.temp', app)

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack  = require('webpack');
const path = require('path') ;

var HtmlWebpackPlugin = require('html-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {

    entry: {
        app : './main.js',
    },
    
    output: {       
        path  : project.projectPath + 'build-' + project.version + '/',
        publicPath: '',
        filename: 'bundle_[hash].js'
    },
    
    
    resolve:{
        alias: {          
            vue: 'vue/dist/vue.js'
        }
    },
    
    resolveLoader:{
        root: path.join(__dirname, 'node_modules')
    },
    
    watch: NODE_ENV=='development',

    watchOptions : {      
      aggregateTimeout : 100
    },

    devtool: NODE_ENV=='development' ? "eval-cheap-source-map" : null ,

    module : {
        loaders : [
          {
            test:/\.vue$/,
            loader: 'vue'
          },
          {
            test: /\.css$/, loader: "style-loader!css-loader",
            /*loader: ExtractTextPlugin.extract("style-loader", "css-loader")*/
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
    },/*
    vue: {
      loaders: {
        css: ExtractTextPlugin.extract("css")
      }
    },*/
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.ejs',
        title: app.title,
        cache: true,
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
        exclude: [/node_modules/, /\.(js|css)\.map$/],
        output: 'manifest.appcache'
      }),
      new ExtractTextPlugin('bundle_[hash].css')
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