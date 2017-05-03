<template>
  <f7-page no-navbar no-toolbar no-swipeback>

    <!-- Title -->
    <f7-block style="text-align: center; font-size: 25px;">{{!$root.user ? text.titleSignIn : text.titleSignOut}}</f7-block>

    <!-- Sign in disabled alert -->
    <f7-block inner inset v-if="!firebaseConfig.allowEmailLogin && mode === 'signIn'">{{text.currentlyDisabled}}</f7-block>

    <!-- Form for email sign in / registration / password reset -->
    <f7-list form id="app-framework-login-screen" inset v-if="!$root.user && (firebaseConfig.allowEmailLogin || (firebaseConfig.allowEmailRegistration && mode === 'registration'))">
      <f7-list-item v-if="firebaseConfig.allowEmailLogin || (firebaseConfig.allowEmailRegistration && mode === 'registration')">
        <f7-label>{{text.email}}</f7-label>
        <f7-input type="email" :placeholder="text.email" v-model="email" />
      </f7-list-item>
      <f7-list-item v-if="(firebaseConfig.allowEmailLogin && mode === 'signIn') || (firebaseConfig.allowEmailRegistration && mode === 'registration')">
        <f7-label>{{text.password}}</f7-label>
        <f7-input type="password" :placeholder="text.password" v-model="password" />
      </f7-list-item>
      <f7-list-item v-if="firebaseConfig.allowEmailRegistration && mode === 'registration'">
        <f7-label>{{text.password}}</f7-label>
        <f7-input type="password" :placeholder="text.passwordConfirmation" v-model="passwordConfirmation" />
      </f7-list-item>
    </f7-list>

    <!-- Email sign in buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button raised color="green" fill @click="handleSignIn">{{text.signIn}}</f7-button>
    </f7-block>

    <!-- Email registration buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailRegistration">
      <f7-button raised color="green" @click="mode='registration'">{{text.createAccount}}</f7-button>
    </f7-block>
    <f7-block v-if="mode === 'registration' && firebaseConfig.allowEmailRegistration">
      <f7-button raised color="green" fill @click="handleRegistration">{{text.handleRegistration}}</f7-button>
    </f7-block>

    <!-- Email reset buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button raised color="orange" @click="mode='reset'">{{text.resetPassword}}</f7-button>
    </f7-block>
    <f7-block v-if="mode === 'reset' && firebaseConfig.allowEmailLogin">
      <f7-button raised color="orange" fill @click="handleReset">{{text.handleReset}}</f7-button>
    </f7-block>

    <!-- Logout button -->
    <f7-block v-if="mode === 'signOut'">
      <f7-button raised color="red" fill @click="handleSignOut">{{text.signOut}}</f7-button>
    </f7-block>

    <!-- Cancel button -->
    <f7-block>
      <f7-button raised color="red" @click="cancel">{{text.cancel}}</f7-button>
    </f7-block>

  </f7-page>
