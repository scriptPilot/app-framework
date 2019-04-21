import Vue from 'vue';
/* #frontendFramework7 */
import Framework7 from 'framework7/framework7.esm.bundle';
import 'framework7/css/framework7.bundle.min.css';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle';
/* /frontendFramework7 */
/* #frontendMaterial */
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
/* /frontendMaterial */
/* #frontendBootstrap */
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
/* /frontendBootstrap */
/* #iconsFramework7 */
import 'framework7-icons';
/* /iconsFramework7 */
/* #iconsMaterial */
import 'material-icons/css/material-icons.min.css';
/* /iconsMaterial */
import mixinElectron from './mixins/electron';
import app from '../app/app.vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

/* #frontendFramework7 */
Framework7.use(Framework7Vue);
/* /frontendFramework7 */
/* #frontendMaterial */
Vue.use(VueMaterial);
/* /frontendMaterial */
/* #frontendBootstrap */
Vue.use(BootstrapVue);
/* /frontendBootstrap */
Vue.mixin(mixinElectron);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(app),
});
