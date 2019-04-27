import store from '@/store';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import withPayloadHandler from './middleware/withPayloadHandler';
import Queue from './Queue';

function initWidgetStream() {
  const queueInst = new Queue({ middleware: [withPayloadHandler] });

  const methodToOptions = {
    [METHODS.LOGOUT_RESPONSE]: {
      payloadHandler() {
        store.commit('logout');
        bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
      },
    },
    [METHODS.CHANGE_SETTINGS_RESPONSE]: {
      payloadHandler({ activeAccount, activeNet }) {
        store.dispatch('setSettings', {
          lastActiveAccount: activeAccount,
          net: activeNet,
        });
        store.dispatch('defineSettings');
      },
    },
  };

  bridgeMessenger.subscribe(async (payload, req) => {
    // routing by methods
    const { method } = req;

    const options = methodToOptions[method] || {};

    queueInst.handleRequest(options, payload, req);
  });
}

export default initWidgetStream;
