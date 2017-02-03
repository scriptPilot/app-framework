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
        <f7-label>Email</f7-label>
        <f7-input v-model="email" placeholder="Email" type="email"></f7-input>
      </f7-list-item>
      
      <f7-list-item v-if="showPassword">
        <f7-label>Password</f7-label>
        <f7-input v-model="password" placeholder="Password" type="password"></f7-input>
      </f7-list-item>
      
      <f7-list-item v-if="mode === 'create'">
        <f7-label>Password</f7-label>
        <f7-input v-model="passwordConfirmation" placeholder="Confirmation" type="password"></f7-input>
      </f7-list-item>
      
    </f7-list>
    
    <!-- Show buttons, if user is not logged in -->
    <f7-list form v-if="!$root.user">
    
      <f7-list-button
        title="Sign In"
        v-if="mode === 'login' && email !== '' && password !== ''"
        @click="login">
        </f7-list-button>
        
      <f7-list-button
        title="Create Account"
        v-if="$root.config.firebase.allowUserRegistration === true && mode === 'login'"
        @click="mode = 'create'">
        </f7-list-button>
        
      <f7-list-button
        title="Save"
        v-if="email !== '' && password !== '' && passwordConfirmation !== ''"
        @click="createAccount">
        </f7-list-button>
        
      <f7-list-button
        title="Reset Password"
        v-if="mode === 'login'"
        @click="mode = 'reset'">
        </f7-list-button>
        
      <f7-list-button
        title="Send"
        v-if="mode === 'reset' && email !== ''"
        @click="sendResetLink">
        </f7-list-button>
        
      <f7-list-button
        title="Cancel"
        close-login-screen
        @click="resetView">
        </f7-list-button>  
        
    </f7-list>
    
    <!-- Show logout link, if user is logged in -->
    <f7-block inner inset style="text-align: center" v-if="$root.user">
      <p>You are logged in as</p>
      <p><b>{{$root.user.email}}</b></p>
      <p>&nbsp;</p>
      <f7-grid>
        <f7-col width="25" />
        <f7-col><f7-button width="50" @click="logout">Logout</f7-button></f7-col>
        <f7-col width="25" />
      </f7-grid>
      <p>&nbsp;</p>
      <p><f7-link @click="resetView" close-login-screen>Cancel</f7-link></p>
    </f7-block>
    
  </f7-page>
</template>

<script>

  let localStorage = window.localStorage

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
      title: function () {
        return this.$root.user ? 'Logout' : 'Login'
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
          this.$f7.alert('Please type your email address', 'Error')
        } else if (this.password === '') {
          this.$f7.alert('Please choose a password', 'Error')
        } else if (this.password !== this.passwordConfirmation) {
          this.$f7.alert('Passwords do not match', 'Error')
        } else {
          window.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(function (user) {
              this.login()
            }.bind(this))
            .catch(function (err) {
              this.$f7.alert(err.message, 'Error')
            }.bind(this))
        }
      },
      sendResetLink: function () {
        if (this.email === '') {
          this.$f7.alert('Please type your email address', 'Error')
        } else {
          window.firebase.auth().sendPasswordResetEmail(this.email)
            .then(function (user) {
              this.$f7.addNotification({
                title: 'Email sent',
                message: 'Please check your inbox'
              })
              this.resetView()
            }.bind(this))
            .catch(function (err) {
              this.$f7.alert(err.message, 'Error')
            }.bind(this))
        }
      },
      login: function () {
        if (this.email === '') {
          this.$f7.alert('Please type your email address', 'Error')
        } else if (this.password === '') {
          this.$f7.alert('Please type your password', 'Error')
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
              this.$f7.alert(err.message, 'Error')
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
