// Load packages
var path = require('path')
var isThere = require('is-there')
var fs = require('fs')
var replace = require('replace-in-file')
var saveJSON = require('jsonfile')
var cpx = require('cpx')
var run = require('child_process').exec
saveJSON.spaces = 2
var showOnly = require('./show-only')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('App Framework installation ongoing - please wait ...')

// App Framework is installed as dependency
if (cfg.isInstalled) {
  // Fix package.json (implement updates from demo app to already existing app package.json)
  let newApp = require(cfg.appRoot + 'package.json')
  let demoApp = require(path.resolve(cfg.packageRoot, 'demo-app/package.json'))
  newApp.scripts = demoApp.scripts
  saveJSON.writeFileSync(cfg.appRoot + 'package.json', newApp)

  // Copy template app.vue and reset version in package.json
  if (!isThere(cfg.appRoot + 'app.vue')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/app.vue'), cfg.appRoot)
    let app = require(cfg.appRoot + 'package.json')
    app.version = '0.1.0'
    saveJSON.writeFileSync(cfg.appRoot + 'package.json', app)
  }

  // Copy template images
  if (!isThere(cfg.appRoot + 'images')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/images/*'), cfg.appRoot + 'images')
  }

  // Copy template pages
  if (!isThere(cfg.appRoot + 'pages')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/pages/*'), cfg.appRoot + 'pages')
  }

  // Copy database rules file
  if (!isThere(cfg.appRoot + 'databaseRules.json')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/databaseRules.json'), cfg.appRoot)
  }

  // Copy/update gitignore
  if (isThere(path.resolve(cfg.packageRoot, 'demo-app/.gitignore'))) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/.gitignore'), cfg.appRoot)
  } else if (isThere(path.resolve(cfg.packageRoot, 'demo-app/.npmignore'))) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/.npmignore'), cfg.appRoot)
    fs.renameSync(cfg.appRoot + '.npmignore', cfg.appRoot + '.gitignore')
  }

  // Copy .htaccess file, reset version
  if (!isThere(path.resolve(cfg.appRoot, 'www/.htaccess'))) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/www/.htaccess'), cfg.appRoot + 'www')
    replace.sync({
      files: path.resolve(cfg.appRoot, 'www/.htaccess'),
      replace: /\/build-([0-9]+)\.([0-9]+)\.([0-9]+)\//g,
      with: '/build-0.0.0/'
    })
  }

// App Framework is installed for development
} else {
  // Install Gulp (to build Framework7/Framework7-Vue)
  run('npm install -g gulp')
}

// Install common global packages
run('npm install -g firebase-tools && npm install -g standard && npm install eslint-plugin-html -g', function (err, stdOut, errOut) {
  if (err) {
    console.log(errOut)
    console.log('Error: Cannot install global dependencies')
  } else {
    showOnly('App Framework installed successfully')
  }
})
