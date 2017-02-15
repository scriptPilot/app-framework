// Load packages
var run = require('./run')
var spawn = require('./spawn')
var showOnly = require('./show-only')
var isThere = require('is-there')

// Load configuration
var cfg = require('./config.js')

var build = function () {
  showOnly('Build process ongoing - please wait ...')
  run('node scripts/build', function () {
    let version = require(cfg.appRoot + 'package.json').version
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
  if (isThere(cfg.packageRoot + 'icons')) {
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
