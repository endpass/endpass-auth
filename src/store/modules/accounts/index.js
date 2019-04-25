import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const state = {
  linkSent: false,
  authParams: null,
  otpEmail: null,
  accounts: [],
  settings: null,
  balance: null,
  recoveryIdentifier: null,
  isPermission: false,
  isLogin: false,
  demoData: null,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
