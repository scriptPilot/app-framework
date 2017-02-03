// Load packages
var path = require('path')
var showOnly = require('./show-only')
var zipdir = require('zip-dir')
var read = require('read-file')

// Load configuration
var cfg = require('./config.js')
var app = require(cfg.appRoot + 'package.json')

// Installed as package
if (cfg.isInstalled) {
  // Show message
  showOnly('ZIP file creation ongoing - please wait ...')

  // Define output file name
  var zipFilename = app.name + '_' + (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1 < 10 ? '0' : '') + ((new Date()).getMonth() + 1) + '-' + ((new Date()).getDate() < 10 ? '0' : '') + (new Date()).getDate() + '.zip'

  // Define last build folder (to include)
  var htaccess = read.sync(path.resolve(cfg.appRoot, 'www/.htaccess'), 'utf8')
  var versionSearch = htaccess.match(/build-(.+)\//)
  var lastBuildFolder = path.join('www/build-' + versionSearch[1])

  // Add files to zip
  zipdir(cfg.appRoot, {
    saveTo: zipFilename,

    // Filter files
    filter: function (filepath, stat) {
      filepath = filepath.substr(cfg.appRoot.length)
      return filepath.substr(filepath.length - 4, 4) !== '.zip' && /* exclude other zip files */
             filepath.substr(filepath.length - 4, 4) !== '.log' && /* exclude log files */
             filepath !== 'node_modules' && /* exclude node modules */
             (filepath.substr(0, 3) !== 'www' || filepath.length === 3 || filepath === path.join('www/.htaccess') || filepath.substr(0, lastBuildFolder.length) === lastBuildFolder) /* exclude older build folders */
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
  showOnly('Error: Zip file can be created only after App Framework is installed as a package')
}
