import store from '@/store';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import {
  accountChannel,
  authChannel,
  signChannel,
} from '@/class/singleton/channels';
import { METHODS } from '@/constants';
import settingsService from '@/service/settings';
import identityService from '@/service/identity';
import { Answer } from '@/class';
import Queue from './Queue';
import middleware from './middleware';
import { initDialogResizeStream } from './dialogResize';

function initDialogStream() {
  initDialogResizeStream();

  const queueInst = new Queue({ middleware });

  const methodToOptions = {
    [METHODS.SIGN]: {
      commit(payload) {
        store.commit('setRequest', payload);
      },
      routeName: 'sign',
      channel: signChannel,
      needAuth: true,
      needPermission: true,
    },
    [METHODS.AUTH]: {
      commit(payload) {
        store.commit('setAuthParams', payload);
      },
      channel: authChannel,
      needAuth: true,
      needPermission: true,
    },
    [METHODS.ACCOUNT]: {
      routeName: 'account',
      channel: accountChannel,
      needAuth: true,
      needPermission: true,
      async beforeShow() {
        await Promise.all([
          store.dispatch('defineOnlyV3Accounts'),
          store.dispatch('defineSettings'),
        ]);
      },
    },
    [METHODS.GET_SETTINGS]: {
      needPermission: true,
      async payloadHandler() {
        await store.dispatch('defineSettings');
        const { settings } = store.state.accounts;
        return { settings };
      },
    },
    [METHODS.RECOVER]: {
      needPermission: true,
      payloadHandler(payload) {
        return store.dispatch('recoverMessage', payload);
      },
    },
    [METHODS.LOGOUT]: {
      payloadHandler() {
        return identityService.logout();
      },
    },
    [METHODS.LOGOUT_RESPONSE]: {
      payloadHandler() {
        store.commit('logout');
        accountChannel.put(
          Answer.createOk({
            type: 'logout',
          }),
        );
        settingsService.clearLocalSettings();
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

export default initDialogStream;
