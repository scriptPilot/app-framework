/*

  Purpose: Create icons and splash screens, cache icons to version folder

  Arguments: --version (must be "x.y.z" or "dev")

*/

'use strict'

// Include packages
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let fs = require('fs-extra')
let hex2rgb = require('hex-rgb')
let img = require('jimp')
let abs = require('path').resolve
let toIco = require('to-ico')
let _ = require('underscore')

// ALert
alert('Icon generation ongoing - please wait ...')

// Define background color
let bg = hex2rgb(env.cfg.iconBackgroundColor).concat(255)

// Define icons (name, width, height, background)
let icons = [
  ['app-store-icon', 1024, 1024, true],
  ['play-store-icon', 512, 512],
  ['apple-touch-icon', 180, 180, true],
  ['favicon', 16, 16],
  ['favicon', 32, 32],
  ['ico', 16, 16],
  ['ico', 32, 32],
  ['ico', 48, 48],
  ['android-chrome', 192, 192],
  ['android-chrome', 512, 512],
  ['mstile', 150, 150],
  ['ios-icon', 180, 180, true],
  ['ios-icon', 167, 167, true],
  ['ios-icon', 152, 152, true],
  ['ios-icon', 144, 144, true],
  ['ios-icon', 120, 120, true],
  ['ios-icon', 114, 114, true],
  ['ios-icon', 100, 100, true],
  ['ios-icon', 87, 87, true],
  ['ios-icon', 76, 76, true],
  ['ios-icon', 72, 72, true],
  ['ios-icon', 80, 80, true],
  ['ios-icon', 58, 58, true],
  ['ios-icon', 57, 57, true],
  ['ios-icon', 50, 50, true],
  ['ios-icon', 40, 40, true],
  ['ios-icon', 29, 29, true],
  ['ios-splash', 2048, 2732, true],
  ['ios-splash', 1536, 2048, true],
  ['ios-splash', 1436, 2048, true],
  ['ios-splash', 1242, 2208, true],
  ['ios-splash', 1080, 1920, true],
  ['ios-splash', 768, 1024, true],
  ['ios-splash', 750, 1334, true],
  ['ios-splash', 640, 1136, true],
  ['ios-splash', 640, 960, true],
  ['ios-splash', 320, 480, true],
  ['android-icon-ldpi', 36, 36],
  ['android-icon-mdpi', 48, 48],
  ['android-icon-hdpi', 72, 72],
  ['android-icon-xhdpi', 96, 96],
  ['android-icon-xxhdpi', 144, 144],
  ['android-icon-xxxhdpi', 192, 192],
  ['android-splash-xhdpi', 720, 1280, true],
  ['android-splash-hdpi', 480, 800, true],
  ['android-splash-mdpi', 320, 480, true],
  ['android-splash-ldpi', 200, 320, true]
]

// Add landscape launch screens
let iconNo = icons.length
for (let i = 0; i < iconNo; i++) {
  icons.push([icons[i][0], icons[i][2], icons[i][1], icons[i][3]])
}

// Set dev as default version
if (env.arg.version === undefined) {
  env.arg.version = 'dev'
}

// Get version parameter
if (/^(([0-9]+)\.([0-9]+)\.([0-9]+)|dev)$/.test(env.arg.version) === false) {
  alert('Given argument --version must be "x.y.z" or "dev".', 'issue')
}

// Remove dev folder
if (env.arg.version === 'dev') {
  fs.removeSync(abs(env.cache, 'icons/dev'))
}

// Icons for version already cached
let versionFolder = abs(env.cache, 'icons', env.arg.version)
if (found(versionFolder)) {
  alert('Icon generation done.', 'exit')
}

// Function to get icon file name
let getIconFilename = function (callback) {
  if (env.arg.version === 'dev' && found(env.app, 'icon.png')) {
    callback(abs(env.app, 'icon.png'))
  } else {
    // Ensure version snapshot cache
    cmd(__dirname, 'node cache-snapshot --name "build-' + env.arg.version + '"', function () {
      let iconFile = abs(env.cache, 'snapshots/build-' + env.arg.version, 'app/icon.png')
      if (found(iconFile)) {
        callback(iconFile)
      } else {
        alert('Icon file not found for version "' + env.arg.version + '".', 'error')
      }
    })
  }
}

