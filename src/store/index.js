import Vue from 'vue';
import Vuex from 'vuex';

import core from './modules/core';
import widget from './modules/widget';
import accounts from './modules/accounts';
import requests from './modules/requests';
import gasPrice from './modules/gasPrice';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    core,
    widget,
    accounts,
    requests,
    gasPrice,
  },
});

export default store;
