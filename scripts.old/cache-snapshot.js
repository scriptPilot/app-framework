'use strict'

// Load modules
let env = require('../env')
let found = require('../lib/found')
let alert = require('../lib/alert')
let fs = require('fs-extra')
let abs = require('path').join
let unzip = require('extract-zip')
let cmd = require('../lib/cmd')

// Get version parameter
let version = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(env.arg.version) ? env.arg.version : 'dev'
if (env.arg.version !== undefined && env.arg.version !== version) {
  alert('Error: Given version parameter not valid.')
}

// Define snapshot path
let snapshotFolder = abs(env.cache, 'snapshots', version)

// Delete existing dev snapshot
if (version === 'dev') {
  fs.removeSync(snapshotFolder)
}

// Snapshot already in Cache
if (found(snapshotFolder)) {
  alert('Snapshot preparation done.', 'exit')
}

// Snapshot found as zip file
let snapshotFile = abs(env.proj, 'snapshots/snapshot-' + version + '.zip')
if (found(snapshotFile)) {
  unzip(snapshotFile, {dir: snapshotFolder}, function (err) {
    if (err) alert('Error: Failed to unzip the snapshot folder.')
      else alert('Snapshot preparation done.', 'exit')
  })

// Version same as current version or version = dev
} else if (version === env.pkg.version || version === 'dev') {
  // Create snapshot
  cmd(__dirname, 'node create-snapshot --version ' + version, function () {
    alert('Snapshot preparation done.', 'exit')
  })

// Snapshot not available
} else {
  alert('Error: Snapshot for version "' + version + '" not found.')
}
