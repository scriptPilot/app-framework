<!-- Demontration how to include images and icons properly -->

<template>
  <f7-page>
    <f7-navbar title="Icon & Image" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
    
      <!-- Icon -->
      <p style="text-align: center"><f7-icon fa="spinner fa-spin" size="25" class="color-red"></f7-icon></p>
      
      <!-- Images with src attribute could be linked directly and will be loaded correctly later on -->
      <p style="text-align: center"><img src="../images/standard-js-sticker-small.png" /></p>
      
      <p>Colored, animated icon and image added to the page, please see source code for details.</p>
    </f7-block>
  </f7-page>
</template>

<script>
  module.exports = {}
</script>
