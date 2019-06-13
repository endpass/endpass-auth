import { SWController, SWControllerDuplexBridge } from '@endpass/e2e-utils';

const e2eSetup = async () => {
  const sw = new Worker(`${ENV.VUE_APP_E2E_CONNECT_BASE_URL}/sw-e2e.js`);
  const controller = new SWController(sw);

  const swDuplexBridge = new SWControllerDuplexBridge({
    controller,
  });

  swDuplexBridge.subscribe();
  await swDuplexBridge.awaitSetupFinishReceive();
};

export default e2eSetup;
