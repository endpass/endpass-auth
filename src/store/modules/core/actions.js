import { METHODS, DIRECTION } from '@/constants';

import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { accountChannel } from '@/class/singleton/channels';
import settingsService from '@/service/settings';
import { Answer } from '@/class';
import { initDialogStream } from '@/streams';
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
  if (!getters.isDialog) return;

  const {
    isIdentityMode,
    demoData,
    source,
  } = await bridgeMessenger.sendAndWaitResponse(METHODS.INITIATE);

  if (source === DIRECTION.AUTH) {
    initDialogStream();
  }

  if (isIdentityMode !== undefined) {
    commit('changeIdentityMode', isIdentityMode);
  }

  if (demoData) {
    await dispatch('setupDemoData', demoData);
  }

  bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);

  dispatch('subscribeOnBroadcasting');
};

const subscribeOnBroadcasting = ({ commit, dispatch }) => {
  bridgeMessenger.subscribe(METHODS.LOGOUT_RESPONSE, () => {
    commit('logout');
    dispatch('unmountWidget');

    settingsService.clearLocalSettings();
    accountChannel.put(
      Answer.createOk({
        type: 'logout',
      }),
    );
  });
};

const logout = async ({ commit }) => {
  commit('changeLoadingStatus', true);

  const res = await bridgeMessenger.sendAndWaitResponse(METHODS.LOGOUT_REQUEST);

  commit('changeLoadingStatus', false);

  if (res.error) {
    throw new Error(res.error);
  }
};

const changeAccount = async ({ commit }, address) => {
  commit('changeLoadingStatus', true);

  const res = await bridgeMessenger.sendAndWaitResponse(
    METHODS.CHANGE_SETTINGS_REQUEST,
    {
      address,
    },
  );

  if (res.error) {
    throw new Error(res.error);
  }

  commit('changeLoadingStatus', false);
};

const dialogCloseWrap = () => {
  dialogClose();
};

export default {
  init,
  startBridge,
  logout,
  changeAccount,
  subscribeOnBroadcasting,
  dialogClose: dialogCloseWrap,
};
