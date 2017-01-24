var pkg = require('../package.json')
var app = require('..' + pkg.appRoot + 'package.json')

var saveJSON = require('jsonfile')
saveJSON.spaces = 2  

var isThere = require('is-there')
var write = require('write')
var deleteFiles = require('delete')
var path = require('path')

// Update Firebase tool configuration
if (app.firebase.useHostingService === true || app.firebase.useDatabaseRules === true) {
  
  // Write project config
  if (!isThere(path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc'))) {
    write.sync(path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc'), '{}')
  }
  saveJSON.writeFileSync(path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc'), {        
    'projects': {
      'default': app.firebase.authDomain.substr(0, app.firebase.authDomain.indexOf('.firebaseapp.com'))
    }       
  })

  // Create firebase config object
  let firebaseConfig = {}
  
  // Update hosting
  if (app.firebase.useHostingService === true) {
    firebaseConfig.hosting = {
      'public': 'www/build-' + pkg.version
    }      
  }    
  
  // Update database rules
  if (app.firebase.useDatabaseRules === true) {
    firebaseConfig.database = {
      rules: 'firebaseDatabaseRules.json'
    }
    
    // Create file with standard rules
    if (!isThere(path.resolve(__dirname, '..' + pkg.appRoot + 'firebaseDatabaseRules.json'))) {
      write.sync(path.resolve(__dirname, '..' + pkg.appRoot + 'firebaseDatabaseRules.json'), '{}')
      saveJSON.writeFileSync(path.resolve(__dirname, '..' + pkg.appRoot + 'firebaseDatabaseRules.json'), {        
        'rules': {
          '.read': 'auth != null',
          '.write': 'auth != null'
        }        
      })
    }
    
  }
  
  // Save config
  saveJSON.writeFileSync(path.resolve(__dirname, '..' + pkg.appRoot + 'firebase.json'), firebaseConfig)
  
// Delete Firebase tool configuration
} else {
  if (isThere(path.resolve(__dirname, '..' + pkg.appRoot + 'firebase.json'))) {
    deleteFiles.sync([path.resolve(__dirname, '..' + pkg.appRoot + 'firebase.json')])
  }
  if (isThere(path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc'))) {
    deleteFiles.sync([path.resolve(__dirname, '..' + pkg.appRoot + '.firebaserc')])
  }
}

module.exports = {}