var isThere = require('is-there')

// app-framework is installed as dependency
if (isThere('../../package.json')) {
  
  var saveJSON = require('jsonfile')
  saveJSON.spaces = 2  
  var pkg = require('./package.json')
  pkg.projectPath = '../../'
  pkg.appPath = '../../'
  saveJSON.writeFileSync('./package.json', pkg)

  var cpx = require('cpx')
  if (!isThere('../../images')) {
    cpx.copy('hello-world-app/images/*', '../../images')
  }
  if (!isThere('../../pages')) {
    cpx.copy('hello-world-app/pages/*', '../../pages')
  }
  if (!isThere('../../app.vue')) {
    cpx.copy('hello-world-app/app.vue', '../../')
  }
  if (!isThere('../../index.ejs')) {
    cpx.copy('hello-world-app/index.ejs', '../../')
  }
  
}