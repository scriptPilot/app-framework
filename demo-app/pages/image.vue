<template>
  <f7-page>
    <f7-navbar title="Icon & Image" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <p style="text-align: center"><f7-icon fa="spinner fa-spin" size="25" class="color-red"></f7-icon></p>
      <p style="text-align: center"><img :src="img" /></p>
      <p>Colored, animated icon and image added to the page, please see source code for details.</p>
    </f7-block>
  </f7-page>
</template>

<script>
  
var image = require('../images/standard-js-sticker-small.png')

module.exports = {
  data: function() {
    return {
      img: image
    }
  }
}

</script>