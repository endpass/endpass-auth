import { METHODS, WIDGET_RESIZE_DURATION } from '@/constants';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

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

const changeWidgetAccount = async (ctx, address) => {
  const newSettings = await bridgeMessenger.sendAndWaitResponse(
    METHODS.WIDGET_CHANGE_ACCOUNT,
    {
      address,
    },
  );

  bridgeMessenger.send(METHODS.BROADCAST, {
    type: 'settings',
    data: newSettings,
  });
};

export default {
  openWidget,
  closeWidget,
  openAccounts,
  closeAccounts,
  fitWidget,
  changeWidgetAccount,
  unmountWidget,
};
