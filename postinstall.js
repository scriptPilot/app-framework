var isThere = require('is-there')
var fs = require('fs')
var replace = require('replace-in-file')
var path = require('path')

// app-framework is installed as dependency
if (isThere('../../package.json')) {
  
  var saveJSON = require('jsonfile')
  saveJSON.spaces = 2  
  
  var pkg = require('./package.json')
  
  pkg.projectRoot = '/../../'
  pkg.appRoot = '/../../'
  
  var app = require('../../package.json')
  
  saveJSON.writeFileSync('./package.json', pkg)

  var cpx = require('cpx')
  
  if (!isThere('../../images')) {
    cpx.copySync('demo-app/images/*', '../../images')
  }
  if (!isThere('../../pages')) {
    cpx.copySync('demo-app/pages/*', '../../pages')
  }
  if (!isThere('../../app.vue')) {
    cpx.copySync('demo-app/app.vue', '../../')
  }
  if (!isThere('../../.gitignore')) {
    if (isThere('demo-app/.gitignore')) {
      cpx.copySync('demo-app/.gitignore', '../../')
    } else if (isThere('demo-app/.npmignore')) {
      cpx.copySync('demo-app/.npmignore', '../../', function () {
        fs.renameSync('../../.npmignore', '../../.gitignore')
      })
    }
  }
  if (!isThere('../../www/.htaccess')) {
    cpx.copySync('demo-app/www/.htaccess', '../../www')
    replace.sync({
      files: path.resolve('../../www/.htaccess'),
      replace: /\/build-(.+)\//,
      with: '/build-' + app.version + '/'
    })
  }
  
}