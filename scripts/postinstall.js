/*

  Purpose:

  - Create project snapshot
    - Apply release modifications (to adapt older installations to current version)
      - Update platform-specific packages
        - Prune node folder
          - Remove cache folder
            - Create/update project folder files
              - Update scripts and version in package.json file
                - Fix configuration

*/

'use strict'

// Load modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let jsonScheme = require('../lib/json-scheme')
let fs = require('fs-extra')
let abs = require('path').resolve

// Step: Prepare the project folder setup
let prepareSetup = function (callback) {
  if (env.installed) {
    // Rename .npmignore to .gitignore
    if (found(__dirname, '../.npmignore')) fs.renameSync(abs(__dirname, '../.npmignore'), abs(__dirname, '../.gitignore'))
    if (found(__dirname, '../.npmignore')) fs.renameSync(abs(__dirname, '../.npmignore'), abs(__dirname, '../.gitignore'))
  }
  callback()
}

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
      alert('Error: Cache clean-up failed.', 'issue')
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

// Step: Update scripts in package.json
let updateScriptsAndVersion = function (callback) {
  if (env.installed) {
    alert('Script update onging - please wait ...')
    let scripts = fs.readJsonSync(abs(__dirname, '../package.json')).scripts
    for (let script in scripts) {
      if (['postinstall', 'f7', 'f7vue'].indexOf(script) !== -1) {
        delete scripts[script]
      } else {
        scripts[script] = scripts[script].replace('node scripts/', 'node node_modules/app-framework/scripts/')
      }
    }
    let proj = fs.readJsonSync(abs(env.proj, 'package.json'))
    proj.scripts = scripts
    if (proj.devDependencies && proj.devDependencies['app-framework'] === '*') {
      let appFrameworkVersion = fs.readJsonSync(abs(__dirname, '../package.json')).version
      proj.devDependencies['app-framework'] = '^' + appFrameworkVersion
    }
    fs.writeJsonSync(abs(env.proj, 'package.json'), proj)
    alert('Script update done.')
  }
  callback()
}

// Run steps
let appFrameworkVersion = fs.readJsonSync(abs(__dirname, '../package.json')).version
cmd(__dirname, 'node create-snapshot --name "before-app-framework-update-to-v' + appFrameworkVersion + '"', function () {
  cmd(__dirname, 'node modifications13', function () {
    updateModules(function () {
      pruneModules(function () {
        removeCache(function () {
          prepareSetup(function () {
            setupProjectFolder(function () {
              updateScriptsAndVersion(function () {
                // Fix configuration
                let configFix = jsonScheme.fix(abs(__dirname, '../config-scheme.json'), abs(env.app, 'config.json'))
                if (Array.isArray(configFix)) {
                  alert('Error: Failed to fix config file.\nDetails:\n- ' + configFix.join('\n- '), 'issue')
                }
                alert('App Framework installation done.')
              })
            })
          })
        })
      })
    })
  })
})
