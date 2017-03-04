'use strict'

'use strict'

// Load configuration
var cfg = require('./config.js')

// Load packages
var path = require('path')
var found = require('../lib/found')
var run = require('child_process').exec
var copy = require('cpx').copySync
var alert = require('../lib/alert')

// Framework7 folder exists
var f7Folder = path.resolve(cfg.packageRoot, '..', 'Framework7')
if (found(f7Folder)) {
  // Build
  alert('Framework7 build ongoing ... please wait')
  run('cd "' + f7Folder + '" && gulp build', function (err, stdOut, errOut) {
    if (!err) {
      // Dist
      alert('Framework7 dist ongoing ... please wait')
      run('cd "' + f7Folder + '" && gulp dist', function (err, stdOut, errOut) {
        if (!err) {
          // Copy
          copy(path.resolve(f7Folder, 'dist/css/framework7.ios.colors.min.css'), path.resolve(cfg.packageRoot, 'vendor/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/css/framework7.ios.min.css'), path.resolve(cfg.packageRoot, 'vendor/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/css/framework7.material.colors.min.css'), path.resolve(cfg.packageRoot, 'vendor/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/css/framework7.material.min.css'), path.resolve(cfg.packageRoot, 'vendor/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/img/*'), path.resolve(cfg.packageRoot, 'vendor/framework7/img'))
          copy(path.resolve(f7Folder, 'dist/js/framework7.min.js'), path.resolve(cfg.packageRoot, 'vendor/framework7/js'))
          if (found(cfg.packageRoot, 'vendor/framework7/js/framework7.min.js')) {
            alert('Newest Framework7 build copied to App Framework lib folder')
          } else {
            alert('Error: Failed to copy Framework7 build file to App Framework lib folder')
          }
        } else {
          alert('Error: Framework7 dist failed')
        }
      })
    } else {
      alert('Error: Framework7 build failed')
    }
  })
} else {
  alert('Error: Framework7 folder not found')
}
