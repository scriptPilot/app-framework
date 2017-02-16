// Import config
var cfg = require('./config.js')

// Import packages
var isThere = require('is-there')
var deleteFiles = require('delete')
var path = require('path')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Get Firebase bin folder
let firebaseFolder = path.resolve(cfg.projectRoot, 'node_modules/.bin')

// Delete temp files
if (isThere(path.resolve(firebaseFolder, '.firebaserc'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, '.firebaserc')], {force: true})
}
if (isThere(path.resolve(firebaseFolder, 'firebase.json'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'firebase.json')], {force: true})
}
if (isThere(path.resolve(firebaseFolder, 'database-rules.json'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'database-rules.json')], {force: true})
}
if (isThere(path.resolve(firebaseFolder, 'storage-rules.txt'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'storage-rules.txt')], {force: true})
}
if (isThere(path.resolve(firebaseFolder, 'www'))) {
  deleteFiles.sync([path.resolve(firebaseFolder, 'www/**/*'), path.resolve(firebaseFolder, 'www')], {force: true})
}

module.exports = {}
