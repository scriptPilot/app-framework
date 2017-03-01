'use strict'

// Include packages
let env = require('../env')
let alert = require('../lib/alert')
let hex2rgb = require('hex-rgb')
let img = require('jimp')
let found = require('../lib/found')
let abs = require('path').resolve
let fs = require('fs-extra')

// ALert
alert('Icon generation ongoing - please wait ...')

// Define background color
let bg = hex2rgb(env.cfg.iconBackgroundColor).concat(255)

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

// Get version parameter
let version = /^(--|-)(version|v)$/.test(process.argv[2]) && /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(process.argv[3]) ? process.argv[3] : 'dev'

// Delete dev cache folder
fs.remove(abs(env.cache, 'icons/dev'))

// Define icon file
let iconFile = abs(env.app, 'icon.png')

// Function to create icons
let createIcons = function (icon, dest, callback) {
  fs.ensureDirSync(dest)
  icon.write(abs(dest, 'icon.png'), function (err) {
    if (err) alert('Error: Failed to write icons to cache.')
    callback()
  })
}

// Function to copy hash cache to version cache
let copyCache = function (hash) {
  fs.copy(abs(env.cache, 'icons', hash), abs(env.cache, 'icons', version), function (err) {
    if (err) alert('Error: Failed to cache icons.')
      else alert('Icon generation done.', 'exit')
  })
}

// Check version cache folder
if (found(env.cache, 'icons', version)) {
  alert('Icon generation done.', 'exit')
} else {
  // Open icon file
  img.read(iconFile, function (err, icon) {
    if (err) alert('Error: Failed to read icon file.')
    // Check hash cache folder
    let hash = icon.hash()
    let hashCacheFolder = abs(env.cache, 'icons', hash)
    // Icon cached
    if (found(hashCacheFolder)) {
      copyCache(hash)
    // Icons not cached
    } else {
      // Create icons
      createIcons(icon, hashCacheFolder, function () {
        copyCache(hash)
      })
    }
  })
}
