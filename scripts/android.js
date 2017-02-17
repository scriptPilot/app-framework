// Load packages
var path = require('path')
var isThere = require('is-there')
var copy = require('cpx').copy
var run = require('./run')
var showOnly = require('./show-only')
var read = require('read-file')
var deleteFiles = require('delete')
var xml = require('xml2js')
var write = require('write')
var list = require('list-dir')
var replace = require('replace-in-file')
var fs = require('fs-extra')
var cmd = require('./cmd')

// Load configuration
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Get build version
var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
var version = htaccess.match(/build-(.+)\//)[1]

var checkBuild = function (callback) {
  if (!isThere(cfg.appRoot + 'www/build-' + version)) {
    showOnly('Build application first - please wait ...')
    cmd(['npm', 'run', 'patch'], function () {
      htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
      version = htaccess.match(/build-(.+)\//)[1]
      callback()
    }, 'Build process failed')
  } else {
    callback()
  }
}

// Show message
showOnly('Android Studio project build ongoing with application build version ' + version + ' - please wait ...')

// Check icons > create
var checkIcons = function (callback) {
  if (isThere(path.resolve(cfg.packageRoot, 'icons/favicon.ico'))) {
    callback()
  } else {
    showOnly('Icons are generated - please wait ...')
    run('npm run icons', function () {
      callback()
    }, 'Failed to generate icon folder')
  }
}

// Create cordova project folder
function createCordovaProject (callback) {
  let cordovaFolder = path.resolve(cfg.packageRoot, 'cordova')
  if (isThere(cordovaFolder)) {
    deleteFiles.sync([path.resolve(cordovaFolder, '**/**')])
  }
  run('cd "' + cfg.packageRoot + '" && cordova create cordova', function () {
    callback()
  })
}

// Install cordova plugins
function updateCordovaPlugins (callback) {
  let currentPlugins = isThere(path.resolve(cfg.packageRoot, 'cordova/plugins/fetch.json')) ? require(path.resolve(cfg.packageRoot, 'cordova/plugins/fetch.json')) : {}
  let pluginChanges = []
  for (let p = 0; p < app.useCordovaPlugins.length; p++) {
    if (currentPlugins[app.useCordovaPlugins[p]] === undefined) {
      pluginChanges.push('cordova plugin add ' + app.useCordovaPlugins[p])
    }
  }
  if (pluginChanges.length > 0) {
    let command = 'cd "' + path.resolve(cfg.packageRoot, 'cordova') + '" && ' + pluginChanges.join(' && ')
    run(command, function () {
      callback()
    })
  } else {
    callback()
  }
}

// Update cordova www folder and config.xml
function updateCordovaBuild (callback) {
  // Build folder exists
  if (isThere(path.resolve(cfg.appRoot, 'www/build-' + version))) {
    // Delete cordova www folder
    deleteFiles(path.resolve(cfg.packageRoot, 'cordova/www/**/*'), function (err) {
      if (err) {
        throw new Error(err)
      } else {
        // Copy build files
        copy(path.resolve(cfg.appRoot, 'www/build-' + version + '/**/*'), path.resolve(cfg.packageRoot, 'cordova/www'), function (err) {
          if (err) {
            throw new Error(err)
          } else {
            // Attach cordova js files to HTML
            replace.sync({
              files: path.resolve(cfg.packageRoot, 'cordova/www/index.html'),
              from: /<script/,
              to: '<script type=text/javascript src=cordova.js></script><script'
            })
            // Read cordova config file
            read(path.resolve(cfg.packageRoot, 'cordova/config.xml'), 'utf-8', function (err, content) {
              if (err) {
                throw new Error(err)
              } else {
                // Parse cordova config file
                let xmlParser = new xml.Parser()
                xmlParser.parseString(content, function (err, cordovaConfig) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    // Update project id
                    cordovaConfig.widget.$.id = app.playStoreId
                    // Update build version
                    cordovaConfig.widget.$.version = version
                    // Update application name
                    cordovaConfig.widget.name = app.title
                    // Update description
                    if (app.description) {
                      cordovaConfig.widget.description = app.description
                    } else {
                      delete cordovaConfig.widget.description
                    }
                    // Define preferences
                    cordovaConfig.widget.preference = [
                      {
                        $: {
                          name: 'StatusBarStyle',
                          value: app.statusbarTextColor === 'white' ? 'lightcontent' : 'default'
                        }
                      }
                    ]
                    // Add icons and splashscreens
                    cordovaConfig.widget.platform[0].icon = []
                    cordovaConfig.widget.platform[0].splash = []
                    let iconFolder = path.resolve(cfg.packageRoot, 'icons')
                    let icons = list.sync(iconFolder)
                    for (let i = 0; i < icons.length; i++) {
                      let icon = icons[i]
                      if (/android-icon-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/.test(icon)) {
                        cordovaConfig.widget.platform[0].icon.push({
                          $: {
                            src: path.join('..', 'icons', icon),
                            density: icon.match(/android-icon-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[1] + 'dpi'
                          }
                        })
                      } else if (/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/.test(icon)) {
                        let width = icon.match(/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[2]
                        let height = icon.match(/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[3]
                        let dens = icon.match(/android-launchscreen-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)[1]
                        cordovaConfig.widget.platform[0].splash.push({
                          $: {
                            src: path.join('..', 'icons', icon),
                            density: (width > height ? 'port' : 'land') + '-' + dens + 'dpi'
                          }
                        })
                      }
                    }
                    // Build cordova config file
                    let builder = new xml.Builder()
                    let cordovaConfigXml = builder.buildObject(cordovaConfig)
                    // Save cordova config file
                    write(path.resolve(cfg.packageRoot, 'cordova/config.xml'), cordovaConfigXml, function (err) {
                      if (err) {
                        throw new Error(err)
                      } else {
                        callback()
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    showOnly(version === '0.0.0' ? 'You must build your application first.' : 'Build folder "www/build-' + version + '" not found.')
  }
}

// (Re)build cordova android platform
function buildCordovaAndroid (callback) {
  let removePlatform = isThere(path.resolve(cfg.packageRoot, 'cordova/platforms/android')) ? 'cordova platform rm android && ' : ''
  run('cd "' + path.resolve(cfg.packageRoot, 'cordova') + '" && ' + removePlatform + 'cordova platform add android', function () {
    fs.mkdir(path.resolve(cfg.packageRoot, 'cordova/platforms/android/.idea'))
    callback()
  })
}

// Start build process
checkBuild(function () {
  checkIcons(function () {
    createCordovaProject(function () {
      updateCordovaPlugins(function () {
        updateCordovaBuild(function () {
          buildCordovaAndroid(function () {
            showOnly('Android Studio project version ' + version + ' build, Android Studio is starting ...')
            if (process.platform === 'win32') {
              cmd(path.resolve('C:/Programme/Android/Android Studio/bin'), ['start', 'studio64.exe', '"' + path.resolve(cfg.packageRoot, 'cordova/platforms/android') + '"'], function () {
                showOnly('Android Studio started with build version ' + version)
              })
            } else {
              run('open -a "/Applications/Android Studio.app" "' + path.resolve(cfg.packageRoot, 'cordova/platforms/android') + '"', function () {
                showOnly('Android Studio started with build version ' + version)
              })
            }
          })
        })
      })
    })
  })
})
