'use strict'

// Load configuration
var cfg = require('./config.js')
var fs = require('fs-extra')
var alert = require('../lib/alert')

// Update required app framework version
if (!cfg.isInstalled) {
  var pkg = require(cfg.packageRoot + 'package.json')
  var app = require(cfg.appRoot + 'config.json')
  app.devDependencies['app-framework'] = '^' + pkg.version
  fs.writeJsonSync(cfg.appRoot + 'package.json', app, {spaces: 2})
  alert('Required App Framework version updated to ' + pkg.version)
}
