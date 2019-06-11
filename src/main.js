import Vue from 'vue';
import VShowSlide from 'v-show-slide';
import { injectE2EResolver } from '@endpass/utils/e2e';
import { activateE2EWorker } from '@/util/e2eWorker';
import store from '@/store';
import router from '@/router';
import App from '@/App';

(async () => {
  if (ENV.VUE_APP_IS_E2E_CONNECT) {
    await activateE2EWorker(window);
    await injectE2EResolver(window);
  }

  Vue.use(VShowSlide);
  Vue.config.productionTip = false;

  new Vue({
    render: h => h(App),
    store,
    router,
  }).$mount('#app');
})();
