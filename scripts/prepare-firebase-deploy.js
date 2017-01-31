// Import config
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Import packages
var path = require('path')
var isThere = require('is-there')
var write = require('write')
var read = require('read-file')
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

// Get build version to be used
var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
var versionSearch = htaccess.match(/build-(.+)\//)

// Write Firebase config
var firebaseConfig = {
  hosting: {
    'public': 'www/build-' + versionSearch[1]
  }
}
saveJSON.writeFileSync(cfg.appRoot + 'firebase.json', firebaseConfig)

module.exports = {}
