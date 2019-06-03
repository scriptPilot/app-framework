<template>
  <div style="padding: 20px">
    <b-alert
      variant="success"
      show
    >
      Hello World at {{ time }}
    </b-alert>
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
