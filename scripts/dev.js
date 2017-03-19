/* Purpose: Start Webpack development server and open in web browser */

'use strict'

// Load packages
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let webpackConfig = require('../lib/webpack-config').development
let historyFallback = require('connect-history-api-fallback')
let express = require('express')
let fs = require('fs-extra')
let toIco = require('to-ico')
let abs = require('path').resolve
let webpack = require('webpack')
let devMiddleware = require('webpack-dev-middleware')
let hotMiddleware = require('webpack-hot-middleware')
let opn = require('opn')

// Step: Fix code
let fixCode = function (callback) {
  if (env.cfg.fixCodeOnTest === true) {
    cmd(__dirname, 'node code-check --fix', function () {
      callback()
    })
  } else {
    callback()
  }
}

// Step: Start server
let startServer = function (callback) {
  alert('Development server start ongoing - please wait ...')
  // Start express server
  var app = express()
  // Compile webpack
  var compiler = webpack(webpackConfig)
  var devMid = devMiddleware(compiler, { quiet: true })
  // Add hot reload support
  var hotMid = hotMiddleware(compiler)
  // Force reload after html template changes
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMid.publish({ action: 'reload' })
      cb()
    })
  })
  // Handle fallback for HTML5 history API
  app.use(historyFallback())
  // Serve webpack bundle output
  app.use(devMid)
  // Enable hot-reload and state-preserving
  app.use(hotMid)
  // Start server
  app.listen(env.cfg.devServerPort, function (err) {
    if (err) {
      alert('Failed to start development server.', 'error')
    } else {
      callback()
    }
  })
}

let updateFavicon = function (callback) {
  alert('Favicon update ongoing - please wait ...')
  fs.readFile(abs(env.app, 'icon.png'), function (err, bufIn) {
    if (err) alert('Failed to read icon.png file.', 'error')
    toIco([bufIn], {resize: true, sizes: [16, 32, 48]}).then(function (bufOut) {
      fs.writeFile(abs(env.cache, 'favicon.ico'), bufOut, function (err) {
        if (err) alert('Failed to cache favicon.ico file.', 'issue')
        alert('Favicon update done.')
        callback()
      })
    })
  })
}

alert('Development server preparation ongoing - please wait ...')
fixCode(function () {
  updateFavicon(function () {
    startServer(function () {
      let uri = 'http://localhost:' + env.cfg.devServerPort
      opn(uri)
      alert('Development server startet at ' + uri + '.\n\nTo be stopped with "CTRL + C".')
    })
  })
})
