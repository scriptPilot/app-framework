// Load packages
var path = require('path')
var showOnly = require('./show-only')
var zipdir = require('zip-dir')

// Load configuration
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Installed as package
if (cfg.isInstalled) {
  // Show message
  showOnly('ZIP file creation ongoing - please wait ...')

  let zipFilename = app.name + '_' + (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1 < 10 ? '0' : '') + ((new Date()).getMonth() + 1) + '-' + ((new Date()).getDate() < 10 ? '0' : '') + (new Date()).getDate() + '.zip'
  zipdir('./demo-app', {
    saveTo: zipFilename,
    filter: function (filepath, stat) {
      let lastBuildFolder = path.join('www', 'build-' + app.devDependencies['app-framework'].substr(1))
      filepath = filepath.substr(path.resolve(cfg.appRoot).length + 1)
      return (filepath.substr(0, 3) !== 'www' && filepath.substr(filepath.length - 3, 3) !== 'zip') ||
              filepath === 'www' ||
              filepath === path.join('www/.htaccess') ||
              filepath === lastBuildFolder ||
              filepath.substr(0, lastBuildFolder.length + 1) === lastBuildFolder + path.sep
    }
  }, function (err, buffer) {
    if (!err) {
      showOnly('Project files and latest build saved to "' + zipFilename + '". You can backup that ZIP file to an external drive or cloud now.')
    } else {
      showOnly('Error: Zip file creation failed')
    }
  })

// Not installed as package
} else {
  showOnly('Error: Zip file can be created only after App Framework is installed as package')
}
