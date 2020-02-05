import { Action, VuexModule, Module } from 'vuex-class-modules';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isV3 from '@endpass/utils/isV3';
import ConnectError from '@endpass/connect/error';
import Network from '@endpass/class/Network';
import { fromWei, toChecksumAddress } from 'web3-utils';
import identityService from '@/service/identity';
import signer from '@/class/singleton/signer';
import permissionsService from '@/service/permissions';
import settingsService from '@/service/settings';
import userService from '@/service/user';
import authService from '@/service/auth';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import i18n from '@/locales/i18n';

import { accountChannel, permissionChannel } from '@/class/singleton/channels';

import Answer from '@/class/Answer';
import { ENCRYPT_OPTIONS, METHODS, WALLET_TYPES } from '@/constants';
import host from '@/class/singleton/host';

import web3, { setWeb3Network } from '@/class/singleton/web3';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class AccountsModule extends VuexModule {
  accounts = [];

  settings = {};

  balance = null;

  isBalanceLoading = true;

  isBalanceAutoUpdate = false;

  constructor(props, { sharedStore }) {
    super(props);
    this.sharedStore = sharedStore;
  }

  get addresses() {
    return this.accounts.map(({ address }) => address);
  }

  get isOtpMode() {
    return !!this.settings.otpEnabled;
  }

  get ethBalance() {
    if (!this.isBalanceLoading && this.balance) {
      return fromWei(this.balance);
    }
    return '0';
  }

  /**
   * @param {object} newSettings
   */
  @Action
  async changeSettings(newSettings) {
    const oldSettings = this.settings;
    this.settings = newSettings;

    const isNetworkChanged = oldSettings.net !== newSettings.net;
    if (isNetworkChanged) {
      setWeb3Network(newSettings.net);
    }

    this.resubscribeBalance({ isNetworkChanged, newSettings, oldSettings });
  }

  @Action
  async resubscribeBalance({ isNetworkChanged, newSettings, oldSettings }) {
    if (!this.isBalanceAutoUpdate) {
      return;
    }

    const isLastAccountChanged =
      newSettings.lastActiveAccount &&
      oldSettings.lastActiveAccount &&
      oldSettings.lastActiveAccount !== newSettings.lastActiveAccount;

    const isBalanceUpdateStopped = !this.isBalanceLoading && !this.balance;

    if (isLastAccountChanged || (isNetworkChanged && isBalanceUpdateStopped)) {
      this.subscribeOnBalanceUpdates();
    }
  }

  /**
   * Disable otp mode
   */
  @Action
  async disableOtpInStore() {
    await this.changeSettings({
      ...this.settings,
      otpEnabled: false,
    });
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
  async createAccount({ password }) {
    const nextWallet = await userService.getNextWalletFromHD({
      addresses: this.addresses,
      password,
    });
    const v3KeyStoreChild = nextWallet.toV3(
      Buffer.from(password),
      ENCRYPT_OPTIONS,
    );

    const checksumAddress = toChecksumAddress(v3KeyStoreChild.address);

    await userService.setAccount({
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

    await this.changeSettings({
      ...settings,
      ...mergedSettings,
    });
  }

  @Action
  async defineSettingsWithoutPermission() {
    const settings = await this.getSettingsWithoutPermission();
    const mergedSettings = settingsService.mergeSettings(settings);

    await this.changeSettings({
      ...settings,
      ...mergedSettings,
    });
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
        .filter(account => isV3(account) && account.info)
        .map(({ info }) => info);
    } catch (err) {
      this.accounts = [];
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
  async closeAccount() {
    accountChannel.put(Answer.createOk({ type: 'close' }));
  }

  @Action
  async signPermission({ password }) {
    await authService.setAuthPermission(password, host.origin);
    permissionChannel.put(Answer.createOk());
  }

  @Action
  cancelSignPermission() {
    permissionChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
  }

  @Action
  async getAccountBalance() {
    const address = get(this.settings, 'lastActiveAccount');
    const data = await web3.getBalance(address);

    return data;
  }

  @Action
  async enableAutoUpdateBalance() {
    this.isBalanceAutoUpdate = true;
    this.subscribeOnBalanceUpdates();
  }

  @Action
  async subscribeOnBalanceUpdates() {
    const address = get(this.settings, 'lastActiveAccount');

    this.isBalanceLoading = true;
    this.balance = null;

    for await (const { result, error, isNetworkChanged } of web3.iterateBalance(
      address,
    )) {
      this.isBalanceLoading = false;
      this.balance = result;

      if (isNetworkChanged) {
        this.subscribeOnBalanceUpdates();
        break;
      }

      if (address !== get(this.settings, 'lastActiveAccount') || error) {
        break;
      }
    }
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
    return authService.getSeedTemplateUrl();
  }

  @Action
  logout() {
    this.accounts = [];
    this.changeSettings({});
  }
}

export default AccountsModule;
