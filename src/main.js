import Vue from 'vue';
import VShowSlide from 'v-show-slide';

import store from '@/store';
import router from '@/router';
import './streams';
import App from '@/App';

Vue.use(VShowSlide);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
