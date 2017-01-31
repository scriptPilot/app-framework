// Import config
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Import packages
var isThere = require('is-there')
var write = require('write')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Write project config
if (!isThere(cfg.appRoot + '.firebaserc')) {
  write.sync(cfg.appRoot + '.firebaserc', '{}')
}
saveJSON.writeFileSync(cfg.appRoot + '.firebaserc', {
  'projects': {
    'default': app.firebase.authDomain.substr(0, app.firebase.authDomain.indexOf('.firebaseapp.com'))
  }
})

// Write Firebase config
saveJSON.writeFileSync(cfg.appRoot + 'firebase.json', {})

module.exports = {}
