import { METHODS } from '@/constants';

import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { applyDialogStream } from '@/streams';

// TODO: move it to the streams mehtods
import dialogClose from '@/streams/dialogClose';

const init = async ({ dispatch, commit }) => {
  try {
    await dispatch('defineAuthStatus');
    await dispatch('startBridge');
    // eslint-disable-next-line
  } catch (err) {
  } finally {
    commit('changeInitStatus', true);
  }
};

const startBridge = async ({ dispatch, commit, getters }) => {
  if (!getters.isDialog) {
    return;
  }

  const {
    isIdentityMode,
    demoData,
    source,
  } = await bridgeMessenger.sendAndWaitResponse(METHODS.INITIATE);

  if (source === 'dialog') {
    applyDialogStream();
  }

  if (isIdentityMode !== undefined) {
    commit('changeIdentityMode', isIdentityMode);
  }

  if (demoData) {
    await dispatch('setupDemoData', demoData);
  }

  bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);
  bridgeMessenger.subscribe(METHODS.BROADCAST, ({ payload }) => {
    switch (payload.type) {
      case 'settings':
        commit('setWidgetSettings', payload.data);
        break;
      default:
        break;
    }
  });
};

const dialogCloseWrap = () => {
  dialogClose();
};

export default {
  init,
  dialogClose: dialogCloseWrap,
  startBridge,
};
