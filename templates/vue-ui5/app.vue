<template>
  <div class="app">
    <ui5-messagestrip type="Information">
      Hello World at {{ time }}
    </ui5-messagestrip>
  </div>
</template>
<script>
import Vue from 'vue';
import '@ui5/webcomponents/dist/MessageStrip';

export default Vue.component('app', {
  data() {
    return {
      time: (new Date()).toISOString(),
    };
  },
  mounted() {
    setInterval(() => {
      this.time = (new Date()).toISOString();
    }, 1000);
  },
});
</script>
