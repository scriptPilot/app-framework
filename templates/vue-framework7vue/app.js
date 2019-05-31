import Vue from 'vue';
import Framework7 from 'framework7/framework7.esm.bundle';
import 'framework7/css/framework7.bundle.min.css';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle';
import app from './app.vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

Framework7.use(Framework7Vue);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(app),
});
