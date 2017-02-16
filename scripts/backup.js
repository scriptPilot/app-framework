// Load packages
var path = require('path')
var run = require('./run')
var cmd = require('./cmd')
var showOnly = require('./show-only')
var isThere = require('is-there')
var read = require('read-file')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Load configuration
var cfg = require('./config.js')

let backupFile = path.resolve(cfg.appRoot, 'database-backup.json')

showOnly('Preparing Firebase backup - please wait ...')
run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
  showOnly('Login to Firebase - please wait ...')
  cmd(path.resolve(cfg.packageRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'login'], function () {
    showOnly('Backup Firebase database - please wait ...')
    cmd(path.resolve(cfg.packageRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'database:get', '/', '>' + backupFile], function () {
      if (isThere(backupFile)) {
        saveJSON.writeFileSync(backupFile, JSON.parse(read.sync(backupFile, 'utf8')))
      }
      showOnly('Clean up - please wait ...')
      run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
        showOnly('Firebase database backup done!')
      }, 'Firebase clean up failed')
    }, 'Firebase database backup failed')
  }, 'Firebase login failed')
}, 'Cannot prepare Firebase backup')
