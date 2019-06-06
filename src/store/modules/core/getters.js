export default {
  isDialog() {
    if (ENV.VUE_APP_IS_E2E_CONNECT) {
      return true;
    }
    return window.self !== window.top;
  },
};
