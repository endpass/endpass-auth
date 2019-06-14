import { SWController, SWControllerDuplexBridge } from '@endpass/e2e-utils';

const registerWorker = url =>
  new Promise(async resolve => {
    if (!window.navigator.serviceWorker) return resolve(null);

    try {
      const registration = await window.navigator.serviceWorker.register(url);
      const updateHandler = () => {
        registration.removeEventListener('updatefound', updateHandler);

        return resolve(registration.active);
      };

      if (registration.active) {
        return resolve(registration.active);
      }

      registration.addEventListener('updatefound', updateHandler);
    } catch (err) {
      /* eslint-disable */
      console.error(`Service worker ${url} was not registered!`);
      console.error(err.message);
      console.error(err);
      /* eslint-enable */
      return resolve(null);
    }
  });

const e2eSetup = async () => {
  const sw = await registerWorker(
    `${ENV.VUE_APP_E2E_CONNECT_BASE_URL}/sw-e2e.js`,
  );

  if (!sw) return;

  const controller = new SWController(sw);

  const swDuplexBridge = new SWControllerDuplexBridge({
    controller,
  });

  swDuplexBridge.subscribe();
  await swDuplexBridge.awaitSetupFinishReceive();
};

export default e2eSetup;
