import { SWE2EController } from '@endpass/utils/e2e';
import { getServiceWorkerWithActivation } from '@endpass/utils/serviceWorkers';

export async function activateE2EWorker(target) {
  const sw = await getServiceWorkerWithActivation(
    `${ENV.VUE_APP_E2E_CONNECT_BASE_URL}/sw-e2e.js`,
  );
  const e2eController = new SWE2EController(sw);

  Object.assign(target, {
    e2eController,
  });
}

export default {
  activateE2EWorker,
};
