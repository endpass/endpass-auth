import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export const state = {
  currentSettings: {},
  collapsed: true,
  isAccountsCollapsed: true,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
