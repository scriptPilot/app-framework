export default {
  created() {
    if (this === this.$root) {
      this.$electron = window && window.require ? window.require('electron') : null;
    } else {
      this.$electron = this.$root.$electron;
    }
  },
};
