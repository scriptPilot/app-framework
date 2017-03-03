'use strict'

// Include Modules
let found = require('./lib/found')
let abs = require('path').resolve
let fs = require('fs-extra')
let argParser = require('minimist')

// Read script parameters
let arg = argParser(process.argv.slice(2))

// Define force status
let forced = arg.force === true || arg.f === true

// Define installation status
let installed = found('../../package.json')

// Define folders
let proj = installed ? abs(__dirname, '../../') : abs(__dirname)
let app = abs(proj, 'src')
let cache = abs(proj, 'node_modules/.app-framework-cache')

// Load configuration
let pkg = fs.readJsonSync(abs(proj, 'package.json'))
let cfg = fs.readJsonSync(abs(app, 'config.json'))

module.exports = {
  arg: arg,
  forced: forced,
  installed: installed,
  proj: proj,
  app: app,
  cache: cache,
  pkg: pkg,
  cfg: cfg
}
