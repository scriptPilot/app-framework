'use strict'

// Modules
var path = require('path')
var found = require('../lib/found')
var deleteFiles = require('delete')
var alert = require('../lib/alert')
var img = require('jimp')
var fs = require('fs-extra')
var rgb = require('hex-rgb')
var ico = require('to-ico')

// Configuration
let cfg = require('./config')
let app = require(cfg.appRoot + 'config.json')

// Show message
alert('Creating icons - please wait ...')

// Define background color
let bg = rgb(app.iconBackgroundColor).concat(255)

// Define minimum icon size
let minIconWidth = 1024
let minIconHeight = minIconWidth

// Define icons
let icons = [
  ['app-store-icon', 1024, 1024, bg],
  ['play-store-icon', 512, 512],
  ['apple-touch-icon', 180, 180, bg],
  ['favicon', 16, 16],
  ['favicon', 32, 32],
  ['android-chrome', 192, 192],
  ['android-chrome', 512, 512],
  ['mstile', 150, 150],
  ['ios-icon', 180, 180, bg],
  ['ios-icon', 167, 167, bg],
  ['ios-icon', 152, 152, bg],
  ['ios-icon', 144, 144, bg],
  ['ios-icon', 120, 120, bg],
  ['ios-icon', 114, 114, bg],
  ['ios-icon', 100, 100, bg],
  ['ios-icon', 87, 87, bg],
  ['ios-icon', 76, 76, bg],
  ['ios-icon', 72, 72, bg],
  ['ios-icon', 80, 80, bg],
  ['ios-icon', 58, 58, bg],
  ['ios-icon', 57, 57, bg],
  ['ios-icon', 50, 50, bg],
  ['ios-icon', 40, 40, bg],
  ['ios-icon', 29, 29, bg],
  ['ios-launchscreen', 2048, 2732, bg],
  ['ios-launchscreen', 1536, 2048, bg],
  ['ios-launchscreen', 1436, 2048, bg],
  ['ios-launchscreen', 1242, 2208, bg],
  ['ios-launchscreen', 1080, 1920, bg],
  ['ios-launchscreen', 768, 1024, bg],
  ['ios-launchscreen', 750, 1334, bg],
  ['ios-launchscreen', 640, 1136, bg],
  ['ios-launchscreen', 640, 960, bg],
  ['ios-launchscreen', 320, 480, bg],
  ['android-icon-ldpi', 36, 36],
  ['android-icon-mdpi', 48, 48],
  ['android-icon-hdpi', 72, 72],
  ['android-icon-xhdpi', 96, 96],
  ['android-icon-xxhdpi', 144, 144],
  ['android-icon-xxxhdpi', 192, 192],
  ['android-launchscreen-xhdpi', 720, 1280, bg],
  ['android-launchscreen-hdpi', 480, 800, bg],
  ['android-launchscreen-mdpi', 320, 480, bg],
  ['android-launchscreen-ldpi', 200, 320, bg]
]

// Create landscape version of portrait launchscreens
for (let i = 0; i < icons.length; i++) {
  if (icons[i][1] < icons[i][2]) {
    icons.push([icons[i][0], icons[i][2], icons[i][1], icons[i][3]])
  }
}

// Define icon file
let iconFile = found(cfg.appRoot, app.iconImage) ? path.resolve(cfg.appRoot, app.iconImage) : path.resolve(cfg.packageRoot, 'demo/images/icon.png')

// Load icon file
new img(iconFile, function (err, icon) { // eslint-disable-line
  // Cannot load icon file
  if (err) throw new Error('Cannot load icon file "' + iconFile + '".')

  // Reset icon folder
  let iconFolder = path.resolve(cfg.packageRoot, 'icons')
  if (!found(iconFolder)) {
    fs.mkdir(iconFolder)
  } else {
    deleteFiles.sync(path.resolve(iconFolder, '**/*'))
  }

  // Generate ico file
  ico([fs.readFileSync(iconFile)], {resize: true, sizes: [16, 32, 48]})
    .then(buf => {
      fs.writeFileSync(path.resolve(iconFolder, 'favicon.ico'), buf)
    })

  // Check minimum size
  if (icon.bitmap.width < minIconWidth || icon.bitmap.height < minIconHeight) {
    throw new Error('The icon does not have minimum size of ' + minIconWidth + ' x ' + minIconHeight + ' pixel.')
  }

  // Loop icons
  for (let i = 0; i < icons.length; i++) {
    // Define attributes
    let width = icons[i][1]
    let height = icons[i][2]
    let bg = icons[i][3] || [0, 0, 0, 0]
    let name = icons[i][0] + '-' + width + 'x' + height + '.png'

    // Calculate icon size
    let maxIconWidth = width === height ? width : width / 2
    let maxIconHeight = width === height ? height : height / 2
    let factor = Math.min(maxIconWidth / icon.bitmap.width, maxIconHeight / icon.bitmap.height)
    let iconWidth = Math.floor(factor * icon.bitmap.width)
    let iconHeight = Math.floor(factor * icon.bitmap.height)

    // Calculate icon position
    let left = Math.floor((width - iconWidth) / 2)
    let top = Math.floor((height - iconHeight) / 2)

    // Create canvas
    new img(width, height, img.rgbaToInt(bg[0], bg[1], bg[2], bg[3]), function (err, canvas) { // eslint-disable-line
      if (err) throw err

      // Clone icon
      icon.clone(function (err, thisIcon) {
        if (err) throw err

        // Resize icon
        thisIcon.resize(iconWidth, iconHeight, function (err, thisIcon) {
          if (err) throw err

          // Copy icon to canvas
          canvas.composite(thisIcon, left, top, function (err, canvas) {
            if (err) throw err

            // Save icon
            canvas.write(path.resolve(iconFolder, name), function (err) {
              if (err) throw err
              if (i + 1 === icons.length) {
                alert('Icons updated!')
              }
            })
          })
        })
      })
    })
  }
})

module.exports = {}
