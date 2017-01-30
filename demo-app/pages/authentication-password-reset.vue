<template>  
  <f7-page login-screen>
    <f7-login-screen-title>Login</f7-login-screen-title>
    <f7-list form>
      <f7-list-item v-if="view === 'login'">
        <f7-label>Username</f7-label>
        <f7-input v-model="username" placeholder="Username" type="text"></f7-input>
      </f7-list-item>
      <f7-list-item v-if="view === 'login'">
        <f7-label>Password</f7-label>
        <f7-input v-model="password" type="password" placeholder="Password"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-button title="Sign In" close-login-screen v-if="username !== '' && password !== ''"></f7-list-button>
      <!-- Access package.json configuration object with $root.config -->
      <f7-list-button title="Create Account" close-login-screen v-if="$root.config.firebase.allowUserRegistration === true"></f7-list-button>
      <f7-list-button title="Forgot Password" @click="view='reset'"></f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        username: '',
        password: '',
        view: 'login'
      }
    },
    mounted: function () {
      this.$f7.hideNavbar('.navbar')
    }
  }
</script>
