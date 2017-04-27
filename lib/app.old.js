/* eslint-disable */
/*


let manageDOMfix = {
  mounted: function () {
    // Add missing statusbar overlay
    if (window.Dom7('#app .statusbar-overlay').length < 1) {
      window.Dom7('#app').prepend('<div class="statusbar-overlay"></div>')
    }
    // Transform subnavbar for material theme
    if (this.config.materialSubnavbarFix === true) {
      window.Dom7(document).on('page:init', function (e) {
        let subnavbar = window.Dom7(e.target).find('.subnavbar')
        if (subnavbar.length > 0) {
          window.Dom7(e.target).addClass('toolbar-fixed')
          window.Dom7(e.target).removeClass('with-subnavbar')
          subnavbar.prependTo(e.target).find('.page')
          subnavbar.find('.buttons-row').addClass('toolbar-inner')
          subnavbar.find('.buttons-row').removeClass('buttons-row')
          subnavbar.addClass('toolbar')
          subnavbar.addClass('tabbar')
          subnavbar.removeClass('subnavbar')
        }
      })
    }
    // Prevent bouncing
    let xStart = 0
    let yStart = 0
    window.Dom7(document).on('touchstart', function (e) {
      yStart = e.touches ? e.touches[0].screenY : e.screenY
      xStart = e.touches ? e.touches[0].screenX : e.screenX
    })
    window.Dom7(document).on('touchmove', function (e) {
      console.log(e)
    })
    //window.addEventListener('touchstart', handleTouchstart, false)
    //window.addEventListener('touchmove', handleTouchmove, false)

  }
}




function checkFrameworkUpdates (app) {
  if (process.env.NODE_ENV === 'development' && frameworkNPMversion.latest !== undefined) {
    if (frameworkNPMversion.latest === 'unknown') {
      window.f7.alert('Failed to get latest NPM version. Please open an incident on GitHub.', 'App Framework')
    } else if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(frameworkNPMversion.latest)) {
      let currentVersion = framework.version.split('.')
      let npmVersion = frameworkNPMversion.latest.split('.')
      if (parseInt(currentVersion[0]) < parseInt(npmVersion[0]) ||
          parseInt(currentVersion[1]) < parseInt(npmVersion[1]) ||
          parseInt(currentVersion[2]) < parseInt(npmVersion[2])) {
        window.f7.alert('Please update App Framework to the latest version <b>' + frameworkNPMversion.latest + '</b> (currently ' + framework.version + '). CLI commands: "CTRL + C" to stop the development server and "npm update" to update App Framework.', 'App Framework')
      }
    } else {
      window.f7.alert('Failed to get parse NPM version. Please open an incident on GitHub.', 'App Framework')
    }
  }
}

let manageLocalStorageReset = {
  created: function () {
    if (process.env.RESET_LOCAL_STORAGE === 'true' &&
        (!window.localStorage['app-framework-version'] || window.localStorage['app-framework-version'] !== this.frameworkVersion)) {
      let showMessage = window.localStorage['app-framework-version'] !== undefined
      for (let item in window.localStorage) {
        if (!/firebase:(.+)/.test(item) && item !== 'user') {
          window.localStorage.removeItem(item)
        }
      }
      window.localStorage['app-framework-version'] = this.frameworkVersion
      window.localStorage['showCacheResetAlert'] = showMessage
    }
  }
}

var f7Text = {
  en: {
    modalButtonOk: 'OK',
    modalButtonCancel: 'Cancel',
    modalPreloaderTitle: 'Loading ... ',
    modalUsernamePlaceholder: 'Username',
    modalPasswordPlaceholder: 'Password',
    smartSelectBackText: 'Back',
    smartSelectPopupCloseText: 'Close',
    smartSelectPickerCloseText: 'Done',
    notificationCloseButtonText: 'Close'
  },
  de: {
    modalButtonOk: 'OK',
    modalButtonCancel: 'Abbrechen',
    modalPreloaderTitle: 'Lädt ... ',
    modalUsernamePlaceholder: 'Benutzername',
    modalPasswordPlaceholder: 'Passwort',
    smartSelectBackText: 'Zurück',
    smartSelectPopupCloseText: 'Fertig',
    smartSelectPickerCloseText: 'Fertig',
    notificationCloseButtonText: 'OK'
  }
}
var text = {
  en: {
    cacheResetAlert: 'The application has been updated and the cache has been reset.'
  },
  de: {
    cacheResetAlert: 'Die Anwendung wurde aktualisiert und der Cache wurde zurückgesetzt.'
  }
}

function addLoginScreen (callback) {
  if (window.Dom7('.login-screen').length > 0) {
    callback()
  } else {
    let loginScreen = '<div class="login-screen" id="app-framework-login-screen">' +
                      '  <div class="view"></div>' +
                      '</div>'
    window.Dom7('body').append(loginScreen)
    window.f7.addView('#app-framework-login-screen .view', {url: '/app-framework-login-screen/'})
    callback()
  }
}


  },
  computed: {
    text: function () {
      return text[this.language] ? text[this.language] : text['en']
    }
  },
  ,
  methods: {
    onF7Init: function () {
      let app = this
      initFirebase(app, function () {

          // Show cache reset alert
          if (window.localStorage['showCacheResetAlert'] === 'true') {
            window.f7.alert(this.text.cacheResetAlert, function () {
              window.localStorage.removeItem('showCacheResetAlert')
            })
          }
        })
      })
    },
    updateTextPatterns: function () {
      let patterns = f7Text[this.language] ? f7Text[this.language] : f7Text['en']
      for (let p in patterns) {
        window.f7.params[p] = patterns[p]
      }
    }
  }
})
*/
