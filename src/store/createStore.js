// @ts-check
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * @param {object?} [options] passed options for store
 * @return {import('vuex').Store<{}>} store Vuex store instance
 */
export default options => {
  return new Vuex.Store({
    strict: !ENV.VUE_APP_IS_PRODUCTION,
    ...options,
  });
}
