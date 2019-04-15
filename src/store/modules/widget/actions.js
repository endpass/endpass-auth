import { METHODS, WIDGET_RESIZE_DURATION } from '@/constants';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

const openWidget = async () => {
  await bridgeMessenger.sendAndWaitResponse(METHODS.WIDGET_OPEN);
};

const fitWidget = (ctx, widgetNode) => {
  setTimeout(() => {
    bridgeMessenger.send(METHODS.WIDGET_FIT, {
      height: widgetNode.clientHeight,
    });
  }, WIDGET_RESIZE_DURATION + 100);
};

const toggleWidget = async ({ state, commit, dispatch }, widgetNode) => {
  if (state.collapsed) {
    await dispatch('openWidget');
  }

  commit('toggleWidget');
  dispatch('fitWidget', widgetNode);
};

const toggleAccounts = async ({ state, commit, dispatch }, widgetNode) => {
  if (state.isAccountsCollapsed) {
    await dispatch('openWidget');
  }

  commit('toggleAccounts');
  dispatch('fitWidget', widgetNode);
};

export default {
  toggleWidget,
  toggleAccounts,
  fitWidget,
  openWidget,
};
