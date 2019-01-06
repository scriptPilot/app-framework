<template>
  <f7-app :params="f7Params">
    <f7-statusbar></f7-statusbar>
    <f7-view url="/" :main="true" class="ios-edges"></f7-view>
  </f7-app>
</template>
<script>
import routes from './routes';

export default {
  data() {
    return {
      f7Params: {
        routes,
      },
    };
  },
};
</script>
