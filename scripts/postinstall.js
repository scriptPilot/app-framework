/*

  Purpose:

  - Create project snapshot
    - Apply release modifications (to adapt older installations to current version)
      - Update platform-specific packages
      - Prune node folder
      - Remove cache folder
      - Create/update project folder files

  Configuration fix will be done in /env file

*/

'use strict'

// Create project snapshot
let cmd = require('../lib/cmd')
let alert = require('../lib/alert')
let appFrameworkVersion = require('../package.json').version
cmd(__dirname, 'node create-snapshot --name "before-app-framework-update-to-v' + appFrameworkVersion + '"', function () {

  // Apply release modification first
  ///tbc

  // Load modules
  let env = require('../env')
  let found = require('../lib/found')
  let fs = require('fs-extra')
  let glob2regexp = require('glob-to-regexp')
  let list = require('recursive-readdir')
  let rel = require('path').join
  let abs = require('path').resolve

  // Step: Update platform specific packages
  let updateModules = function (callback) {
    if (env.os === 'mac') {
      alert('iOS deployment package installation ongoing - please wait ...')
      cmd(env.proj, 'npm update ios-deploy', function () {
        alert('iOS deployment package installation done.')
        callback()
      })
    } else {
      callback()
    }
  }

  // Step: Prune node folder
  let pruneModules = function (callback) {
    alert('Node modules folder clean-up ongoing - please wait ...')
    cmd(env.proj, 'npm prune', function () {
      alert('Node modules folder clean-up done.')
      callback()
    })
  }

  // Step: Remove cache folder
  let removeCache = function (callback) {
    alert('Cache clean-up ongoing - please wait ...')
    fs.remove(env.cache, function (err) {
      if (err) {
        alert('Error: Cache clean-up failed. Please open an incident on GitHub.')
      } else {
        alert('Cache clean-up done.')
        callback()
      }
    })
  }

  // Step: Create/update project folder files
  let setupProjectFolder = function (callback) {
    // Run only if App Framework is installed as module
    if (env.installed) {
      alert('Project folder setup ongoing - please wait ...')
      // Define source and destination folder
      let from = abs(__dirname, '..')
      let to = abs(env.proj)
      // Copy missing Power Point design files
      fs.copySync(abs(from, 'design'), abs(to, 'design'), {filter: f => /(design|\.pptx)$/.test(f), overwrite: false})
      // Update PDF design files
      fs.copySync(abs(from, 'design'), abs(to, 'design'), {filter: f => /(design|\.pdf)$/.test(f)})
      // Copy images folder if not exists
      if (!found(to, 'app/images')) fs.copySync(abs(from, 'app/images'), abs(to, 'app/images'))
      // Copy pages folder if not exists
      if (!found(to, 'app/pages')) fs.copySync(abs(from, 'app/pages'), abs(to, 'app/pages'))
      // Update login-screen.vue
      fs.copySync(abs(from, 'app/pages/login-screen.vue'), abs(to, 'app/pages/login-screen.vue'))
      // Copy app.vue of not exists
      if (!found(to, 'app/app.vue')) fs.copySync(abs(from, 'app/app.vue'), abs(to, 'app/app.vue'))
      // Copy config.json if not exists
      if (!found(to, 'app/config.json')) fs.copySync(abs(from, 'app/config.json'), abs(to, 'app/config.json'))
      // Copy database-rules.json if not exists
      if (!found(to, 'app/database-rules.json')) fs.copySync(abs(from, 'app/database-rules.json'), abs(to, 'app/database-rules.json'))
      // Copy icon.png if not exists
      if (!found(to, 'app/icon.png')) fs.copySync(abs(from, 'app/icon.png'), abs(to, 'app/icon.png'))
      // Copy storage-rules.txt if not exists
      if (!found(to, 'app/storage-rules.txt')) fs.copySync(abs(from, 'app/storage-rules.txt'), abs(to, 'app/storage-rules.txt'))
      // Update .babelrc
      fs.copySync(abs(from, '.babelrc'), abs(to, '.babelrc'))
      // Update .gitignore
      fs.copySync(abs(from, '.gitignore'), abs(to, '.gitignore'))
      // Alert
      alert('Project folder setup done.')
    }
    callback()
  }

  // Run steps
  updateModules(function () {
    pruneModules(function () {
      removeCache(function () {
        setupProjectFolder(function () {
          alert('App Framework installation done.')
        })
      })
    })
  })

})