// Function to read icon to jimp object
let readIconFile = function (filename, callback) {
  new img(filename, function (err, icon) { // eslint-disable-line
    if (err) {
      alert('Failed to read icon file "' + filename + '"', 'error')
    } else {
      callback(icon)
    }
  })
}

// Function to calculate icon dimensions
let getIconsToCreate = function (icon, callback) {
  let iconsToCreate = []
  // Loop icons
  for (let i = 0; i < icons.length; i++) {
    // Define attributes
    let width = icons[i][1]
    let height = icons[i][2]
    let name = icons[i][0] + '-' + width + 'x' + height + '.png'
    let isFilled = icons[i][3] !== undefined
    // Calculate icon size
    let maxIconWidth = width === height ? width : width / 2
    let maxIconHeight = width === height ? height : height / 2
    let factor = Math.min(maxIconWidth / icon.bitmap.width, maxIconHeight / icon.bitmap.height)
    let iconWidth = Math.floor(factor * icon.bitmap.width)
    let iconHeight = Math.floor(factor * icon.bitmap.height)
    // Calculate icon position
    let left = Math.floor((width - iconWidth) / 2)
    let top = Math.floor((height - iconHeight) / 2)
    // Define icon to create
    iconsToCreate.push({
      name: name,
      canvasWidth: width,
      canvasHeight: height,
      iconWidth: iconWidth,
      iconHeight: iconHeight,
      iconPosLeft: left,
      iconPosTop: top,
      isFilled: isFilled,
      resizeFactor: factor
    })
  }
  // Callback with icons to create
  callback(iconsToCreate)
}

// Create transparent icons
let createTransparentIcons = function (icon, iconList, hashFolder, callback) {
  alert('Transparent icon generation ongoing - please wait ...')
  let thisIcon = iconList.pop()
  // Resize icon
  icon.resize(thisIcon.iconWidth, thisIcon.iconHeight, function (err, icon) {
    if (err) {
      alert('Failed to resize icon "' + thisIcon.name + '".', 'issue')
    } else {
      icon.write(abs(hashFolder, thisIcon.name), function (err) {
        if (err) {
          alert('Failed to save icon "' + thisIcon.name + '".', 'issue')
        } else {
          // Create next icon or finish
          if (iconList.length > 0) {
            createTransparentIcons(icon, iconList, hashFolder, callback)
          // Finish
          } else {
            callback()
          }
        }
      })
    }
  })
}

// Create filled icons
let createFilledIcons = function (icon, iconList, hashFolder, callback) {
  alert('Filled icon generation ongoing - please wait ...')
  let thisIcon = iconList.pop()
  // Create canvas
  new img(thisIcon.canvasWidth, thisIcon.canvasHeight, img.rgbaToInt.apply(null, bg), function (err, canvas) { // eslint-disable-line
    if (err) {
      alert('Failed to create canvas for icon "' + thisIcon.name + '".', 'issue')
    } else {
      // Resize icon
      icon.resize(thisIcon.iconWidth, thisIcon.iconHeight, function (err, icon) {
        if (err) {
          alert('Failed to resize icon "' + thisIcon.name + '".', 'issue')
        } else {
          // Coyp icon to canvas
          canvas.composite(icon, thisIcon.iconPosLeft, thisIcon.iconPosTop, function (err, canvas) {
            if (err) {
              alert('Failed to merge icon "' + thisIcon.name + '" with canvas.', 'issue')
            } else {
              canvas.write(abs(hashFolder, thisIcon.name), function (err) {
                if (err) {
                  alert('Failed to save icon "' + thisIcon.name + '".', 'issue')
                } else {
                  // Create next icon or finish
                  if (iconList.length > 0) {
                    createFilledIcons(icon, iconList, hashFolder, callback)
                  // Finish
                  } else {
                    callback()
                  }
                }
              })
            }
          })
        }
      })
    }
  })
}

