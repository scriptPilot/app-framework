/*

  Purpose: Deploy build to FTP server and update .htaccess file

*/

'use strict'

// Include modules
let env = require('../env')
let alert = require('../lib/alert')
let cmd = require('../lib/cmd')
let found = require('../lib/found')
let fs = require('fs-extra')
let ftp = require('ftp')
let abs = require('path').resolve
let rec = require('recursive-readdir')

// Steps
let getVersion = function (callback) {
  if (env.arg.version === undefined) {
    callback(env.pkg.version)
  } else if (/^([0-9]+)\.([0-9]+)\.([0-9]+)$/.test(env.arg.version) === true) {
    callback(env.arg.version)
  } else {
    alert('Version argument not valid.', 'error')
  }
}
let getConfig = function (callback) {
  let configFile = abs(env.proj, 'ftp-config.json')
  if (found(configFile)) {
    fs.readJson(configFile, function (err, config) {
      if (err) {
        alert('Reading the "ftp-config.json" file failed.', 'issue')
      } else {
        if (config.host !== undefined && config.port !== undefined && config.user !== undefined && config.password !== undefined) {
          callback(config)
        } else {
          alert('File "ftp-config.json" must contain object with host, port, user and password properties.', 'error')
        }
      }
    })
  } else {
    let standardConfig = {
      host: '',
      port: '21',
      user: '',
      password: ''
    }
    fs.writeJson(configFile, standardConfig, function (err) {
      if (!err) {
        alert('Please update the "ftp-config.json" file with your FTP server data first.', 'exit')
      } else {
        alert('Creation of the "ftp-config.json" file failed.', 'issue')
      }
    })
  }
}
let connect = function (config, callback) {
  alert('Connecting to the FTP server - please wait ...')
  let client = new ftp() // eslint-disable-line
  client.on('ready', function () {
    callback(client)
  })
  try {
    client.connect(config)
  } catch (err) {
    alert('Failed to connect to the FTP server.\nPlease check your "ftp-config.json" file.', 'error')
  }
}
/*
let deployBuild = function (client, callback) {
  let files = rec(abs(env.proj, 'build/www'))


  client.put('build', 'build', function (err) {
    if (!err) {
      callback()
    } else {
      alert(err, 'exit')
      alert('Failed to upload build folder to the FTP server.', 'issue')
    }
  })
  client.list(function (err, list) {
    let versionFound = false
    list.map(function (item) {
      if (item.name === 'build-' + version) {
        versionFound = true
      }
    })
    callback(versionFound)
  })
}
*/
let updateHtaccess = function (client) {
  client.mkdir('main/sub', true, function (err) {
    if (!err) {
      client.put('build/icon.png', 'main/sub/icon.png', function (err) {
        if (!err) {
          alert('Upload done.')
        } else {
          alert('Failed to upload file.' + err)
        }
      })
    }
  })
}

// Run
alert('FTP deployment ongoing - please wait ...')
getConfig(function (config) {
  ///getVersion(function (version) {
    connect(config, function (client) {
      updateHtaccess(client, function () {
        alert('done')
        client.end()
      })
    })
  ///})
})
