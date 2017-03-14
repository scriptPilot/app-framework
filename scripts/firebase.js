/*

  Purpose: Deploy database rules, storage rules ans static files to Firebase

  Arguments: --database --storage --hosting

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let fs = require('fs-extra')
let join = require('path').join
let abs = require('path').resolve

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
  if (env.arg.version === undefined) {
    let buildFolder = abs(env.proj, 'build')
    if (found(buildFolder)) {
      callback(buildFolder)
    } else {
      alert('Please build your application first with "npm run patch/minor/major".')
    }
  } else if (/^(([0-9]+)\.([0-9]+)\.([0-9]+))$/.test(env.arg.version) === true) {
    // tbc
    console.log(env.arg.version)
    process.exit()
  } else {
    alert('Version argument must be "dev" or "x.y.z".')
  }
}
let checkFolders = function (buildFolder, callback) {
  if (!found(buildFolder)) {
    alert('Build folder not found.', 'error')
  } else if (!found(buildFolder, 'database-rules.json')) {
    alert('File "database-rules.json" not found in build folder.', 'error')
  } else if (!found(buildFolder, 'storage-rules.txt')) {
    alert('File "storage-rules.txt" not found in build folder.', 'error')
  } else {
    callback()
  }
}
let prepareFiles = (callback) => {
  alert('Firebase deployment preparation ongoing - please wait ...')
  try {
    // Correct storage bucket in database rules
    let rules = fs.readFileSync(abs(buildFolder, 'storage-rules.txt'), 'utf8')
    rules = rules.replace(/match \/b\/(.+?)\/o {/, 'match /b/' + (env.cfg.firebase.storageBucket !== '' ? env.cfg.firebase.storageBucket : '<your-storage-bucket>') + '/o {')
    fs.writeFileSync(abs(buildFolder, 'storage-rules.txt'), rules)
    // Reset build folder in firebase
    fs.removeSync(abs(binFolder, 'build'))
    if (env.arg.hosting === true) {
      fs.copy(buildFolder, abs(binFolder, 'build'))
    }
    if (env.arg.hosting !== true && env.arg.database === true) {
      fs.copy(abs(buildFolder, 'database-rules.json'), abs(binFolder, 'build/database-rules.json'))
    }
    if (env.arg.hosting !== true && env.arg.storage === true) {
      fs.copy(abs(buildFolder, 'storage-rules.txt'), abs(binFolder, 'build/storage-rules.txt'))
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
        'default': env.cfg.firebase.authDomain.substr(0, env.cfg.firebase.authDomain.indexOf('.firebaseapp.com'))
      }
    }
    fs.writeJsonSync(abs(binFolder, '.firebaserc'), rc)
    // Create/update firebase.json file
    let config = {}
    if (env.arg.database === true) {
      config.database = {
        rules: join('build', 'database-rules.json')
      }
    }
    if (env.arg.storage === true) {
      config.storage = {
        rules: join('build', 'storage-rules.txt')
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
      // alert('Firebase storage rules deployment failed.', 'issue')
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
      // alert('Firebase hosting deployment failed.', 'issue')
    })
  } else {
    callback()
  }
}

 // Run

// Run
defineBuildFolder(function (buildFolder) {
  checkFolders(buildFolder, function () {
    cmd(binFolder, 'firebase login', () => {
      prepareFiles(() => {
        updateConfigFiles(() => {
          databaseDeployment(() => {
            storageDeployment(() => {
              hostingDeployment(() => {
                alert('Firebase deployment done.')
              })
            })
          })
        })
      })
    })
  })
})
