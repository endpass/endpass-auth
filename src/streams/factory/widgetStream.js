import store, { authStore, accountsStore } from '@/store';
import { METHODS } from '@/constants';
import subscribe from '@/streams/subscribe';
import withPayloadHandler from '../middleware/withPayloadHandler';
import answerToRequest from '../middleware/answerToRequest';

function initWidgetStream() {
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

  subscribe(methodToOptions, [withPayloadHandler, answerToRequest]);
}

export default initWidgetStream;
