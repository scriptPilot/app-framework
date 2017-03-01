'use strict'

// Load packages
var path = require('path')
var run = require('./run')
var cmd = require('./cmd')
var alert = require('../lib/alert')

// Load configuration
var cfg = require('./config.js')

alert('Preparing Firebase database rules deployment - please wait ...')
run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
  alert('Login to Firebase - please wait ...')
  cmd(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'login'], function () {
    alert('Deploying to Firebase - please wait ...')
    cmd(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'deploy', '--only', 'database'], function () {
      alert('Clean up temp files - please wait ...')
      run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
        alert('Firebase database rules deployed!')
      }, 'Firebase clean up failed')
    }, 'Firebase database rules deployment failed')
  }, 'Firebase login failed')
}, 'Cannot prepare Firebase database rules deployment')
