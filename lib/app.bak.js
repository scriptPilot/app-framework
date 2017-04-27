/* Purpose: Provide client code */

/* eslint-disable */
/*

'use strict'

let manageFirebase = {
  data: {
    user: null,
    db: null,
    store: null,
    timestamp: null
  },
  created: function () {
    // Use Firebase
    if (process.env.USE_FIREBASE_APP === 'true') {
      // Include scripts
      let firebase = require('firebase/app')
      if (process.env.USE_FIREBASE_AUTH === 'true') require('firebase/auth')
      if (process.env.USE_FIREBASE_DATABASE === 'true') require('firebase/database')
      if (process.env.USE_FIREBASE_STORAGE === 'true') require('firebase/storage')
      // Initialize Firebase
      firebase.initializeApp(process.env.NODE_ENV === 'production' ? this.config.firebase : this.config.devFirebase)
      // Use auth service
      if (process.env.USE_FIREBASE_AUTH === 'true') {
        // Get initial user data from local storage
        this.user = window.localStorage.user !== undefined ? JSON.parse(window.localStorage.user) : null
        // Monitor user changes
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            this.user = {
              uid: user.uid,
              email: user.email
            }
          } else {
            this.user = null
          }
        })
      }
      // Use database service
      if (process.env.USE_FIREBASE_DATABASE === 'true') {
        this.db = function (path) {
          return firebase.database().ref(path)
        }
        this.timestamp = firebase.database.ServerValue.TIMESTAMP
      }
      // Use storage service
      if (process.env.USE_FIREBASE_STORAGE === 'true') {
        this.store = function (path) {
          return firebase.storage().ref(path)
        }
      }
    }
  },
  watch: {
    user: function (newUser) {
      // Update local storage
      if (newUser === null) {
        window.localStorage.removeItem('user')
      } else {
        window.localStorage.user = JSON.stringify(newUser)
      }
      // Update window object
      window.user = newUser
    },
    db: function (newDB) {
      // Update window object
      window.db = newDB
    },
    store: function (newStore) {
      // Update window object
      window.store = newStore
    },
    timestamp: function (newTimestamp) {
      // Update window object
      window.timestamp = newTimestamp
    }
  }
}
let manageLanguage = {
  data: {
    language: null
  },
  created: function () {
    this.language = window.localStorage.language
  },
  watch: {
    language: function (newLanguage, oldLanguage) {
      if (/^([a-z]{2})$/.test(newLanguage)) {
        // Update local storage
        window.localStorage.language = newLanguage
      } else {
        // Rollback
        this.language = oldLanguage !== null ? oldLanguage : this.config.defaultLanguage
      }
    }
  }
}
let manageStatusbar = {
  data: {
    statusbarTextColor: null,
    statusbarBackgroundColor: null,
    statusbarVisibility: null
  },
  watch: {
    f7init: function () {
      this.statusbarTextColor = window.localStorage.statusbarTextColor
      this.statusbarBackgroundColor = window.localStorage.statusbarBackgroundColor
      this.statusbarVisibility = window.localStorage.statusbarVisibility
    },
    statusbarTextColor: function (newColor, oldColor) {
      if (newColor === 'white') {
        // Update local storage
        window.localStorage.statusbarTextColor = 'white'
        // Update DOM
        window.Dom7('meta[name=apple-mobile-web-app-status-bar-style]').attr('content', 'black')
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.styleLightContent()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.styleLightContent()
            })
          }
        }
      } else if (newColor === 'black') {
        // Update local storage
        window.localStorage.statusbarTextColor = 'black'
        // Update DOM
        window.Dom7('meta[name=apple-mobile-web-app-status-bar-style]').attr('content', 'black-translucent')
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.styleDefault()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.styleDefault()
            })
          }
        }
      } else {
        // Rollback
        this.statusbarTextColor = oldColor !== null ? oldColor : this.config.statusbarTextColor
      }
    },
    statusbarBackgroundColor: function (newColor, oldColor) {
      if (/^[0-9a-f]{6}$/i.test(newColor)) newColor = '#' + newColor
      if (/^#[0-9a-f]{6}$/i.test(newColor)) {
        // Update local storage
        window.localStorage.statusbarBackgroundColor = newColor
        // Update DOM
        window.Dom7('.statusbar-overlay').css('background-color', newColor)
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.backgroundColorByHexString(newColor)
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.backgroundColorByHexString(newColor)
            })
          }
        }
      } else {
        // Rollback
        this.statusbarBackgroundColor = oldColor !== null ? oldColor : this.config.statusbarBackgroundColor
      }
    },
    statusbarVisibility: function (newState, oldState) {
      if (newState === 'visible') {
        // Update local storage
        window.localStorage.removeItem('statusbarVisibility')
        // Update DOM
        if (window.f7.device.statusBar === true) {
          window.Dom7('html').addClass('with-statusbar-overlay')
        } else {
          window.Dom7('html').removeClass('with-statusbar-overlay')
        }
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.show()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.show()
            })
          }
        }
      } else if (newState === 'hidden') {
        // Update local storage
        window.localStorage.statusbarVisibility = 'hidden'
        // Update DOM
        window.Dom7('html').removeClass('with-statusbar-overlay')
        // Update Cordova
        if (window.cordova) {
          if (window.StatusBar) {
            window.StatusBar.hide()
          } else {
            window.Dom7(document).on('deviceready', function () {
              window.StatusBar.hide()
            })
          }
        }
      } else {
        // Rollback
        this.statusbarVisibility = oldState !== null ? oldState : this.config.statusbarVisibility
      }
    }
  }
}*/
