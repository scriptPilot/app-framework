// Load packages
var isThere = require('is-there')
var run = require('child_process').exec
var showOnly = require('./show-only')
var deleteFiles = require('delete').sync

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('Standard JavaScript fix ongoing - please wait ...')

// Do the fix
let files = cfg.isInstalled ? 'app.vue" "pages/*.vue"' : '"scripts/*.js" "demo-app/app.vue" "demo-app/pages/*.vue"'
run('standard >standard-check.log ' + files + ' --plugin html', function (err, stdOut, errOut) {
  if (err) {
    showOnly('Error: Standard JavaScript check failed - please check "standard-check.log" for detailed information or run "npm run fix".')
  } else {
    showOnly('Standard JavaScript check completed')
    if (isThere(cfg.projectRoot + 'standard-check.log')) {
      deleteFiles([cfg.projectRoot + 'standard-check.log'])
    }
  }
})
