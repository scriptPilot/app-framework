<template>
  <f7-page no-page-content with-subnavbar>
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
      <f7-tab id="tab1" active class="page-content">
        <f7-block inner inset>
          <p>Go to second tab, with <b>click or swipe</b> ...</p>
        </f7-block>
        <f7-list form>
          <f7-list-item>
            <f7-label>Name</f7-label>
            <f7-input type="text" placeholder="Name"></f7-input>
          </f7-list-item>
        </f7-list>
        <f7-block inner>
           <p>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            text
           </p>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab2" class="page-content">
        <f7-block inner inset>
          Open <f7-link href="tabs-sub">sub page with tabs</f7-link>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab3" class="page-content">
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