// Create special icons
let createIcoFile = function (hashFolder, callback) {
  alert('Favicon.ico creation ongoing - please wait ...')
  // Define including sizes
  let sizes = [16, 32, 48]
  // Load files
  let files = []
  sizes.map(s => {
    let path = abs(hashFolder, 'ico-' + s + 'x' + s + '.png')
    if (!found(path)) {
      alert('Cannot find favicon-' + s + '.png in hash cache folder.', 'issue')
    } else {
      files.push(fs.readFileSync(path))
    }
  })
  // Create ico file
  toIco(files).then(buf => {
    fs.writeFile(abs(hashFolder, 'favicon.ico'), buf, err => {
      if (err) {
        alert('Failed to save favicon.ico to hash cache folder.', 'issue')
      } else {
        alert('Favicon.ico creation done.')
        callback()
      }
    })
  })
}

// Downsize ms tile icons, keep transparency
let downsizeTileIcons = function (hashFolder, iconList, callback) {
  alert('Downsizing tile icons - Please wait ...')
  if (!Array.isArray(iconList) || iconList.length === 0) {
    alert('Downsized tile icons.')
    callback()
  } else {
    let iconFile = iconList.shift().name
    if (/^mstile/.test(iconFile) === true) {
      new img(abs(hashFolder, iconFile), function (err, icon) { // eslint-disable-line
        if (!err) {
          new img(icon.bitmap.width, icon.bitmap.height, function (err, canvas) { // eslint-disable-line
            if (!err) {
              let newWidth = Math.floor(icon.bitmap.width * 0.75)
              let newHeight = Math.floor(icon.bitmap.height * 0.75)
              icon.resize(newWidth, newHeight, function (err, icon) {
                if (!err) {
                  let left = Math.floor((canvas.bitmap.width - newWidth) / 2)
                  let top = Math.floor((canvas.bitmap.height - newHeight) / 2)
                  canvas.composite(icon, left, top, function (err, canvas) {
                    if (!err) {
                      canvas.write(abs(hashFolder, iconFile), function (err) {
                        if (!err) {
                          downsizeTileIcons(hashFolder, iconList, callback)
                        } else {
                          alert('Failed to save tile icon.', 'issue')
                        }
                      })
                    } else {
                      alert('Failed to create tile icon.', 'issue')
                    }
                  })
                } else {
                  alert('Failed to downsize tile icon.', 'issue')
                }
              })
            } else {
              alert('Failed to create tile icon canvas.', 'issue')
            }
          })
        } else {
          alert('Failed to read tile icon.', 'issue')
        }
      })
    } else {
      downsizeTileIcons(hashFolder, iconList, callback)
    }
  }
}

// Cache hash folder
let cacheHashFolder = function (hashFolder, callback) {
  // Copy icons to version cache folder
  fs.copy(hashFolder, versionFolder, function (err) {
    if (err) {
      alert('Failed to cache icons.', 'error')
    } else {
      callback()
    }
  })
}

// Run
alert('Icon generation ongoing - please wait ...')
getIconFilename(function (filename) {
  readIconFile(filename, function (icon) {
    // Icon with same hash already cached
    let hashFolder = abs(env.cache, 'icons', icon.hash())
    if (found(hashFolder)) {
      cacheHashFolder(hashFolder, function () {
        alert('Icon generation done.', 'exit')
      })
    }
    // Generate icons
    getIconsToCreate(icon, function (iconsToCreate) {
      // Group by filled / not filled
      let filled = _.sortBy(_.filter(iconsToCreate, function (i) { return i.isFilled === true }), 'resizeFactor')
      let transparent = _.sortBy(_.filter(iconsToCreate, function (i) { return i.isFilled === false }), 'resizeFactor')
      // Clone icon for filled one
      let iconFilled = icon.clone()
      // Create hash folder
      fs.ensureDirSync(hashFolder)
      // Create icons
      createTransparentIcons(icon, transparent, hashFolder, function () {
        createFilledIcons(iconFilled, filled, hashFolder, function () {
          downsizeTileIcons(hashFolder, iconsToCreate, function () {
            createIcoFile(hashFolder, function () {
              cacheHashFolder(hashFolder, function () {
                alert('Icon generation done.', 'exit')
              })
            })
          })
        })
      })
    })
  })
})
