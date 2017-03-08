/*

  Purpose: Deploy database rules, storage rules ans static files to Firebase

  Arguments: --database --storage --hosting

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let found = require('../lib/found')
let fs = require('fs-extra')
let abs = require('path').resolve

// Check arguments
if (env.arg.database !== true && env.arg.storage !== true && env.arg.hosting !== true) {
  alert('Error: No arguments passed to Firebase deployment.', 'issue')
}

// Prepare Firebase deployment
let cacheFolder = abs(env.cache, 'firebase')
let buildFolder = abs(env.proj, 'build')

// Check folders
if (!found(buildFolder)) {
  alert('Error: Build folder not found.')
} else if (!found(buildFolder, 'database-rules.json')) {
  alert('Error: File "database-rules.json" not found in build folder.')
} else if (!found(buildFolder, 'storage-rules.txt')) {
  alert('Error: File "storage-rules.txt" not found in build folder.')
}

// Step: Create firebase.json file
let config = {
  projects: {
    'default': env.cfg.firebase.authDomain.substr(0, env.cfg.firebase.authDomain.indexOf('.firebaseapp.com'))
  }
}
fs.writeJsonSync(abs(cacheFolder, 'firebase.json'), config)

// Run
alert('Firebase deployment ongoing - please wait ...')
