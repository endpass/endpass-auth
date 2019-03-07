import isEmpty from 'lodash/isEmpty';

const setAuthParams = (state, params) => {
  state.authParams = params;
};

const setAuthStatus = (state, status) => {
  state.isAuthorized = status;
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

export default {
  setDemoData,
  setAuthParams,
  setAuthStatus,
  setOtpEmail,
  setAccounts,
  setSentStatus,
  setSettings,
  setRecoveryIdentifier,
};
