/* Purpose: Build Framework7-Vue and copy dist files to App Framework */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let fs = require('fs-extra')
let abs = require('path').resolve

// Check App Framework development mode
if (env.installed === true) {
  alert('Error: Framework7-Vue update is only possible in App Framework development mode.')
}

// Check Framework7-Vue folder
let f7VueFolder = abs(env.proj, '../Framework7-Vue')
if (!found(f7VueFolder)) {
  alert('Error: Cannot find Framework7-Vue folder.')
}

// Build Framework7-Vue
alert('Framework7-Vue build process ongoing - please wait ...')
cmd(f7VueFolder, 'npm run build', function () {
  alert('Framework7-Vue distribution process ongoing - please wait ...')
  cmd(f7VueFolder, 'npm run dist', function () {
      alert('Copying build files to App Framework folder - please wait ...')
      // Empty current directory
      fs.emptyDirSync(abs(env.proj, 'vendor/Framework7-Vue'))
      // Copy file
      fs.copySync(abs(f7VueFolder, 'dist/framework7-vue.min.js'), abs(env.proj, 'vendor/Framework7-Vue/framework7-vue.min.js'))
      // Alert
      alert('Framework7-Vue update done.')
  }, 'Error: Framework7-Vue distribution process failed.')
}, 'Error: Framework7-Vue build process failed.')
