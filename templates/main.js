import Vue from 'vue';
import Framework7 from 'framework7/framework7.esm.bundle';
import 'framework7/css/framework7.css';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle';
import App from './app.vue';

if (process.env.NODE_ENV === 'development') {
  Vue.config.productionTip = false;
}

Framework7.use(Framework7Vue);

export default new Vue({
  el: '#app',
  render: c => c(App),
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = 'service-worker.js';
    navigator.serviceWorker.register(swPath).then((registration) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }
    }, (err) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('ServiceWorker registration failed: ', err);
      }
    });
  });
}
