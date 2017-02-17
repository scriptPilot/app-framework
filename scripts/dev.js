// Load packages
var run = require('./run')
var cmd = require('./cmd')
var showOnly = require('./show-only')
var isThere = require('is-there')
var path = require('path')

// Load configuration
var cfg = require('./config.js')

var devServer = function () {
  showOnly('Development server starting - please wait ...')
  cmd(cfg.packageRoot, ['node', 'scripts/dev-server'])
}

var checkIcons = function () {
  if (isThere(path.resolve(cfg.packageRoot, 'icons/favicon.ico'))) {
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
