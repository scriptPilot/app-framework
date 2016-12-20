var cpx = require('cpx')
var isThere = require('is-there')
var json = require('jsonfile')
json.spaces = 2

var pkg = require('./package.json')

if (isThere('../../package.json')) {
  
  //pkg.projectPath = '../../';
  pkg.appPath = '../../';
  
  json.writeFileSync('./package.json', pkg);

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