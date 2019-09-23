// @ts-check
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default function() {
  const store = new Vuex.Store({
    strict: !ENV.VUE_APP_IS_PRODUCTION,
  });

  return store;
}
