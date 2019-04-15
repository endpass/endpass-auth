export default {
  isDialog() {
    return window.self !== window.top;
  },

  isIdentityMode(state) {
    return state.isIdentityMode;
  },
};
