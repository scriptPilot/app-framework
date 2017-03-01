'use strict'

// Load packages
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')

// Load configuration
var cfg = require('./config.js')

alert('Development server preparation ongoing - please wait ...')
cmd('npm run fix', function () {
  cmd(cfg.packageRoot, 'node scripts/create-icons', function () {
    cmd(cfg.packageRoot, 'node scripts/dev-server')
  })
})
