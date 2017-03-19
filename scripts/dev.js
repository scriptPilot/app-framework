/* Purpose: Start Webpack development server and open in web browser */

'use strict'

// Set dev argument (for webpack config)
let env = require('../env')
env.arg.dev = true

// Load packages
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let webpackConfig = require('../lib/webpack-config').development
let historyFallback = require('connect-history-api-fallback')
let express = require('express')
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

alert('Development server preparation ongoing - please wait ...')
fixCode(function () {
  cmd(__dirname, 'node create-icons', function () {
    cmd(__dirname, 'node firebase --database --storage --version dev', function () {
      startServer(function () {
        let uri = 'http://localhost:' + env.cfg.devServerPort
        opn(uri)
        alert('Development server startet at ' + uri + '.\n\nTo be stopped with "CTRL + C".')
      })
    })
  })
})
