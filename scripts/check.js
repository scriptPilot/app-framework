// Load packages
var isThere = require('is-there')
var run = require('./run')
var showOnly = require('./show-only')
var deleteFiles = require('delete').sync
var path = require('path')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('Standard JavaScript check ongoing - please wait ...')

// Define files to fix
var files = ' "' + path.resolve(cfg.appRoot, 'app.vue') + '"' +
            ' "' + path.resolve(cfg.appRoot, 'pages/**/*.vue') + '"' +
            cfg.isInstalled ? '' : ' "' + path.resolve(cfg.packageRoot, 'scripts/*.js') + '"'

// Do the fix
run('standard >' + path.resolve(cfg.projectRoot, 'standard-check.log') + ' ' + files + ' --plugin html', function () {
  showOnly('Standard JavaScript check completed')
  if (isThere(cfg.projectRoot + 'standard-check.log')) {
    deleteFiles([cfg.projectRoot + 'standard-check.log'])
  }
}, function () {
  showOnly('Standard JavaScript check found some unconformities. Please run "npm run fix" or check "standard-check.log" for detailed information.')
})
