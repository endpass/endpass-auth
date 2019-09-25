export default function() {
  if (ENV.VUE_APP_IS_E2E_CONNECT) {
    return !!window.parent.e2eBridge;
  }

  return window.self !== window.top;
}
