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

// Create file with standard rules
if (!isThere(cfg.appRoot + 'databaseRules.json')) {
  write.sync(cfg.appRoot + 'databaseRules.json', '{}')
  saveJSON.writeFileSync(cfg.appRoot + 'databaseRules.json', {
    'rules': {
      '.read': 'auth != null',
      '.write': 'auth != null'
    }
  })
}

// Write Firebase config
var firebaseConfig = {
  database: {
    rules: 'databaseRules.json'
  }
}
saveJSON.writeFileSync(cfg.appRoot + 'firebase.json', firebaseConfig)

module.exports = {}