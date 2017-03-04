'use strict'

// Import config
var cfg = require('./config.js')

// Import packages
var found = require('../lib/found')
var path = require('path')
var fs = require('fs-extra')

// Get Firebase bin folder
let firebaseFolder = path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')

// Delete temp files
if (found(firebaseFolder, '.firebaserc')) {
  fs.remove(path.resolve(firebaseFolder, '.firebaserc'))
}
if (found(firebaseFolder, 'firebase.json')) {
  fs.remove(path.resolve(firebaseFolder, 'firebase.json'))
}
if (found(firebaseFolder, 'database-rules.json')) {
  fs.remove(path.resolve(firebaseFolder, 'database-rules.json'))
}
if (found(firebaseFolder, 'storage-rules.txt')) {
  fs.remove(path.resolve(firebaseFolder, 'storage-rules.txt'))
}
if (found(firebaseFolder, 'www')) {
  fs.remove(path.resolve(firebaseFolder, 'www/**/*'))
  fs.remove(path.resolve(firebaseFolder, 'www'))
}

module.exports = {}
