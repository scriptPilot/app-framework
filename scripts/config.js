// Load modules
var path = require('path')
var abs = require('path').resolve
var found = require('../lib/found')
var merge = require('webpack-merge')
var list = require('list-dir').sync
var _ = require('underscore')
var alert = require('../lib/alert')

// Define installation status and root path
var isInstalled = found(__dirname, '../../../package.json')
var packageRoot = abs(__dirname, '..') + path.sep
var src = isInstalled ? abs('../../../src') + path.sep : abs('../demo-app/src') + path.sep
var projectRoot = (isInstalled ? abs(__dirname, '../../..') : abs(__dirname, '..')) + path.sep
var appRoot = (isInstalled ? abs(__dirname, '../../..') : abs(__dirname, '../demo-app')) + path.sep

// Load configuration
var pkg = require(packageRoot + 'package.json')
var app = require(src + 'config.json')

// Check application configuration file
var io = function (el) {
  if (!_.isObject(app[el])) {
    alert('Error in package.json: Element "' + el + '" must be an object.')
    throw new Error()
  }
}
var ia = function (el) {
  if (!_.isArray(app[el])) {
    alert('Error in package.json: Element "' + el + '" must be an array.')
    throw new Error()
  }
}
var is = function (el) {
  if (!_.isString(app[el])) {
    alert('Error in package.json: Element "' + el + '" must be a string.')
    throw new Error()
  }
}
var ib = function (el) {
  if (!_.isBoolean(app[el])) {
    alert('Error in package.json: Element "' + el + '" must be true or false.')
    throw new Error()
  }
}
is('title')
is('theme')
if (app.theme !== 'ios' && app.theme !== 'material') alert('Error in package.json: Theme must be "ios" or "material".')
is('iconBackgroundColor')
if (app.statusbarTextColor !== 'white')
is('defaultLanguage')
ib('showPhoneFrameOnDesktop')
ia('useCordovaPlugins')
ib('resetLocalStorageOnVersionChange')
io('specialRoutes')
ia('pagesWithRequiredLogin')
io('firebase')
io('loadIconFonts')
is('iconImage')
ib('buildSourcemaps')

// Create string with array of all vue page components
var pageStr = ''
if (isThere(appRoot + 'pages')) {
  var pageFiles = list(appRoot + 'pages')
  for (var p = 0; p < pageFiles.length; p++) {
    if (pageFiles[p].substr(pageFiles[p].length - 4, 4) === '.vue') {
      pageFiles[p] = pageFiles[p].replace(/\\/g, '/')
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
