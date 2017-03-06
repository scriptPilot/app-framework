/* Purpose: Fix code, bump version, create build, create snapshot */

'use strict'

// Import modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let webpackConfig = require('../lib/webpack-config').production
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

// Run steps
alert('Build process preparation ongoing - please wait ...')
fixCode(function () {
  buildWebpack(function () {
    alert('Build process done for ' + (mode === 'dev' ? 'development' : 'version ' + version) + '.')
  })
})
