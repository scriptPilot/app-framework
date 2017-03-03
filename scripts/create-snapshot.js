'use strict'

/*


REWORK :::: ONLY CREATION; NOT CACHEING !!!

*/

// Load modules
let env = require('../env')
let found = require('../lib/found')
let alert = require('../lib/alert')
let fs = require('fs-extra')
let abs = require('path').join
let zip = require('zip-dir')
let cmd = require('../lib/cmd')

// Get version parameter
let version = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(env.arg.version) ? env.arg.version : 'dev'
if (env.arg.version !== undefined && env.arg.version !== version) {
  alert('Error: Given version parameter not valid.')
}

// Check version
if (version !== env.pkg.version && version !== 'dev') {
  alert('Error: Given version should be current version or dev.')
}

// Define snapshot path
let snapshotFolder = abs(env.cache, 'snapshots', version)

// Delete existing dev snapshot
if (version === 'dev') {
  fs.removeSync(snapshotFolder)
}

// Snapshot already exists
if (found(snapshotFolder)) {
  alert('Snapshot creation done.', 'exit')
}

// Snapshot file already exists
if (found(snapshotFile)) {
  // todo ... extract to cache
  alert('Snapshot creation done', 'exit')

// Create snapshot
} else {
  zip(env.proj, {saveTo: snapshotFile, filter: function (path, stats) {
    path = path.substr(env.proj.length + 1)
    return /^node_modules/.test(path) === false &&
           /^snapshots/.test(path) === false
  }}, function (err) {
    if (err) alert('Error: Snapshot creation failed.')
    // todo ... copy to cache
    alert('Snapshot creation done', 'exit')
  })
}
