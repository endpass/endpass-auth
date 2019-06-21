import Vue from 'vue';
import VShowSlide from 'v-show-slide';
import e2eSetup from '@/util/e2eSetup';
import store from '@/store';
import router from '@/router';
import App from '@/App';
import validation from './validation';

(async () => {
  if (ENV.VUE_APP_IS_E2E_CONNECT) {
    await e2eSetup(window);
  }

  Vue.use(validation);
  Vue.use(VShowSlide);
  Vue.config.productionTip = false;

  new Vue({
    render: h => h(App),
    store,
    router,
  }).$mount('#app');
})();
