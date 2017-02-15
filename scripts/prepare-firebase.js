// Import config
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Import packages
var isThere = require('is-there')
var write = require('write')
var path = require('path')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Get Firebase bin folder
let firebaseFolder = path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')

// Write project config
if (!isThere(path.resolve(firebaseFolder, '.firebaserc'))) {
  write.sync(path.resolve(firebaseFolder, '.firebaserc'), '{}')
}
saveJSON.writeFileSync(path.resolve(firebaseFolder, '.firebaserc'), {
  'projects': {
    'default': app.firebase.authDomain.substr(0, app.firebase.authDomain.indexOf('.firebaseapp.com'))
  }
})

// Write Firebase config
saveJSON.writeFileSync(path.resolve(firebaseFolder, 'firebase.json'), {})

module.exports = {}
