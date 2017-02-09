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
var img = require('lwip')
var fs = require('fs-extra')

// Load configuration
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Show message
showOnly('iOS build ongoing - please wait ...')

// Create cordova project folder
function createCordovaProject (callback) {
  if (!isThere(path.resolve(cfg.packageRoot, 'cordova/config.xml'))) {
    run('cd "' + cfg.packageRoot + '" && cordova create cordova', function () {
      callback()
    })
  } else {
    callback()
  }
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
  for (let p in currentPlugins) {
    if (app.useCordovaPlugins.indexOf(p) === -1 && p !== 'cordova-plugin-whitelist') {
      pluginChanges.push('cordova plugin rm ' + p)
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

// Function to save cordova config
function saveCordovaConfig (config, callback) {
  // Build cordova config file
  let builder = new xml.Builder()
  let cordovaConfigXml = builder.buildObject(config)
  // Save cordova config file
  write(path.resolve(cfg.packageRoot, 'cordova/config.xml'), cordovaConfigXml, function (err) {
    if (err) {
      throw new Error(err)
    } else {
      callback()
    }
  })
}

// Update cordova www folder and config.xml
function updateCordovaBuild (callback) {
  // Get version of last build to be used
  var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
  var version = htaccess.match(/build-(.+)\//)[1]
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
                    // Clean-up cordova config
                    for (let i in cordovaConfig.widget) {
                      if (i === 'platform') {
                        for (let i2 in cordovaConfig.widget[i]) {
                          // Remove icons
                          if (cordovaConfig.widget[i][i2].icon !== undefined) {
                            delete cordovaConfig.widget[i][i2].icon
                          }
                        }
                      }
                    }
                    // Update application name
                    cordovaConfig.widget.name = app.title
                    // Update ios icons and startup images
                    if (isThere(path.resolve(cfg.appRoot, app.faviconIcon))) {
                      if (!isThere(path.resolve(cfg.packageRoot, 'cordova/icons'))) {
                        fs.mkdir(path.resolve(cfg.packageRoot, 'cordova/icons'))
                      } else {
                        deleteFiles.sync(path.resolve(cfg.packageRoot, 'cordova/icons/**/*'))
                      }
                      cordovaConfig.widget.platform[1].icon = []
                      let sizes = [20, 29, 29, 40, 50, 57, 58, 60, 72, 76, 80, 87, 100, 114, 120, 144, 152, 167, 170, 180, 1024]
                      img.open(path.resolve(cfg.appRoot, app.faviconIcon), function (err, image) {
                        if (err) {
                          throw new Error(err)
                        }
                        img.create(image.width(), image.height(), 'white', function (err, canvas) {
                          if (err) {
                            throw new Error(err)
                          }
                          canvas.paste(0, 0, image, function (err, canvas) {
                            if (err) {
                              throw new Error(err)
                            }
                            for (let s = 0; s < sizes.length; s++) {
                              canvas.clone(function (err, thumbnail) {
                                if (err) {
                                  throw new Error(err)
                                }
                                thumbnail.resize(sizes[s], sizes[s], function (err, thumbnail) {
                                  if (err) {
                                    throw new Error(err)
                                  }
                                  thumbnail.writeFile(path.resolve(cfg.packageRoot, 'cordova/icons/icon-' + sizes[s] + '.png'), function (err) {
                                    if (!err) {
                                      cordovaConfig.widget.platform[1].icon.push({
                                        $: {
                                          src: 'icons/icon-' + sizes[s] + '.png',
                                          width: sizes[s],
                                          height: sizes[s]
                                        }
                                      })
                                    }
                                    if (s + 1 === sizes.length) {
                                      saveCordovaConfig(cordovaConfig, callback)
                                    }
                                  })
                                })
                              })
                            }
                          })
                        })
                      })
                    } else {
                      saveCordovaConfig(cordovaConfig, callback)
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    throw new Error(version === '0.0.0' ? 'You must build your application first.' : 'Build folder "www/build-' + version + '" not found.')
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
createCordovaProject(function () {
  updateCordovaPlugins(function () {
    updateCordovaBuild(function () {
      buildCordovaIos(function () {
        run('open -a Xcode "' + path.resolve(cfg.packageRoot, 'cordova/platforms/ios', app.title + '.xcodeproj') + '"')
        showOnly('iOS build done! Please open Xcode to run the simulator or to publish your application to the App Store.')
      })
    })
  })
})
