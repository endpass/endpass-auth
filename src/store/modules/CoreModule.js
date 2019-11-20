import { Action, VuexModule, Module, Mutation } from 'vuex-class-modules';
import ConnectError from '@endpass/connect/ConnectError';
import { METHODS, DIRECTION } from '@/constants';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import settingsService from '@/service/settings';
import {
  initDialogStream,
  initWidgetStream,
  initCoreStream,
  initDialogRequestStream,
} from '@/streams';

// TODO: move it to the streams methods
import dialogClose from '@/streams/actions/dialogClose';
import isDialog from '@/util/isDialog';
import { initDialogResize } from '@/streams/actions/dialogResize';
import Answer from '@/class/Answer';
import {
  accountChannel,
  authChannel,
  documentChannel,
  permissionChannel,
  signChannel,
  walletChannel,
} from '@/class/singleton/channels';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class CoreModule extends VuexModule {
  isInited = false;

  isServerMode = false;

  rateLimitTimeout = 0;

  isDialog = isDialog;

  constructor(props, { authStore, sharedStore }) {
    super(props);
    this.authStore = authStore;
    this.sharedStore = sharedStore;
    this.authStore.cookieExpire.value.onExpire(() => {
      this.cancelAllChannels();
    });
  }

  get isLoading() {
    // for old code support
    return this.sharedStore.isLoading;
  }

  get isRateLimit() {
    return this.rateLimitTimeout !== 0;
  }

  @Mutation
  changeLoadingStatus(val) {
    this.sharedStore.changeLoadingStatus(val);
  }

  @Mutation
  setRateLimitTimeout(val) {
    this.rateLimitTimeout = val;
  }

  @Mutation
  changeInitStatus(val) {
    this.isInited = val;
  }

  @Action
  async init() {
    try {
      await this.authStore.defineAuthStatus();
      await this.startBridge();
      // eslint-disable-next-line
    } catch (err) {
      console.error(err);
    }
  }

  @Action
  async initDialog() {
    if (this.isInited) return;

    initDialogStream();
    initDialogRequestStream();

    this.authStore.cookieExpire.value.onExpire(() => {
      this.dialogClose();
      this.finishLogout();
    });

    this.isInited = true;
  }

  @Action
  async initWidget() {
    if (this.isInited) return;

    initWidgetStream();

    this.authStore.cookieExpire.value.onExpire(() => {
      bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
      this.finishLogout();
    });

    this.isInited = true;
  }

  @Action
  async initResize() {
    initDialogResize();
  }

  @Action
  cancelAllChannels() {
    const fail = () => Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER);

    permissionChannel.put(fail());
    authChannel.put(fail());
    accountChannel.put(fail());
    signChannel.put(fail());
    documentChannel.put(fail());
    walletChannel.put(fail());
  }

  @Action
  async startBridge() {
    if (!this.isDialog) return;

    const { isIdentityMode } = await bridgeMessenger.sendAndWaitResponse(
      METHODS.INITIATE,
    );

    if (isIdentityMode !== undefined) {
      this.isServerMode = isIdentityMode;
    }

    initCoreStream();
    bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);
  }

  @Action
  async logout({ isCloseDialog = true } = {}) {
    this.sharedStore.changeLoadingStatus(true);

    const { error, code, source } = await bridgeMessenger.sendAndWaitResponse(
      METHODS.LOGOUT_REQUEST,
    );

    this.sharedStore.changeLoadingStatus(false);

    if (error || code) {
      throw ConnectError.create(code, error);
    }

    if (isCloseDialog && (!source || source === DIRECTION.AUTH)) {
      this.dialogClose();
    } else if (source === DIRECTION.WIDGET) {
      bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
    }

    this.finishLogout();
  }

  @Action
  finishLogout() {
    this.authStore.logout();
    settingsService.clearLocalSettings();
  }

  @Action
  async changeAccount(address) {
    this.sharedStore.changeLoadingStatus(true);

    const { error, code } = await bridgeMessenger.sendAndWaitResponse(
      METHODS.CHANGE_SETTINGS_REQUEST,
      {
        address,
      },
    );

    if (error || code) {
      throw ConnectError.create(code, error);
    }

    this.sharedStore.changeLoadingStatus(false);
  }

  @Action
  dialogClose() {
    dialogClose();
  }
}

export default CoreModule;
