/* Purpose: Upgrade config to newer app versions (just renaming - deleting and adding will be done by default) */

'use strict'

// Include modules
let alert = require('../lib/alert')
let found = require('../lib/found')
let fs = require('fs-extra')
let path = require('path')

module.exports = function (appRoot) {
  if (found(appRoot, 'config.json')) {
    try {
      // Read config
      let cfg = fs.readJsonSync(path.resolve(appRoot, 'config.json'))
      // to v1.4
      if (cfg.loadIconFonts !== undefined) cfg.useIconFonts = cfg.loadIconFonts
      if (cfg.firebase.allowUserRegistration !== undefined) cfg.firebase.allowEmailRegistration = cfg.firebase.allowUserRegistration
      if (cfg.firebase.allowEmailLogin === undefined && cfg.firebase.authDomain !== '') cfg.firebase.allowEmailLogin = true
      if (cfg.firebase.useEmailLogin !== undefined) cfg.firebase.allowEmailLogin = cfg.firebase.useEmailLogin
      if (cfg['dev-firebase'] !== undefined) cfg.devFirebase = cfg['dev-firebase']
      if (cfg.devFirebase.allowUserRegistration !== undefined) cfg.devFirebase.allowEmailRegistration = cfg.devFirebase.allowUserRegistration
      if (cfg.devFirebase.useEmailLogin !== undefined) cfg.devFirebase.allowEmailLogin = cfg.devFirebase.useEmailLogin
      if (cfg.devFirebase.allowEmailLogin === undefined && cfg.devFirebase.authDomain !== '') cfg.devFirebase.allowEmailLogin = true
      if (cfg.devFirebase.useDevFirebaseOnTesting !== undefined) cfg.devFirebase.deployDevRulesOnTesting = cfg.devFirebase.useDevFirebaseOnTesting
      if (cfg.defaultLanguage !== undefined) cfg.language = cfg.defaultLanguage
      if (cfg.statusbarVisibility === 'visible') cfg.statusbarVisibility = true
      if (cfg.statusbarVisibility === 'hidden') cfg.statusbarVisibility = false
      // Write config
      fs.writeJsonSync(path.resolve(appRoot, 'config.json'), cfg)
    } catch (err) {
      alert('Failed to upgrade the config.json file.', 'issue')
    }
  }
}
