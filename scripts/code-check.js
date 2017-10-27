/* Purpose: Check or fix scripts according Standard JS and create log file with remaining findings. */

'use strict'

// Load packages
let env = require('./env')
let alert = require('./alert')
let cmd = require('./cmd')
let fs = require('fs-extra')
let abs = require('path').resolve

// Show message
alert('Code ' + (env.arg.fix === true ? 'fix' : 'check') + ' ongoing - please wait ...')

// Define log file
let logFile = 'code-unconformities.log'

// Define Standard parameters
let params = [
  'node',
  'node_modules/eslint/bin/eslint.js',
  // Find app.vue, pages/*.vue and pages/sub/*.vue
  '"' + abs(env.app, '**/*.vue') + '"',
  '"' + abs(env.app, '**/*.js') + '"'
]
if (!env.installed) {
  params.push('"' + abs(__dirname, '../client/*.js') + '"')
  params.push('"' + abs(__dirname, '../scripts/*.js') + '"')
}
// Print to log file
params.push('>')
params.push('"' + abs(env.proj, logFile) + '"')
if (env.arg.fix === true) {
  params.push('--fix')
}

// Define error alert
let errorAlert = (env.arg.fix !== true ? 'Code unconformities found.' : 'Some unconformities must be fixed manually.') + '\n' +
                 'Please check "' + logFile + '" for detailed information.\n' +
                 (env.arg.fix !== true ? 'You can run "npm run fix" first for automatic fix.' : '')

// Update eslint config file
const eslintConfig = env.cfg.eslint
if (eslintConfig.extends === 'airbnb') {
  eslintConfig.extends = 'airbnb-base'
}
eslintConfig.plugins = ['vue']
try {
  fs.writeJsonSync(abs(env.proj, '.eslintrc'), eslintConfig, { spaces: 2 })
} catch (err) {
  alert('Failed to update the ESLint configuration file.', 'issue')
}

// Do the fix
cmd([env.proj], params, function () {
  fs.removeSync(abs(env.proj, logFile))
  alert('Code ' + (env.arg.fix === true ? 'fix' : 'check') + ' done without findings.')
}, function () {
  alert(errorAlert, 'error')
})
