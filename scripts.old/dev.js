/* Purpose: Start Webpack development server and open in web browser */

'use strict'

// Load packages
var env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let webpackConfig = require('../lib/webpack-config').production


var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')

// Fork check
env.forkCheck()

alert('Development server preparation ongoing - please wait ...')
///cmd('npm run fix', function () {
  ///cmd(cfg.packageRoot, 'node scripts/create-icons', function () {
  var app = express()
  /*
  console.log(webpackConfig)
  */
  var compiler = webpack(webpackConfig)

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    //publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  })

  var hotMiddleware = require('webpack-hot-middleware')(compiler)
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  // proxy api requests
  /*
  Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
  })
  */

  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')())

  // serve webpack bundle output
  app.use(devMiddleware)

  // enable hot-reload and state-preserving
  // compilation error display
  app.use(hotMiddleware)

  // serve pure static assets
  /*
  var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))
  */
  let port = env.cfg.devServerPort
  app.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')

    // when env is testing, don't need open it
    ///if (process.env.NODE_ENV !== 'testing') {
      opn(uri)
    ///}
  })
  ///})
///})
