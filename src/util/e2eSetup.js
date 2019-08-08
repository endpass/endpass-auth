import { SWController, SWClient } from '@endpass/e2e-utils';

const registerWorker = url =>
  // eslint-disable-next-line
  new Promise(async resolve => {
    if (!window.navigator.serviceWorker) {
      return resolve(null);
    }

    try {
      const registration = await window.navigator.serviceWorker.register(url);

      if (registration.active) {
        return resolve(registration.active);
      }

      const updateHandler = () => {
        registration.removeEventListener('updatefound', updateHandler);
        if (registration.active) {
          return resolve(registration.active);
        }

        const installingWorker = registration.installing;
        // eslint-disable-next-line consistent-return
        const onStatus = () => {
          if (installingWorker.state === 'activated') {
            installingWorker.removeEventListener('statechange', onStatus);
            return resolve(registration.active);
          }
          return null;
        };
        installingWorker.addEventListener('statechange', onStatus);
        return null;
      };

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

// eslint-disable-next-line consistent-return
const e2eSetup = async () => {
  const sw = await registerWorker(
    `${ENV.VUE_APP_E2E_CONNECT_BASE_URL}/sw-e2e.js`,
  );

  if (!sw) return null;

  const controller = new SWController(sw);

  const swClient = new SWClient({
    controller,
    setupTarget: window.parent,
    name: 'e2e-auth',
  });

  if (!swClient) {
    console.error(
      'Doh! Something broken with SWClient initialization, check e2eSetup() method',
    );
  } else {
    await swClient.awaitClientResume();
  }
};

export default e2eSetup;
