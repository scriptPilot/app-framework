// Import config
var cfg = require('../config.js')
var app = require(cfg.appRoot + 'package.json')

// Import packages
var isThere = require('is-there')
var write = require('write')
var saveJSON = require('jsonfile')
var deleteFiles = require('delete')
saveJSON.spaces = 2

// Update Firebase tool configuration
if (app.firebase.useHostingService === true || app.firebase.useDatabaseRules === true) {
  // Write project config
  if (!isThere(cfg.appRoot + '.firebaserc')) {
    write.sync(cfg.appRoot + '.firebaserc', '{}')
  }
  saveJSON.writeFileSync(cfg.appRoot + '.firebaserc', {
    'projects': {
      'default': app.firebase.authDomain.substr(0, app.firebase.authDomain.indexOf('.firebaseapp.com'))
    }
  })

  // Create firebase config object
  let firebaseConfig = {}

  // Update hosting
  if (app.firebase.useHostingService === true) {
    firebaseConfig.hosting = {
      'public': 'www/build-' + app.version
    }
  }

  // Update database rules
  if (app.firebase.useDatabaseRules === true) {
    firebaseConfig.database = {
      rules: 'firebaseDatabaseRules.json'
    }

    // Create file with standard rules
    if (!isThere(cfg.appRoot + 'firebaseDatabaseRules.json')) {
      write.sync(cfg.appRoot + 'firebaseDatabaseRules.json', '{}')
      saveJSON.writeFileSync(cfg.appRoot + 'firebaseDatabaseRules.json', {
        'rules': {
          '.read': 'auth != null',
          '.write': 'auth != null'
        }
      })
    }
  }

  // Save config
  saveJSON.writeFileSync(cfg.appRoot + 'firebase.json', firebaseConfig)

// Delete Firebase tool configuration
} else {
  if (isThere(cfg.appRoot + 'firebase.json')) {
    deleteFiles.sync([cfg.appRoot + 'firebase.json'], {force: true})
  }
  if (isThere(cfg.appRoot + '.firebaserc')) {
    deleteFiles.sync([cfg.appRoot + '.firebaserc'], {force: true})
  }
}

module.exports = {}
