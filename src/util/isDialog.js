// TODO: change to isClosable
const isDialog = ENV.VUE_APP_IS_E2E_CONNECT
  ? !!window.parent.e2eBridge
  : window.self !== window.top;

export default isDialog;
