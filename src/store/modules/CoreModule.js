// @ts-check
import { Action, VuexModule, Module, Mutation } from 'vuex-class-modules';
import ConnectError from '@endpass/class/ConnectError';
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
import dialogClose from '@/streams/Actions/dialogClose';
import isDialog from '@/util/isDialog';

@Module({ generateMutationSetters: true })
class CoreModule extends VuexModule {
  isInited = false;

  isIdentityMode = false;

  showCreateAccount = true;

  rateLimitTimeout = 0;

  isDialog = isDialog;

  constructor(props, { accountsStore, sharedStore }) {
    super(props);
    this.accountsStore = accountsStore;
    this.sharedStore = sharedStore;
  }

  get loading() {
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
      await this.accountsStore.defineAuthStatus();
      await this.startBridge();
      // eslint-disable-next-line
    } catch (err) {
      console.error(err);
    }
  }

  @Action
  initDialog() {
    if (this.isInited) return;

    initDialogStream();
    initDialogRequestStream();
    this.isInited = true;
  }

  @Action
  initWidget() {
    if (this.isInited) return;

    initWidgetStream();
    this.isInited = true;
  }

  @Action
  async startBridge() {
    if (!this.isDialog) return;

    const {
      isIdentityMode,
      showCreateAccount,
    } = await bridgeMessenger.sendAndWaitResponse(METHODS.INITIATE);

    if (isIdentityMode !== undefined) {
      this.isIdentityMode = isIdentityMode;
    }

    if (showCreateAccount !== undefined) {
      this.showCreateAccount = showCreateAccount;
    }

    initCoreStream();
    bridgeMessenger.send(METHODS.READY_STATE_BRIDGE);
  }

  @Action
  async logout() {
    this.sharedStore.changeLoadingStatus(true);

    const { error, code, source } = await bridgeMessenger.sendAndWaitResponse(
      METHODS.LOGOUT_REQUEST,
    );

    this.sharedStore.changeLoadingStatus(false);

    if (error || code) {
      throw ConnectError.create(code, error);
    }

    if (!source || source === DIRECTION.AUTH) {
      bridgeMessenger.send(METHODS.DIALOG_CLOSE);
    } else if (source === DIRECTION.WIDGET) {
      bridgeMessenger.send(METHODS.WIDGET_UNMOUNT);
    }

    this.accountsStore.logout();
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
