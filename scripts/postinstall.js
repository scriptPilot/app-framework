// Load packages
var path = require('path')
var isThere = require('is-there')
var fs = require('fs')
var replace = require('replace-in-file')
var cpx = require('cpx')
var run = require('./run')
var saveJSON = require('jsonfile')
saveJSON.spaces = 2
var showOnly = require('./show-only')

// Load configuration
var cfg = require('./config.js')

// Show message
showOnly('App Framework installation ongoing - please wait ...')

// App Framework is installed as dependency
if (cfg.isInstalled) {
  // Copy template app.vue and reset version in package.json
  if (!isThere(cfg.appRoot + 'app.vue')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/app.vue'), cfg.appRoot)
    var app = require(cfg.appRoot + 'package.json')
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
  if (!isThere(cfg.appRoot + 'database-rules.json')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/database-rules.json'), cfg.appRoot)
  }

  // Copy stoarge rules file
  if (!isThere(cfg.appRoot + 'storage-rules.txt')) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/storage-rules.txt'), cfg.appRoot)
  }

  // Copy/update gitignore
  if (isThere(path.resolve(cfg.packageRoot, 'demo-app/.gitignore'))) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/.gitignore'), cfg.appRoot)
  } else if (isThere(path.resolve(cfg.packageRoot, 'demo-app/.npmignore'))) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/.npmignore'), cfg.appRoot)
    fs.renameSync(cfg.appRoot + '.npmignore', cfg.appRoot + '.gitignore')
  }

  // Copy/update login-screen.vue
  if (isThere(path.resolve(cfg.packageRoot, 'demo-app/pages/login-screen.vue'))) {
    cpx.copySync(path.resolve(cfg.packageRoot, 'demo-app/pages/login-screen.vue'), cfg.appRoot + 'pages')
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
  run('npm update -g gulp')
}

// Install common global packages
showOnly('Installing Firebase tools - please wait ...')
run('npm update -g firebase-tools', function () {
  showOnly('Installing Standard JavaScript - please wait ...')
  run('npm update -g standard', function () {
    showOnly('Installing ESLint html plugin - please wait ...')
    run('npm update -g eslint-plugin-html', function () {
      showOnly('Installing Cordova - please wait ...')
      run('npm update -g cordova', function () {
        showOnly('Clean-up node modules folder - please wait ...')
        run('npm prune', function () {
          showOnly('App Framework installed successfully')
        })
      })
    })
  })
})
