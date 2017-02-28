// Load modules
var path = require('path')
var abs = require('path').resolve
var found = require('../lib/found')
var merge = require('webpack-merge')
var list = require('list-dir').sync
var _ = require('underscore')
var alert = require('../lib/alert')
var json = require('../lib/json')

// Define installation status and root path
var isInstalled = found(__dirname, '../../../package.json')
var packageRoot = abs(__dirname, '..') + path.sep
var appRoot = isInstalled ? abs(__dirname, '../../../src') + path.sep : abs(__dirname, '../demo/src') + path.sep
var projectRoot = (isInstalled ? abs(__dirname, '../../..') : abs(__dirname, '..')) + path.sep

// Load configuration
var pkg = require(packageRoot + 'package.json')
var app = require(appRoot + 'config.json')

// Check application configuration file
let scheme = abs(packageRoot, 'demo/config-scheme.json')
let config = appRoot + 'config.json'
let check = json.validate(scheme, config)
if (check !== true) alert(check)

// Create string with array of all vue page components
var pageStr = ''
if (found(appRoot + 'pages')) {
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
  APP_ROOT_FROM_SCRIPTS: '"' + (isInstalled ? '../../../' : '../demo/') + '"',
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
