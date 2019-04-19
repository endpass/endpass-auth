import isEmpty from 'lodash/isEmpty';

const setAuthParams = (state, params) => {
  state.authParams = params;
};

const setAuthStatus = (state, flag) => {
  // TODO: merge with setAuthByCode functionality
  state.isLogin = flag;
  state.isPermission = flag;
};

const setAuthByCode = (state, code) => {
  state.isLogin = code !== 401;
  state.isPermission = !(code === 403 || code === 401);
};

const setOtpEmail = (state, email) => {
  state.otpEmail = email;
};

const setSentStatus = (state, status) => {
  state.linkSent = status;
};

const setAccounts = (state, accounts) => {
  state.accounts = isEmpty(accounts) ? [] : [...accounts];
};

const setSettings = (state, settings) => {
  state.settings = settings;
};

const setRecoveryIdentifier = (state, recoveryIdentifier) => {
  state.recoveryIdentifier = recoveryIdentifier;
};

const setDemoData = (state, demoData) => {
  state.demoData = demoData;
};

const logout = state => {
  state.otpEmail = null;
  state.authParams = null;
  state.isPermission = false;
  state.isLogin = false;
  state.accounts = [];
  state.settings = null;
  state.recoveryIdentifier = null;
};

export default {
  logout,
  setDemoData,
  setAuthParams,
  setAuthStatus,
  setOtpEmail,
  setAccounts,
  setSentStatus,
  setSettings,
  setRecoveryIdentifier,
  setAuthByCode,
};
