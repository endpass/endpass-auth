import Vue from 'vue';
import VShowSlide from 'v-show-slide';
import e2eSetup from '@/util/e2eSetup';
import store from '@/store';
import router from '@/router';
import App from '@/App';
import validation from './validation';
import '@endpass/ui/kit/kit.theme-default.css';
import i18n from '@/locales/i18n';

(async () => {
  let duplexBridge;
  const isE2E = ENV.VUE_APP_IS_E2E_CONNECT;
  if (isE2E) {
    duplexBridge = await e2eSetup(window);
  }

  Vue.use(validation);
  Vue.use(VShowSlide);
  Vue.config.productionTip = false;

  new Vue({
    render: h => h(App),
    store,
    i18n,
    router,
  }).$mount('#app');

  if (isE2E && duplexBridge) {
    duplexBridge.finishSetup();
  }
})();
