/*

  Purpose:
  - Define paths
  - Fix configuration file
  - Check if user has forked the repo insetead of installing it as dependency
  - Define installation status
  - Load package information
  - Load app configuration
  - Define operating system
  - Function to compare path with .gitignore entries
  Provide everything as an object

*/

'use strict'

// Include Modules
let alert = require('./lib/alert')
let found = require('./lib/found')
let jsonScheme = require('./lib/json-scheme')
let fs = require('fs-extra')
let argParser = require('minimist')
let rel = require('path').join
let abs = require('path').resolve
let sep = require('path').sep

// Read script parameters
let arg = argParser(process.argv.slice(2))

// Define installation status
let installed = found(__dirname, '../../package.json')

// Define paths
let proj = installed ? abs(__dirname, '../../') : abs(__dirname)
let app = abs(proj, 'app')
let cache = abs(proj, 'node_modules/.app-framework-cache')

// Check if user has forked the repo
if (!installed && !found(proj, '.enable-dev-mode')) {
  alert('Error: App Framework should be installed as module.\nPlease check our documentation on GitHub.')
}

// Fix configuration file
if (found(app, 'config.json')) {
  let configFix = jsonScheme.fix(abs(__dirname, 'config-scheme.json'), abs(app, 'config.json'))
  if (Array.isArray(configFix)) {
    alert('Error: Failed to fix config file.\nDetails:\n- ' + configFix.join('\n- '), 'issue')
  }
}

// Load configuration
let pkg = found(proj, 'package.json') ? fs.readJsonSync(abs(proj, 'package.json')) : {}
let cfg = found(app, 'config.json') ? fs.readJsonSync(abs(app, 'config.json')) : {}

// Define operating system
let os = null
if (process.platform === 'win32') {
  os = 'win'
} else if (process.platform === 'darwin') {
  os = 'mac'
} else if (process.platform === 'linux') {
  os = 'linux'
} else {
  alert('Error: Your operation system "' + process.platform + '" is not supported.', 'issue')
}

// Read .gitignore file as array with regexp
let ignoredExp = []
if (found(proj, '.gitignore')) {
  let gitignore = fs.readFileSync(abs(proj, '.gitignore'), 'utf8')
  let rows = gitignore.match(/^(.+)$/gm)
  for (let r = 0; r < rows.length; r++) {
    if (rows[r] !== '' && /^#/.test(rows[r]) === false) {
      let exp = rel(rows[r])
      // Replace path separators with system path separators
      exp = exp.replace(/\//, sep)
      // Escape backslashs
      exp = exp.replace(/\\/g, '\\\\')
      // Escape slashs
      exp = exp.replace(/\//g, '\\\/') // eslint-disable-line
      // Escape points
      exp = exp.replace(/\./g, '\\.')
      // Escape wildcards
      exp = exp.replace(/\*/g, '(.*)')
      // Make last backslash optional (to include folder itself)
      exp = exp.replace(/\\\\$/g, '(\\\\(.*))?')
      // Make last slash optional (to include folder itself)
      exp = exp.replace(/\\\/$/g, '(\\\/(.*))?') // eslint-disable-line
      // Add start/end
      exp = '^' + exp + '$'
      // Create regexp
      let regexp = new RegExp(exp)
      ignoredExp.push(regexp)
    }
  }
}

// Function to check path according .gitignore file
let ignored = function (path) {
  // Transform path, if folder, add separator to end
  let isIgnored = false
  for (let i = 0; i < ignoredExp.length; i++) {
    if (ignoredExp[i].test(path) === true) {
      isIgnored = true
      i = ignoredExp.length
    }
  }
  return isIgnored
}

module.exports = {
  arg: arg,
  installed: installed,
  proj: proj,
  app: app,
  cache: cache,
  pkg: pkg,
  cfg: cfg,
  os: os,
  ignored: ignored
}
