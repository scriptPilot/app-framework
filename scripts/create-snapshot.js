/*

  Purpose: Create snapshot of current project folder, exclude files specified in .gitignore

  Arguments: --name must be string

*/

'use strict'

// Load modules
let env = require('./env')
let alert = require('./alert')
let found = require('./found')
let fs = require('fs-extra')
let path = require('path')
let zip = require('zip-dir')

// Create no snapshot on initial installation
if (env.pkg.devDependencies &&
    env.pkg.devDependencies['app-framework'] &&
    env.pkg.devDependencies['app-framework'] !== '*') {
  // Alert
  alert('Snapshot creation ongoing - please wait ...')

  // Check snapshot name
  if (env.arg.name === undefined) {
    alert('Snapshot must have argument "name".', 'error')
  } else if (env.arg.name.length < 3) {
    alert('Snapshot name must have three characters or more.', 'error')
  }

  // Check snapshot files
  let snapshotFile = path.resolve(env.proj, 'snapshots', env.arg.name + '.zip')
  if (found(snapshotFile) === true) {
    alert('Snapshot file already exists. Please choose a different name.', 'error')
  }

  // Ensure snapshot folder
  fs.ensureDirSync(path.dirname(snapshotFile))

  // Create snapshot
  zip(env.proj, {
    saveTo: snapshotFile,
    filter: function (path, stat) {
      path = path.substr(env.proj.length + 1)
      return !env.ignored(path) && /^node_modules/.test(path) === false
    }},
  function (err) {
    if (err) {
      alert('Snapshot creation failed.', 'issue')
    } else {
      alert('Snapshot creation done.')
    }
  }
  )
}
