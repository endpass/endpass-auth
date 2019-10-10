import { authStore, accountsStore, requestStore } from '@/store';
import {
  accountChannel,
  authChannel,
  signChannel,
  documentChannel,
  walletChannel,
} from '@/class/singleton/channels';
import { METHODS } from '@/constants';
import Answer from '@/class/Answer';
import middleware from './dialogMiddleware';
import { initDialogResize } from '@/streams/actions/dialogResize';
import subscribe from '@/streams/subscribe';

function initDialogStream() {
  initDialogResize();

  const methodToOptions = {
    [METHODS.SIGN]: {
      commit(payload) {
        requestStore.setRequest(payload);
      },
      routeName: 'sign',
      channel: signChannel,
      needAuth: true,
      needPermission: true,
      needWallet: true,
    },
    [METHODS.GENERATE_WALLET]: {
      routeName: 'wallet-generate',
      channel: walletChannel,
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
      needWallet: true,
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
      needWallet: true,
      async payloadHandler() {
        await accountsStore.defineSettings();
        const { settings } = accountsStore;
        return { settings };
      },
    },
    [METHODS.RECOVER]: {
      needPermission: true,
      needWallet: true,
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
      },
    },
  };

  subscribe(methodToOptions, middleware);
}

export default initDialogStream;
