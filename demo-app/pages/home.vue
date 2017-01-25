<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center sliding>{{$root.title}}</f7-nav-center>
      <f7-nav-right>
        <f7-link icon="icon-bars" open-panel="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block inner inset style="text-align: center">
      <p><b>For native App feeling, pin this page to your homescreen and reopen it!</b></p>
    </f7-block>
    <f7-block-title>Test pages</f7-block-title>            
    <f7-list>
      <f7-list-item link="simpleTodo" title="Simple ToDo List"></f7-list-item>
      <f7-list-item link="firebasePublic" title="Public Firebase ToDo List"></f7-list-item>
      <!--<f7-list-item link="firebasePrivate" title="Private Firebase Notes"></f7-list-item>-->
      <f7-list-item link="multipleLanguages" title="Multiple Languages"></f7-list-item>
      <f7-list-item link="tabs" title="Tab Handling"></f7-list-item>
      <f7-list-item link="form" title="Form Handling"></f7-list-item>
      <f7-list-item link="flexibleRouting/blog/45/post/125?foo=bar#about" title="Flexible Routing"></f7-list-item>
      <f7-list-item link="image" title="Icon & Image"></f7-list-item>
      <f7-list-item link="login" title="Login test" badge="work in progress" badge-color="red"></f7-list-item>      
      <f7-list-item link="https://framework7.io/kitchen-sink-ios" title="iOS Showcase" badge="Framework7" link-external></f7-list-item>
      <f7-list-item link="https://framework7.io/kitchen-sink-material" title="Material Showcase" badge="Framework7" link-external></f7-list-item>
    </f7-list>
    <f7-block-title>Side Panels</f7-block-title>
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
          <f7-button open-login-screen="#login-screen">Login Screen</f7-button>
        </f7-col>
      </f7-grid>
    </f7-block>
    <f7-block style="text-align: center">
      <f7-link href="https://github.com/scriptPilot/app-framework" external>
        <f7-icon fa="github"></f7-icon> App Framework - v{{$root.version}}
      </f7-link>
    </f7-block>
  </f7-page>
</template>

<script>
  module.exports = {}
</script>