<!--

  Take this template as base for your own application.
  
  For real modularization, all pages are extracted to their own page component in /pages folder.
  You can define the initial page for each view with the URL attribute.
  Initial pages should not require a login (to configure in package.json file).
  
  Read more about application layouts: https://framework7.io/vue/app-layout.html
  
-->

<template>

  <!-- Will replace app container -->
  <div id="app">
  
    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Left panel -->
    <f7-panel left reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true" url="panel-left"></f7-view>
    </f7-panel>

    <!-- Right panel -->
    <f7-panel right cover layout="dark">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true" url="panel-right"></f7-view>
    </f7-panel>

    <!-- Main view -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main url="home"></f7-view>
    </f7-views>

    <!-- Popup -->
    <f7-popup id="popup">
      <f7-view id="popup" navbar-fixed url="popup"></f7-view>
    </f7-popup>

    <!-- Login screen - Do not change this block! -->
    <f7-login-screen id="login-screen">
      <f7-view id="login-screen" url="login-screen"></f7-view>
    </f7-login-screen>
    <!-- End of login screen -->

  </div>
</template>

<!-- Default export, template will be compiled automatically -->
<script>
  module.exports = {}
</script>

<!-- Style - for whole app, as there is no scope property -->
<style>

  /* Icon sizes */
  .item-media .fa,
  .swipeout-actions-left .fa,
  .swipeout-actions-right .fa  {
    font-size: 20px;
  }
  
</style>
