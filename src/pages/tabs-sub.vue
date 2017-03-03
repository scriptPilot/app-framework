<!-- Sub tabs page to demonstrate state recovery -->

<template>
  <f7-page tabs no-page-content with-subnavbar>
    <f7-navbar title="Tab Handling Sub" back-link="Back" sliding>
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
          <p><b>Close app and reopen it</b> - you will see, selected tabs, scroll positions, side panels and popups will be restored properly <f7-icon fa="smile-o"></f7-icon></p>
        </f7-block>        
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
            
              <!-- Show login / logout button, depending on the user status -->
              <f7-button open-login-screen="#login-screen" :text="$root.user ? 'Logout' : 'Login Screen'"></f7-button>
              
            </f7-col>
          </f7-grid>
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
