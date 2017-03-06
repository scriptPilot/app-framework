/* Purpose: Build Framework7 and copy dist files to App Framework */

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
  alert('Error: Framework7 update is only possible in App Framework development mode.')
}

// Check Framework7 folder
let f7Folder = abs(env.proj, '../Framework7')
if (!found(f7Folder)) {
  alert('Error: Cannot find Framework7 folder.')
}

// Build Framework7
alert('Framework7 build process ongoing - please wait ...')
cmd(f7Folder, 'gulp build', function () {
  alert('Framework7 distribution process ongoing - please wait ...')
  cmd(f7Folder, 'gulp dist', function () {
    alert('Copying build files to App Framework folder - please wait ...')
      // Empty current directory
    fs.emptyDirSync(abs(env.proj, 'vendor/framework7'))
      // Define files to copy
    let files = [
      'css/framework7.ios.colors.min.css',
      'css/framework7.ios.min.css',
      'css/framework7.material.colors.min.css',
      'css/framework7.material.min.css',
      'img',
      'js/framework7.min.js'
    ]
      // Copy files
    for (let f = 0; f < files.length; f++) {
      fs.copySync(abs(f7Folder, 'dist', files[f]), abs(env.proj, 'vendor/framework7', files[f]))
    }
      // Alert
    alert('Framework7 update done.')
  }, 'Error: Framework7 distribution process failed.')
}, 'Error: Framework7 build process failed.')
