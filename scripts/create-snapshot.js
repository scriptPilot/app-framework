/* Create snapshot of current project folder, exclude files specified in .gitignore */

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let fs = require('fs-extra')
let path = require('path')
let zip = require('zip-dir')

// Alert
alert('Snapshot creation ongoing - please wait ...')

// Check snapshot name
if (env.arg.name === undefined) {
  alert('Error: Snapshot must have argument "name".')
} else if (env.arg.name.length < 3) {
  alert('Error: Snapshot name must have three characters or more.')
}

// Check snapshot files
let snapshotFile = path.resolve(env.proj, 'snapshots', env.arg.name + '.zip')
if (found(snapshotFile) === true) {
  alert('Error: Snapshot file already exists. Please choose a different name.')
}

// Ensure snapshot folder
fs.ensureDirSync(path.dirname(snapshotFile))

// Create snapshot
zip(env.proj, {
  saveTo: snapshotFile,
  filter: function (path, stat) {
    path = path.substr(env.proj.length + 1)
    return !env.ignored(path)
  }},
  function (err) {
    if (err) {
      alert('Error: Snapshot creation failed.', 'issue')
    } else {
      alert('Snapshot creation done.')
    }
  }
)
