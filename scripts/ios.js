// Load packages
var path = require('path')
var isThere = require('is-there')
var copy = require('cpx').copy
var run = require('./run')
var showOnly = require('./show-only')
var read = require('read-file')
var deleteFiles = require('delete')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('iOS build ongoing - please wait ...')

// Update cordova www folder with last build files
function updateCordovaBuild (callback) {
  // Get version of last build to be used
  var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
  var version = htaccess.match(/build-(.+)\//)[1]
  // Build folder exists
  if (isThere(path.resolve(cfg.appRoot, 'www/build-' + version))) {
    // Delete cordova www folder
    deleteFiles(path.resolve(cfg.packageRoot, 'cordova/www'), function (err) {
      if (err) {
        throw new Error(err)
      } else {
        // Copy build files
        copy(path.resolve(cfg.appRoot, 'www/build-' + version), path.resolve(cfg.packageRoot, 'cordova/www'), function (err) {
          if (err) {
            throw new Error(err)
          } else {
            callback()
          }
        })
      }
    })
  } else {
    throw new Error(version === '0.0.0' ? 'You must build your application first.' : 'Build folder "www/build-' + version + '" not found.')
  }
}

// Create cordova project folder
function createCordovaProject (callback) {
  if (!isThere(cfg.packageRoot + 'cordova')) {
    run('cd "' + cfg.packageRoot + '" && cordova create cordova', updateCordovaBuild(callback))
  } else {
    updateCordovaBuild(callback)
  }
}

// (Re)build cordova ios platform
function buildCordovaIos (callback) {
  createCordovaProject(function () {
    let removePlatform = isThere(path.resolve(cfg.packageRoot, 'cordova/platforms/ios')) ? 'cordova platform rm ios && ' : ''
    run('cd "' + path.resolve(cfg.packageRoot, 'cordova') + '" && ' + removePlatform + 'cordova platform add ios', function () {
      callback()
    })
  })
}

// Start build process
buildCordovaIos(function () {
  // run('cd "' + path.resolve(cfg.packageRoot, 'cordova') + '" && cordova run ios')
  showOnly('iOS build done! Please open Xcode to run the simulator or to comit your application to the App Store.')
})
