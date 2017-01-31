// Load configuration
var cfg = require('./config.js')

// Load packages
var path = require('path')
var isThere = require('is-there')
var run = require('child_process').exec
var copy = require('cpx').copySync
var showOnly = require('./show-only.js')

// Framework7 folder exists
var f7Folder = path.resolve(cfg.packageRoot, '..', 'Framework7')
if (isThere(f7Folder)) {
  // Build
  showOnly('Framework7 build ongoing ... please wait')
  run('cd "' + f7Folder + '" && gulp build', function (err, stdOut, errOut) {
    if (!err) {
      // Dist
      showOnly('Framework7 dist ongoing ... please wait')
      run('cd "' + f7Folder + '" && gulp dist', function (err, stdOut, errOut) {
        if (!err) {
          // Copy
          copy(path.resolve(f7Folder, 'dist/css/framework7.ios.colors.min.css'), path.resolve(cfg.packageRoot, 'libs/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/css/framework7.ios.min.css'), path.resolve(cfg.packageRoot, 'libs/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/css/framework7.material.colors.min.css'), path.resolve(cfg.packageRoot, 'libs/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/css/framework7.material.min.css'), path.resolve(cfg.packageRoot, 'libs/framework7/css'))
          copy(path.resolve(f7Folder, 'dist/img/*'), path.resolve(cfg.packageRoot, 'libs/framework7/img'))
          copy(path.resolve(f7Folder, 'dist/js/framework7.min.js'), path.resolve(cfg.packageRoot, 'libs/framework7/js'))
          if (isThere(path.resolve(cfg.packageRoot, 'libs/framework7/js/framework7.min.js'))) {
            showOnly('Newest Framework7 build copied to App Framework libs folder')
          } else {
            showOnly('Error: Failed to copy Framework7 build file to App Framework libs folder')
          }
        } else {
          showOnly('Error: Framework7 dist failed')
        }
      })
    } else {
      showOnly('Error: Framework7 build failed')
    }
  })
} else {
  showOnly('Error: Framework7 folder not found')
}
