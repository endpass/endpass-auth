import store from '@/store';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';
import withPayloadHandler from './middleware/withPayloadHandler';
import answerToRequest from './middleware/answerToRequest';
import Queue from './Queue';
import { initDialogResize } from '@/streams/Actions/dialogResize';

function initWidgetStream() {
  initDialogResize();
  const queueInst = new Queue({
    middleware: [withPayloadHandler, answerToRequest],
  });

  const methodToOptions = {
    [METHODS.LOGOUT_RESPONSE]: {
      payloadHandler() {
        store.commit('logout');
        store.dispatch('unmountWidget');
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
