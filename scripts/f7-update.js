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
    fs.emptyDirSync(abs(env.app, 'pages/f7ios'))
    fs.emptyDirSync(abs(env.app, 'pages/material'))
    // Define basic files to copy
    let files = [
      'css/framework7.ios.colors.min.css',
      'css/framework7.ios.min.css',
      'css/framework7.material.colors.min.css',
      'css/framework7.material.min.css',
      'img',
      'js/framework7.min.js'
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
    // Copy and modify kitchen sink files
    rec(abs(f7Folder, 'kitchen-sink-ios'), function (err, files) {
      if (err) {
        alert('Failed to read iOS kitchen sink files.', 'error')
      } else {
        files.map(function (file) {
          let fileShort = file.substr(abs(f7Folder, 'kitchen-sink-ios').length + 1)
          if (/^([0-9a-z.-]+)\.html$/i.test(fileShort) === true && fileShort !== 'index.html') {
            fileShort = fileShort
            let fileName = fileShort.replace('.html', '.vue')
            let content = fs.readFileSync(file, 'utf8')
            // Modify links
            content = content.replace(/"([0-9a-z-]+)\.html"/g, '"/f7ios/$1/"')
            // Search components
            let src1 = content.match(/(<div class="navbar[\s\S.]+)\n[ ]*<div class="pages.+\n[ ]*(<div data-page=.+)\n[ ]*(<[\s\S.]+)\n[ ]*<\/div>\n[ ]*<\/div>[\n ]*/)
            if (src1 !== null) {
              let newContent = '<template>\n' +
                               '  ' + src1[2] + '\n' +
                               '    ' + src1[1].replace(/\n/g, '\n    ') + '\n' +
                               '    ' + src1[3] + '\n' +
                               '  </div>' + '\n' +
                               '</template>' + '\n'
              fs.writeFileSync(abs(env.app, 'pages/f7ios', fileName), newContent)/*
            } else if (contentParts2 !== null) {
              let newContent = '<template>\n' +
                               '  <div data-page="' + contentParts2[2] + '</div>\n' +
                               '</template>\n'
              fs.writeFileSync(abs(env.app, 'pages/f7ios', fileShort), newContent)
            } else if (contentParts3 !== null) {
              let newContent = '<template>\n' +
                               '  <div class="navbar' + contentParts3[1].replace(/\n/g, '\n  ') + '\n' +
                               '  <div data-page="' + contentParts3[2].replace(/\n/g, '\n  ') + '</div>\n' +
                               '</template>\n'
              fs.writeFileSync(abs(env.app, 'pages/f7ios', fileShort), newContent)
            } else if (contentParts4 !== null) {
              let newContent = '<template>\n' +
                               '  <div data-page="' + contentParts4[1].replace(/\n/g, '\n  ') + '</div>\n' +
                               '</template>\n'
              fs.writeFileSync(abs(env.app, 'pages/f7ios', fileShort), newContent) */
            } else {
              alert('Page analysis failed for "' + fileShort + '".', 'error')
            }
          }
        })
        // Create home.vue
        let indexPage = fs.readFileSync(abs(f7Folder, 'kitchen-sink-ios/index.html'), 'utf8')
        let mainView = indexPage.match(/<div data-page="index" class="page">([\n ]*)<div class="page-content">([\n ]+)([\s\S.]+?)([\n ]+)<\/div>([\n ]+)<\/div>([\n ]+)<\/div>([\n ]+)<\/div>([\n ]+)<\/div>([\n ]+)<div class="popup demo-popup">/)[3]
        mainView = mainView.replace(/"([0-9a-z-]+)\.html"/g, '"/f7ios/$1/"')
        let homePage = '<template>\n' +
                       '  <div data-page="home" class="page">\n' +
                       '    ' + mainView.replace(/\n( ){10}/g, '\n') + '\n' +
                       '  </div>\n' +
                       '</template>\n'
        fs.writeFileSync(abs(env.app, 'pages/f7ios/index.vue'), homePage)
        // Reset routes for f7vue
        if (found(abs(env.app, 'routes.json'))) {
          let routes = fs.readJsonSync(abs(env.app, 'routes.json'))
          let newRoutes = []
          routes.map(function (route) {
            if (/^\/f7ios\//.test(route.path) === false) {
              newRoutes.push(route)
            }
          })
          fs.writeJsonSync(abs(env.app, 'routes.json'), newRoutes)
        }
        // Alert
        alert('Framework7 update done.')
      }
    })
  }, 'Framework7 distribution process failed.')
}, 'Framework7 build process failed.')
