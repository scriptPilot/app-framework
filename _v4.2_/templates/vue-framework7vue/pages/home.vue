<template>
  <f7-page>
    <f7-navbar title="Home Page"></f7-navbar>
    <f7-block
      inset
      strong
    >
      <p>Hello World at {{ time }}</p>
    </f7-block>
  </f7-page>
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
