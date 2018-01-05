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
let env = require('./env')
let alert = require('./alert')
let cmd = require('./cmd')
let found = require('./found')
let jsonScheme = require('./json-scheme')
let fs = require('fs-extra')
let abs = require('path').resolve
const path = require('path')

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
      alert('Cache clean-up failed.', 'issue')
    } else {
      alert('Cache clean-up done.')
      callback()
    }
  })
}

// Step: Create/update project folder files
let setupProjectFolder = function (callback) {
  if (env.installed) {
    alert('Project folder setup ongoing - please wait ...')
    try {
      // Define source and destination folder
      let from = abs(__dirname, '..')
      let to = abs(env.proj)
      // Copy missing Power Point design files
      fs.copySync(abs(from, 'design'), abs(to, 'design'), {filter: f => /(design|\.pptx)$/.test(f), overwrite: false})
      // Update PDF design files
      fs.copySync(abs(from, 'design'), abs(to, 'design'), {filter: f => /(design|\.pdf)$/.test(f)})
      // Update .babelrc
      fs.copySync(abs(from, '.babelrc'), abs(to, '.babelrc'))
      // Alert
      alert('Project folder setup done.')
      // callback
      callback()
    } catch (err) {
      alert('Project folder setup failed.', 'issue')
    }
  } else {
    callback()
  }
}

// Setup app folder
function setupAppFolder (callback) {
  let reset = function () {
    alert('Setting up app folder - please wait ...')
    cmd(__dirname, 'node reset-app', function () {
      alert('App folder set up done.')
      callback()
    }, function () {
      alert('Failed to setup app folder.', 'issue')
    })
  }
  if (!found(env.app)) {
    reset()
  } else {
    fs.readdir(env.app, function (err, files) {
      if (err) alert('Failed to setup app folder.', 'issue')
      if (files.length === 1 && found(env.app, 'config.json')) {
        reset()
      } else {
        callback()
      }
    })
  }
}

// Step: Update scripts in package.json
let updateScriptsAndVersion = function (callback) {
  if (env.installed) {
    alert('Script update onging - please wait ...')
    let scripts = fs.readJsonSync(abs(__dirname, '../package.json')).scripts
    for (let script in scripts) {
      if (['postinstall', 'reset', 'f7', 'f7vue', 'iconfonts'].indexOf(script) !== -1) {
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

// Step: Create snapshot
let createSnapshot = function (callback) {
  let appFrameworkVersion = fs.readJsonSync(abs(__dirname, '../package.json')).version
  if (env.pkg.devDependencies['app-framework'] === '*') {
    callback()
  } else {
    cmd(__dirname, 'node create-snapshot --name "before-app-framework-update-to-v' + appFrameworkVersion + '"', function () {
      callback()
    })
  }
}

const completePackageJson = (callback) => {
  const pkg = fs.readJsonSync(abs(env.proj, 'package.json'))
  if (JSON.stringify(pkg) === '{}') {
    const projectFolderName = path.basename(env.proj)
    const pkg = {
      name: projectFolderName,
      version: '1.0.0',
      devDependencies: {
        'app-framework': '*'
      }
    }
    fs.writeJsonSync(abs(env.proj, 'package.json'), pkg, { spaces: 2 })
    env.pkg = pkg
  }
  callback()
}

// Run steps
completePackageJson(() => {
  createSnapshot(function () {
    cmd(__dirname, 'node modifications13', function () {
      cmd(__dirname, 'node modifications14', function () {
        cmd(__dirname, 'node modifications16plus', function () {
          pruneModules(function () {
            removeCache(function () {
              setupAppFolder(function () {
                setupProjectFolder(function () {
                  updateScriptsAndVersion(function () {
                    cmd(__dirname, 'node applyConfiguration', function () {
                      // Fix configuration
                      let configFix = jsonScheme.fix(abs(__dirname, '../config-scheme.json'), abs(env.app, 'config.json'))
                      if (Array.isArray(configFix)) {
                        alert('Failed to fix config file.\nDetails:\n- ' + configFix.join('\n- '), 'issue', 'error')
                      }
                      alert('App Framework installation done.\n\nPlease take a look at the change log:\nhttps://github.com/scriptPilot/app-framework/blob/master/CHANGELOG.md')
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
