<template>
  <div style="padding: 20px">
    <md-toolbar>
      <h3 class="md-title">
        Hello World at {{ time }}
      </h3>
    </md-toolbar>
  </div>
</template>
<script>
export default {
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
};
</script>
