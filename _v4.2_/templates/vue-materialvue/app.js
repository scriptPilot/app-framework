import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import app from './app.vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

Vue.use(VueMaterial);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(app),
});
