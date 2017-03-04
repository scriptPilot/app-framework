<!--

  DO NOT MODIFY THIS FILE - IT WILL BE OVERWRITTEN AFTER EACH APP FRAMEWORK UPDATE

  This page is managing all the authentication topics with Firebase

-->

<template>
  <f7-page login-screen>
    <f7-login-screen-title>{{title}}</f7-login-screen-title>

    <!-- Show form, if user is not logged in -->
    <f7-list form v-if="!$root.user">

      <f7-list-item v-if="showEmail">
        <f7-label>{{text.email}}</f7-label>
        <f7-input v-model="email" :placeholder="text.email" type="email"></f7-input>
      </f7-list-item>

      <f7-list-item v-if="showPassword">
        <f7-label>{{text.password}}</f7-label>
        <f7-input v-model="password" :placeholder="text.password" type="password"></f7-input>
      </f7-list-item>

      <f7-list-item v-if="mode === 'create'">
        <f7-label>{{text.password}}</f7-label>
        <f7-input v-model="passwordConfirmation" :placeholder="text.confirmation" type="password"></f7-input>
      </f7-list-item>

    </f7-list>

    <!-- Show buttons, if user is not logged in -->
    <f7-list form v-if="!$root.user">

      <f7-list-button
        :title="text.signIn"
        v-if="mode === 'login' && email !== '' && password !== ''"
        @click="login">
        </f7-list-button>

      <f7-list-button
        :title="text.createAccount"
        v-if="$root.config.firebase.allowUserRegistration === true && mode === 'login'"
        @click="mode = 'create'">
        </f7-list-button>

      <f7-list-button
        :title="text.save"
        v-if="email !== '' && password !== '' && passwordConfirmation !== ''"
        @click="createAccount">
        </f7-list-button>

      <f7-list-button
        :title="text.resetPassword"
        v-if="mode === 'login'"
        @click="mode = 'reset'">
        </f7-list-button>

      <f7-list-button
        :title="text.send"
        v-if="mode === 'reset' && email !== ''"
        @click="sendResetLink">
        </f7-list-button>

      <f7-list-button
        :title="text.cancel"
        close-login-screen
        @click="resetView">
        </f7-list-button>

    </f7-list>

    <!-- Show logout link, if user is logged in -->
    <f7-block inner inset style="text-align: center" v-if="$root.user">
      <p>{{text.loggedInAs}}</p>
      <p><b>{{$root.user.email}}</b></p>
      <p>&nbsp;</p>
      <f7-grid>
        <f7-col width="25" />
        <f7-col><f7-button width="50" @click="logout">{{text.logout}}</f7-button></f7-col>
        <f7-col width="25" />
      </f7-grid>
      <p>&nbsp;</p>
      <p><f7-link @click="resetView" close-login-screen>{{text.cancel}}</f7-link></p>
    </f7-block>

  </f7-page>
</template>

<script>

  // Text patterns
  var text = {
    en: {
      email: 'Email',
      password: 'Password',
      confirmation: 'Confirmation',
      signIn: 'Sign in',
      createAccount: 'Create account',
      save: 'Save',
      resetPassword: 'Reset password',
      send: 'Send',
      cancel: 'Cancel',
      loggedInAs: 'You are logged in as',
      logout: 'Logout',
      login: 'Login',
      emailMissing: 'Please type your email address.',
      passwordMissing: 'Please choose a password.',
      passwordsDifferent: 'Passwords do not match.',
      error: 'Error',
      emailSent: 'Email sent',
      checkYourInbox: 'Please check your inbox.',
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
      email: 'E-Mail',
      password: 'Passwort',
      confirmation: 'Bestätigung',
      signIn: 'Anmelden',
      createAccount: 'Konto erstellen',
      save: 'Speichern',
      resetPassword: 'Passwort zurücksetzen',
      send: 'Senden',
      cancel: 'Abbrechen',
      loggedInAs: 'Du bist angemeldet als',
      logout: 'Logout',
      login: 'Login',
      emailMissing: 'Bitte gib deine E-Mail-Adresse ein.',
      passwordMissing: 'Bitte wähle ein Passwort aus.',
      passwordsDifferent: 'Die Passwörter stimmen nicht überein.',
      error: 'Fehler',
      emailSent: 'E-Mail verschickt',
      checkYourInbox: 'Bitte schau in deinem Posteingang.',
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

  // Shortlink to local storage
  var localStorage = window.localStorage

  module.exports = {
    data: function () {
      return {
        password: '',
        passwordConfirmation: '',
        email: '',
        mode: 'login'
      }
    },
    computed: {
      text: function () {
        return text[this.$root.language] || text['en']
      },
      title: function () {
        return this.$root.user ? this.text.logout : this.text.login
      },
      showEmail: function () {
        return this.mode === 'login' || this.mode === 'create' || this.mode === 'reset'
      },
      showPassword: function () {
        return this.mode === 'login' || this.mode === 'create'
      }
    },
    methods: {
      resetView: function () {
        this.title = 'Login'
        this.password = ''
        this.passwordConfirmation = ''
        this.email = ''
        this.mode = 'login'
        if (localStorage.requestedView) {
          localStorage.removeItem('requestedView')
        }
        if (localStorage.requestedUrl) {
          localStorage.removeItem('requestedUrl')
        }
      },
      createAccount: function () {
        if (this.email === '') {
          this.$f7.alert(this.text.emailMissing, this.text.error)
        } else if (this.password === '') {
          this.$f7.alert(this.text.passwordMissing, this.text.error)
        } else if (this.password !== this.passwordConfirmation) {
          this.$f7.alert(this.text.passwordsDifferent, this.text.error)
        } else {
          window.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(function (user) {
              this.login()
            }.bind(this))
            .catch(function (err) {
              this.$f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            }.bind(this))
        }
      },
      sendResetLink: function () {
        if (this.email === '') {
          this.$f7.alert(this.text.emailMissing, this.text.error)
        } else {
          window.firebase.auth().sendPasswordResetEmail(this.email)
            .then(function (user) {
              this.$f7.addNotification({
                title: this.text.emailSent,
                message: this.text.checkYourInbox,
                hold: 3000,
                closeIcon: false
              })
              this.resetView()
            }.bind(this))
            .catch(function (err) {
              this.$f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            }.bind(this))
        }
      },
      login: function () {
        if (this.email === '') {
          this.$f7.alert(this.text.emailMissing, this.text.error)
        } else if (this.password === '') {
          this.$f7.alert(this.text.passwordMissing, this.text.error)
        } else {
          window.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(function (user) {
              // Forward to requested page
              if (localStorage.requestedView && localStorage.requestedUrl) {
                setTimeout(function () {
                  this.$f7.views[window.views[localStorage.requestedView].no].router.load({url: localStorage.requestedUrl, animatePages: false})
                  this.resetView()
                  this.$f7.closeModal('.login-screen')
                }.bind(this), 0)
              // Close modal, no requested page before
              } else {
                this.resetView()
                this.$f7.closeModal('.login-screen')
              }
            }.bind(this))
            .catch(function (err) {
              this.$f7.alert(this.text.firebaseErrors[err.code], this.text.error)
            }.bind(this))
        }
      },
      logout: function () {
        window.firebase.auth().signOut()
          .then(function () {
            setTimeout(function () {
              this.resetView()
              this.$f7.closeModal('.login-screen')
            }.bind(this), 0)
          }.bind(this))
      }
    }
  }
</script>
