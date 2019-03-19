import Vue from 'vue';
import Vuex from 'vuex';

import core from './modules/core';
import accounts from './modules/accounts';
import requests from './modules/requests';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    core,
    accounts,
    requests,
  },
});

export default store;
