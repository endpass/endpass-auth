import store, { authStore, accountsStore } from '@/store';
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
    [METHODS.WIDGET_CHANGE_MOBILE_MODE]: {
      payloadHandler({ isMobile }) {
        store.commit('setMobileModeStatus', isMobile);
      },
    },
    [METHODS.WIDGET_COLLAPSE_RESPONSE]: {
      payloadHandler() {
        store.dispatch('collapseMobileWidget');
      },
    },
    [METHODS.LOGOUT_RESPONSE]: {
      payloadHandler() {
        authStore.logout();
        store.dispatch('unmountWidget');
      },
    },
    [METHODS.CHANGE_SETTINGS_RESPONSE]: {
      async payloadHandler({ activeAccount, activeNet }) {
        accountsStore.setSettings({
          lastActiveAccount: activeAccount,
          net: activeNet,
        });
        accountsStore.defineSettings();
      },
    },
  };

  bridgeMessenger.subscribe(async (payload, req) => {
    const { method } = req;
    const options = methodToOptions[method] || {};

    queueInst.handleRequest(options, payload, req);
  });
}

export default initWidgetStream;
