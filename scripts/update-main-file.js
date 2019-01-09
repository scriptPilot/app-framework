// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

// Define variables
const relAppPath = path.relative(path.cache(), path.app());
const importVue = fs.pathExistsSync(path.app('vue.js'))
  ? `import VueDefault from 'vue'; import customizeVue from '${relAppPath}/vue.js'; const Vue = customizeVue(VueDefault);`
  : 'import Vue from \'vue\'';
const importAppCSSFile = fs.pathExistsSync(path.app('app.css'))
  ? `import "${relAppPath}/app.css";` : '';

// Create main file content
const mainFileContent = `
${importVue}
import Framework7 from 'framework7/framework7.esm.bundle';
import 'framework7/css/framework7.css';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle';
import { Plugins } from '@capacitor/core';
import App from '${relAppPath}/app.vue';
import 'framework7-icons';
import 'material-icons/iconfont/material-icons.css';
${importAppCSSFile}

Vue.config.productionTip = false;

Framework7.use(Framework7Vue);

export default new Vue({
  el: '#app',
  render: c => c(App),
  mounted() {
    this.$f7ready(() => {
      Plugins.SplashScreen.hide().catch(() => {});
    });
  },
});
`;

// Update main.js file
try {
  fs.outputFileSync(path.cache('main.js'), mainFileContent.trim());
  log.success('Updated main.js file.');
} catch (e) {
  log.error('Failed to update main.js file.');
}
