// Load configuration
var cfg = require('./config.js')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Update required app framework version
if (!cfg.isInstalled) {
  var pkg = require(cfg.packageRoot + 'package.json')
  var app = require(cfg.appRoot + 'package.json')
  app.devDependencies['app-framework'] = '^' + pkg.version
  saveJSON.writeFileSync(cfg.appRoot + 'package.json', app)
  console.log('Required App Framework version updated')
}
