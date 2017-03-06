/* Purpose: Fix code, bump version, create build, create snapshot */

'use strict'

// Import modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let webpackConfig = require('../lib/webpack-config').production
let fs = require('fs-extra')
let abs = require('path').resolve
let webpack = require('webpack')

// Define build mode
let mode
if (env.arg.dev === true) {
  mode = 'dev'
} else if (env.arg.patch === true) {
  mode = 'patch'
} else if (env.arg.minor === true) {
  mode = 'minor'
} else if (env.arg.major === true) {
  mode = 'major'
} else {
  alert('Error: Build script must have one argument of dev, patch, minor or major.')
}

// Define version
let version = 'x.y.z'

// Step: Fix code
let fixCode = function (callback) {
  if (env.cfg.fixCodeOnBuild === true) {
    cmd(__dirname, 'node code-check --fix', function () {
      callback()
    })
  } else {
    callback()
  }
}

// Step: Build webpack
let buildWebpack = function (callback) {
  alert('Webpack build process ongoing - please wait ...')
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      alert('Error: Webpack build process failed.', 'issue')
    } else {
      alert('Webpack build process done.')
      callback()
    }
  })
}

// Step: Update license date
let updateLicense = function (callback) {
  if (env.installed === false) {
    alert('License update ongoing - please wait ...')
    let file = abs(env.proj, 'LICENSE')
    let text = fs.readFileSync(file, 'utf8')
    text = text.replace(/Copyright \(c\) ([0-9]{4}) scriptPilot/, 'Copyright (c) ' + (new Date()).getFullYear() + ' scriptPilot')
    fs.writeFileSync(file, text)
    alert('License update done.')
    callback()
  } else {
    callback()
  }
}

// Step: Manage icons
let manageIcons = function (callback) {
  // /tbc
  callback()
}

// Run steps
alert('Build process preparation ongoing - please wait ...')
fixCode(function () {
  updateLicense(function () {
    buildWebpack(function () {
      manageIcons(function () {
        alert('Build process done for ' + (mode === 'dev' ? 'development' : 'version ' + version) + '.')
      })
    })
  })
})
