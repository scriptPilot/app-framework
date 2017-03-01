'use strict'

let found = require('../lib/found')
let alert = require('../lib/alert')
let abs = require('path').resolve
let fs = require('fs-extra')
let img = require('jimp')
let zipdir = require('zip-dir')
let list = require('list-dir').sync

module.exports = function (callback) {
  // Alert
  alert('Release modifications of v1.3 ongoing - please wait ...')

  // Define expected project root
  let proj = abs(__dirname, '../../../')

  // Is installed
  if (found(proj, 'package.json')) {
    // Transform special routes to object
    let pkg = fs.readJsonSync(abs(proj, 'package.json'))
    if (pkg.specialRoutes && Array.isArray(pkg.specialRoutes)) {
      let routes = pkg.specialRoutes
      pkg.specialRoutes = {}
      for (let i = 0; i < routes.length; i++) {
        let page = routes[i].substr(0, routes[i].indexOf('/'))
        pkg.specialRoutes[routes[i]] = page
      }
      fs.writeJsonSync(abs(proj, 'package.json'), pkg, {spaces: 2})
    }

    // Create src folder
    fs.ensureDirSync(abs(proj, 'src'))

    // Image folder
    if (!found(proj, 'src/images') && found(proj, 'images')) {
      fs.copySync(abs(proj, 'images'), abs(proj, 'src/images'))
      if (abs(proj, 'src/images')) {
        fs.removeSync(abs(proj, 'images'))
      }
    }

    // Pages folder
    if (!found(proj, 'src/pages') && found(proj, 'pages')) {
      fs.copySync(abs(proj, 'pages'), abs(proj, 'src/pages'))
      if (abs(proj, 'src/pages')) {
        fs.removeSync(abs(proj, 'pages'))
      }
    }

    // Rename icon template
    if (found(proj, 'design/icon.pptx')) {
      fs.renameSync(abs(proj, 'design/icon.pptx'), abs(proj, 'design/icon-template.pptx'))
    }

    // Remove .gitattributes
    fs.remove(abs(proj, '.gitattributes'))

      // Move app.vue
    if (!found(proj, 'src/app.vue') && found(proj, 'app.vue')) {
      fs.copySync(abs(proj, 'app.vue'), abs(proj, 'src/app.vue'))
      if (abs(proj, 'src/app.vue')) {
        fs.removeSync(abs(proj, 'app.vue'))
      }
    }

      // Move database-rules.json
    if (!found(proj, 'src/database-rules.json') && found(proj, 'database-rules.json')) {
      fs.copySync(abs(proj, 'database-rules.json'), abs(proj, 'src/database-rules.json'))
      if (abs(proj, 'src/database-rules.json')) {
        fs.removeSync(abs(proj, 'database-rules.json'))
      }
    }

      // Move storage-rules.txt
    if (!found(proj, 'src/storage-rules.txt') && found(proj, 'storage-rules.txt')) {
      fs.copySync(abs(proj, 'storage-rules.txt'), abs(proj, 'src/storage-rules.txt'))
      if (abs(proj, 'src/storage-rules.txt')) {
        fs.removeSync(abs(proj, 'storage-rules.txt'))
      }
    }

      // Create config.json
    if (!found(proj, 'src/config.json')) {
      let cfg = fs.readJsonSync(abs(proj, 'package.json'))
      delete cfg.name
      delete cfg.version
      delete cfg.description
      delete cfg.devDependencies
      delete cfg.dependencies
      delete cfg.scripts
      if (cfg.favionIcon) cfg.iconImage = cfg.faviconIcon
      delete cfg.faviconIcon
      if (cfg.faviconBackgroundColor) cfg.iconBackgroundColor = cfg.faviconBackgroundColor
      delete cfg.faviconBackgroundColor
      fs.writeJsonSync(abs(proj, 'src/config.json'), cfg, {spaces: 2})
    }

    // Clean-up package.json file
    let cfg = fs.readJsonSync(abs(proj, 'src/config.json'))
    for (let item in pkg) {
      if (cfg[item] !== undefined || item === 'faviconBackgroundColor' || item === 'faviconIcon') {
        delete pkg[item]
      }
    }
    delete pkg.iconImage
    fs.writeJsonSync(abs(proj, 'package.json'), pkg, {spaces: 2})

    // Copy icon file to root and tranform to png
    if (typeof cfg.iconImage === 'string') {
      let iconFile = abs(proj, 'src', cfg.iconImage)
      if (found(iconFile) && !found(proj, 'src/icon.png')) {
        img.read(iconFile, function (err, icon) {
          if (!err) {
            icon.write(abs(proj, 'src/icon.png'), function (err) {
              if (!err && found(proj, 'src/icon.png')) {
                delete cfg.iconImage
                fs.writeJsonSync(abs(proj, 'src/config.json'), cfg, {spaces: 2})
                fs.removeSync(iconFile)
              }
            })
          }
        })
      }
    }

    // Transform build to snapshot
    fs.ensureDirSync(abs(proj, 'snapshots'))
    let wwwFolder = abs(proj, 'www')
    if (found(wwwFolder)) {
      let items = list(wwwFolder)
      if (items.length === 0) {
        fs.removeSync(wwwFolder)
      }
      for (let i = 0; i < items.length; i++) {
        if (/^build-([0-9]+)\.([0-9]+)\.([0-9]+)(\/|\\)index\.html$/.test(items[i]) === true) {
          if (!found(proj, 'snapshots')) {
            fs.ensureDirSync(abs(proj, 'snapshots'))
          }
          let build = items[i].match(/^build-(([0-9]+)\.([0-9]+)\.([0-9]+))(\/|\\)index\.html$/)[1]
          fs.move(abs(wwwFolder, 'build-' + build), abs(wwwFolder, '.temp'), function (err) {
            if (!err) {
              fs.move(abs(wwwFolder, '.temp'), abs(wwwFolder, 'build-' + build, 'build'), function (err) {
                if (!err) {
                  zipdir(abs(wwwFolder, 'build-' + build), {
                    saveTo: abs(proj, 'snapshots', 'snapshot-' + build + '.zip')
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

    alert('Release modifications of v1.3 done.')
  }

  callback()
}
