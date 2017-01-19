<template>  
  <f7-page>
    <f7-navbar title="Right Panel" sliding></f7-navbar>
    <f7-block>
      <p>Right panel content goes here</p>
    </f7-block>
    <f7-block-title>Load page in panel</f7-block-title>
    <f7-list>
      <f7-list-item link="about" title="About"></f7-list-item>
      <f7-list-item link="form" title="Form"></f7-list-item>
    </f7-list>
    <f7-block-title>Load page in main view</f7-block-title>
    <f7-list>
      <f7-list-item link="about" title="About" link-view="#main-view" link-close-panel></f7-list-item>
      <f7-list-item link="form" title="Form" link-view="#main-view" link-close-panel></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
  module.exports = {}
</script>