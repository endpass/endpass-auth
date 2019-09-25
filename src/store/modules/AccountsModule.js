import { Action, VuexModule, Module, Mutation } from 'vuex-class-modules';
import mapToQueryString from '@endpass/utils/mapToQueryString';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isV3 from '@endpass/utils/isV3';
import ConnectError from '@endpass/class/ConnectError';
import asyncCheckProperty from '@endpass/utils/asyncCheckProperty';
import Network from '@endpass/class/Network';
import identityService from '@/service/identity';
import signer from '@/class/singleton/signer';
import permissionsService from '@/service/permissions';
import settingsService from '@/service/settings';
import modeService from '@/service/mode';
import cryptoDataService from '@/service/cryptoData';
import userService from '@/service/user';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import i18n from '@/locales/i18n';
import {
  accountChannel,
  authChannel,
  permissionChannel,
} from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import {
  ENCRYPT_OPTIONS,
  IDENTITY_MODE,
  METHODS,
  ORIGIN_HOST,
  WALLET_TYPES,
} from '@/constants';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class AccountsModule extends VuexModule {
  linkSent = false;

  authParams = null;

  otpEmail = null;

  accounts = [];

  settings = null;

  balance = null;

  recoveryIdentifier = null;

  isAccountCreated = false;

  isPermission = false;

  isLogin = false;

  constructor(props, { sharedStore }) {
    super(props);
    this.sharedStore = sharedStore;
  }

  get addresses() {
    return this.accounts.map(({ address }) => address);
  }

  get isAuthorized() {
    return this.isLogin && this.isPermission;
  }

  @Action
  async auth({ email, serverMode }) {
    const { type, serverUrl } = serverMode;
    const redirectUrl = get(this, 'authParams.redirectUrl', '');

    const queryParamsToAppend = {};

    if (type !== IDENTITY_MODE.DEFAULT) {
      Object.assign(queryParamsToAppend, {
        mode: type,
      });
    }

    if (serverUrl) {
      Object.assign(queryParamsToAppend, {
        serverUrl,
      });
    }

    const request = identityService.auth(
      email,
      mapToQueryString(redirectUrl, queryParamsToAppend),
    );

    await this.handleAuthRequest({
      request,
      email,
      link: true,
    });
  }

  @Action
  async authWithGoogle({ email, idToken }) {
    const request = identityService.authWithGoogle(idToken);

    await this.handleAuthRequest({
      request,
      email,
    });
  }

  @Action
  async authWithGitHub(code) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      const res = await identityService.authWithGitHub(code);

      if (!res.success) {
        throw new Error(res.message || i18n.t('store.auth.authFailed'));
      }

      settingsService.clearLocalSettings();

      const type = get(res, 'challenge.challengeType');
      if (type === 'otp') {
        this.otpEmail = res.email;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async authWithOauth({ challengeId, password }) {
    let res;

    try {
      const { email, keystore } = await permissionsService.getLoginDetails(
        challengeId,
      );

      const { signature } = await signer.signDataWithAccount({
        account: keystore,
        data: email,
        password,
      });

      res = await permissionsService.login({
        challengeId,
        signature,
      });
    } catch (err) {
      throw new Error(i18n.t('store.auth.passwordIncorrect'));
    }
    return res;
  }

  @Action
  async checkOauthLoginRequirements(challengeId) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      const res = await permissionsService.getLoginDetails(challengeId);

      return res;
    } catch (err) {
      throw new Error(i18n.t('store.auth.failedToCheckStatus'));
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async createInitialWallet({ password }) {
    const { default: walletGen } = await import(
      /* webpackChunkName: "wallet-gen" */ '@endpass/utils/walletGen'
    );
    const {
      v3KeystoreHdWallet,
      v3KeystoreChildWallet,
      encryptedSeed,
      seedKey,
    } = await walletGen.createComplex(password, ENCRYPT_OPTIONS);
    const info = {
      address: v3KeystoreHdWallet.address,
      type: WALLET_TYPES.HD_MAIN,
      hidden: false,
    };

    await userService.setAccount(v3KeystoreHdWallet.address, {
      ...v3KeystoreHdWallet,
      info,
    });
    await identityService.backupSeed(encryptedSeed);
    await userService.setAccount(
      v3KeystoreChildWallet.address,
      v3KeystoreChildWallet,
    );
    await identityService.updateAccountSettings(v3KeystoreChildWallet.address);
    await this.defineOnlyV3Accounts();

    return seedKey;
  }

  @Action
  async createAccount({ password }) {
    const nextWallet = await userService.getNextWalletFromHD({
      addresses: this.addresses,
      password,
    });
    const v3KeyStoreChild = nextWallet.toV3(
      Buffer.from(password),
      ENCRYPT_OPTIONS,
    );
    // TODO: change to utils get
    const web3 = await signer.getWeb3Instance();
    const checksumAddress = web3.utils.toChecksumAddress(
      v3KeyStoreChild.address,
    );

    await userService.setAccount(checksumAddress, {
      ...v3KeyStoreChild,
      address: checksumAddress,
    });

    this.accounts = [
      {
        address: checksumAddress,
        type: WALLET_TYPES.STANDARD,
        hidden: false,
      },
    ].concat(this.accounts);

    await this.updateSettings({
      lastActiveAccount: checksumAddress,
    });
  }

  @Mutation
  setWalletCreated() {
    this.isAccountCreated = true;
  }

  @Action
  getConsentDetails(consentChallenge) {
    return permissionsService.getConsentDetails(consentChallenge);
  }

  @Action
  grantPermissionsWithOauth({ consentChallenge, scopesList }) {
    return permissionsService.grantPermissions({
      consentChallenge,
      scopesList,
    });
  }

  @Action
  async handleAuthRequest({ email, request, link }) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      const res = await request;

      if (!res.success) throw new Error(i18n.t('store.auth.authFailed'));

      settingsService.clearLocalSettings();

      const type = get(res, 'challenge.challengeType');
      this.otpEmail = type === 'otp' ? email : null;
      this.linkSent = !!link;
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async confirmAuthViaOtp({ email, code }) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      await identityService.otpAuth(email, code);
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  confirmAuth(serverMode) {
    authChannel.put(Answer.createOk(serverMode));
  }

  @Action
  cancelAuth() {
    authChannel.put(
      Answer.createFail(
        ERRORS.AUTH_CANCELED_BY_USER,
        i18n.t('store.auth.authCanceled'),
      ),
    );
  }

  @Action
  async getSettings() {
    const settings = await userService.getSettings();
    const { lastActiveAccount } = settings;
    let account = null;

    if (lastActiveAccount) {
      account = await this.getAccount(lastActiveAccount);
    }

    if (!lastActiveAccount || !isV3(account)) {
      const lastAccount = await this.getFirstPrivateAccount();

      Object.assign(settings, {
        lastActiveAccount: get(lastAccount, 'address'),
      });
    }

    if (!settings.net) {
      Object.assign(settings, {
        net: Network.NET_ID.MAIN,
      });
    }

    return settings;
  }

  @Action
  async getSettingsWithoutPermission() {
    const settings = await userService.getSettingsSkipPermission();

    return settings;
  }

  @Action
  async defineSettings() {
    const settings = await this.getSettings();
    const mergedSettings = settingsService.mergeSettings(settings);

    settingsService.setLocalSettings(mergedSettings);

    this.settings = {
      ...settings,
      ...mergedSettings,
    };
  }

  @Action
  async defineSettingsWithoutPermission() {
    const settings = await this.getSettingsWithoutPermission();
    const mergedSettings = settingsService.mergeSettings(settings);

    this.settings = {
      ...settings,
      ...mergedSettings,
    };
  }

  @Action
  setSettings(payload) {
    settingsService.setLocalSettings(payload);
  }

  @Action
  async updateSettings(payload) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      await this.setSettings(payload);
      await this.defineSettings();

      const { settings } = this;
      const settingsToSend = {
        activeAccount: settings.lastActiveAccount,
        activeNet: settings.net,
      };
      const answer = Answer.createOk({
        type: 'update',
        settings: settingsToSend,
      });

      this.balance = null;

      bridgeMessenger.send(METHODS.CHANGE_SETTINGS_REQUEST, settingsToSend);
      accountChannel.put(answer);
    } catch (err) {
      throw new Error(i18n.t('global.somethingWrong'));
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async checkAccountExists() {
    return identityService.checkAccountExist();
  }

  @Action
  async defineOnlyV3Accounts() {
    try {
      const accounts = await userService.getV3Accounts();

      this.accounts = accounts
        .filter(account => isV3(account))
        .map(({ info }) => info);
      await this.changeAuthStatusByCode(200);
    } catch (err) {
      this.accounts = [];

      await this.changeAuthStatusByCode(401);
    }
  }

  @Action
  async getAccount(address) {
    const res = await userService.getAccount(address);

    return res;
  }

  @Action
  async getFirstPrivateAccount() {
    if (isEmpty(this.accounts)) {
      await this.defineOnlyV3Accounts();
    }

    const { accounts } = this;

    return !accounts
      ? null
      : accounts.find(account => account.type !== 'PublicAccount') || null;
  }

  @Action
  async waitAccountCreate() {
    await asyncCheckProperty(this, 'isAccountCreated');
  }

  @Action
  async closeAccount() {
    accountChannel.put(Answer.createOk({ type: 'close' }));
  }

  @Action
  async getRecoveryIdentifier() {
    this.sharedStore.changeLoadingStatus(true);

    try {
      this.recoveryIdentifier = await identityService.getRecoveryIdentifier(
        this.otpEmail,
      );
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async recover({ seedPhrase }) {
    this.sharedStore.changeLoadingStatus(true);

    try {
      const signature = await signer.recover({
        seedPhrase,
        recoveryIdentifier: this.recoveryIdentifier,
      });

      const { success } = await identityService.recover(
        this.otpEmail,
        signature,
        this.authParams.redirectUrl,
      );

      this.linkSent = true;

      return success;
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async validateCustomServer(serverUrl) {
    return modeService.validateIdentityServer(serverUrl);
  }

  @Action
  async signPermission({ password }) {
    const res = await identityService.getAuthPermission();

    if (res.success === false) {
      throw new Error(res.message);
    }
    const signature = await signer.getSignedRequest({
      v3KeyStore: res.keystore,
      password,
      request: {
        params: [ORIGIN_HOST],
      },
    });
    await identityService.setAuthPermission(signature);
    permissionChannel.put(Answer.createOk());
  }

  @Action
  cancelSignPermission() {
    permissionChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
  }

  @Action
  cancelAllChannels() {
    permissionChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
    authChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
    accountChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
  }

  @Action
  async waitLogin() {
    await identityService.waitLogin();
    await this.defineAuthStatus();
    // authChannel.put(Answer.createOk());
  }

  @Action
  async defineAuthStatus() {
    const status = await identityService.getAuthStatus();
    const settings = settingsService.getLocalSettings();

    if (status !== 200 && !isEmpty(settings)) {
      settingsService.clearLocalSettings();
    }

    await this.changeAuthStatusByCode(status);
    return status;
  }

  @Action
  async getAccountBalance({ address, net }) {
    const { balance } = await cryptoDataService.getAccountBalance({
      network: net,
      address,
    });

    return balance;
  }

  @Action
  subscribeOnBalanceUpdates() {
    const handler = () =>
      setTimeout(async () => {
        const address = get(this.settings, 'lastActiveAccount');
        const net = get(this.settings, 'net', 1);

        if (address) {
          try {
            this.balance = await this.getAccountBalance({ address, net });
          } catch (err) {
            this.balance = null;
          }
        }

        handler();
      }, 1500);

    handler();
  }

  @Action
  async validatePassword({ address, password }) {
    this.sharedStore.changeLoadingStatus(true);

    const v3KeyStore = await this.getAccount(address);

    try {
      await signer.validatePassword({
        v3KeyStore,
        password,
      });

      return true;
    } catch (err) {
      throw new Error(i18n.t('store.auth.passwordIncorrect'));
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  getSeedTemplateUrl() {
    return identityService.getSeedTemplateUrl();
  }

  @Mutation
  setAuthByCode(code) {
    this.isLogin = code === 403 || code === 200;
    this.isPermission = code === 200;
  }

  @Action
  changeAuthStatusByCode(code) {
    const { isAuthorized } = this;
    this.setAuthByCode(code);
    const isAuthorizedNew = this.isAuthorized;
    if (isAuthorizedNew !== isAuthorized) {
      bridgeMessenger.send(METHODS.AUTH_STATUS, isAuthorizedNew);
    }
  }

  @Mutation
  setAuthParams(params) {
    this.authParams = params;
  }

  @Mutation
  logout() {
    this.otpEmail = null;
    this.authParams = null;
    this.isPermission = false;
    this.isLogin = false;
    this.accounts = [];
    this.settings = null;
    this.recoveryIdentifier = null;
    this.isAccountCreated = false;
  }
}

export default AccountsModule;
