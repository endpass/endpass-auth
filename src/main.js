import Vue from 'vue';
import VueSvgIcons from 'vue-svgicon';

import store from '@/store';
import router from '@/router';
import App from '@/App';

Vue.config.productionTip = false;

Vue.use(VueSvgIcons);

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
