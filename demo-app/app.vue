<template>
  <!-- App -->
  <div id="app">
  
    <!-- Status bar -->
    <f7-statusbar></f7-statusbar>

    <!-- Left Panel -->
    <f7-panel left reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true" url="panel-left">
      </f7-view>
    </f7-panel>

    <!-- Right Panel -->
    <f7-panel right cover layout="dark">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true" url="panel-right">
      </f7-view>
    </f7-panel>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main url="home">
      </f7-view>
    </f7-views>

    <!-- Popup -->
    <f7-popup id="popup">
      <f7-view id="popup" navbar-fixed url="popup">
      </f7-view>
    </f7-popup>

    <!-- Login Screen -->
    <f7-login-screen id="login-screen">
      <f7-view id="login-screen" url="login-screen">
      </f7-view>
    </f7-login-screen>

  </div>
</template>

<script>
module.exports = {}
</script>

<style>
  /* Icon sizes */
  .item-media .fa,
  .swipeout-actions-left .fa,
  .swipeout-actions-right .fa  {
    font-size: 20px;
  }
</style>
