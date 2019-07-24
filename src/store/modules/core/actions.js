import ConnectError from '@endpass/class/ConnectError';
import { METHODS, DIRECTION } from '@/constants';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import settingsService from '@/service/settings';
import {
  initDialogStream,
  initWidgetStream,
  initCoreStream,
  initDialogRequestStream,
} from '@/streams';
// TODO: move it to the streams methods
import dialogClose from '@/streams/Actions/dialogClose';

const init = async ({ dispatch }) => {
  try {
    await dispatch('defineAuthStatus');
    await dispatch('startBridge');
    // eslint-disable-next-line
  } catch (err) {}
};

const initDialog = async ({ state, commit }) => {
  if (state.isInited) return;

  initDialogStream();
  initDialogRequestStream();
  commit('changeInitStatus', true);
};

const initWidget = async ({ state, commit }) => {
  if (state.isInited) return;

  initWidgetStream();
  commit('changeInitStatus', true);
};

const startBridge = async ({ dispatch, commit, getters }) => {
  if (!getters.isDialog) return;

  const {
    isIdentityMode,
    demoData,
    showCreateAccount,
  } = await bridgeMessenger.sendAndWaitResponse(METHODS.INITIATE);

  if (isIdentityMode !== undefined) {
    commit('changeIdentityMode', isIdentityMode);
  }

  if (demoData) {
    await dispatch('setupDemoData', demoData);
  }

  if (showCreateAccount !== undefined) {
    commit('changeShowCreateAccount', showCreateAccount);
  }

  initCoreStream();
  bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);
};

const logout = async ({ commit }) => {
  commit('changeLoadingStatus', true);

  const { error, code, source } = await bridgeMessenger.sendAndWaitResponse(
    METHODS.LOGOUT_REQUEST,
  );

  commit('changeLoadingStatus', false);

  if (error || code) {
    throw ConnectError.create(code, error);
  }

  if (!source || source === DIRECTION.AUTH) {
    bridgeMessenger.send(METHODS.DIALOG_CLOSE);
  } else if (source === DIRECTION.WIDGET) {
    bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
  }

  settingsService.clearLocalSettings();
};

const changeAccount = async ({ commit }, address) => {
  commit('changeLoadingStatus', true);

  const { error, code } = await bridgeMessenger.sendAndWaitResponse(
    METHODS.CHANGE_SETTINGS_REQUEST,
    {
      address,
    },
  );

  if (error || code) {
    throw ConnectError.create(code, error);
  }

  commit('changeLoadingStatus', false);
};

const dialogCloseWrap = () => {
  dialogClose();
};

export default {
  init,
  initDialog,
  initWidget,
  startBridge,
  logout,
  changeAccount,
  dialogClose: dialogCloseWrap,
};
