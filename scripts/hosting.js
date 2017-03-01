'use strict'

// Load packages
var path = require('path')
var run = require('./run')
var alert = require('../lib/alert')
var read = require('read-file')
var found = require('../lib/found')
var cmd = require('./cmd')

// Load configuration
var cfg = require('./config.js')

// Get build version to be used
var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
var version = htaccess.match(/build-(.+)\//)[1]

var checkBuild = function (callback) {
  if (!found(cfg.appRoot + 'www/build-' + version)) {
    alert('Build application first - please wait ...')
    cmd(['npm', 'run', 'patch'], function () {
      htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
      version = htaccess.match(/build-(.+)\//)[1]
      callback()
    }, 'Build process failed')
  } else {
    callback()
  }
}

checkBuild(function () {
  alert('Preparing Firebase deployment - please wait ...')
  run('node "' + path.resolve(cfg.packageRoot, 'scripts/prepare-firebase') + '"', function () {
    alert('Login to Firebase - please wait ...')
    cmd(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'login'], function () {
      alert('Deploying to Firebase - please wait ...')
      cmd(path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin'), ['firebase', 'deploy', '--only', 'hosting'], function () {
        alert('Clean up temp files - please wait ...')
        run('node "' + path.resolve(cfg.packageRoot, 'scripts/cleanup-firebase') + '"', function () {
          alert('Build ' + version + ' deployed to Firebase Hosting!')
        }, 'Firebase clean up failed')
      }, 'Firebase deployment failed')
    }, 'Firebase login failed')
  }, 'Cannot prepare Firebase deployment')
})
