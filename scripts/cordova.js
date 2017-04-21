/*

  Purpose with specific arguments:

  --ios to open dev build in iOS emulator
  --android to open dev build in Android emulator
  --xcode to open given version build in Xcode
  --studio to open given version build in Android Studio

  Optionally: --version x.y.z

*/

'use strict'

// Load packages
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let type = require('../lib/type')
let fs = require('fs-extra')
let path = require('path')
let abs = require('path').resolve
let xml = require('xml2js')

// Deploy current version by default
if (env.arg.version === undefined && (env.arg.xcode === true || env.arg.studio === true)) {
  env.arg.version = env.pkg.version
} else if (env.arg.ios === true || env.arg.android === true) {
  env.arg.version = 'dev'
}

// Check arguments
if (env.arg.ios === true || env.arg.xcode === true) {
  if (env.os !== 'mac') {
    alert('iOS builds are only possible on macOS devices.', 'exit')
  }
} else if (env.arg.android !== true && env.arg.studio !== true) {
  alert('Cordova argument missing.', 'issue')
}

// Define Cordova bin directory
let binDir = abs(env.proj, 'node_modules/cordova/bin')

// Define build directories
let buildSourceDir = abs(env.cache, 'snapshots', 'build-' + env.arg.version, 'build/www')
let wwwFolder = abs(binDir, 'www')

