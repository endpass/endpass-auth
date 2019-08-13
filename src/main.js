import Vue from 'vue';
import VShowSlide from 'v-show-slide';
import store from '@/store';
import router from '@/router';
import App from '@/App';
import validation from './validation';
import '@endpass/ui/kit/kit.theme-default.css';
import i18n from '@/locales/i18n';

(async () => {
  try {
    if (window.parent.e2eBridge) {
      console.warn('AUTH is working on E2E MODE');
      await window.parent.e2eBridge.awaitClientResume();
      window.XMLHttpRequest = window.parent.XMLHttpRequest;
      window.fetch = window.parent.fetch;
    }
  } catch (e) {
    console.error(e);
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
})();
