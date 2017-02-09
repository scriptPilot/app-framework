// Configuration
let cfg = require('./config')
let app = require(cfg.appRoot + 'package.json')
let minIconWidth = 1024
let minIconHeight = 1024
let iconSizesWithBackground = [20, 29, 29, 40, 50, 57, 58, 60, 72, 76, 80, 87, 100, 114, 120, 144, 152, 167, 170, 180, 1024]
let launchScreenSizes = [
  [320, 480], [640, 960], [640, 1136], [750, 1334], [768, 1024], [1080, 1920], [1242, 2208], [1536, 2048], [2048, 2732]
]

// Modules
var path = require('path')
var isThere = require('is-there')
var deleteFiles = require('delete')
var img = require('lwip')
var fs = require('fs-extra')
var rgb = require('hex-rgb')

// Reset icon folder
let iconFile = isThere(path.resolve(cfg.appRoot, app.iconImage)) ? path.resolve(cfg.appRoot, app.iconImage) : path.resolve(cfg.packageRoot, 'demo-app/images/icon.png')

// Load icon file
img.open(iconFile, function (err, icon) {
  // Cannot load icon file
  if (err) throw new Error('Cannot load icon file "' + iconFile + '".')

  // Check minimum size
  if (icon.width() < minIconWidth || icon.height() < minIconHeight) {
    throw new Error('The icon does not have minimum size of ' + minIconWidth + ' x ' + minIconHeight + ' pixel.')
  }

  // Create/reset icon folder
  let iconFolder = path.resolve(cfg.packageRoot, 'icons')
  if (!isThere(iconFolder)) {
    fs.mkdir(iconFolder)
  } else {
    deleteFiles.sync(path.resolve(iconFolder, '**/*'))
  }

  // Define background color
  let bg = rgb(app.iconBackgroundColor)

  // Create filled canvas
  img.create(icon.width(), icon.height(), bg, function (err, canvas) {
    if (err) throw new Error(err)

    // Copy icon to canvas
    canvas.paste(0, 0, icon, function (err, iconWithBackground) {
      if (err) throw new Error(err)

      // Calculate landscape splash screen sizes
      let splashscreens = launchScreenSizes.length
      for (let ls = 0; ls < splashscreens; ls++) {
        launchScreenSizes.push([launchScreenSizes[ls][1], launchScreenSizes[ls][0]])
      }

      // Create splash screens
      for (let ls = 0; ls < launchScreenSizes.length; ls++) {
        let width = launchScreenSizes[ls][0]
        let height = launchScreenSizes[ls][1]

        // Create launch screen canvas
        img.create(width, height, bg, function (err, lsCanvas) {
          if (err) throw new Error(err)

          // Clone icon
          iconWithBackground.clone(function (err, thisIcon) {
            if (err) throw new Error(err)

            // Calculate icon size and position
            let factorWidth = width / 3 / icon.width()
            let factorHeight = height / 3 / icon.height()
            let size = Math.floor(Math.min(0.5, Math.max(factorWidth, factorHeight)) * canvas.width())
            let left = Math.floor((width - size) / 2)
            let top = Math.floor((height - size) / 2)

            // Resize
            thisIcon.resize(size, size, function (err, thisIcon) {
              if (err) throw new Error(err)

              // Paste to splash screen canvas
              lsCanvas.paste(left, top, thisIcon, function (err, lsCanvas) {
                if (err) throw new Error(err)

                // Save splash sreen
                lsCanvas.writeFile(path.resolve(iconFolder, 'splashscreen-' + width + 'x' + height + '.png'), function (err) {
                  if (err) throw new Error(err)
                })
              })
            })
          })
        })
      }

      // Loop sizes
      for (let s = 0; s < iconSizesWithBackground.length; s++) {
        let size = iconSizesWithBackground[s]

        // Clone icon with background
        iconWithBackground.clone(function (err, thisIcon) {
          if (err) throw new Error(err)

          // Resize icon with background
          thisIcon.resize(size, size, function (err, thisIcon) {
            if (err) throw new Error(err)

            // Save icon with background
            thisIcon.writeFile(path.resolve(iconFolder, 'icon-with-background-' + size + '.png'), function (err) {
              if (err) throw new Error(err)
            })
          })
        })
      }
    })
  })
})

module.exports = {}
