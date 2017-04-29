/* eslint-disable */

localMixins.firebase = {
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


localMixins.npmUpdateCheck = {
  created: function () {
    this.doOnF7Init.push((cb) => {
      let npm = require(process.env.PROJECT_ROOT_FROM_SCRIPTS + 'node_modules/.app-framework-cache/latest-npm-version.json')
      if (process.env.NODE_ENV === 'development' && npm !== undefined && npm.latest !== undefined) {
        if (npm.latest === 'unknown') {
          window.f7.alert('Failed to get latest NPM version. Please open an incident on GitHub.', 'App Framework')
        } else if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(npm.latest)) {
          let currentVersion = this.framework.version.split('.')
          let npmVersion = npm.latest.split('.')
          if (parseInt(currentVersion[0]) < parseInt(npmVersion[0]) ||
              parseInt(currentVersion[1]) < parseInt(npmVersion[1]) ||
              parseInt(currentVersion[2]) < parseInt(npmVersion[2])) {
            window.f7.alert('Please update App Framework to the latest version <b>' + npm.latest + '</b>.<br /><br />You have installed version ' + this.framework.version + '.<br /><br />CLI commands: "CTRL + C" to stop the development server and "npm update" to update App Framework.', 'App Framework')
          }
        } else {
          window.f7.alert('Failed to get parse NPM version. Please open an incident on GitHub.', 'App Framework')
        }
      } else {
        cb()
      }
    })
  }
}
