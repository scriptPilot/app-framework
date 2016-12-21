<template>
  <div>
    <f7-statusbar></f7-statusbar>
    <f7-views :navbar-fixed="$root.theme=='material'" :navbar-through="$root.theme=='ios'">
      <f7-view main url="home" :dynamic-navbar="$root.theme=='ios'">
        <f7-navbar v-if="$root.theme=='ios'"></f7-navbar>
        <f7-pages>          
        </f7-pages>
      </f7-view>
    </f7-views>   
  </div>  
</template>
<script>

  module.exports = {
    data: function() {
      return {
        url: localStorage.url ? localStorage.url : 'home'
      }
    }
  }

</script>
<style>
  
  /* Workaround for icon sizes until there is a real fix */
  .content-block .f7-icons {
    font-size: 16px;
    padding-bottom: 2px;
  }
  .content-block small .material-icons {
    font-size: 12px;
    padding-bottom: 2px;
  }
  
</style>