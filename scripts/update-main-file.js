// Import modules
const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');

// Load app configuration
const configFile = path.app('config.json');
let config = {};
try {
  config = fs.readJsonSync(configFile);
  log.success('Loaded app config file.');
} catch (e) {
  log.error('Failed to load app config file.');
}

// Define variables
const relAppPath = path.relative(path.cache(), path.app());
const importVue = fs.pathExistsSync(path.app('vue.js'))
  ? `import VueDefault from 'vue'; import customizeVue from '${relAppPath}/vue.js'; const Vue = customizeVue(VueDefault);`
  : 'import Vue from \'vue\'';
const importFramework7Icons = config.iconFonts.useFramework7Icons
  ? 'import \'framework7-icons\';' : '';
const importMaterialDesignIcons = config.iconFonts.useMaterialDesignIcons
  ? 'import \'material-icons/iconfont/material-icons.css\';' : '';
const importAppCSSFile = fs.pathExistsSync(path.app('app.css'))
  ? `import "${relAppPath}/app.css";` : '';

// Create main file content
const mainFileContent = `
${importVue}
import Framework7 from 'framework7/framework7.esm.bundle';
import 'framework7/css/framework7.css';
${importFramework7Icons}
${importMaterialDesignIcons}
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle';
import { Plugins } from '@capacitor/core';
${importAppCSSFile}
import App from '${relAppPath}/app.vue';

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
