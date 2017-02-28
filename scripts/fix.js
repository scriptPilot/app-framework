// Load packages
var found = require('../lib/found')
var cmd = require('../lib/cmd')
var alert = require('../lib/alert')
var fs = require('fs-extra')
var abs = require('path').resolve

// Load configuration
var cfg = require('./config.js')

// Show message
alert('Standard JavaScript fix ongoing - please wait ...')

// Define Standard parameters
var params = [
  'node',
  'cmd.js',
  '>' + abs(cfg.projectRoot, 'standard-check.log'),
  '"' + abs(cfg.appRoot, '**/*.vue') + '"'
]
if (!cfg.isInstalled) {
  params.push('"' + abs(cfg.packageRoot, 'scripts/*.js') + '"')
  params.push('"' + abs(cfg.packageRoot, 'lib/*.js') + '"')
}
params.push('--plugin')
params.push('html')
params.push('--fix')

// Do the fix
cmd([cfg.projectRoot, 'node_modules/standard/bin'], params, function () {
  alert('Standard JavaScript fix done.')
  fs.removeSync(abs(cfg.projectRoot, 'standard-check.log'))
}, 'Error: Some findings must be fixed manually - please check "standard-check.log" for detailed information.')
