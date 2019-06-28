import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export const state = {
  isMobile: false,
  isExpanded: false,
  isLoading: false,
};

export default {
  state,
  mutations,
  actions,
  getters,
};
