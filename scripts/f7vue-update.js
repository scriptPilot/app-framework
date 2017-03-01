'use strict'

// Load configuration
var cfg = require('./config.js')

// Load packages
var path = require('path')
var found = require('../lib/found')
var run = require('child_process').exec
var copy = require('cpx').copySync
var alert = require('../lib/alert')

// Framework7-Vue folder exists
var f7vueFolder = path.resolve(cfg.packageRoot, '..', 'Framework7-Vue')
if (found(f7vueFolder)) {
  // Build
  alert('Framework7-Vue build ongoing ... please wait')
  run('cd "' + f7vueFolder + '" && npm run build', function (err, stdOut, errOut) {
    if (!err) {
      // Dist
      alert('Framework7-Vue dist ongoing ... please wait')
      run('cd "' + f7vueFolder + '" && npm run dist', function (err, stdOut, errOut) {
        if (!err) {
          // Copy script
          copy(path.resolve(f7vueFolder, 'dist/framework7-vue.min.js'), cfg.packageRoot + 'vendor/framework7-vue')
        } else {
          alert('Error: Framework7-Vue dist failed')
        }
      })
    } else {
      alert('Error: Framework7-Vue build failed')
    }
  })
} else {
  alert('Error: Framework7-Vue folder not found')
}
