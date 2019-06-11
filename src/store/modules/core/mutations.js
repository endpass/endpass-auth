const changeInitStatus = (state, status) => {
  state.isInited = status;
};

const changeLoadingStatus = (state, status) => {
  state.loading = status;
};

const changeIdentityMode = (state, status) => {
  state.isIdentityMode = status;
};

const changeShowCreateAccount = (state, status) => {
  state.showCreateAccount = status;
};

const setRateLimitTimeout = (state, value) => {
  state.rateLimitTimeout = value;
};

export default {
  changeInitStatus,
  changeLoadingStatus,
  changeIdentityMode,
  changeShowCreateAccount,
  setRateLimitTimeout,
};
