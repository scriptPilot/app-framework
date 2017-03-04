'use strict'

// Load packages
var env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')

// Require force in development mode
if (!env.installed && !env.forced) alert('Error: App Framework should be installed as module. Please read our documentation on GitHub.')

// Load configuration
var cfg = require('./config.js')

alert('Development server preparation ongoing - please wait ...')
cmd('npm run fix', function () {
  cmd(cfg.packageRoot, 'node scripts/create-icons', function () {
    cmd(cfg.packageRoot, 'node scripts/dev-server')
  })
})
