/* eslint-disable */

/* Purpose: Build Framework7 and copy dist files to App Framework, update theme colors */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let fs = require('fs-extra')
let abs = require('path').resolve
let rec = require('recursive-readdir')

// Check App Framework development mode
if (env.installed === true) {
  alert('Framework7 update is only possible in App Framework development mode.', 'error')
}

// Check Framework7 folder
let f7Folder = abs(env.proj, '../Framework7')
if (!found(f7Folder)) {
  alert('Cannot find Framework7 folder.', 'error')
}

// Build Framework7
alert('Framework7 build process ongoing - please wait ...')
cmd(f7Folder, 'gulp build', function () {
  alert('Framework7 distribution process ongoing - please wait ...')
  cmd(f7Folder, 'gulp dist', function () {
    alert('Copying build files to App Framework folder - please wait ...')
    // Empty current directory
    fs.emptyDirSync(abs(env.proj, 'vendor/framework7'))
    // Define basic files to copy
    let files = [
      'css/framework7.ios.colors.css',
      'css/framework7.ios.css',
      'css/framework7.material.colors.css',
      'css/framework7.material.css',
      'img',
      'js/framework7.js',
    ]
    // Copy basic files
    for (let f = 0; f < files.length; f++) {
      fs.copySync(abs(f7Folder, 'dist', files[f]), abs(env.proj, 'vendor/framework7', files[f]))
    }
    // Update theme colors
    let colors = {ios: {}, material: {}, default: {}}
    let iosColorFile = fs.readFileSync(abs(f7Folder, 'src/less/ios/_colors-vars.less'), 'utf8')
    iosColorFile.match(/@([a-z]+):( )?#([0-9a-z]{6});/g).map(function (colorStr) {
      let colorSearch = colorStr.match(/@([a-z]+):( )?#([0-9a-z]{6});/)
      colors.ios[colorSearch[1]] = colorSearch[3]
    })
    colors.default.ios = iosColorFile.match(/@themeColor:( )?@([a-z]+);/)[2]
    let materialColorFile = fs.readFileSync(abs(f7Folder, 'src/less/material/_colors-vars.less'), 'utf8')
    materialColorFile.match(/@([a-z]+):( )?#([0-9a-z]{6});/g).map(function (colorStr) {
      let colorSearch = colorStr.match(/@([a-z]+):( )?#([0-9a-z]{6});/)
      colors.material[colorSearch[1]] = colorSearch[3]
    })
    colors.default.material = materialColorFile.match(/@themeColor:( )?@([a-z]+);/)[2]
    fs.writeJsonSync(abs(env.proj, 'lib/theme-colors.json'), colors)
    // Update kitchen sinks
    cmd(__dirname, 'node update-kitchen-sinks', function () {
      cmd(__dirname, 'node update-routes', function () {
        alert('Framework7 update done.')
      })
    })
  }, 'Framework7 distribution process failed.')
}, 'Framework7 build process failed.')
