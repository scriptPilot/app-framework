/* Purpose: Copy snapshot to cache */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let unzip = require('extract-zip')
let fs = require('fs-extra')
let path = require('path')

// Alert
alert('Snapshot cache ongoing - please wait ...')

// Get snapshot name
if (env.arg.name === undefined) {
  alert('Error: Snapshot cache needs name argument.')
}

// Define snapshot cache folder
let cacheFolder = path.resolve(env.cache, 'snapshots/' + env.arg.name)

// Snapshot already cached
if (found(cacheFolder)) {
  alert('Snapshot cache done.', 'exit')
}

// Unzip snapshot
let snapshotFile = path.resolve(env.proj, 'snapshots/' + env.arg.name + '.zip')
if (!found(snapshotFile)) {
  alert('Error: Snapshot file "' + path.relative(env.proj, snapshotFile) + '" not found.')
}
unzip(snapshotFile, {dir: cacheFolder}, function (err) {
  if (err) {
    alert('Error: Snapshot cache failed.', 'issue')
  } else {
    alert('Snapshot cache done.')
  }
})
