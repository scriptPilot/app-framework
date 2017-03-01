'use strict'

// Load packages
var run = require('./run')
var alert = require('../lib/alert')
var found = require('../lib/found')
var read = require('read-file')

// Load configuration
var cfg = require('./config.js')

var build = function () {
  alert('Build process ongoing - please wait ...')
  run('cd "' + cfg.packageRoot + '" && node scripts/build', function () {
    let version = JSON.parse(read.sync(cfg.appRoot + 'package.json', 'utf8')).version
    alert('Completed build ' + version)
  })
}

var updateVersion = function () {
  alert('Increasing version - please wait ...')
  run('npm version minor', function () {
    build()
  }, 'Failed to increase version - please ensure that your latest changes are commited to GIT!')
}

var checkIcons = function () {
  if (found(cfg.packageRoot, 'icons/favicon.ico')) {
    updateVersion()
  } else {
    alert('Icons are generated - please wait ...')
    run('npm run icons', function () {
      updateVersion()
    }, 'Failed to generate icon folder')
  }
}

if (cfg.isInstalled) {
  checkIcons()
} else {
  alert('Standard JavaScript fix ongoing - please wait ...')
  run('npm run fix', function () {
    checkIcons()
  }, 'Standard JavaScript fix failed')
}
