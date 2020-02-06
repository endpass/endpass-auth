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
import { sendOpen } from '@/streams/actions/dialogOpen';
import Answer from '@/class/Answer';
import {
  accountChannel,
  authChannel,
  documentChannel,
  permissionChannel,
  signChannel,
  walletChannel,
} from '@/class/singleton/channels';
import host from '@/class/singleton/host';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class CoreModule extends VuexModule {
  isInitStarted = false;

  isIniting = true;

  isServerMode = false;

  rateLimitTimeout = 0;

  isIdentityMode = false;

  isDialog = isDialog;

  constructor(props, { authStore, sharedStore }) {
    super(props);
    this.authStore = authStore;
    this.sharedStore = sharedStore;
    this.authStore.cookieExpireChecker.value.onExpire(() => {
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

  @Action
  async initStreams({ isDialogStream, isWidgetStream }) {
    this.isInitStarted = true;
    this.isIniting = true;

    try {
      bridgeMessenger.send(METHODS.BRIDGE_CONNECTION_OPEN);

      if (isDialogStream || isWidgetStream) {
        await this.setupCore();
      }

      await this.setupResize();

      if (isDialogStream) {
        await this.setupDialog();
      }

      if (isWidgetStream) {
        await this.setupWidget();
      }

      await this.authStore.defineAuthStatus();
      await this.startBridge();
      bridgeMessenger.send(METHODS.BRIDGE_CONNECTION_READY);

      // deprecated
      bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);
    } catch (e) {
      bridgeMessenger.send(METHODS.BRIDGE_CONNECTION_ERROR);
      console.error(e);
      throw e;
    } finally {
      this.isIniting = false;
    }
  }

  @Action
  async setupDialog() {
    initDialogStream();
    initDialogRequestStream();

    this.authStore.cookieExpireChecker.value.onExpire(() => {
      this.dialogClose();
      this.finishLogout();
    });
  }

  @Action
  async setupWidget() {
    initWidgetStream();

    this.authStore.cookieExpireChecker.value.onExpire(() => {
      bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
      this.finishLogout();
    });
  }

  @Action
  async setupResize() {
    initDialogResize();
  }

  @Action
  cancelAllChannels() {
    const fail = () => Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER);
    [
      permissionChannel,
      authChannel,
      accountChannel,
      signChannel,
      documentChannel,
      walletChannel,
    ].forEach(channel => channel.put(fail()));
  }

  @Action
  async setupCore() {
    const {
      isIdentityMode,
      originLocation,
    } = await bridgeMessenger.sendAndWaitResponse(METHODS.INITIATE);

    host.origin = originLocation;
    this.isIdentityMode = isIdentityMode;
  }

  @Action
  async startBridge() {
    if (!this.isDialog) return;

    const { isIdentityMode } = this;

    if (isIdentityMode !== undefined) {
      this.isServerMode = isIdentityMode;
    }

    initCoreStream();
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

  @Action
  async dialogSendOpen() {
    sendOpen();
  }
}

export default CoreModule;
