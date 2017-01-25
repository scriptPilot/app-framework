// Load packages
var isThere = require('is-there')
var fs = require('fs')
var replace = require('replace-in-file')
var path = require('path')
var saveJSON = require('jsonfile')
var cpx = require('cpx')
saveJSON.spaces = 2  

// Load configuration
var cfg = require('./config.js')
var pkg = require('./package.json')
var app = require(cfg.appRoot + 'package.json')

// App Framework is installed as dependency
if (cfg.isInstalled) {
  
  // Copy template app.vue and reset version in package.json
  if (!isThere('../../app.vue')) {
    cpx.copySync('demo-app/app.vue', '../../')
    app.version = '0.1.0'
    saveJSON.writeFileSync(cfg.appRoot + 'package.json', app)
  }
  
  // Copy template images
  if (!isThere('../../images')) {
    cpx.copySync('demo-app/images/*', '../../images')
  }
  
  // Copy template pages
  if (!isThere('../../pages')) {
    cpx.copySync('demo-app/pages/*', '../../pages')
  }
  
  // Copy/rename gitignore
  if (!isThere('../../.gitignore')) {
    if (isThere('demo-app/.gitignore')) {
      cpx.copySync('demo-app/.gitignore', '../../')
    } else if (isThere('demo-app/.npmignore')) {
      cpx.copySync('demo-app/.npmignore', '../../')
      fs.renameSync('../../.npmignore', '../../.gitignore')
    }
  }
  
  // Copy .htaccess file, reset version
  if (!isThere('../../www/.htaccess')) {
    cpx.copySync('demo-app/www/.htaccess', '../../www')
    replace.sync({
      files: cfg.appRoot + 'www/.htaccess',
      replace: /\/build-([0-9]+)\.([0-9]+)\.([0-9]+)\//g,
      with: '/build-0.0.0/'
    })
  }
  
}