// Load packages
var isThere = require('is-there')
var run = require('./run')
var showOnly = require('./show-only')
var deleteFiles = require('delete').sync
var path = require('path')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('Standard JavaScript fix ongoing - please wait ...')

// Define files to fix
var files = ' "' + path.resolve(cfg.appRoot, 'app.vue') + '"' +
            ' "' + path.resolve(cfg.appRoot, 'pages/*.vue') + '"' +
            cfg.isInstalled ? '' : ' "' + path.resolve(cfg.packageRoot, 'scripts/*.js') + '"'

// Do the fix
run('standard >' + path.resolve(cfg.projectRoot, 'standard-check.log') + ' ' + files + ' --plugin html --fix', function () {
  showOnly('Standard JavaScript fix completed')
  if (isThere(cfg.projectRoot + 'standard-check.log')) {
    deleteFiles([cfg.projectRoot + 'standard-check.log'])
  }
}, function () {
  showOnly('Standard JavaScript fix must be completed manually - please check "standard-check.log" for detailed information.')
})
