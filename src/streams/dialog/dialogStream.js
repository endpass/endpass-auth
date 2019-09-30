import { authStore, accountsStore, requestStore } from '@/store';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import {
  accountChannel,
  authChannel,
  signChannel,
  documentChannel,
} from '@/class/singleton/channels';
import { METHODS } from '@/constants';
import settingsService from '@/service/settings';
import Answer from '@/class/Answer';
import Queue from '@/streams/Queue';
import middleware from '@/streams/middleware';
import { initDialogResize } from '@/streams/Actions/dialogResize';

function initDialogStream() {
  initDialogResize();

  const queueInst = new Queue({ middleware });

  const methodToOptions = {
    [METHODS.SIGN]: {
      commit(payload) {
        requestStore.setRequest(payload);
      },
      routeName: 'sign',
      channel: signChannel,
      needAuth: true,
      needPermission: true,
    },
    [METHODS.CREATE_DOCUMENT]: {
      routeName: 'document-create',
      channel: documentChannel,
      needAuth: true,
      needPermission: true,
    },
    [METHODS.AUTH]: {
      commit(payload) {
        authStore.setAuthParams(payload);
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
          accountsStore.defineOnlyV3Accounts(),
          authStore.defineAuthStatus(),
          accountsStore.defineSettings(),
        ]);
      },
    },
    [METHODS.GET_SETTINGS]: {
      needPermission: true,
      async payloadHandler() {
        await accountsStore.defineSettings();
        const { settings } = accountsStore;
        return { settings };
      },
    },
    [METHODS.RECOVER]: {
      needPermission: true,
      payloadHandler(payload) {
        return requestStore.recoverMessage(payload);
      },
    },
    [METHODS.LOGOUT_RESPONSE]: {
      payloadHandler() {
        authStore.logout();
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
