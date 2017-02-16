// Load packages
var path = require('path')
var run = require('./run')
var showOnly = require('./show-only')
var read = require('read-file')
var saveJSON = require('jsonfile')
var isThere = require('is-there')
var spawn = require('./spawn')
saveJSON.spaces = 2

// Load configuration
var cfg = require('./config.js')

// Get build version to be used
var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
var version = htaccess.match(/build-(.+)\//)[1]

var checkBuild = function (callback) {
  if (!isThere(cfg.appRoot + 'www/build-' + version)) {
    showOnly('Run "npm run patch" to build your App before deployment')
  } else {
    callback()
  }
}

checkBuild(function () {
  showOnly('Preparing Firebase deployment - please wait ...')
  run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
    showOnly('Login to Firebase - please wait ...')
    spawn.sync(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), 'firebase', ['login'], function () {
      showOnly('Deploying to Firebase - please wait ...')
      spawn.async(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), 'firebase', ['deploy', '--only', 'hosting'], function () {
        showOnly('Clean up temp files - please wait ...')
        run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
          showOnly('Build ' + version + ' deployed to Firebase Hosting!')
        }, 'Firebase clean up failed')
      }, 'Firebase deployment failed')
    })//, 'Firebase login failed')
  }, 'Cannot prepare Firebase deployment')
})
