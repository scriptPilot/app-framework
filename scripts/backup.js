// Load packages
var path = require('path')
var run = require('./run')
var cmd = require('interactive-command')
var showOnly = require('./show-only')
// var write = require('write')
// var saveJSON = require('jsonfile')
var isThere = require('is-there')
// saveJSON.spaces = 2

// Load configuration
var cfg = require('./config.js')

showOnly('Preparing Firebase backup - please wait ...')
run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
  showOnly('Login to Firebase - please wait ...')

  cmd('./node_modules/.bin/firebase', ['login'], {cwd: cfg.projectRoot}, function () {
    showOnly('Backup Firebase database - please wait ...')
    cmd('firebase', ['database:get', '/', '>../../../database-backup.json'], {cwd: path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')}, function (res) {
      /*
      if (!isThere(cfg.appRoot + 'database-backup.json')) {
        write.sync(cfg.appRoot + 'database-backup.json', '{}')
      }
      console.log("###", res, "###")
      saveJSON.writeFileSync(cfg.appRoot + 'database-backup.json', JSON.parse(res))
      */
      showOnly('Clean up - please wait ...')
      run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
        showOnly('Firebase database backup done!')
      }, 'Firebase clean up failed')
    }, 'Firebase database backup failed')
  }, 'Firebase login failed')
}, 'Cannot prepare Firebase backup')
