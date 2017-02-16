// Load packages
var run = require('./run')
var showOnly = require('./show-only')
var isThere = require('is-there')
var read = require('read-file')
var path = require('path')

// Load configuration
var cfg = require('./config.js')

var build = function () {
  showOnly('Build process ongoing - please wait ...')
  run('cd "' + cfg.packageRoot + '" && node scripts/build', function () {
    let version = JSON.parse(read.sync(cfg.appRoot + 'package.json', 'utf8')).version
    showOnly('Completed build ' + version)
  })
}

var updateVersion = function () {
  showOnly('Increasing version - please wait ...')
  run('npm version patch', function () {
    build()
  }, 'Failed to increase version - please ensure that your latest changes are commited to GIT!')
}

var checkIcons = function () {
  if (isThere(path.resolve(cfg.packageRoot, 'icons/favicon.ico'))) {
    updateVersion()
  } else {
    showOnly('Icons are generated - please wait ...')
    run('npm run icons', function () {
      updateVersion()
    }, 'Failed to generate icon folder')
  }
}

if (cfg.isInstalled) {
  checkIcons()
} else {
  showOnly('Standard JavaScript fix ongoing - please wait ...')
  run('npm run fix', function () {
    checkIcons()
  }, 'Standard JavaScript fix failed')
}

module.exports = {}
