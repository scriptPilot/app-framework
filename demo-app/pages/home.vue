<template>  
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center sliding>Framework7</f7-nav-center>
      <f7-nav-right>
        <f7-link icon="icon-bars" open-panel="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block inner inset style="text-align: center">
      <p><b>For native App feeling, pin this page to your homescreen and reopen it!</b></p>
    </f7-block>
    <f7-block-title>Test pages</f7-block-title>            
    <f7-list>
      <f7-list-item link="about" title="About"></f7-list-item>
      <f7-list-item link="form" title="Form"></f7-list-item>
      <f7-list-item link="dynamic-route/blog/45/post/125?foo=bar#about" title="Dynamic Route"></f7-list-item>
      <f7-list-item link="image" title="Icon & Image" badge="new" badge-color="green"></f7-list-item>
      <f7-list-item link="localStorage" title="LocalStorage ToDo" badge="new" badge-color="green"></f7-list-item>
      <!--<f7-list-item link="firebase" title="Firebase ToDo" badge="wip" badge-color="red"></f7-list-item>-->
      <f7-list-item link="multipleLanguages" title="Multiple languages" badge="new" badge-color="green"></f7-list-item>
      <!--<f7-list-item link="tabs" title="Tabs"></f7-list-item>-->
      <f7-list-item link="https://framework7.io/kitchen-sink-ios" title="iOS Showcase" link-external></f7-list-item>
      <f7-list-item link="https://framework7.io/kitchen-sink-material" title="Material Showcase" link-external></f7-list-item>
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