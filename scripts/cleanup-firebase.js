// Import config
var cfg = require('./config.js')

// Import packages
var isThere = require('is-there')
var deleteFiles = require('delete')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2

// Delete temp files
if (isThere(cfg.appRoot + '.firebaserc')) {
  deleteFiles.sync([cfg.appRoot + '.firebaserc'], {force: true})
}
if (isThere(cfg.appRoot + 'firebase.json')) {
  deleteFiles.sync([cfg.appRoot + 'firebase.json'], {force: true})
}

// Format database backup
if (isThere(cfg.appRoot + 'database-backup.json')) {
  let data = require(cfg.appRoot + 'database-backup.json')
  saveJSON.writeFileSync(cfg.appRoot + 'database-backup.json', data)
}

module.exports = {}
