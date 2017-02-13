// Load packages
var path = require('path')
var isThere = require('is-there')
var merge = require('webpack-merge')
var list = require('list-dir').sync
var _ = require('underscore')
var showOnly = require('./show-only')

// Define installation status and root path
var isInstalled = isThere(path.resolve(__dirname, '../../../package.json'))
var packageRoot = path.resolve(__dirname, '..') + path.sep
var projectRoot = (isInstalled ? path.resolve(__dirname, '../../..') : path.resolve(__dirname, '..')) + path.sep
var appRoot = (isInstalled ? path.resolve(__dirname, '../../..') : path.resolve(__dirname, '../demo-app')) + path.sep
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Load application configuration
var pkg = require(packageRoot + 'package.json')
var app = require(appRoot + 'package.json')
var demoApp = require(path.resolve(packageRoot, 'demo-app/package.json'))

// Apply changes to configuration file (necessary after updates)

  // (Regulary) update of scripts
app.scripts = demoApp.scripts

  // New items
app.iconImage = app.iconImage || demoApp.iconImage
app.iconBackgroundColor = app.iconBackgroundColor || demoApp.iconBackgroundColor
app.materialSubnavbarFix = app.materialSubnavbarFix || demoApp.materialSubnavbarFix
app.useCordovaPlugins = app.useCordovaPlugins || demoApp.useCordovaPlugins
app.firebase = app.firebase || demoApp.firebase
app.statusbarTextColor = app.statusbarTextColor || demoApp.statusbarTextColor
app.appStoreId = app.appStoreId || demoApp.appStoreId
app.playStoreId = app.playStoreId || demoApp.playStoreId

  // Removed items
if (app.faviconIcon) delete app.faviconIcon
if (app.faviconBackgroundColor) delete app.faviconBackgroundColor
if (app.firebase.useDatabaseService) delete app.firebase.useDatabaseService
if (app.firebase.useStorageService) delete app.firebase.useStorageService

  // Update app config file
saveJSON.writeFileSync(appRoot + 'package.json', app)

// Check application configuration file
var io = function (el) {
  if (!_.isObject(app[el])) {
    showOnly('Error in package.json: Element "' + el + '" must be an object.')
    throw new Error()
  }
}
var ia = function (el) {
  if (!_.isArray(app[el])) {
    showOnly('Error in package.json: Element "' + el + '" must be an array.')
    throw new Error()
  }
}
var is = function (el) {
  if (!_.isString(app[el])) {
    showOnly('Error in package.json: Element "' + el + '" must be a string.')
    throw new Error()
  }
}
var ib = function (el) {
  if (!_.isBoolean(app[el])) {
    showOnly('Error in package.json: Element "' + el + '" must be true or false.')
    throw new Error()
  }
}
is('name')
is('version')
io('scripts')
io('devDependencies')
is('title')
is('theme')
is('defaultLanguage')
ib('showPhoneFrameOnDesktop')
ia('useCordovaPlugins')
ib('resetLocalStorageOnVersionChange')
ia('specialRoutes')
ia('pagesWithRequiredLogin')
io('firebase')
io('loadIconFonts')
is('iconImage')
is('iconBackgroundColor')
ib('buildSourcemaps')
if (app.theme !== 'ios' && app.theme !== 'material') showOnly('Error in package.json: Theme must be "ios" or "material".')

// Create string with array of all vue page components
var pageStr = ''
if (isThere(appRoot + 'pages')) {
  var pageFiles = list(appRoot + 'pages')
  for (var p = 0; p < pageFiles.length; p++) {
    if (pageFiles[p].substr(pageFiles[p].length - 4, 4) === '.vue') {
      if (p > 0) {
        pageStr += ','
      }
      pageStr += pageFiles[p].substr(0, pageFiles[p].length - 4)
    }
  }
}

// Create webpack environment variables
var env = {
  THEME: '"' + app.theme + '"',
  FRAMEWORK_VERSION: '"' + pkg.version + '"',
  APP_ROOT_FROM_SCRIPTS: '"' + (isInstalled ? '../../../' : '../demo-app/') + '"',
  FONT_FRAMEWORK7: '"' + app.loadIconFonts.framework7 + '"',
  FONT_MATERIAL: '"' + app.loadIconFonts.material + '"',
  FONT_ION: '"' + app.loadIconFonts.ion + '"',
  FONT_AWESOME: '"' + app.loadIconFonts.fontawesome + '"',
  RESET_LOCAL_STORAGE: '"' + app.resetLocalStorageOnVersionChange + '"',
  PAGES: '"' + pageStr + '"'
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
