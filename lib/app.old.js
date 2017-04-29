/* eslint-disable */

globallocalMixins.dataObject = {
  beforeCreate: function () {
    require('lodash')
  },
  created: function () {
    this.$root.globalDataObject = window.localStorage.globalDataObject !== undefined ? JSON.parse(window.localStorage.globalDataObject) : {}
  },
  computed: {
    data: function () {
      return this.$root.globalDataObject
    }
  },
  methods: {
    saveData: function (path, value) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.globalDataObject))
      // Add value to path
      data = window._.set(data, path, value)
      // Update root data object
      this.$root.$set(this.$root, 'globalDataObject', data)
      // Update local storage
      window.localStorage.globalDataObject = JSON.stringify(this.$root.globalDataObject)
    },
    removeData: function (path) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.globalDataObject))
      // Remove path
      window._.unset(data, path)
      // Update root data object
      this.$root.$set(this.$root, 'globalDataObject', data)
      // Update local storage
      window.localStorage.globalDataObject = JSON.stringify(this.$root.globalDataObject)
    }
  }
}

/*
// Global data object
this.$root.data
window.data
this.$root.saveData(...)
window.saveData(...)
$root.removeData(...)
window.removeData(...)
{{$root.data.item}}

// Firebase
this.$root.user
window.user
this.$root.db(...)
window.db(...)
this.$root.store(...)
window.store(...)
*/

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

localMixins.cacheReset = {
  created: function () {
    if (this.config.resetLocalStorageOnVersionChange === true && (!window.localStorage['app-framework-version'] || window.localStorage['app-framework-version'] !== this.framework.version)) {
      // Empty local storage
      for (let item in window.localStorage) {
        if (!/firebase:(.+)/.test(item) && item !== 'user') {
          window.localStorage.removeItem(item)
        }
      }
      // Update framework version in local storage
      window.localStorage['app-framework-version'] = this.framework.version
      // Show notification
      this.doOnF7Init.push((cb) => {
        let text = {
          en: 'The application has been updated and the cache has been reset.',
          de: 'Die Anwendung wurde aktualisiert und der Cache wurde zurückgesetzt.'
        }
        window.f7.alert(text[this.language] ? text[this.language] : text['en'], cb)
      })
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
