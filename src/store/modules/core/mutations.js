const changeInitStatus = (state, status) => {
  state.inited = status;
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

export default {
  changeInitStatus,
  changeLoadingStatus,
  changeIdentityMode,
  changeShowCreateAccount,
};
