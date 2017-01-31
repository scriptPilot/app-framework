// Import config
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Import packages
var path = require('path')
var isThere = require('is-there')
var write = require('write')
var read = require('read-file')
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
  var firebaseConfig = {}

  // Update hosting
  if (app.firebase.useHostingService === true) {
    var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
    var versionSearch = htaccess.match(/build-(.+)\//)
    firebaseConfig.hosting = {
      'public': 'www/build-' + versionSearch[1]
    }
  }

  // Update database rules
  if (app.firebase.useDatabaseRules === true) {
    firebaseConfig.database = {
      rules: 'databaseRules.json'
    }

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
  throw new Error('Please check your configuration for Firebase hosting')
}

module.exports = {}
