export default {
  isDialog() {
    if (ENV.VUE_APP_IS_E2E_CONNECT_TESTING) {
      return true;
    }
    return window.self !== window.top;
  },
};
