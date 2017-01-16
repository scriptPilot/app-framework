<template>
  <f7-page>
    <f7-navbar title="Image" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <p style="text-align: center"><f7-icon fa="spinner fa-spin" size="20"></f7-icon></p>
      <p style="text-align: center"><img :src="img" /></p>
      <p>See source code to understand how to integrate images to your app.</p>
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