<template>
  <div>
    <p>Hello World at {{ time }}!</p>
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
