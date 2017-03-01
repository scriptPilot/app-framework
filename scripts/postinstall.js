'use strict'

// Apply modifications first
let modifications13 = require('./modifications13')
modifications13(function () {

  // Load packages
  let env = require('../env')
  var abs = require('path').resolve
  var path = require('path')
  var fs = require('fs-extra')
  var cmd = require('../lib/cmd')
  var list = require('list-dir').sync
  var found = require('../lib/found')
  var alert = require('../lib/alert')
  var glob2regexp = require('glob-to-regexp')
  let modifications13 = require('./modifications13')

  // Update iOS deploy package
  let updateIosDeploy = function (callback) {
    if (process.platform === 'darwin') {
      alert('iOS deploy installation ongoing - please wait ...')
      cmd('npm update ios-deploy', function () {
        alert('iOS deploy installation done.')
        callback()
      })
    } else {
      callback()
    }
  }

  // Prepare the project folder setup
  let prepareSetupProjectFolder = function (callback) {
    if (env.isInstalled) {
      // Rename .npmignore to .gitignore
      if (found(__dirname, '../.npmignore')) fs.renameSync(abs(__dirname, '../.npmignore'), abs(__dirname, '../.gitignore'))
      if (found(__dirname, '../demo/.npmignore')) fs.renameSync(abs(__dirname, '../demo/.npmignore'), abs(__dirname, '../demo/.gitignore'))
      // Reset version in demo app
      if (found(__dirname, '../demo/package.json')) {
        let demo = fs.readJsonSync(abs(__dirname, '../demo/package.json'))
        demo.version = '1.0.0'
        fs.writeJsonSync(abs(__dirname, '../demo/package.json'), demo, {spaces: 2})
      }
    }
    callback()
  }

  // Setup/update project folder
  let setupProjectFolder = function (callback) {
    if (env.isInstalled) {
      alert('Project folder setup ongoing - please wait ...')
      // Define source and destination folder
      let from = abs(__dirname, '../demo')
      let to = env.proj
      // Define files to be copied (glob, replace)
      // - Folders will be removed with replace === true before copy (example: "src/pages")
      // - Files will be overwritten with replace === true (example: "src/pages/*.*")
      let copyFiles = [
        ['design/*.pptx'],
        ['design/*.pdf', true],
        ['src/images'],
        ['src/pages'],
        ['src/app.vue'],
        ['src/config.json'],
        ['src/database-rules.json'],
        ['src/icon.png'],
        ['src/storage-rules.txt'],
        ['src/pages/login-screen.vue', true],
        ['.gitignore', true]
      ]
      // Get complete file list
      let allFiles = list(from)
      // Loop files to copy
      for (let c = 0; c < copyFiles.length; c++) {
        // Define options
        let cFile = path.join(copyFiles[c][0])
        let isFolder = cFile.indexOf('.') === -1
        let isGlob = cFile.indexOf('*') !== -1
        let replace = copyFiles[c][1] === true
        // Replace folder
        if (isFolder && replace) {
          fs.removeSync(abs(to, cFile))
        }
        // Loop file list
        for (let a = 0; a < allFiles.length; a++) {
          // Define options
          let aFile = allFiles[a]
          // Copy files
          if (// Folder
              (isFolder && (replace || !found(to, cFile)) && cFile === aFile.substr(0, cFile.length)) ||
              // Files without glob
              (!isGlob && cFile === aFile) ||
              // Files with glob
              (isGlob && glob2regexp(cFile).test(aFile))) {
            fs.copySync(abs(from, aFile), abs(to, aFile), {overwrite: replace})
          }
        }
      }
      alert('Project folder setup done.')
    }
    callback()
  }

  // Update scripts in package.json
  let updateScripts = function (callback) {
    if (env.isInstalled) {
      alert('Script update onging - please wait ...')
      let proj = fs.readJsonSync(abs(env.proj, 'package.json'))
      let demo = fs.readJsonSync(abs(__dirname, '../demo/package.json'))
      proj.scripts = demo.scripts
      fs.writeJsonSync(abs(env.proj, 'package.json'), proj, {spaces: 2})
      alert('Script update done.')
    }
    callback()
  }

  // Clean-up node module folder and delete cache
  let prune = function (callback) {
    alert('Node modules folder clean-up ongoing - please wait ...')
    cmd('npm prune', function () {
      fs.removeSync(env.cache)
      alert('Node module folder clean-up done.')
      callback()
    })
  }

  // Run steps
  alert('App Framework installation ongoing - please wait ...')
  updateIosDeploy(function () {
    prepareSetupProjectFolder(function () {
      setupProjectFolder(function () {
        updateScripts(function () {
          prune(function () {
            alert('App Framework installation done. Please read latest documentation on GitHub.')
          })
        })
      })
    })
  })

})
