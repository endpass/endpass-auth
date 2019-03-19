import { web3 } from '@/class/singleton';
import { Network } from '@endpass/class';
import { METHODS } from '@/constants';

import bridgeMessenger from '@/class/singleton/messengers';
import syncChannel from '@/class/singleton/syncChannel';
import { Answer } from '@/class';

const init = async ({ dispatch, commit }, router) => {
  try {
    await dispatch('defineOnlyV3Accounts');
    await dispatch('subscribeOnDialog', router);
    await dispatch('subscribeOnBridge');
    await dispatch('startBridge');
    // eslint-disable-next-line
  } catch (err) {
  } finally {
    commit('changeInitStatus', true);
  }
};

const setWeb3NetworkProvider = (ctx, netId) => {
  const netUrl = Network.NETWORK_URL_HTTP[netId][0];
  const provider = new web3.providers.HttpProvider(netUrl);

  web3.setProvider(provider);
};

const subscribeOnBridge = async ({ commit, dispatch, rootState }) => {
  bridgeMessenger.subscribe(METHODS.RECOVER, async (payload, req) => {
    try {
      const res = await dispatch('recoverMessage', payload);

      req.answer(Answer.createOk(res));
    } catch (e) {
      req.answer(Answer.createFail());
    }
  });

  bridgeMessenger.subscribe(METHODS.GET_SETTINGS, async (payload, req) => {
    try {
      const settings = await dispatch('defineSettings');

      req.answer(Answer.createOk({ settings }));
    } catch (e) {
      req.answer(Answer.createFail());
    }
  });

  bridgeMessenger.subscribe(METHODS.LOGOUT, async (payload, req) => {
    try {
      await dispatch('logout');
      req.answer(Answer.createOk());
    } catch (e) {
      req.answer(Answer.createFail());
    }
  });

  bridgeMessenger.subscribe(METHODS.AUTH, async (payload, req) => {
    commit('setAuthParams', payload);

    const result = await syncChannel.take();

    req.answer(result);
  });

  bridgeMessenger.subscribe(METHODS.ACCOUNT, async (payload, req) => {
    const result = await syncChannel.take();

    req.answer(result);
  });

  bridgeMessenger.subscribe(METHODS.SIGN, async (payload, req) => {
    commit('setRequest', payload);

    const result = await syncChannel.take();

    req.answer(result);
  });
};

const startBridge = async ({ dispatch, commit, getters }) => {
  if (!getters.isDialog) {
    return;
  }

  const {
    isIdentityMode,
    demoData,
  } = await bridgeMessenger.sendAndWaitResponse(METHODS.INITIATE);

  if (isIdentityMode !== undefined) {
    commit('changeIdentityMode', isIdentityMode);
  }

  if (demoData) {
    await dispatch('setupDemoData', demoData);
  }

  bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);
};

const subscribeOnDialog = ({ dispatch }, router) => {
  bridgeMessenger.subscribe(METHODS.DIALOG_OPEN, (payload, req) => {
    const { route = '' } = payload;
    const onComplete = () => req.answer(Answer.createOk());
    router.push(`/${route}`, onComplete, onComplete);
  });

  bridgeMessenger.subscribe(METHODS.DIALOG_CLOSE, () => {
    router.push(`/bridge`);
  });

  dispatch('setupOnResize');
};

const setupOnResize = () => {
  let lastHeight = 0;
  const onResize = () => {
    const newHeight = document.body.offsetHeight;
    if (newHeight !== lastHeight) {
      lastHeight = newHeight;
      bridgeMessenger.send(METHODS.DIALOG_RESIZE, {
        offsetHeight: document.body.offsetHeight,
      });
    }
  };

  // dirty hack for detect resize
  setInterval(onResize, 200);

  window.addEventListener('resize', onResize);
};

export default {
  init,
  setWeb3NetworkProvider,
  setupOnResize,
  subscribeOnBridge,
  startBridge,
  subscribeOnDialog,
};
