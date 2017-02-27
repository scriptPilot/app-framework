// Load packages
var path = require('path')
var abs = require('path').resolve
var isThere = require('is-there')
var fs = require('fs-extra')
var replace = require('replace-in-file')
var cpx = require('cpx')
var cmd = require('./cmd')
var saveJSON = require('jsonfile')
var json = require('jsonfile')
saveJSON.spaces = 2
var showOnly = require('./show-only')
var img = require('jimp')
var zipdir = require('zip-dir')
var list = require('list-dir')
var found = require('../lib/found')
var alert = require('../lib/alert')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('App Framework installation ongoing - please wait ...')

let applyReleaseModifications = function (callback) {
  alert('Release modifications ongoing - please wait ...')

  // < 1.3
  let app = fs.readJsonSync(abs(cfg.appRoot, 'src/config.json'))
  let demoApp = fs.readJsonSync(abs(cfg.packageRoot, 'demo-app/src/config.json'))

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
    for (i = 0; i < routes.length; i++) {
      let page = routes[i].substr(0, routes[i].indexOf('/'))
      app.specialRoutes[routes[i]] = page
    }
  }

  // Save config
  fs.writeJsonSync(abs(cfg.appRoot, 'src/config.json'), app)

  // 1.3
    // Restructure source files
      // Images folder
      if (!isThere(abs(cfg.appRoot, 'src/images')) && isThere(abs(cfg.appRoot, 'images'))) {
        fs.copySync(abs(cfg.appRoot, 'images'), abs(cfg.appRoot, 'src/images'))
        if (abs(cfg.appRoot, 'src/images')) {
          fs.removeSync(abs(cfg.appRoot, 'images'))
        }
      }
      // pages folder
      fs.ensureDirSync(abs(cfg.appRoot, 'src'))
      if (!isThere(abs(cfg.appRoot, 'src/pages')) && isThere(abs(cfg.appRoot, 'pages'))) {
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
      if (!isThere(abs(cfg.appRoot, 'src/app.vue')) && isThere(abs(cfg.appRoot, 'app.vue'))) {
        fs.copySync(abs(cfg.appRoot, 'app.vue'), abs(cfg.appRoot, 'src/app.vue'))
        if (abs(cfg.appRoot, 'src/app.vue')) {
          fs.removeSync(abs(cfg.appRoot, 'app.vue'))
        }
      }
      // database-rules.json
      if (!isThere(abs(cfg.appRoot, 'src/database-rules.json')) && isThere(abs(cfg.appRoot, 'database-rules.json'))) {
        fs.copySync(abs(cfg.appRoot, 'database-rules.json'), abs(cfg.appRoot, 'src/database-rules.json'))
        if (abs(cfg.appRoot, 'src/database-rules.json')) {
          fs.removeSync(abs(cfg.appRoot, 'database-rules.json'))
        }
      }
      // storage-rules.txt
      if (!isThere(abs(cfg.appRoot, 'src/storage-rules.txt')) && isThere(abs(cfg.appRoot, 'storage-rules.txt'))) {
        fs.copySync(abs(cfg.appRoot, 'storage-rules.txt'), abs(cfg.appRoot, 'src/storage-rules.txt'))
        if (abs(cfg.appRoot, 'src/storage-rules.txt')) {
          fs.removeSync(abs(cfg.appRoot, 'storage-rules.txt'))
        }
      }
      // config.json
      if (!isThere(abs(cfg.appRoot, 'src/config.json'))) {
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
      if (typeof cfg.iconImage === 'text') {
        let config = fs.readJsonSync(abs(cfg.appRoot, 'src/config.json'))
        let iconFile = abs(cfg.appRoot, 'src', config.iconImage)
        if (isThere(iconFile) && !isThere(abs(cfg.appRoot, 'src/icon.png'))) {
          img.read(iconFile, function (err, icon) {
            if (!err) {
              icon.write(abs(cfg.appRoot, 'src/icon.png'), function (err) {
                if (!err && isThere(abs(cfg.appRoot, 'src/icon.png'))) {
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
        let items = list.sync(wwwFolder)
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
              fs.move(abs(wwwFolder, '.temp'), abs(wwwFolder, 'build-' + build, 'build'), function (err) {
                zipdir(abs(wwwFolder, 'build-' + build), {
                  saveTo: abs(cfg.appRoot, 'snapshots', 'snapshot-' + build + '.zip')
                }, function (err, buf) {
                  if (!err) {
                    fs.removeSync(abs(wwwFolder, 'build-' + build))
                  }
                  if (list.sync(wwwFolder).length === 0) {
                    fs.removeSync(wwwFolder)
                  }
                })
              })
            })
          } else if (/^build-([0-9]+)\.([0-9]+)\.([0-9]+)/.test(items[i]) === false) {
            fs.removeSync(abs(wwwFolder, items[i]))
            if (i + 1 === items.length && list.sync(wwwFolder).length === 0) {
              fs.removeSync(wwwFolder)
            }
          } else {
            if (i + 1 === items.length && list.sync(wwwFolder).length === 0) {
              fs.removeSync(wwwFolder)
            }
          }
        }
      }

  alert('Release modifications done')
  callback()
}

let updateIosDeploy = function (callback) {
  alert('iOS deploy installation ongoing - please wait ...')
  if (process.platform === 'darwin') {
    cmd(['npm', 'update', 'ios-deploy'], function () {
      alert('iOS deploy installation done')
      callback()
    })
  } else {
    callback()
  }
}

let copyDemoAppFiles = function () {

  // App Framework is installed as dependency
  if (cfg.isInstalled) {
    // Copy template app.vue and reset version in package.json
    if (!isThere(cfg.appRoot + 'app.vue')) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/app.vue'), cfg.appRoot)
      var app = require(cfg.appRoot + 'package.json')
      app.version = '0.1.0'
      saveJSON.writeFileSync(cfg.appRoot + 'package.json', app)
    }

    // Copy template images
    if (!isThere(cfg.appRoot + 'images')) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/images/*'), cfg.appRoot + 'images')
    }

    // Copy template pages
    if (!isThere(cfg.appRoot + 'pages')) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/pages/**/*'), cfg.appRoot + 'pages')
    }

    // Copy database rules file
    if (!isThere(cfg.appRoot + 'database-rules.json')) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/database-rules.json'), cfg.appRoot)
    }

    // Copy stoarge rules file
    if (!isThere(cfg.appRoot + 'storage-rules.txt')) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/storage-rules.txt'), cfg.appRoot)
    }

    // Copy/update gitignore
    if (isThere(abs(cfg.packageRoot, 'demo-app/.gitignore'))) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/.gitignore'), cfg.appRoot)
    } else if (isThere(abs(cfg.packageRoot, 'demo-app/.npmignore'))) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/.npmignore'), cfg.appRoot)
      fs.renameSync(cfg.appRoot + '.npmignore', cfg.appRoot + '.gitignore')
    }

    // Update login-screen.vue
    if (isThere(abs(cfg.packageRoot, 'demo-app/pages/login-screen.vue'))) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/pages/login-screen.vue'), cfg.appRoot + 'pages')
    }

    // Copy .htaccess file, reset version
    if (!isThere(abs(cfg.appRoot, 'www/.htaccess'))) {
      cpx.copySync(abs(cfg.packageRoot, 'demo-app/www/.htaccess'), cfg.appRoot + 'www')
      replace.sync({
        files: abs(cfg.appRoot, 'www/.htaccess'),
        from: /\/build-([0-9]+)\.([0-9]+)\.([0-9]+)\//g,
        to: '/build-0.0.0/'
      })
    }
  }
}

let prune = function (callback) {
  alert('Node modules folder clean-up ongoing - please wait ...')
  cmd(['npm', 'prune'], function () {
    alert('Node module folder clean-up done')
    callback()
  })
}

applyReleaseModifications(function () {})
