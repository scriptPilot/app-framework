// Import config
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Import packages
var isThere = require('is-there')
var replace = require('replace-in-file')
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

// Create file with standard rules
if (!isThere(cfg.appRoot + 'storage-rules.txt')) {
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

// Write Firebase config
var firebaseConfig = {
  storage: {
    rules: 'storage-rules.txt'
  }
}
saveJSON.writeFileSync(cfg.appRoot + 'firebase.json', firebaseConfig)

module.exports = {}
