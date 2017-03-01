'use strict'

// Include Modules
let found = require('./lib/found')
let abs = require('path').resolve
let fs = require('fs-extra')

// Define installation status
let isInstalled = found('../../package.json')

// Define folders
let proj = isInstalled ? abs(__dirname, '../../') : abs(__dirname)
let app = isInstalled ? abs(proj, 'src') : abs(proj, 'demo/src')
let cache = abs(proj, 'node_modules/.app-framework-cache')

// Load configuration
let pkg = fs.readJsonSync(abs(proj, 'package.json'))
let cfg = fs.readJsonSync(abs(app, 'config.json'))

module.exports = {
  isInstalled: isInstalled,
  proj: proj,
  app: app,
  cache: cache,
  pkg: pkg,
  cfg: cfg
}
