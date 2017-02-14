// Modules
var path = require('path')
var isThere = require('is-there')
var deleteFiles = require('delete')
var img = require('jimp')
var fs = require('fs-extra')
var rgb = require('hex-rgb')

// Configuration
let cfg = require('./config')
let app = require(cfg.appRoot + 'package.json')

// Show message
console.log('Creating icons - please wait ...')

// Define background color
let bg = rgb(app.iconBackgroundColor).concat(255)

// Define minimum icon size
let minIconWidth = 1024
let minIconHeight = minIconWidth

// Define timestamp
let timestamp = Date.now()

// Define icons
let icons = [
  ['icon', 16, 16],
  ['icon', 32, 32],
  ['icon', 128, 128],
  ['icon', 192, 192],
  ['apple-touch-icon', 180, 180, bg],
  ['app-store-icon', 1024, 1024, bg],
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

// Define icon folder
let iconFile = isThere(path.resolve(cfg.appRoot, app.iconImage)) ? path.resolve(cfg.appRoot, app.iconImage) : path.resolve(cfg.packageRoot, 'demo-app/images/icon.png')

// Load icon file
new img(iconFile, function (err, icon) { // eslint-disable-line
  // Cannot load icon file
  if (err) throw new Error('Cannot load icon file "' + iconFile + '".')

  // Check minimum size
  if (icon.bitmap.width < minIconWidth || icon.bitmap.height < minIconHeight) {
    throw new Error('The icon does not have minimum size of ' + minIconWidth + ' x ' + minIconHeight + ' pixel.')
  }

  // Reset icon folder
  let iconFolder = path.resolve(cfg.packageRoot, 'icons')
  if (!isThere(iconFolder)) {
    fs.mkdir(iconFolder)
  } else {
    deleteFiles.sync(path.resolve(iconFolder, '**/*'))
  }

  // Loop icons
  for (let i = 0; i < icons.length; i++) {
    // Define attributes
    let width = icons[i][1]
    let height = icons[i][2]
    let bg = icons[i][3] || [0, 0, 0, 0]
    let name = icons[i][0] + '-' + width + (width === height ? '' : 'x' + height) + '.' + timestamp + '.png'

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
            })
          })
        })
      })
    })
  }
})

module.exports = {}
