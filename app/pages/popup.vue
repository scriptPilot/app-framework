<!-- Page content for popup -->

<template>  
  <f7-page>
    <f7-navbar title="Popup">
      <f7-nav-right>
        <f7-link close-popup>Close</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block>Popup and text will be restored after app restart.</f7-block>
    <f7-list inset form>
      <f7-list-item>
        <f7-label>Text</f7-label>
        
        <!-- Input binded with v-model to ensure proper state revovery -->
        <f7-input v-model="text" placeholder="Some text ..." type="text"></f7-input>
        
      </f7-list-item>
    </f7-list>
    <f7-block inset>
      <f7-button close-popup>Close Popup</f7-button>
    </f7-block>
  </f7-page>
</template>

<script>

  // Assign input value for proper use in v-model
  module.exports = {
    data: function () {
      return {
        text: ''
      }
    }
  }
  
</script>
