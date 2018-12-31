/* Purpose: Creates snapshot with current day as name, increase with character in case there are more than one snapshots per day */

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let cmd = require('./cmd')
let found = require('./found')
let fs = require('fs-extra')
let abs = require('path').resolve

// Define filename
let now = new Date()
let name = 'snapshot-' + now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()

// Define filename and create snapshot
let createSnapshot = function (name, char) {
  // Start empty
  char = char || ''
  // Check if file exists
  if (char !== '' && char > 122) {
    alert('More than ' + (char - 97) + ' snapshots per day are not supported.', 'error')
  } else if (!found(env.proj, 'snapshots', name + (char === '' ? '' : String.fromCharCode(char)) + '.zip') && (char !== '' || !found(env.proj, 'snapshots', name + 'a.zip'))) {
    // Extend first one with a
    if (char === 98) {
      fs.renameSync(abs(env.proj, 'snapshots', name + '.zip'), abs(env.proj, 'snapshots', name + 'a.zip'))
    }
    name = name + (char === '' ? '' : String.fromCharCode(char))
    // Create snapshot
    cmd(__dirname, 'node create-snapshot --name ' + name)
  } else {
    return createSnapshot(name, char === '' ? 98 : char + 1)
  }
}
createSnapshot(name)
