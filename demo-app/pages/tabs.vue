<!-- Page with tabs to demontrate state recovery -->

<template>

  <!-- Page with necessary props -->
  <f7-page no-page-content with-subnavbar>
  
    <!-- Navbar -->
    <f7-navbar title="Tab Handling" back-link="Back" sliding>    
      <f7-nav-right>
        <f7-link icon="icon-bars" open-panel="right"></f7-link>
      </f7-nav-right>
      
      <!-- Tab links in sub navbar -->
      <f7-subnavbar>
        <f7-buttons>
          <f7-button tab-link="#tab1" active>Tab 1</f7-button>
          <f7-button tab-link="#tab2">Tab 2</f7-button>
          <f7-button tab-link="#tab3">Tab 3</f7-button>
        </f7-buttons>
      </f7-subnavbar>
      
    </f7-navbar>
    
    <!-- Tabs -->
    <f7-tabs swipeable>
    
      <!-- Tab 1 -->
      <f7-page-content tab active id="tab1">
        <f7-block inner inset>
          <p>Scroll a little bit down and then go to second tab, with <b>click or swipe</b> ...</p>
        </f7-block>
        <f7-list>
          <f7-list-item v-for="n in 9" :title="'List item no ' + n"></f7-list-item>
        </f7-list>
      </f7-page-content>
      
      <!-- Tab 2 -->
      <f7-page-content tab id="tab2">
        <f7-block inner inset>
          Open <f7-link href="tabs-sub">sub page with tabs</f7-link>
        </f7-block>
      </f7-page-content>
      
      <!-- Tab 3 -->
      <f7-page-content tab id="tab3">
        <f7-block inner inset>
          <p>Content of <b>third</b> tab ...</p>
        </f7-block>
      </f7-page-content>
      
    </f7-tabs>
    
  </f7-page>
</template>

<script>
  module.exports = {}
</script>
