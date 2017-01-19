<template>
  <f7-page with-subnavbar>
    <f7-navbar title="Tabs" back-link="Back" sliding>
      <f7-subnavbar>
        <f7-buttons>
          <f7-button tab-link="#tab1" active>Tab 1</f7-button>
          <f7-button tab-link="#tab2">Tab 2</f7-button>
          <f7-button tab-link="#tab3">Tab 3</f7-button>
        </f7-buttons>
      </f7-subnavbar>
    </f7-navbar>
    <f7-tabs swipeable>
      <f7-tab id="tab1" active>
        <f7-block inner inset>
          <p>Go to second tab, with <b>click or swipe</b> ...</p>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab2">
        <f7-block inner inset>
          Open <f7-link href="tabs-sub">sub page with tabs</f7-link>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab3">
        <f7-block inner inset>
          <p>Content of <b>third</b> tab ...</p>
        </f7-block>
      </f7-tab>
    </f7-tabs>    
  </f7-page>
</template>

<script>
  module.exports = {}
</script>