import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export const state = {
  loading: false,
  isInited: false,
  rateLimitTimeout: 0,
  isIdentityMode: false,
  showCreateAccount: true,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
