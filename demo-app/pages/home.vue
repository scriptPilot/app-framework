<!-- Initial page of the main view, please see ../app.vue for more information about the application layout -->

<template>
  <f7-page>

    <!-- Navbar -->
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center sliding>{{$root.title}}</f7-nav-center>
      <f7-nav-right>
        <f7-link icon="icon-bars" open-panel="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- Content block -->
    <f7-block inner inset style="text-align: center" v-if="$root.isMobileDevice && !$root.isNativeApp && !$root.isHomescreenApp">
      <p><b>For native App feeling, please pin this page to your homescreen and open it from there!</b></p>
    </f7-block>

    <!-- List with test pages -->
    <f7-block-title>Test pages</f7-block-title>
    <f7-list>
      <f7-list-item link="simple-todo" title="Simple ToDo List"></f7-list-item>
      <f7-list-item link="firebase-public" title="Public Firebase ToDo List"></f7-list-item>
      <f7-list-item link="firebase-private" title="Private Firebase Storage"></f7-list-item>
      <f7-list-item link="multiple-languages" title="Multiple Languages"></f7-list-item>
      <f7-list-item link="tabs" title="Tab Handling"></f7-list-item>
      <f7-list-item link="form" title="Form Handling"></f7-list-item>
      <f7-list-item link="flexible-routing/blog/45/post/125?foo=bar#about" title="Flexible Routing"></f7-list-item>
      <f7-list-item link="image" title="Icon & Image"></f7-list-item>
      <f7-list-item link="f7-showcase" title="Framework7-Vue Showcase"></f7-list-item>
    </f7-list>
    <f7-block-title>Side Panels</f7-block-title>

    <!-- Some test buttons for panels and modals -->
    <f7-block>
      <f7-grid>
        <f7-col width="50">
          <f7-button open-panel="left">Left Panel</f7-button>
        </f7-col>
        <f7-col width="50">
          <f7-button open-panel="right">Right Panel</f7-button>
        </f7-col>
      </f7-grid>
    </f7-block>
    <f7-block-title>Modals</f7-block-title>
    <f7-block>
      <f7-grid>
        <f7-col width="50">
          <f7-button open-popup="#popup">Popup</f7-button>
        </f7-col>
        <f7-col width="50">

          <!-- Show login / logout button, depending on the user status -->
          <f7-button open-login-screen="#login-screen" :text="$root.user ? 'Logout' : 'Login Screen'"></f7-button>

        </f7-col>
      </f7-grid>
    </f7-block>

    <!-- Link to GitHub repository -->
    <f7-block style="text-align: center">
      <f7-link href="https://github.com/scriptPilot/app-framework" external>
        <f7-icon fa="github" size="20"></f7-icon>&nbsp;&nbsp;App Framework - v{{$root.packageVersion}}
      </f7-link>
    </f7-block>

  </f7-page>
</template>

<script>
  module.exports = {}
</script>
