import { web3 } from '@/class/singleton';
import { Network } from '@endpass/class';
import { METHODS } from '@/constants';

import bridgeMessenger from '@/class/singleton/messengers';
import dialogClose from '@/streams/dialogClose';

const init = async ({ dispatch, commit }) => {
  try {
    await dispatch('defineOnlyV3Accounts');
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

const dialogCloseWrap = () => {
  dialogClose();
};

export default {
  init,
  setWeb3NetworkProvider,
  dialogClose: dialogCloseWrap,
  startBridge,
};
