import { METHODS, WIDGET_RESIZE_DURATION, WALLET_TYPES } from '@/constants';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

const initWidget = async ({ commit }) => {
  const { position, isMobile } = await bridgeMessenger.sendAndWaitResponse(
    METHODS.WIDGET_INIT,
  );

  commit('setMobileModeStatus', isMobile);
  commit('setWidgetPosition', position);
};

const openWidget = async ({ dispatch }, { widgetNode, root = false }) => {
  await bridgeMessenger.sendAndWaitResponse(METHODS.WIDGET_OPEN, {
    root,
  });
  dispatch('fitWidget', widgetNode);
};

const closeWidget = async ({ dispatch }, widgetNode) => {
  await bridgeMessenger.send(METHODS.WIDGET_CLOSE);
  dispatch('fitWidget', widgetNode);
};

const expandMobileWidget = async ({ commit }) => {
  commit('setWidgetLoadingStatus', true);

  await bridgeMessenger.sendAndWaitResponse(METHODS.WIDGET_EXPAND_REQUEST);

  commit('setWidgetLoadingStatus', false);
  commit('expandWidget');
};

const collapseMobileWidget = ({ commit }) => {
  commit('minimizeWidget');

  bridgeMessenger.send(METHODS.WIDGET_COLLAPSE_REQUEST);
};

const openAccounts = async ({ dispatch }, widgetNode) => {
  await dispatch('openWidget', {
    widgetNode,
  });
};

const closeAccounts = async ({ dispatch }, widgetNode) => {
  dispatch('fitWidget', widgetNode);
};

const fitWidget = (ctx, widgetNode) => {
  setTimeout(() => {
    bridgeMessenger.send(METHODS.WIDGET_FIT, {
      height: widgetNode.clientHeight,
    });
  }, WIDGET_RESIZE_DURATION + 100);
};

const unmountWidget = () => {
  bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
};

const createAccountFromWidget = async (
  { dispatch, commit },
  { address, password },
) => {
  commit('setWidgetLoadingStatus', true);

  try {
    await dispatch('validatePassword', { address, password });
    await dispatch('createAccount', { password });
  } catch (err) {
    throw err;
  } finally {
    commit('setWidgetLoadingStatus', false);
  }
};

export default {
  initWidget,
  openWidget,
  closeWidget,
  openAccounts,
  closeAccounts,
  fitWidget,
  unmountWidget,
  expandMobileWidget,
  collapseMobileWidget,
  createAccountFromWidget,
};
