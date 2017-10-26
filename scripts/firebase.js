/*

  Purpose: Deploy database rules, storage rules ans static files to Firebase

  Arguments: --database --storage --hosting

*/

'use strict'

// Include modules
let env = require('./env')
let alert = require('./alert')
let cmd = require('./cmd')
let found = require('./found')
let fs = require('fs-extra')
let join = require('path').join
let abs = require('path').resolve

// Deploy current version by default
if (env.arg.version === undefined) {
  env.arg.version = env.pkg.version
}

// Return if version dev and deployDevRulesOnTesting not true
if (env.arg.version === 'dev' && env.cfg.devFirebase.deployDevRulesOnTesting !== true) {
  alert('Dev-Firebase development deployment not activated in the config.json file.', 'exit')
}

// Define configuration
let cfg = env.arg.version === 'dev' ? env.cfg.devFirebase : env.cfg.firebase

// Get project ID
let projectID = null
if (cfg.projectId !== '') {
  projectID = cfg.projectId
} else if (cfg.authDomain.match(/^(.+)\.firebaseapp\.com$/) !== null) {
  projectID = cfg.authDomain.match(/^(.+)\.firebaseapp\.com$/)[1]
} else if (cfg.databaseURL.match(/^https:\/\/(.+)\.firebaseio\.com$/) !== null) {
  projectID = cfg.databaseURL.match(/^https:\/\/(.+)\.firebaseio\.com$/)[1]
} else if (cfg.storageBucket.match(/^(.+)\.appspot\.com$/) !== null) {
  projectID = cfg.storageBucket.match(/^(.+)\.appspot\.com$/)[1]
}

// Check configuration
if (env.arg.hosting === true && projectID === null) {
  alert((env.arg.version === 'dev' ? 'dev' : '') + 'Firebase configuration must be set for projectId to deploy static files.', 'error')
} else if (env.arg.database === true && cfg.databaseURL === '') {
  alert((env.arg.version === 'dev' ? 'dev' : '') + 'Firebase configuration must be set for databaseURL to deploy database rules.', 'error')
} else if (env.arg.storage === true && cfg.storageBucket === '') {
  alert((env.arg.version === 'dev' ? 'dev' : '') + 'Firebase configuration must be set for storageBucket to deploy storage rules.', 'error')
}

// Run
alert('Firebase deployment ongoing - please wait ...')

// Check arguments
if (env.arg.database !== true && env.arg.storage !== true && env.arg.hosting !== true) {
  alert('No arguments passed to Firebase deployment.', 'issue')
}

// Prepare Firebase deployment
let binFolder = abs(env.proj, 'node_modules/firebase-tools/bin')

// Steps
let defineBuildFolder = function (callback) {
  if (env.arg.hosting !== true && env.arg.version === 'dev') {
    callback(env.app)
  } else {
    cmd(__dirname, 'node cache-version --version ' + env.arg.version, function () {
      let buildFolder = abs(env.cache, 'snapshots/build-' + env.arg.version + '/build')
      if (found(buildFolder)) {
        callback(buildFolder)
      } else {
        alert('Build folder not found in snapshot cache.', 'issue')
      }
    })
  }
}
let checkFolders = function (buildFolder, callback) {
  if (!found(buildFolder)) {
    alert('Build folder not found.', 'error')
  } else if (!found(buildFolder, 'firebase-database.json')) {
    alert('File "firebase-database.json" not found in build folder.', 'error')
  } else if (!found(buildFolder, 'firebase-storage.txt')) {
    alert('File "firebase-storage.txt" not found in build folder.', 'error')
  } else {
    callback()
  }
}
let prepareFiles = (buildFolder, callback) => {
  alert('Firebase deployment preparation ongoing - please wait ...')
  try {
    // Correct storage bucket in database rules
    let rules = fs.readFileSync(abs(buildFolder, 'firebase-storage.txt'), 'utf8')
    rules = rules.replace(/match \/b\/(.+?)\/o {/, 'match /b/' + (cfg.storageBucket !== '' ? cfg.storageBucket : '<your-storage-bucket>') + '/o {')
    fs.writeFileSync(abs(buildFolder, 'firebase-storage.txt'), rules)
    // Reset build folder in firebase
    fs.removeSync(abs(binFolder, 'build'))
    if (env.arg.hosting === true) {
      fs.copy(buildFolder, abs(binFolder, 'build'))
    }
    if (env.arg.hosting !== true && env.arg.database === true) {
      fs.copy(abs(buildFolder, 'firebase-database.json'), abs(binFolder, 'build/firebase-database.json'))
    }
    if (env.arg.hosting !== true && env.arg.storage === true) {
      fs.copy(abs(buildFolder, 'firebase-storage.txt'), abs(binFolder, 'build/firebase-storage.txt'))
    }
    callback()
  } catch (err) {
    alert('Firebase deployment preparation failed.', 'issue')
  }
}
let updateConfigFiles = (callback) => {
  alert('Firebase configuration update ongoing - please wait ...')
  try {
    // Ensure firebase cache folder
    fs.ensureDirSync(abs(binFolder))
    // Create/update .firebaserc file
    let rc = {
      projects: {
        'default': projectID
      }
    }
    fs.writeJsonSync(abs(binFolder, '.firebaserc'), rc)
    // Create/update firebase.json file
    let config = {}
    if (env.arg.database === true) {
      config.database = {
        rules: join('build', 'firebase-database.json')
      }
    }
    if (env.arg.storage === true) {
      config.storage = {
        rules: join('build', 'firebase-storage.txt')
      }
    }
    if (env.arg.hosting === true) {
      config.hosting = {
        public: 'build/www'
      }
    }
    fs.writeJsonSync(abs(binFolder, 'firebase.json'), config)
    // Callback
    callback()
  } catch (err) {
    alert('Firebase configuration update failed.', 'issue')
  }
}
let databaseDeployment = (callback) => {
  if (env.arg.database === true) {
    alert('Firebase database rules deployment ongoing - please wait ...')
    cmd(binFolder, 'firebase deploy --only database', () => {
      alert('Firebase database rules deployment done.')
      callback()
    }, () => {
      alert('Firebase database rules deployment failed.', 'issue')
    })
  } else {
    callback()
  }
}
let storageDeployment = (callback) => {
  if (env.arg.storage === true) {
    alert('Firebase storage rules deployment ongoing - please wait ...')
    cmd(binFolder, 'firebase deploy --only storage', () => {
      alert('Firebase storage rules deployment done.')
      callback()
    }, () => {
      alert('Firebase storage rules deployment failed.', 'issue')
    })
  } else {
    callback()
  }
}
let hostingDeployment = (callback) => {
  if (env.arg.hosting === true) {
    alert('Firebase hosting deployment ongoing - please wait ...')
    cmd(binFolder, 'firebase deploy --only hosting', () => {
      alert('Firebase hosting deployment done.')
      callback()
    }, () => {
      alert('Firebase hosting deployment failed.', 'issue')
    })
  } else {
    callback()
  }
}

// Run
defineBuildFolder(function (buildFolder) {
  checkFolders(buildFolder, function () {
    cmd(binFolder, 'firebase login', () => {
      prepareFiles(buildFolder, function () {
        updateConfigFiles(() => {
          databaseDeployment(() => {
            storageDeployment(() => {
              hostingDeployment(() => {
                alert('Firebase deployment done for version ' + env.arg.version + '.')
              })
            })
          })
        })
      })
    })
  })
})
