// Import config
var cfg = require('./config.js')

// Import packages
var isThere = require('is-there')
var deleteFiles = require('delete')
var path = require('path')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Get Firebase bin folder
let firebaseFolder = path.resolve(cfg.projectRoot, 'node_modules/firebase-tools/bin')

// Delete temp files
if (isThere(path.resolve(firebaseFolder, '.firebaserc'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, '.firebaserc')], {force: true})
}
if (isThere(path.resolve(firebaseFolder, 'firebase.json'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'firebase.json')], {force: true})
}

module.exports = {}
