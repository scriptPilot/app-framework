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
var cmd = require('./cmd')

// Cancel on Windows
if (process.platform === 'win32') {
  showOnly('iOS builds are only possible on macOS machines, like iMac or MacBook', true)
}

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
showOnly('Xcode project build ongoing with application build version ' + version + ' - please wait ...')

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
  run('cd "' + cfg.packageRoot + '" && rm -rf ~/.cordova', function () {
    run('cd "' + cfg.packageRoot + '" && cordova create cordova', function () {
      callback()
    })
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
                    cordovaConfig.widget.$.id = app.appStoreId
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
                    cordovaConfig.widget.platform[1].icon = []
                    cordovaConfig.widget.platform[1].splash = []
                    let iconFolder = path.resolve(cfg.packageRoot, 'icons')
                    let icons = list.sync(iconFolder)
                    for (let i = 0; i < icons.length; i++) {
                      let icon = icons[i]
                      if (/ios-icon-([0-9]+)x([0-9]+)\.png/.test(icon)) {
                        cordovaConfig.widget.platform[1].icon.push({
                          $: {
                            src: path.join('..', 'icons', icon),
                            width: icon.match(/ios-icon-([0-9]+)x([0-9]+)\.png/)[1],
                            height: icon.match(/ios-icon-([0-9]+)x([0-9]+)\.png/)[2]
                          }
                        })
                      } else if (/ios-launchscreen-([0-9]+)x([0-9]+)\.png/.test(icon)) {
                        cordovaConfig.widget.platform[1].splash.push({
                          $: {
                            src: path.join('..', 'icons', icon),
                            width: icon.match(/ios-launchscreen-([0-9]+)x([0-9]+)\.png/)[1],
                            height: icon.match(/ios-launchscreen-([0-9]+)x([0-9]+)\.png/)[2]
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

// (Re)build cordova ios platform
function buildCordovaIos (callback) {
  let removePlatform = isThere(path.resolve(cfg.packageRoot, 'cordova/platforms/ios')) ? 'cordova platform rm ios && ' : ''
  run('cd "' + path.resolve(cfg.packageRoot, 'cordova') + '" && ' + removePlatform + 'cordova platform add ios', function () {
    callback()
  })
}

// Start build process
checkBuild(function () {
  checkIcons(function () {
    createCordovaProject(function () {
      updateCordovaPlugins(function () {
        updateCordovaBuild(function () {
          buildCordovaIos(function () {
            showOnly('Xcode project version ' + version + ' build, Xcode is starting ...')
            run('open -a Xcode "' + path.resolve(cfg.packageRoot, 'cordova/platforms/ios', app.title + '.xcodeproj') + '"', function () {
              showOnly('Xcode started with build version ' + version)
            })
          })
        })
      })
    })
  })
})