// Define steps
let deleteFiles = function (files, callback) {
  if (Array.isArray(files) && files.length > 0) {
    fs.remove(abs(binDir, files.shift()), function (err) {
      if (err) {
        alert('Failed to remove files in Cordova folder.', 'issue')
      } else {
        deleteFiles(files, callback)
      }
    })
  } else {
    callback()
  }
}
let resetCordovaFolder = function (callback) {
  alert('Cordova directory reset ongoing - please wait ...')
  fs.readdir(binDir, function (err, files) {
    if (err) {
      alert('Cordova directory reset failed.', 'issue')
    } else {
      let filesToDelete = []
      for (let f = 0; f < files.length; f++) {
        if (files[f] !== 'cordova' && files[f] !== 'cordova.cmd') {
          filesToDelete.push(files[f])
        }
      }
      deleteFiles(filesToDelete, function () {
        alert('Cordova directory reset done.')
        callback()
      })
    }
  })
}
let createCordovaProject = function (callback) {
  alert('Cordova project folder creation ongoing - please wait ...')
  cmd(binDir, 'cordova create .temp', function () {
    fs.copy(abs(binDir, '.temp'), binDir, function (err) {
      if (!err) {
        fs.remove(abs(binDir, '.temp'), function (err) {
          if (!err) {
            alert('Cordova project folder creation done.')
            callback()
          } else {
            alert('Failed to remove Cordova temp folder.', 'issue')
          }
        })
      } else {
        alert('Failed to copy Cordova project folder.', 'issue')
      }
    })
  }, function () {
    alert('Failed to create Cordova project folder.', 'issue')
  })
}
let updateCordovaConfig = function (callback) {
  alert('Cordova configuration update ongoing - please wait ...')
  // Copy icons and read to array
  try {
    fs.copySync(abs(env.cache, 'icons/dev'), abs(binDir, 'icons'))
    var icons = fs.readdirSync(abs(env.cache, 'icons/dev'))
  } catch (err) {
    alert('Failed to copy and read icon folder.', 'issue')
  }
  // Start configuration
  let config = {}
  // Add widget
  config = {
    '$': {
      'id': env.arg.ios === true || env.arg.xcode === true ? env.cfg.appStoreId : env.cfg.playStoreId,
      'version': env.arg.version === 'dev' ? env.arg.version + '-' + (new Date().getTime()) : env.arg.version,
      'xmlns': 'http://www.w3.org/ns/widgets',
      'xmlns:cdv': 'http://cordova.apache.org/ns/1.0'
    }
  }
  // Add name
  config.name = env.cfg.title
  // Author
  if (type(env.pkg.author) === 'object') {
    config.author = {
      _: env.pkg.author.name
    }
    if (type(env.pkg.author.email) === 'string' || type(env.pkg.author.url) === 'string') {
      config.author.$ = {}
      if (type(env.pkg.author.email) === 'string') {
        config.author.$.email = env.pkg.author.email
      }
      if (type(env.pkg.author.url) === 'string') {
        config.author.$.url = env.pkg.author.url
      }
    }
  } else if (type(env.pkg.author) === 'string') {
    let authorInfo = env.pkg.author.match(/^(.+?)( <(.+)>)?( \((.+?)\))?$/)
    if (env.pkg.author !== null && authorInfo[1] !== undefined) {
      config.author = {
        _: authorInfo[1]
      }
      if (authorInfo[3] !== undefined || authorInfo[5] !== undefined) {
        config.author.$ = {}
        if (authorInfo[3] !== undefined) {
          config.author.$.email = authorInfo[3]
        }
        if (authorInfo[5] !== undefined) {
          config.author.$.url = authorInfo[5]
        }
      }
    }
  }
  // Add description
  if (env.pkg.description !== undefined) {
    config.description = env.pkg.description
  }
  // Add content entry point
  config.content = {
    '$': {
      'src': 'index.html'
    }
  }
  // Add Android platform
  if (env.arg.android === true || env.arg.studio) {
    config.platform = {
      '$': {
        'name': 'android'
      },
      'allow-intent': {
        '$': {
          'href': 'market:*'
        }
      },
      'icon': [],
      'splash': []
    }
    for (let i = 0; i < icons.length; i++) {
      let iconInfo = icons[i].match(/android-(icon|splash)-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)
      if (iconInfo !== null) {
        config.platform[iconInfo[1]].push({
          '$': {
            'src': path.join('icons/' + iconInfo[0]),
            'density': (iconInfo[1] === 'splash' ? (iconInfo[3] > iconInfo[4] ? 'land' : 'port') + '-' : '') + iconInfo[2] + 'dpi'
          }
        })
      }
    }
  }
  // Add iOS platform
  if (env.arg.ios === true || env.arg.xcode === true) {
    config.platform = {
      $: {
        name: 'ios'
      },
      'allow-intent': [
        {
          $: {
            href: 'itms:*'
          }
        },
        {
          $: {
            href: 'itms-apps:*'
          }
        }
      ],
      'icon': [],
      'splash': []
    }
    for (let i = 0; i < icons.length; i++) {
      let iconInfo = icons[i].match(/ios-(icon|splash)-([0-9]+)x([0-9]+)\.png/)
      if (iconInfo !== null) {
        config.platform[iconInfo[1]].push({
          '$': {
            'src': path.join('icons/' + iconInfo[0]),
            'width': iconInfo[2],
            'height': iconInfo[3]
          }
        })
      }
    }
  }
  // White listening
  config.plugin = [
    {
      '$': {
        'name': 'cordova-plugin-whitelist',
        'spec': '1'
      }
    }
  ]
  config.access = {
    $: {
      origin: '*'
    }
  }
  config['allow-intent'] = [
    {
      $: {
        href: 'http://*/*'
      }
    },
    {
      $: {
        href: 'https://*/*'
      }
    },
    {
      $: {
        href: 'tel:*'
      }
    },
    {
      $: {
        href: 'sms:*'
      }
    },
    {
      $: {
        href: 'mailto:*'
      }
    },
    {
      $: {
        href: 'geo:*'
      }
    }
  ]
  // Preferences
  config.preference = [
    {
      $: {
        name: 'StatusBarStyle',
        value: env.cfg.statusbarTextColor === 'white' ? 'lightcontent' : 'default'
      }
    }
  ]
  // Update config files
  let builder = new xml.Builder({rootName: 'widget', xmldec: {version: '1.0', encoding: 'utf-8'}})
  let xmlContent = builder.buildObject(config)
  fs.writeFile(abs(binDir, 'config.xml'), xmlContent, function (err) {
    if (!err) {
      callback()
    } else {
      alert('Cordova configuration update failed.', 'issue')
    }
  })
}
let updateWwwFolder = function (callback) {
  alert('Cordova build folder update ongoing - please wait ...')
  fs.remove(wwwFolder, function (err) {
    if (!err) {
      fs.copy(buildSourceDir, wwwFolder, function (err) {
        if (!err) {
          fs.readFile(abs(wwwFolder, 'index.html'), 'utf8', function (err, html) {
            if (!err) {
              html = html.replace('<script', '<script type=text/javascript src=cordova.js></script><script')
              fs.writeFile(abs(wwwFolder, 'index.html'), html, function (err) {
                if (!err) {
                  alert('Cordova build folder update done.')
                  callback()
                } else {
                  alert('Failed to update the index.html file', 'issue')
                }
              })
            } else {
              alert('Failed to read the index.html file.', 'issue')
            }
          })
        } else {
          alert('Failed to copy build folder.', 'issue')
        }
      })
    } else {
      alert('Failed to reset Cordova build folder.', 'issue')
    }
  })
}
let installCordovaPlugins = function (callback, pluginList) {
  alert('Cordova plugin installation ongoing - please wait ...')
  if (pluginList === undefined) {
    pluginList = env.cfg.useCordovaPlugins
    try {
      let defaultPlugins = fs.readJsonSync(abs(__dirname, '../config-scheme.json')).useCordovaPlugins.default
      for (let d = 0; d < defaultPlugins.length; d++) {
        if (pluginList.indexOf(defaultPlugins[d]) === -1) {
          pluginList.push(defaultPlugins[d])
        }
      }
    } catch (err) {
      alert('Failed to read default plugin list.', 'issue')
    }
  }
  if (Array.isArray(pluginList) && pluginList.length > 0) {
    cmd(binDir, 'cordova plugin add ' + pluginList.shift(), function () {
      installCordovaPlugins(callback, pluginList)
    }, function () {
      alert('Failed to install Cordova plugins.', 'issue')
    })
  } else {
    alert('Cordova plugin installation done.')
    callback()
  }
}
let addCordovaPlatforms = function (callback) {
  alert('Cordova platform installation ongoing - please wait ...')
  if (env.arg.ios === true || env.arg.xcode === true) {
    cmd(binDir, 'cordova platform add ios', function () {
      alert('Cordova platform installation done for iOS.')
      callback()
    }, function () {
      alert('Cordova platform installation failed for iOS.', 'issue')
    })
  } else {
    cmd(binDir, 'cordova platform add android', function () {
      fs.mkdir(abs(binDir, 'platforms/android/.idea'), function (err) {
        if (!err) {
          alert('Cordova platform installation done for Android.')
          callback()
        } else {
          alert('Failed to create .idea folder for Cordova Android platform.', 'issue')
        }
      })
    }, function () {
      alert('Cordova platform installation failed for Android.', 'issue')
    })
  }
}

