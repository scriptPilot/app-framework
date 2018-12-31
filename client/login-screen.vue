<template>
  <f7-page no-navbar no-toolbar no-swipeback layout="white">

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
      <f7-button big raised color="green" fill @click="handleSignIn">{{text.signIn}}</f7-button big>
    </f7-block>

    <!-- Email registration buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailRegistration">
      <f7-button big raised color="green" @click="mode='registration'">{{text.createAccount}}</f7-button big>
    </f7-block>
    <f7-block v-if="mode === 'registration' && firebaseConfig.allowEmailRegistration">
      <f7-button big raised color="green" fill @click="handleRegistration">{{text.handleRegistration}}</f7-button big>
    </f7-block>

    <!-- Email reset buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button big raised color="orange" @click="mode='reset'">{{text.resetPassword}}</f7-button big>
    </f7-block>
    <f7-block v-if="mode === 'reset' && firebaseConfig.allowEmailLogin">
      <f7-button big raised color="orange" fill @click="handleReset">{{text.handleReset}}</f7-button big>
    </f7-block>

    <!-- Logout button -->
    <f7-block v-if="mode === 'signOut'">
      <f7-button big raised color="red" fill @click="handleSignOut">{{text.signOut}}</f7-button big>
    </f7-block>

    <!-- Cancel button -->
    <f7-block v-if="(!$root.loginRequiringPagesOnStart && !$root.config.loginRequiredForAllPages) || mode !== 'signIn'">
      <f7-button big raised color="red" @click="cancel">{{text.cancel}}</f7-button big>
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
      accountCreated: 'Account created',
      error: 'Error',
      errorOffline: 'This action is offline not possible.',
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
      accountCreated: 'Konto erstellt',
      error: 'Fehler',
      errorOffline: 'Diese Aktion ist offline nicht möglich.',
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
      this.$root.$signOut = this.handleSignOut
    },
    mounted() {
      // Workaround to close login popup on initial load and shift it back to the left -->
      // Close only if there are no login requiring pages on start or the user is logged in
      if ((!this.$root.loginRequiringPagesOnStart && !this.$root.config.loginRequiredForAllPages) || this.$root.user) {
        this.$f7.closeModal('#app-framework-login-popup', false)
      }
      this.$$('#app-framework-login-popup').css('left', '0')
    },
    methods: {
      cancel: function () {
        if (this.mode === 'reset' || this.mode === 'registration') {
          this.mode = this.$root.user ? 'signOut' : 'signIn'
        } else {
          // Reset form
          this.email = ''
          this.password = ''
          this.passwordConfirmation = ''
          this.mode = this.$root.user ? 'signOut' : 'signIn'
          // Reset required URLs
          this.$root.loginRequiringPages = []
          // Close popup
          this.$f7.closeModal('#app-framework-login-popup')
        }
      },
      handleSignIn: function () {
        if (navigator.onLine === false) {
          window.f7.alert(this.text.errorOffline, this.text.error)
        } else if (this.email === '') {
          window.f7.alert(this.text.errorNoEmail, this.text.error)
        } else if (this.password === '') {
          window.f7.alert(this.text.errorNoPassword, this.text.error)
        } else {
          // Show loading indicator
          window.f7.showIndicator()
          // Sign in user
          window.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            // On success
            .then(user => {
              this.handleSignInDone()
            })
            // On error, show alert
            .catch(err => {
              // Hide loading indicator
              window.f7.hideIndicator()
              // Show error alert
              window.f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            })
        }
      },
      handleSignInDone: function ()  {
        // Hide loading indicator
        window.f7.hideIndicator()
        // Reset form
        this.email = ''
        this.password = ''
        this.passwordConfirmation = ''
        this.mode = 'signOut'
        // Load required URL per view
        const loginRequiringPages = this.$root.loginRequiringPages
        this.$f7.views.forEach((view) => {
          if (loginRequiringPages[view.selector]) {
            this.$nextTick(() => {
              view.router.load({url: loginRequiringPages[view.selector], animatePages: false})
            })
          }
        })
        // Reset required URLs
        this.$root.loginRequiringPages = []
        // Close popup
        this.$f7.closeModal('#app-framework-login-popup')
      },
      handleSignOut: function () {
        this.$f7.popup('#app-framework-login-popup')
        window.firebase.auth().signOut()
          .then(() => {
            // Reset form
            this.mode = 'signIn'
            // Navigate pages back
            const navBack = (view, times) => {
              if (times > 0) {
                view.router.back()
                this.$nextTick(() => {
                  times--
                  navBack(view, times)
                })
              }
            }
            this.$f7.views.forEach((view) => {
              const history = view.history
              let historyRequiresLoginAtPosition = 0
              history.forEach((url) => {
                if (this.$root.urlRequiresLogin(url) == false) {
                  historyRequiresLoginAtPosition++
                }
              })
              navBack(view, history.length - historyRequiresLoginAtPosition)
            })
            // Do only if there are pages which do not require login
            if (!this.$root.config.loginRequiredForAllPages && !this.$root.loginRequiringPagesOnStart) {
              // Close popup
              this.$f7.closeModal('#app-framework-login-popup')
              // Show notification
              window.f7.addNotification({
                title: this.text.signOut,
                message: this.text.signOutDone,
                hold: 3000,
                closeIcon: false
              })
            }
          })
      },
      handleRegistration: function () {
        if (navigator.onLine === false) {
          window.f7.alert(this.text.errorOffline, this.text.error)
        } else if (this.email === '') {
          window.f7.alert(this.text.errorNoEmail, this.text.error)
        } else if (this.password === '') {
          window.f7.alert(this.text.errorNoPassword, this.text.error)
        } else if (this.passwordConfirmation !== this.password) {
          window.f7.alert(this.text.errorPasswordsDifferent, this.text.error)
        } else {
          // Show loading indicator
          window.f7.showIndicator()
          // Create new user
          window.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            // On success, sign in user
            .then(user => {
              // Hide loading indicator
              window.f7.hideIndicator()
              // Show notification
              window.f7.addNotification({
                title: this.text.accountCreated,
                message: this.text.checkYourInbox,
                hold: 3000,
                closeIcon: false
              })
              // Handle sign in
              this.handleSignInDone()
            })
            // On error, show alert
            .catch(err => {
              // Hide loading indicator
              window.f7.hideIndicator()
              // Show error alert
              window.f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            })
        }
      },
      handleReset: function () {
        if (navigator.onLine === false) {
          window.f7.alert(this.text.errorOffline, this.text.error)
        } else if (this.email === '') {
          window.f7.alert(this.text.errorNoEmail, this.text.error)
        } else {
          // Show loading indicator
          window.f7.showIndicator()
          // Send reset link
          window.firebase.auth().sendPasswordResetEmail(this.email)
            .then(user => {
              // Hide loading indicator
              window.f7.hideIndicator()
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
              // Hide loading indicator
              window.f7.hideIndicator()
              // Show error alert
              window.f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            })
        }
      }
    }
  }
</script>
