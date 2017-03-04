'use strict'

// Load packages
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let cmd = require('../lib/cmd')
let webpack = require('webpack')

// Load webpack configuration
let webpackConfig = require('./webpack.prod.conf')

// Get version parameter
let version = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(env.arg.version) ? env.arg.version : 'dev'
if (env.arg.version !== undefined && env.arg.version !== version) {
  alert('Error: Given version parameter not valid for building the application.')
}

// Run webpack
let runWebpack = function (callback) {
  /*
  alert('Webpack build process ongoing - please wait ...')
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      alert('Error: Webpack build process failed.')
    } else {
      alert('Webpack build done')
      callback()
    }
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
  */
  callback()
}

// Run build process
cmd(__dirname, 'node cache-snapshot --version ' + version, function () {
  cmd(__dirname, 'node create-icons --version' + version, function () {
    runWebpack(function () {
      alert('Build done for version "' + version + '".')
    })
  })
})
