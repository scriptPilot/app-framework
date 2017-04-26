/* Purpose: Provide client code */

/* eslint-disable */
/*
'use strict'

let manageGlobalDataObject = {
  computed: {
    data: function () {
      return this.$root.data
    }
  },
  created: function () {
    require('lodash')
  },
  methods: {
    saveData: function (path, value) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.data))
      // Add value to path
      data = window._.set(data, path, value)
      // Update root data object
      this.$root.$set(this.$root, 'data', data)
      // Update local storage
      window.localStorage.data = JSON.stringify(this.$root.data)
    },
    removeData: function (path) {
      // Clone current data
      let data = JSON.parse(JSON.stringify(this.$root.data))
      // Remove path
      window._.unset(data, path)
      // Update root data object
      this.$root.$set(this.$root, 'data', data)
      // Update local storage
      window.localStorage.data = JSON.stringify(this.$root.data)
    }
  }
}
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

*/
