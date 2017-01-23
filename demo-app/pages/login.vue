<template>  
  <f7-page login-screen>
    <f7-login-screen-title>Login</f7-login-screen-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>Username</f7-label>
        <f7-input v-model="username" placeholder="Username" type="text"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Password</f7-label>
        <!-- State of password field won't be kept for security reasons (to be read in local storage) -->
        <f7-input type="password" placeholder="Password"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-button title="Sign In" close-login-screen></f7-list-button>
      <f7-list-label>
        <p>Click Sign In to close Login Screen</p>
      </f7-list-label>
    </f7-list>
  </f7-page>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        username: ''
      }
    }
  }
</script>