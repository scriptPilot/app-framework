// Load packages
var run = require('./run')
var spawn = require('./spawn')
var showOnly = require('./show-only')
var isThere = require('is-there')

// Load configuration
var cfg = require('./config.js')

var devServer = function () {
  showOnly('Development server starting - please wait ...')
  spawn.sync(cfg.packageRoot, 'node', ['scripts/dev-server'])
}

var checkIcons = function () {
  if (isThere(cfg.packageRoot + 'icons')) {
    devServer()
  } else {
    showOnly('Icons are generated - please wait ...')
    run('npm run icons', function () {
      devServer()
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
