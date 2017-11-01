/* Purpose: Check or fix scripts according Standard JS and create log file with remaining findings. */

// Load packages
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const fs = require('fs-extra')
const abs = require('path').resolve

// Show message
alert(`Code ${env.arg.fix === true ? 'fix' : 'check'} ongoing - please wait ...`)

// Define log file
const logFile = 'code-unconformities.log'

// Define Standard parameters
const params = [
  'node',
  'node_modules/eslint/bin/eslint.js',
  // Find app.vue, pages/*.vue and pages/sub/*.vue
  `"${abs(env.app, '**/*.vue')}"`,
  `"${abs(env.app, '**/*.js')}"`
]
if (!env.installed) {
  params.push(`"${abs(__dirname, '../client/*.js')}"`)
  params.push(`"${abs(__dirname, '../scripts/*.js')}"`)
}
// Print to log file
params.push('>')
params.push(`"${abs(env.proj, logFile)}"`)
if (env.arg.fix === true) {
  params.push('--fix')
}

// Define error alert
const errorAlert = `${env.arg.fix !== true ? 'Code unconformities found.' : 'Some unconformities must be fixed manually.'}\n` +
                 `Please check "${logFile}" for detailed information.\n${
                   env.arg.fix !== true ? 'You can run "npm run fix" first for automatic fix.' : ''}`

// Do the fix
cmd(__dirname, 'node applyConfiguration', () => {
  cmd([env.proj], params, () => {
    fs.removeSync(abs(env.proj, logFile))
    alert(`Code ${env.arg.fix === true ? 'fix' : 'check'} done without findings.`)
  }, () => {
    alert(errorAlert, 'error')
  })
})
