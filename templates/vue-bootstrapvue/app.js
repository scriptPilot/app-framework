import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import app from './app.vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(app),
});
