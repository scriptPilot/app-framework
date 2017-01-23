var isThere = require('is-there')

// app-framework is installed as dependency
if (isThere('../../package.json')) {
  
  var saveJSON = require('jsonfile')
  saveJSON.spaces = 2  
  
  var pkg = require('./package.json')
  
  pkg.projectRoot = '/../../'
  pkg.appRoot = '/../../'
  
  saveJSON.writeFileSync('./package.json', pkg)

  var cpx = require('cpx')
  
  if (!isThere('../../images')) {
    cpx.copy('demo-app/images/*', '../../images')
  }
  if (!isThere('../../pages')) {
    cpx.copy('demo-app/pages/*', '../../pages')
  }
  if (!isThere('../../app.vue')) {
    cpx.copy('demo-app/app.vue', '../../')
  }
  if (!isThere('../../.gitignore')) {
    cpx.copy('demo-app/.gitignore', '../../')
  }
  if (!isThere('../../www/.htaccess')) {
    cpx.copy('demo-app/www/.htaccess', '../../www')
  }
  
}