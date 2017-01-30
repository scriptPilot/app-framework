// Load packages
var path = require('path')
var isThere = require('is-there')
var merge = require('webpack-merge')

// Define installation status and root path
var isInstalled = isThere(path.resolve(__dirname, '../../../package.json'))
var packageRoot = path.resolve(__dirname, '..') + path.sep
var projectRoot = (isInstalled ? path.resolve(__dirname, '../../..') : path.resolve(__dirname, '..')) + path.sep
var appRoot = (isInstalled ? path.resolve(__dirname, '../../..') : path.resolve(__dirname, '../demo-app')) + path.sep

// Load application configuration
var pkg = require(packageRoot + 'package.json')
var app = require(appRoot + 'package.json')

// Create webpack environment variables
var env = {
  THEME: '"' + app.theme + '"',
  FRAMEWORK_VERSION: '"' + pkg.version + '"',
  APP_ROOT_FROM_SCRIPTS: '"' + (isInstalled ? '../../../' : '../demo-app/') + '"',
  FONT_FRAMEWORK7: '"' + app.loadIconFonts.framework7 + '"',
  FONT_MATERIAL: '"' + app.loadIconFonts.material + '"',
  FONT_ION: '"' + app.loadIconFonts.ion + '"',
  FONT_AWESOME: '"' + app.loadIconFonts.fontawesome + '"',
  USE_FIREBASE: '"' + (app.firebase.useDatabaseService === true || app.firebase.useStorageService === true) + '"',
  RESET_LOCAL_STORAGE: '"' + app.resetLocalStorageOnVersionChange + '"'
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
  packageRoot: packageRoot,
  projectRoot: projectRoot,
  appRoot: appRoot
}
