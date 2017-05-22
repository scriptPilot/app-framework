/* eslint-disable */

/* Purpose: Build Framework7 and copy dist files to App Framework, update theme colors */

'use strict'

// Load modules
let env = require('./env')
let alert = require('./alert')
let cmd = require('./cmd')
let found = require('./found')
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
    fs.writeJsonSync(abs(__dirname, '../client/theme-colors.json'), colors)
    // Workaround: #121 - Popup open to large on big screens
    try {
      let js
      // iOS CSS file
      js = fs.readFileSync(abs(env.proj, 'vendor/framework7/css/framework7.ios.css'), 'utf8')
      js = js.replace(/\.popup:not\(\.tablet-fullscreen\)/g, 'body:not(.phoneFrame):not(.limitHeight):not(.limitWidth) .popup:not(.tablet-fullscreen)')
      fs.writeFileSync(abs(env.proj, 'vendor/framework7/css/framework7.ios.css'), js)
      // Material CSS file
      js = fs.readFileSync(abs(env.proj, 'vendor/framework7/css/framework7.material.css'), 'utf8')
      js = js.replace(/\.popup:not\(\.tablet-fullscreen\)/g, 'body:not(.phoneFrame):not(.limitHeight):not(.limitWidth) .popup:not(.tablet-fullscreen)')
      fs.writeFileSync(abs(env.proj, 'vendor/framework7/css/framework7.material.css'), js)
    } catch (err) {
      alert('Failed to apply workaround #121.', 'issue')
    }
    // Workaround #578 - Action sheets shown to big width phone frame
    try {
      let js
      // iOS CSS file
      js = fs.readFileSync(abs(env.proj, 'vendor/framework7/css/framework7.ios.css'), 'utf8')
      js = js.replace(/@media \(min-width: 496px\) \{[\n ]*\.actions-modal/g, '@media (min-width: 496px) {\n  body:not(.phoneFrame):not(.limitHeight):not(.limitWidth) .actions-modal')
      fs.writeFileSync(abs(env.proj, 'vendor/framework7/css/framework7.ios.css'), js)
    } catch (err) {
      alert('Failed to apply workaround #578.', 'issue')
    }
    // Update kitchen sinks
    cmd(__dirname, 'node update-kitchen-sinks', function () {
      cmd(__dirname, 'node update-routes', function () {
        alert('Framework7 update done.')
      })
    })
  }, 'Framework7 distribution process failed.')
}, 'Framework7 build process failed.')
