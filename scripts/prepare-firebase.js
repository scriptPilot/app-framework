'use strict'

// Import config
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'config.json')

// Import packages
var found = require('../lib/found')
var read = require('read-file')
var write = require('write')
var copy = require('cpx')
var path = require('path')
var replace = require('replace-in-file')
var fs = require('fs-extra')

// Get build version to be used
var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
var version = htaccess.match(/build-(.+)\//)[1]

// Get Firebase bin folder
let firebaseFolder = path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')

// Create file with standard database rules
if (!found(cfg.appRoot + 'database-rules.json')) {
  write.sync(cfg.appRoot + 'database-rules.json', '{}')
  fs.writeJsonSync(cfg.appRoot + 'database-rules.json', {
    'rules': {
      '.read': 'auth != null',
      '.write': 'auth != null'
    }
  })
}

// Create file with standard storage rules
if (!found(cfg.appRoot + 'storage-rules.txt')) {
  let stdRules = 'service firebase.storage {\n' +
                 '  match /b/' + app.firebase.storageBucket + '/o {\n' +
                 '    match /{allPaths=**} {\n' +
                 '      allow read, write: if request.auth != null;\n' +
                 '    }\n' +
                 '  }\n' +
                 '}\n'
  write.sync(cfg.appRoot + 'storage-rules.txt', stdRules)

// Update storage bucket
} else {
  replace.sync({
    files: cfg.appRoot + 'storage-rules.txt',
    replace: /\/b\/(.+)\/o/,
    with: '/b/' + app.firebase.storageBucket + '/o'
  })
}

// Define Firabase config
let config = {
  database: {
    rules: 'database-rules.json'
  },
  storage: {
    rules: 'storage-rules.txt'
  },
  hosting: {
    'public': 'www'
  }
}

// Write project config
if (!found(firebaseFolder, '.firebaserc')) {
  write.sync(path.resolve(firebaseFolder, '.firebaserc'), '{}')
}
fs.writeJsonSync(path.resolve(firebaseFolder, '.firebaserc'), {
  'projects': {
    'default': app.firebase.authDomain.substr(0, app.firebase.authDomain.indexOf('.firebaseapp.com'))
  }
})

// Copy files
copy.copySync(path.resolve(cfg.appRoot, 'database-rules.json'), firebaseFolder)
copy.copySync(path.resolve(cfg.appRoot, 'storage-rules.txt'), firebaseFolder)
copy.copySync(path.resolve(cfg.appRoot, 'www/build-' + version + '/**/*'), path.resolve(firebaseFolder, 'www'))

// Write Firebase config
fs.writeJsonSync(path.resolve(firebaseFolder, 'firebase.json'), config)

module.exports = {}
