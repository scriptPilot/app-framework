/*

  Purpose: Create snapshots of the Firebase database and user list.

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let fs = require('fs-extra')
let abs = require('path').resolve

// Define Firebase bin folder
let binFolder = abs(env.proj, 'node_modules/firebase-tools/bin')

// Define filename
let now = new Date()
let dateStr = now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()

// Steps
let prepareFirebase = function (callback) {
  alert('Preparing Firebase - please wait ...')
  try {
    // Create/update .firebaserc file
    let rc = {
      projects: {
        'default': env.cfg.firebase.authDomain.substr(0, env.cfg.firebase.authDomain.indexOf('.firebaseapp.com'))
      }
    }
    fs.writeJsonSync(abs(binFolder, '.firebaserc'), rc)
    callback()
  } catch (err) {
    alert('Firebase preparation failed.', 'issue')
  }
}

// Run
alert('Firebase backup ongoing - please wait ...')
prepareFirebase(function () {
  cmd(binFolder, 'firebase login', function () {
    alert('Firebase database backup ongoing - please wait ...')
    cmd(binFolder, 'firebase database:get / >"' + abs(env.proj, 'snapshots/firebase-database-' + dateStr + '.json') + '"', function () {
      alert('Firebase user backup ongoing - please wait ...')
      cmd(binFolder, 'firebase auth:export "' + abs(env.proj, 'snapshots/firebase-users-' + dateStr + '.json') + '" --format=json', function () {
        alert('Firebase backup done.')
      }, 'Firebase user backup failed.')
    }, 'Firebase database backup failed.')
  }, 'Firebase login failed.')
})
