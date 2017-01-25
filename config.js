// Load packages
var path = require('path')
var isThere = require('is-there')
var merge = require('webpack-merge')

// Define installation status and root path
var isInstalled = isThere('../../package.json')
var appRoot = (isInstalled ? path.resolve(__dirname, '../../') : path.resolve(__dirname, 'demo-app/')) + path.sep
var projectRoot = (isInstalled ? path.resolve(__dirname, '../../') : path.resolve(__dirname)) + path.sep

// Load application configuration
var app = require(appRoot + 'package.json')

// Create webpack environment variables
var env = {
  THEME: '"' + app.theme + '"',
  appRoot: '"' + (isThere('../../package.json') ? '../../' : './demo-app/') + '"',
  FONT_FRAMEWORK7: '"' + app.loadIconFonts.framework7 + '"',
  FONT_MATERIAL: '"' + app.loadIconFonts.material + '"',
  FONT_ION: '"' + app.loadIconFonts.ion + '"',
  FONT_AWESOME: '"' + app.loadIconFonts.fontawesome + '"',
  USE_FIREBASE: '"' + (app.firebase.useDatabaseService === true || app.firebase.useStorageService === true) + '"'
}

// Export configuration
module.exports = {
  build: {
    env: merge(env, {NODE_ENV: '"production"'}),
    assetsSubDirectory: '',
    assetsPublicPath: '',
    productionSourceMap: app.buildSourcemaps === true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: merge(env, {NODE_ENV: '"development"'}),
    port: 8080,
    assetsSubDirectory: '',
    assetsPublicPath: '',
    proxyTable: {},
    cssSourceMap: false
  },
  isInstalled: isInstalled,
  projectRoot: projectRoot,
  appRoot: appRoot
}