// TODO: move it to the utils
export function registerE2EWorker() {
  // eslint-disable-next-line consistent-return
  return new Promise(async resolve => {
    if (!navigator.serviceWorker) return resolve();

    const workerUrl = `${ENV.VUE_APP_E2E_CONNECT_BASE_URL}/e2e-sw.js`;

    try {
      const registration = await navigator.serviceWorker.register(workerUrl);
      const activateHandler = () =>
        setTimeout(() => {
          const isCurrentScope = new RegExp(window.location.origin).test(
            registration.scope,
          );
          const isActivated = Boolean(registration.active);

          if (isCurrentScope && isActivated) {
            return resolve();
          }

          return activateHandler();
        }, 500);

      activateHandler();
    } catch (err) {
      /* eslint-disable */
      console.error(`Can't register e2e worker from ${workerUrl}!`);
      console.error(err);
      /* eslint-enable */

      return resolve();
    }
  });
}

export default {
  registerE2EWorker,
};
