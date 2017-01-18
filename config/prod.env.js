var pkg = require('../package.json')
var app = require('..' + pkg.appRoot + 'package.json')
var isThere = require('is-there')

module.exports = {
  NODE_ENV: '"production"',
  THEME: '"' + app.theme + '"',
  ROOT_APP: '"' + (isThere('../../../package.json') ? '../../' : './demo-app/') + '"',
  ROOT_PROJECT: '"' + (isThere('../../../package.json') ? '../../' : './') + '"',
  FONT_FRAMEWORK7: '"' + app.loadIconFonts.framework7 + '"',
  FONT_MATERIAL: '"' + app.loadIconFonts.material + '"',
  FONT_ION: '"' + app.loadIconFonts.ion + '"',
  FONT_AWESOME: '"' + app.loadIconFonts.fontawesome + '"',
  USE_FIREBASE: '"' + app.useFirebase + '"'
}
