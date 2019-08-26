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
    if (!window.parent.e2eBridge) {
      throw new Error();
    }

    /* eslint-disable-next-line */
    const { web3, setWeb3Network } = require('@/service/web3');

    /* eslint-disable-next-line */
    console.warn('AUTH is working on E2E MODE');

    window.Cypress = true;
    window.parent.setWeb3AuthProvider = net => {
      setWeb3Network(net);
      window.parent.web3AuthNet = net;
      window.parent.web3Auth = web3;
    };

    await window.parent.e2eBridge.awaitClientResume();

    window.XMLHttpRequest = window.parent.XMLHttpRequest;
    window.fetch = window.parent.fetch;
    /* eslint-disable-next-line */
  } catch (e) {}

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
