/* eslint-disable */
/*

language patterns
firebase
phone frame


// Language patterns




  framework7: {
    ,
    preroute: function (view, options) {
      let url = options.isBack ? view.history[view.history.length - (options.preloadOnly ? 1 : 2)] : options.url
      if (!url) {
        // Dynamic content
        return true
      } else {
        let page = url.match(/(\/)(.+)(\/)?(.+)?/)[2]
        if (window.user || cfg.pagesWithRequiredLogin.indexOf(page) === -1) {
          return true
        } else {
          localStorage.requestedView = view.container.id
          localStorage.requestedUrl = url
          window.f7.loginScreen()
          return false
        }
      }
    }
  },

  mounted: function () {
    // Adjust web look to iPhone
    if (!this.isMobileDevice && cfg.showPhoneFrameOnDesktop === true) {
      this.$$('html').addClass('pixel-ratio-2')
      this.$$('html').addClass('ios-gt-8')
      this.$$('html').addClass('light-scrollbars')
    }

    // Update phone frame function
    var updatePhoneFrame = function () {
      // Show frame on desktop
      if (!this.isMobileDevice && cfg.showPhoneFrameOnDesktop === true) {
        // Show frame
        if (window.innerWidth > 370 && window.innerHeight > 778) {
          this.$$('#frame').addClass('phone')
          this.$$('#frame').removeClass('limitWidth')
          this.$$('#frame').removeClass('limitHeight')
          this.$$('body').removeClass('bodyDark')

            // Limit width and height
        } else if (window.innerWidth > 320 && window.innerHeight > 568) {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').addClass('limitWidth')
          this.$$('#frame').addClass('limitHeight')
          this.$$('body').addClass('bodyDark')

            // Limit width
        } else if (window.innerWidth > 320) {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').addClass('limitWidth')
          this.$$('#frame').removeClass('limitHeight')
          this.$$('body').addClass('bodyDark')

            // Limit height
        } else if (window.innerHeight > 568) {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').removeClass('limitWidth')
          this.$$('#frame').addClass('limitHeight')
          this.$$('body').addClass('bodyDark')

            // No limitation
        } else {
          this.$$('#frame').removeClass('phone')
          this.$$('#frame').removeClass('limitWidth')
          this.$$('#frame').removeClass('limitHeight')
          this.$$('body').removeClass('bodyDark')
        }
      }
    }.bind(this)

    // Resize initially
    updatePhoneFrame()

    // Resize again on windows resize
    this.$$(window).resize(updatePhoneFrame)



    // Define Firebase config
    let firebaseConfig = process.env.DEV_BUILD === 'true' && cfg['dev-firebase'].useDevFirebaseOnTesting === true ? cfg['dev-firebase'] : cfg.firebase

    // Firebase configuration not empty
    if (firebaseConfig.apiKey !== '' &&
        firebaseConfig.authDomain !== '' &&
        firebaseConfig.databaseURL !== '' &&
        firebaseConfig.storageBucket !== '') {
      // Import Firebase
      var firebase = window.firebase = require('firebase')

      // Init Firebase
      firebase.initializeApp(firebaseConfig)

      // User data from cache
      window.user = this.user = localStorage.user ? JSON.parse(localStorage.user) : null

      // Monitor user changes
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          window.user = this.user = {
            uid: user.uid,
            email: user.email
          }
          localStorage.user = JSON.stringify(window.user)
        } else {
          // After logout - browse back in history to last page series which does not require login
          if (localStorage.user) {
            // Loop views
            let viewsToReduce = window.views
            for (let v in viewsToReduce) {
              if (viewsToReduce[v]) {
                let openPageSeries = 0
                // Loop pages, count number of non-login-requiring pages
                for (let p = 0; p < viewsToReduce[v].pages.length; p++) {
                  if (cfg.pagesWithRequiredLogin.indexOf(viewsToReduce[v].pages[p]) === -1) {
                    openPageSeries += 1
                  }
                }
                // Get number of pages to browse back
                let browseBack = viewsToReduce[v].pages.length - openPageSeries
                // Browse back
                for (let b = 0; b < browseBack; b++) {
                  setTimeout(function () {
                    this.$f7.views[viewsToReduce[v].no].router.back({animatePages: false})
                  }.bind(this), 0)
                }
              }
            }
          }
          // After logout - remove all login requiring pages from local storage
          if (localStorage.user) {
            for (let el in localStorage) {
              if (/page:(.+)/.test(el)) {
                let page = el.substr(el.indexOf('/') + 1)
                page = page.substr(0, page.indexOf('/') === -1 ? page.length : page.indexOf('/'))
                if (cfg.pagesWithRequiredLogin.indexOf(page) !== -1) {
                  localStorage.removeItem(el)
                }
              }
            }
          }
          window.user = this.user = null
          localStorage.removeItem('user')
        }
      }.bind(this))

      // Database shortlink
      window.db = function (path) {
        return firebase.database().ref(path)
      }

      // Storage shortlink
      window.store = function (path) {
        return firebase.storage().ref(path)
      }

      // Timestamp
      window.timestamp = firebase.database.ServerValue.TIMESTAMP
    } else {
      window.user = null
      window.db = null
      window.store = null
      window.timestamp = null
    }
    */
