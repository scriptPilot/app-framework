<template>
  <f7-page with-subnavbar>
    <f7-navbar title="Tabs sub page" back-link="Back" sliding>
      <f7-subnavbar>
        <f7-buttons>
          <f7-button tab-link="#tab2-1" active>Tab 2-1</f7-button>
          <f7-button tab-link="#tab2-2">Tab 2-2</f7-button>
          <f7-button tab-link="#tab2-3">Tab 2-3</f7-button>
        </f7-buttons>
      </f7-subnavbar>
    </f7-navbar>
    <f7-tabs swipeable>
      <f7-tab id="tab2-1" active>
        <f7-block inner inset>
          <p>Go to second sub tab, with <b>click or swipe</b>.</p>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab2-2">
        <f7-block inner inset>
          <p><b>Close app and reopen it</b> - you will see, this tab and the tab of the page before will be restored properly <f7-icon fa="smile-o"></f7-icon></p>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab2-3">
        <f7-block inner inset>
          <p>Content of <b>third sub</b> tab ...</p>
        </f7-block>
      </f7-tab>
    </f7-tabs>    
  </f7-page>
</template>

<script>
  module.exports = {}
</script>