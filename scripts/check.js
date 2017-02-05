// Load packages
var isThere = require('is-there')
var run = require('child_process').exec
var showOnly = require('./show-only')
var deleteFiles = require('delete').sync
var path = require('path')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('Standard JavaScript fix ongoing - please wait ...')

// Define files to check
var files = ' "' + path.resolve(cfg.appRoot, 'app.vue') + '"' +
            ' "' + path.resolve(cfg.appRoot, 'pages/*.vue') + '"' +
            cfg.isInstalled ? '' : ' "' + path.resolve(cfg.packageRoot, 'scripts/*.js') + '"'

// Do the check
run('standard >' + path.resolve(cfg.projectRoot, 'standard-check.log') + ' ' + files + ' --plugin html', function (err, stdOut, errOut) {
  if (err) {
    throw new Error('Standard JavaScript check failed - please check "standard-check.log" for detailed information or run "npm run fix".')
  } else {
    showOnly('Standard JavaScript check completed')
    if (isThere(cfg.projectRoot + 'standard-check.log')) {
      deleteFiles([cfg.projectRoot + 'standard-check.log'])
    }
  }
})
