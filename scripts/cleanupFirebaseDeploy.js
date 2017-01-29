// Import config
var cfg = require('./config.js')

// Import packages
var isThere = require('is-there')
var deleteFiles = require('delete')

if (isThere(cfg.appRoot + '.firebaserc')) {
  deleteFiles.sync([cfg.appRoot + '.firebaserc'], {force: true})
}
if (isThere(cfg.appRoot + 'firebase.json')) {
  deleteFiles.sync([cfg.appRoot + 'firebase.json'], {force: true})
}

module.exports = {}
