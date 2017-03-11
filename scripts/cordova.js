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
let fs = require('fs-extra')
let abs = require('path').resolve

// Define Cordova bin directory
let binDir = abs(env.proj, 'node_modules/cordova/bin')

// Define build directories
let buildSourceDir = abs(env.proj, 'build/www')
let buildDestDir = abs(binDir, 'www')

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
let installCordovaPlugins = function (pluginList, callback) {
  alert('Cordova plugin installation ongoing - please wait ...')
  if (Array.isArray(pluginList) && pluginList.length > 0) {
    cmd(binDir, 'cordova plugin add ' + pluginList.shift(), function () {
      installCordovaPlugins(pluginList, callback)
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
  cmd(binDir, 'cordova platform add android', function () {
    fs.mkdir(abs(binDir, 'platforms/android/.idea'), function (err) {
      if (!err) {
        if (env.os === 'mac') {
          cmd(binDir, 'cordova platform add ios', function () {
            alert('Cordova platform installation done for iOS and Android.')
            callback()
          }, function () {
            alert('Failed to install Cordova iOS platform.', 'issue')
          })
        } else {
          alert('Cordova platform installation done for Android.')
          callback()
        }
      } else {
        alert('Failed to create .idea folder for Cordova Android platform.', 'issue')
      }
    })
  }, function () {
    alert('Failed to install Cordova Android platform.', 'issue')
  })
}
let updateBuildFolder = function (callback) {
  alert('Cordova build folder update ongoing - please wait ...')
  fs.remove(buildDestDir, function (err) {
    if (!err) {
      fs.copy(buildSourceDir, buildDestDir, function (err) {
        if (!err) {
          fs.readFile(abs(buildDestDir, 'index.html'), 'utf8', function (err, html) {
            if (!err) {
              html = html.replace('<script', '<script type=text/javascript src=cordova.js></script><script')
              fs.writeFile(abs(buildDestDir, 'index.html'), html, function (err) {
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

// Run script
resetCordovaFolder(function () {
  createCordovaProject(function () {
    addCordovaPlatforms(function () {
      installCordovaPlugins(env.cfg.useCordovaPlugins, function () {
        updateBuildFolder(function () {
          alert('Done')
        })
      })
    })
  })
})
