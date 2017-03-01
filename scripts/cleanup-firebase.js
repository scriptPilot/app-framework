'use strict'

// Import config
var cfg = require('./config.js')

// Import packages
var found = require('../lib/found')
var deleteFiles = require('delete')
var path = require('path')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Get Firebase bin folder
let firebaseFolder = path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')

// Delete temp files
if (found(firebaseFolder, '.firebaserc')) {
  deleteFiles.sync([path.resolve(firebaseFolder, '.firebaserc')], {force: true})
}
if (found(firebaseFolder, 'firebase.json')) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'firebase.json')], {force: true})
}
if (found(firebaseFolder, 'database-rules.json')) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'database-rules.json')], {force: true})
}
if (found(firebaseFolder, 'storage-rules.txt')) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'storage-rules.txt')], {force: true})
}
if (found(firebaseFolder, 'www')) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'www/**/*'), path.resolve(firebaseFolder, 'www')], {force: true})
}

module.exports = {}
