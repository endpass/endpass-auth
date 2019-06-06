function registerE2EWorker() {
  if (navigator.serviceWorker) {
    const workerUrl = `${ENV.VUE_APP_E2E_CONNECT_BASE_URL}/e2e-sw.js`;

    try {
      navigator.serviceWorker.register(workerUrl);
    } catch (err) {
      /* eslint-disable-next-line */
      console.error(`Can't register e2e worker from ${workerUrl}!`);
    }
  }
}

export default registerE2EWorker;