</template>
<script>
  // Define text patterns
  let text = {
    en: {
      titleSignIn: 'Sign in',
      titleSignOut: 'Sign out',
      currentlyDisabled: 'The sign in is currently disabled.',
      email: 'Email',
      password: 'Password',
      passwordConfirmation: 'Confirmation',
      handleRegistration: 'Create account',
      handleReset: 'Reset password',
      signIn: 'Sign in',
      signOut: 'Sign out',
      createAccount: 'Create new account',
      resetPassword: 'Reset your password',
      cancel: 'Cancel',
      emailSent: 'Email sent',
      checkYourInbox: 'Please check your inbox.',
      signOutDone: 'Sign out done',
      error: 'Error',
      errorNoEmail: 'Please enter your email address.',
      errorNoPassword: 'Please enter a password.',
      errorPasswordsDifferent: 'You entered two different passwords.',
      firebaseErrors: {
        'auth/email-already-in-use': 'The email address is already linked to another account.',
        'auth/invalid-email': 'The email address is invalid.',
        'auth/operation-not-allowed': 'Login is currently disabled.',
        'auth/weak-password': 'The password is not safe enough.',
        'auth/user-not-found': 'No account found for that email address.',
        'auth/user-disabled': 'Your account is deactivated.',
        'auth/wrong-password': 'The password is wrong.'
      }
    },
    de: {
      titleSignIn: 'Anmelden',
      titleSignOut: 'Abmelden',
      currentlyDisabled: 'Die Anmeldung ist zurzeit deaktiviert.',
      email: 'E-Mail',
      password: 'Passwort',
      passwordConfirmation: 'Bestätigung',
      handleRegistration: 'Konto erstellen',
      handleReset: 'Passwort zurücksetzen',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
      createAccount: 'Neues Konto erstellen',
      resetPassword: 'Passwort zurücksetzen',
      cancel: 'Abbrechen',
      emailSent: 'E-Mail verschickt',
      checkYourInbox: 'Bitte schau in deinem Posteingang.',
      signOutDone: 'Abmeldung erfolgreich',
      error: 'Fehler',
      errorNoEmail: 'Bitte gib Deine E-Mail-Adresse ein.',
      errorNoPassword: 'Bitte gib ein Passwort ein.',
      errorPasswordsDifferent: 'Du hast zwei unterschiedliche Passwörter eingegeben.',
      firebaseErrors: {
        'auth/email-already-in-use': 'Die E-Mail-Adresse wird bereits verwendet.',
        'auth/invalid-email': 'Die E-Mail-Adresse ist fehlerhaft.',
        'auth/operation-not-allowed': 'Anmelden ist zurzeit nicht möglich.',
        'auth/weak-password': 'Dein Passwort ist nicht sicher genug.',
        'auth/user-not-found': 'Kein Konto mit dieser E-Mail-Adresse gefunden.',
        'auth/user-disabled': 'Dein Konto ist deaktiviert.',
        'auth/wrong-password': 'Das Passwort ist falsch.'
      }
    }
  }
  // Export module
  export default {
    data: function () {
      return {
        email: '',
        password: '',
        passwordConfirmation: '',
        mode: ''
      }
    },
    computed: {
      firebaseConfig: function () {
        return process.env.NODE_ENV === 'production' ? this.$root.config.firebase : this.$root.config.devFirebase
      },
      text: function () {
        return text[this.$root.language] || text['en']
      }
    },
    created: function () {
      this.mode = this.$root.user ? 'signOut' : 'signIn'
    },
    methods: {
      onF7Init: function () {
        window.Dom7('#app-framework-login-screen input[type=email]').focus()
      },
      cancel: function () {
        // Reset form
        this.email = ''
        this.password = ''
        this.passwordConfirmation = ''
        // Navigate back
        let viewId = null
        window.f7.views.map((view, id) => {
          if (view.selector === window.localStorage.requestedView) viewId = id
        })
        window.f7.views[viewId || 'main'].router.back()
        // Reset local storage
        window.localStorage.removeItem('requestedView')
        window.localStorage.removeItem('requestedUrl')
      },
      handleSignIn: function () {
        if (this.email === '') {
          window.f7.alert(this.text.errorNoEmail, this.text.error)
        } else if (this.password === '') {
          window.f7.alert(this.text.errorNoPassword, this.text.error)
        } else {
          // Sign in user
          window.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            // On success
            .then(user => {
              // Reset form
              this.email = ''
              this.password = ''
              this.passwordConfirmation = ''
              this.mode = 'signOut'
              // Show requested URL or navigate back
              let viewId = null
              window.f7.views.map((view, id) => {
                if (view.selector === window.localStorage.requestedView) viewId = id
              })
              if (window.localStorage.requestedUrl) {
                let url = window.localStorage.requestedUrl
                setTimeout(() =>{
                  window.f7.views.main.router.back({animatePages: false})
                  setTimeout(() => {
                    window.f7.views.main.router.load({url: url})
                  })
                })
              } else {
                window.f7.views.main.router.back()
              }
              // Reset local storage
              window.localStorage.removeItem('requestedView')
              window.localStorage.removeItem('requestedUrl')
            })
            // On error, show alert
            .catch(err => {
              window.f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            })
        }
      },
      handleSignOut: function () {
        window.firebase.auth().signOut()
          .then(() => {
            // Reset form
            this.mode = 'signIn'
            // Navigate back
            let viewId = null
            window.f7.views.map((view, id) => {
              if (view.selector === window.localStorage.requestedView) viewId = id
            })
            window.f7.views[viewId || 'main'].router.back()
            // Show notification
            window.f7.addNotification({
              title: this.text.signOutDone,
              hold: 3000,
              closeIcon: false
            })
          })
      },
      handleRegistration: function () {
        if (this.email === '') {
          window.f7.alert(this.text.errorNoEmail, this.text.error)
        } else if (this.password === '') {
          window.f7.alert(this.text.errorNoPassword, this.text.error)
        } else if (this.passwordConfirmation !== this.password) {
          window.f7.alert(this.text.errorPasswordsDifferent, this.text.error)
        } else {
          // Create new user
          window.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            // On success, sign in user
            .then(user => {
              this.handleSignIn()
            })
            // On error, show alert
            .catch(err => {
              window.f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            })
        }
      },
      handleReset: function () {
        if (this.email === '') {
          window.f7.alert(this.text.errorNoEmail, this.text.error)
        } else {
          // Send reset link
          window.firebase.auth().sendPasswordResetEmail(this.email)
            .then(user => {
              // Update mode
              this.mode = 'signIn'
              // On success, show notfication and login screen again
              window.f7.addNotification({
                title: this.text.emailSent,
                message: this.text.checkYourInbox,
                hold: 3000,
                closeIcon: false
              })
              this.mode = 'signIn'
            })
            .catch(err => {
              window.f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            })
        }
      }
    }
  }
</script>
