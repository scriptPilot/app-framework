'use strict'

// Load packages
var path = require('path')
var run = require('./run')
var cmd = require('./cmd')
var alert = require('../lib/alert')
var found = require('../lib/found')
var read = require('read-file')
var fs = require('fs-extra')

// Load configuration
var cfg = require('./config.js')

let backupFile = path.resolve(cfg.appRoot, 'database-backup.json')

alert('Preparing Firebase backup - please wait ...')
run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
  alert('Login to Firebase - please wait ...')
  cmd(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'login'], function () {
    alert('Backup Firebase database - please wait ...')
    cmd(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'database:get', '/', '>' + backupFile], function () {
      if (found(backupFile)) {
        fs.writeJsonSync(backupFile, JSON.parse(read.sync(backupFile, 'utf8')), {spaces: 2})
      }
      alert('Clean up - please wait ...')
      run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
        alert('Firebase database backup done!')
      }, 'Firebase clean up failed')
    }, 'Firebase database backup failed')
  }, 'Firebase login failed')
}, 'Cannot prepare Firebase backup')
