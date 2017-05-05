/*

  Purpose: Replace app folder with minimum files.

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let jsonScheme = require('../lib/json-scheme')
let fs = require('fs-extra')
let abs = require('path').resolve

// Cancel in App Framework development mode
if (env.installed !== true) {
  alert('App reset not possible in App Framework development mode.', 'exit')
}

// Define source and destination folders
let dest = abs(env.proj, 'app')

// Steps
let resetAppFolder = function (callback) {
  alert('Resetting app folder - please wait ...')
  try {
    fs.emptyDirSync(abs(dest))
    fs.ensureDirSync(abs(dest, 'images'))
    fs.ensureDirSync(abs(dest, 'pages'))
    alert('Reset app folder.')
    callback()
  } catch (err) {
    alert('Failed to reset app folder structure.', 'issue')
  }
}
let copyIconFile = function (callback) {
  fs.copy(abs(__dirname, '../app/icon.png'), abs(dest, 'icon.png'), function (err) {
    alert('Copying icon file - please wait ...')
    if (!err) {
      alert('Icon file copied.')
      callback()
    } else {
      alert('Failed to copy icon file.', 'issue')
    }
  })
}
let createConfigFile = function (callback) {
  alert('Create default configuration file.')
  let res = jsonScheme.create(abs(__dirname, '../config-scheme.json'), abs(dest, 'config.json'))
  if (!Array.isArray(res)) {
    env.cfg = fs.readJsonSync(abs(dest, 'config.json'))
    alert('Default configuration file created.')
    callback()
  } else {
    alert('Failed to create deafault configuration file.', 'issue')
  }
}
let createDatabaseRules = function (callback) {
  alert('Creating default database rules - please wait ...')
  let rules = {
    'rules': {
      '.read': 'auth != null',
      '.write': 'auth != null'
    }
  }
  fs.writeJson(abs(dest, 'database-rules.json'), rules, function (err) {
    if (!err) {
      alert('Created default database rules.')
      callback()
    } else {
      alert('Failed to create default database rules.', 'issue')
    }
  })
}
let createStorageRules = function (callback) {
  alert('Creating default storage rules - please wait ...')
  let rules = 'service firebase.storage {\n' +
              '  match /b/' + (env.cfg.firebase.storageBucket !== '' ? env.cfg.firebase.storageBucket : '<your-storage-bucket>') + '/o {\n' +
              '    match /{allPaths=**} {\n' +
              '      allow read, write: if request.auth != null;\n' +
              '    }\n' +
              '  }\n' +
              '}\n'
  fs.writeFile(abs(dest, 'storage-rules.txt'), rules, function (err) {
    if (!err) {
      alert('Created default storage rules.')
      callback()
    } else {
      alert('Failed to create default stoarge rules.', 'issue')
    }
  })
}
let createAppComponent = function (callback) {
  alert('Creating default app component - please wait ...')
  let content = '<template>\n' +
                '  <div id="app">\n' +
                '    <f7-views>\n' +
                '      <f7-view id="main-view" main url="home" navbar-through :dynamic-navbar="true" />\n' +
                '    </f7-views>\n' +
                '  </div>\n' +
                '</template>\n'
  fs.writeFile(abs(dest, 'app.vue'), content, function (err) {
    if (!err) {
      alert('Created default app component.')
      callback()
    } else {
      alert('Failed to create default app component.', 'issue')
    }
  })
}
let createHomepage = function (callback) {
  alert('Creating default page component - please wait ...')
  let content = '<template>\n' +
                '  <f7-page>\n' +
                '    <f7-navbar title="My App" />\n' +
                '    <f7-block inner inset>It works!</f7-block>\n' +
                '    <f7-block inset>\n' +
                '      <f7-button big fill bg="green" href="https://github.com/scriptPilot/app-framework/blob/master/DOCUMENTATION.md" external>Documentation</f7-button>\n' +
                '    </f7-block>\n' +
                '  </f7-page>\n' +
                '</template>\n'
  fs.writeFile(abs(dest, 'pages/home.vue'), content, function (err) {
    if (!err) {
      alert('Created default page component.')
      callback()
    } else {
      alert('Failed to create default page component.', 'issue')
    }
  })
}

// Run
alert('Replacing app folder with minimum files - please wait ...')
cmd(__dirname, 'node snapshot', function () {
  resetAppFolder(function () {
    copyIconFile(function () {
      createConfigFile(function () {
        createDatabaseRules(function () {
          createStorageRules(function () {
            createAppComponent(function () {
              createHomepage(function () {
                cmd(__dirname, 'node update-routes', function () {
                  alert('App folder replaced with minimum files.')
                })
              })
            })
          })
        })
      })
    })
  })
})
