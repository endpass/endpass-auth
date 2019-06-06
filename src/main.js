import Vue from 'vue';
import VShowSlide from 'v-show-slide';
import e2eWorker from '@/util/e2eWorker';
import store from '@/store';
import router from '@/router';
import App from '@/App';

if (ENV.VUE_APP_IS_E2E_CONNECT) {
  e2eWorker();
}

Vue.use(VShowSlide);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
