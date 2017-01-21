<template>
  <f7-page tabs no-page-content with-subnavbar>
    <f7-navbar title="Tabs sub" back-link="Back" sliding>
      <f7-subnavbar>
        <f7-buttons>
          <f7-button tab-link="#tab2-1" active>Tab 2-1</f7-button>
          <f7-button tab-link="#tab2-2">Tab 2-2</f7-button>
          <f7-button tab-link="#tab2-3">Tab 2-3</f7-button>
        </f7-buttons>
      </f7-subnavbar>
    </f7-navbar>
    <f7-tabs swipeable>
      <f7-page-content tab active id="tab2-1">
        <f7-block inner inset>
          <p>Scroll again a little bit and then go to second sub tab, with <b>click or swipe</b> ...</p>
        </f7-block>
        <f7-list>
          <f7-list-item v-for="n in 9" :title="'Sub list item no ' + n"></f7-list-item>
        </f7-list>
      </f7-page-content>
      <f7-page-content tab id="tab2-2">
        <f7-block inner inset>
          <p><b>Close app and reopen it</b> - you will see, selected tabs and scroll positions will be restored properly <f7-icon fa="smile-o"></f7-icon></p>
        </f7-block>
      </f7-page-content>
      <f7-page-content tab id="tab2-3">
        <f7-block inner inset>
          <p>Content of <b>third sub</b> tab ...</p>
        </f7-block>
      </f7-page-content>
    </f7-tabs>
  </f7-page>
</template>

<script>
  module.exports = {}
</script>