<template>
  <f7-navbar>
    <f7-nav-left></f7-nav-left>
    <f7-nav-title>{{title}}</f7-nav-title>
    <f7-nav-right>
      <f7-button @click="toggleDevTools" v-if="$electron" icon-f7="desktop"></f7-button>
    </f7-nav-right>
  </f7-navbar>
</template>
<script>
export default {
  props: ['title'],
  methods: {
    toggleDevTools() {
      if (this.$electron) {
        this.$electron.remote.getCurrentWindow().toggleDevTools();
      }
    },
  },
};
</script>
