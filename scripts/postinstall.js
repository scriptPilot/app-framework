'use strict'

// Load packages
var abs = require('path').resolve
var path = require('path')
var fs = require('fs-extra')
var cmd = require('../lib/cmd')
var saveJSON = require('jsonfile')
var json = require('jsonfile')
saveJSON.spaces = 2
var img = require('jimp')
var zipdir = require('zip-dir')
var list = require('list-dir').sync
var found = require('../lib/found')
var alert = require('../lib/alert')
var _ = require('underscore')
var glob2regexp = require('../vendor/glob-to-regexp')

// Load configuration
var cfg = require('./config.js')

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

let applyReleaseModifications = function (callback) {
  if (cfg.isInstalled) {
    alert('Release modifications ongoing - please wait ...')

    // < 1.3
    let app = fs.readJsonSync(abs(cfg.appRoot, 'src/config.json'))
    let demoApp = fs.readJsonSync(abs(cfg.packageRoot, 'demo/src/config.json'))

    app.iconImage = app.iconImage || demoApp.iconImage
    app.iconBackgroundColor = app.iconBackgroundColor || demoApp.iconBackgroundColor
    app.materialSubnavbarFix = app.materialSubnavbarFix || demoApp.materialSubnavbarFix
    app.useCordovaPlugins = app.useCordovaPlugins || demoApp.useCordovaPlugins
    app.firebase = app.firebase || demoApp.firebase
    app.statusbarTextColor = app.statusbarTextColor || demoApp.statusbarTextColor
    app.appStoreId = app.appStoreId || demoApp.appStoreId
    app.playStoreId = app.playStoreId || demoApp.playStoreId

    // Removed items
    if (app.faviconIcon) delete app.faviconIcon
    if (app.faviconBackgroundColor) delete app.faviconBackgroundColor
    if (app.firebase.useDatabaseService) delete app.firebase.useDatabaseService
    if (app.firebase.useStorageService) delete app.firebase.useStorageService

    // Transform special routes to object (needed after sub page functionality added)
    if (_.isArray(app.specialRoutes)) {
      let routes = app.specialRoutes
      app.specialRoutes = {}
      for (let i = 0; i < routes.length; i++) {
        let page = routes[i].substr(0, routes[i].indexOf('/'))
        app.specialRoutes[routes[i]] = page
      }
    }

    // Save config
    fs.writeJsonSync(abs(cfg.appRoot, 'src/config.json'), app)

    // 1.3
      // Restructure source files
        // Images folder
    if (!found(cfg.appRoot, 'src/images') && found(cfg.appRoot, 'images')) {
      fs.copySync(abs(cfg.appRoot, 'images'), abs(cfg.appRoot, 'src/images'))
      if (abs(cfg.appRoot, 'src/images')) {
        fs.removeSync(abs(cfg.appRoot, 'images'))
      }
    }
        // pages folder
    fs.ensureDirSync(abs(cfg.appRoot, 'src'))
    if (!found(cfg.appRoot, 'src/pages') && found(cfg.appRoot, 'pages')) {
      fs.copySync(abs(cfg.appRoot, 'pages'), abs(cfg.appRoot, 'src/pages'))
      if (abs(cfg.appRoot, 'src/pages')) {
        fs.removeSync(abs(cfg.appRoot, 'pages'))
      }
    }
        // design files
    if (found(cfg.appRoot, 'design/icon.pptx')) {
      fs.renameSync(abs(cfg.appRoot, 'design/icon.pptx'), abs(cfg.appRoot, 'design/icon-template.pptx'))
    }
        // app.vue
    if (!found(cfg.appRoot, 'src/app.vue') && found(cfg.appRoot, 'app.vue')) {
      fs.copySync(abs(cfg.appRoot, 'app.vue'), abs(cfg.appRoot, 'src/app.vue'))
      if (abs(cfg.appRoot, 'src/app.vue')) {
        fs.removeSync(abs(cfg.appRoot, 'app.vue'))
      }
    }
        // database-rules.json
    if (!found(cfg.appRoot, 'src/database-rules.json') && found(cfg.appRoot, 'database-rules.json')) {
      fs.copySync(abs(cfg.appRoot, 'database-rules.json'), abs(cfg.appRoot, 'src/database-rules.json'))
      if (abs(cfg.appRoot, 'src/database-rules.json')) {
        fs.removeSync(abs(cfg.appRoot, 'database-rules.json'))
      }
    }
        // storage-rules.txt
    if (!found(cfg.appRoot, 'src/storage-rules.txt') && found(cfg.appRoot, 'storage-rules.txt')) {
      fs.copySync(abs(cfg.appRoot, 'storage-rules.txt'), abs(cfg.appRoot, 'src/storage-rules.txt'))
      if (abs(cfg.appRoot, 'src/storage-rules.txt')) {
        fs.removeSync(abs(cfg.appRoot, 'storage-rules.txt'))
      }
    }
        // config.json
    if (!found(cfg.appRoot, 'src/config.json')) {
      let config = json.readFileSync(abs(cfg.appRoot, 'package.json'))
      delete config.name
      delete config.version
      delete config.description
      delete config.devDependencies
      delete config.dependencies
      delete config.scripts
      fs.writeJsonSync(abs(cfg.appRoot, 'src/config.json'), config, {space: 2})
    }
        // package.json
    let pkg = fs.readJsonSync(abs(cfg.appRoot, 'package.json'))
    let config = json.readFileSync(abs(cfg.appRoot, 'src/config.json'))
    for (let item in pkg) {
      if (config[item] !== undefined) {
        delete pkg[item]
      }
    }
    delete pkg.iconImage
    fs.writeJsonSync(abs(cfg.appRoot, 'package.json'), pkg, {space: 2})
    // icon file
    if (typeof cfg.iconImage === 'string') {
      let config = fs.readJsonSync(abs(cfg.appRoot, 'src/config.json'))
      let iconFile = abs(cfg.appRoot, 'src', config.iconImage)
      if (found(iconFile) && !found(cfg.appRoot, 'src/icon.png')) {
        img.read(iconFile, function (err, icon) {
          if (!err) {
            icon.write(abs(cfg.appRoot, 'src/icon.png'), function (err) {
              if (!err && found(cfg.appRoot, 'src/icon.png')) {
                delete config.iconImage
                fs.writeJsonSync(abs(cfg.appRoot, 'src/config.json'), config, {space: 2})
                fs.removeSync(iconFile)
              }
            })
          }
        })
      }
    }
        // www folder
    let wwwFolder = abs(cfg.appRoot, 'www')
    if (found(wwwFolder)) {
      let items = list(wwwFolder)
      if (items.length === 0) {
        fs.removeSync(wwwFolder)
      }
      for (let i = 0; i < items.length; i++) {
        if (/^build-([0-9]+)\.([0-9]+)\.([0-9]+)(\/|\\)index\.html$/.test(items[i]) === true) {
          if (!found(cfg.appRoot, 'snapshots')) {
            fs.ensureDirSync(abs(cfg.appRoot, 'snapshots'))
          }
          let build = items[i].match(/^build-(([0-9]+)\.([0-9]+)\.([0-9]+))(\/|\\)index\.html$/)[1]
          fs.move(abs(wwwFolder, 'build-' + build), abs(wwwFolder, '.temp'), function (err) {
            if (!err) {
              fs.move(abs(wwwFolder, '.temp'), abs(wwwFolder, 'build-' + build, 'build'), function (err) {
                if (!err) {
                  zipdir(abs(wwwFolder, 'build-' + build), {
                    saveTo: abs(cfg.appRoot, 'snapshots', 'snapshot-' + build + '.zip')
                  }, function (err, buf) {
                    if (!err) {
                      fs.removeSync(abs(wwwFolder, 'build-' + build))
                    }
                    if (list(wwwFolder).length === 0) {
                      fs.removeSync(wwwFolder)
                    }
                  })
                }
              })
            }
          })
        } else if (/^build-([0-9]+)\.([0-9]+)\.([0-9]+)/.test(items[i]) === false) {
          fs.removeSync(abs(wwwFolder, items[i]))
          if (i + 1 === items.length && list(wwwFolder).length === 0) {
            fs.removeSync(wwwFolder)
          }
        } else {
          if (i + 1 === items.length && list(wwwFolder).length === 0) {
            fs.removeSync(wwwFolder)
          }
        }
      }
    }
    alert('Release modifications done')
  }
  callback()
}

