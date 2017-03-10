/*

  Purpose with specific arguments:

  --ios to open dev build in iOS emulator
  --android to open dev build in Android emulator
  --xcode to open given version build in Xcode
  --studio to open given version build in Android Studio

  Optionally: --version x.y.z

*/

'use strict'

// Load packages
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')

// Single steps
let buildApp = function (callback) {
  if (env.arg.ios === true || env.arg.android === true) {
    cmd(__dirname, 'node build --dev', function () {
      callback()
    })
  } else {
    callback()
  }
}
let buildCordova = function (callback) {
    // Remove cordova build
}

// Run
buildApp(function () {
  buildCordova(function () {
    alert('Deployment done.')
  })
})
