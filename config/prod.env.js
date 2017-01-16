var pkg = require('../package.json')
var app = require('..' + pkg.appRoot + 'package.json')
var isThere = require('is-there')

module.exports = {
  NODE_ENV: '"production"',
  ROOT_APP: '"' + (isThere('../../../package.json') ? '../../' : './demo-app/') + '"',
  FONT_FRAMEWORK7: '"' + app.loadIconFonts.framework7 + '"',
  FONT_MATERIAL: '"' + app.loadIconFonts.material + '"',
  FONT_ION: '"' + app.loadIconFonts.ion + '"',
  FONT_AWESOME: '"' + app.loadIconFonts.fontawesome + '"'
}