let prepareFiles = function (callback) {
  if (cfg.isInstalled) {
    // Rename .npmignore to .gitignore
    if (found(cfg.packageRoot, '.npmignore')) fs.renameSync(abs(cfg.packageRoot, '.npmignore'), abs(cfg.packageRoot, '.gitignore'))
    if (found(cfg.packageRoot, 'demo/.npmignore')) fs.renameSync(abs(cfg.packageRoot, 'demo/.npmignore'), abs(cfg.packageRoot, 'demo/.gitignore'))
    // Reset version in demo app
    if (found(cfg.packageRoot, 'demo/package.json')) {
      let demo = fs.readJsonSync(abs(cfg.packageRoot, 'demo/package.json'))
      demo.version = '1.0.0'
      fs.writeJsonSync(abs(cfg.packageRoot, 'demo/package.json'), demo, {space: 2})
    }
  }
  callback()
}

let copyDemoAppFiles = function (callback) {
  if (cfg.isInstalled) {
    // Define source and destination folder
    let from = cfg.packageRoot + 'demo'
    let to = cfg.projectRoot
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
            (isFolder && cFile === aFile.substr(0, cFile.length)) ||
            // Files without glob
            (!isGlob && cFile === aFile) ||
            // Files with glob
            (isGlob && glob2regexp(cFile).test(aFile))) {
          fs.copySync(abs(from, aFile), abs(to, aFile), {overwrite: replace})
        }
      }
    }
  }
  callback()
}

let reworkFiles = function (callback) {
  if (cfg.isInstalled) {
    alert('Files rework ongoing - please wait ...')
    // Update scripts
    let project = fs.readJsonSync(abs(cfg.projectRoot, 'package.json'))
    let demo = fs.readJsonSync(abs(cfg.packageRoot, 'demo/package.json'))
    project.scripts = demo.scripts
    fs.writeJsonSync(abs(cfg.projectRoot, 'package.json'))
    alert('Files rework done.')
  }
  callback()
}

let prune = function (callback) {
  alert('Node modules folder clean-up ongoing - please wait ...')
  cmd('npm prune', function () {
    alert('Node module folder clean-up done.')
    callback()
  })
}

alert('App Framework installation ongoing - please wait ...')
updateIosDeploy(function () {
  applyReleaseModifications(function () {
    prepareFiles(function () {
      copyDemoAppFiles(function () {
        reworkFiles(function () {
          prune(function () {
            alert('App Framework installation done. Please read latest documentation on GitHub.')
          })
        })
      })
    })
  })
})