let deployDevRules = function (callback) {
  if (env.arg.version === 'dev') {
    cmd(__dirname, 'node firebase --database --storage --version dev', function () {
      callback()
    })
  } else {
    callback()
  }
}

// Run script
deployDevRules(function () {
  cmd(__dirname, 'node cache-version --version ' + env.arg.version, function () {
    resetCordovaFolder(function () {
      createCordovaProject(function () {
        updateCordovaConfig(function () {
          updateWwwFolder(function () {
            installCordovaPlugins(function () {
              addCordovaPlatforms(function () {
                if (env.arg.ios === true) {
                  alert('iOS simulator start ongoing - please wait ...')
                  cmd(binDir, 'cordova emulate ios', function () {
                    alert('iOS simulator started.')
                  })
                } else if (env.arg.xcode === true) {
                  alert('Xcode start ongoing - please wait ...')
                  cmd(__dirname, 'open -a Xcode "' + abs(binDir, 'platforms/ios', env.cfg.title + '.xcodeproj') + '"', function () {
                    alert('Xcode started.')
                  })
                } else {
                  alert('Android Studio start ongoing - please wait ...')
                  if (env.os === 'win') {
                    let possibleInstallations = [
                      abs(process.env['ProgramFiles'], 'Android/Android Studio/bin/studio64.exe'),
                      abs(process.env['ProgramFiles'], 'Android/Android Studio/bin/studio.exe'),
                      abs(process.env['ProgramFiles(x86)'], 'Android/Android Studio/bin/studio64.exe'),
                      abs(process.env['ProgramFiles(x86)'], 'Android/Android Studio/bin/studio.exe')
                    ]
                    for (let p = 0; p < possibleInstallations.length; p++) {
                      if (found(possibleInstallations[p])) {
                        cmd(path.dirname(possibleInstallations[p]), ['start', path.basename(possibleInstallations[p]), '"' + abs(binDir, 'platforms/android') + '"'], function () {
                          alert('Android Studio started.')
                        })
                        p = possibleInstallations.length
                      } else if (p + 1 === possibleInstallations.length) {
                        alert('Android Studio installation path not found.\nPlease open Android Studio manually and open project path:\n\n' + abs(binDir, 'platforms/android'), 'issue')
                      }
                    }
                  } else if (env.os === 'mac') {
                    cmd(__dirname, 'open -a "/Applications/Android Studio.app" "' + abs(binDir, 'platforms/android') + '"', function () {
                      alert('Android Studio started.')
                    })
                  } else if (env.os === 'linux') {
                    let possibleInstallations = [
                      abs('/bin/android-studio/bin/studio.sh'),
                      abs('/opt/android-studio/bin/studio.sh'),
                      abs('/usr/bin/android-studio/bin/studio.sh'),
                      abs('/usr/local/android-studio/bin/studio.sh'),
                      abs('/usr/local/bin/android-studio/bin/studio.sh')
                    ]
                    for (let p = 0; p < possibleInstallations.length; p++) {
                      if (found(possibleInstallations[p])) {
                        cmd(path.dirname(possibleInstallations[p]), ['./' + path.basename(possibleInstallations[p]), '"' + abs(binDir, 'platforms/android') + '"'], function () {
                          alert('Android Studio started.')
                        })
                        p = possibleInstallations.length
                      } else if (p + 1 === possibleInstallations.length) {
                        alert('Android Studio installation path not found.\nPlease open Android Studio manually and open project path:\n\n' + abs(binDir, 'platforms/android'), 'issue')
                      }
                    }
                  } else {
                    alert('Unknown operating system "' + env.os + '".', 'issue')
                  }
                }
              })
            })
          })
        })
      })
    })
  })
})
