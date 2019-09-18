import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isV3 from '@endpass/utils/isV3';
import mapToQueryString from '@endpass/utils/mapToQueryString';
import ConnectError from '@endpass/class/ConnectError';
import asyncCheckProperty from '@endpass/utils/asyncCheckProperty';
import Network from '@endpass/class/Network';
import signer from '@/class/singleton/signer';
import identityService from '@/service/identity';
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

const auth = async ({ state, dispatch }, { email, serverMode }) => {
  const { type, serverUrl } = serverMode;
  const redirectUrl = get(state, 'authParams.redirectUrl', '');

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

  await dispatch('handleAuthRequest', {
    request,
    email,
    link: true,
  });
};

const authWithGoogle = async ({ dispatch }, { email, idToken }) => {
  const request = identityService.authWithGoogle(idToken);

  await dispatch('handleAuthRequest', {
    request,
    email,
  });
};

const authWithGitHub = async ({ commit }, code) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await identityService.authWithGitHub(code);

    if (!res.success) {
      throw new Error(res.message || i18n.t('store.auth.authFailed'));
    }

    settingsService.clearLocalSettings();

    const type = get(res, 'challenge.challengeType');
    if (type === 'otp') {
      commit('setOtpEmail', res.email);
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const authWithOauth = async (ctx, { challengeId, password }) => {
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
};

const checkOauthLoginRequirements = async ({ commit }, challengeId) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await permissionsService.getLoginDetails(challengeId);

    return res;
  } catch (err) {
    throw new Error(i18n.t('store.auth.failedToCheckStatus'));
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const createInitialWallet = async ({ dispatch }, { password }) => {
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
  await dispatch('defineOnlyV3Accounts');

  return seedKey;
};

const createAccount = async ({ commit, getters, dispatch }, { password }) => {
  const nextWallet = await userService.getNextWalletFromHD({
    addresses: getters.addresses,
    password,
  });
  const v3KeyStoreChild = nextWallet.toV3(
    Buffer.from(password),
    ENCRYPT_OPTIONS,
  );
  // TODO: change to utils get
  const web3 = await signer.getWeb3Instance();
  const checksumAddress = web3.utils.toChecksumAddress(v3KeyStoreChild.address);

  await userService.setAccount(checksumAddress, {
    ...v3KeyStoreChild,
    address: checksumAddress,
  });
  commit('addAccount', {
    address: checksumAddress,
    type: WALLET_TYPES.STANDARD,
    hidden: false,
  });
  await dispatch('updateSettings', {
    lastActiveAccount: checksumAddress,
  });
};

const setWalletCreated = ({ commit }) => {
  commit('setAccountCreated', true);
};

const getConsentDetails = (ctx, consentChallenge) =>
  permissionsService.getConsentDetails(consentChallenge);

const grantPermissionsWithOauth = (ctx, { consentChallenge, scopesList }) =>
  permissionsService.grantPermissions({ consentChallenge, scopesList });

const handleAuthRequest = async ({ commit }, { email, request, link }) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await request;

    if (!res.success) throw new Error(i18n.t('store.auth.authFailed'));

    settingsService.clearLocalSettings();

    const type = get(res, 'challenge.challengeType');

    commit('setOtpEmail', type === 'otp' ? email : null);
    commit('setSentStatus', !!link);
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const confirmAuthViaOtp = async ({ commit }, { email, code }) => {
  commit('changeLoadingStatus', true);

  try {
    await identityService.otpAuth(email, code);
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const confirmAuth = (ctx, serverMode) => {
  authChannel.put(Answer.createOk(serverMode));
};

const cancelAuth = () => {
  authChannel.put(
    Answer.createFail(
      ERRORS.AUTH_CANCELED_BY_USER,
      i18n.t('store.auth.authCanceled'),
    ),
  );
};

const getSettings = async ({ dispatch }) => {
  const settings = await userService.getSettings();
  const { lastActiveAccount } = settings;
  let account = null;

  if (lastActiveAccount) {
    account = await dispatch('getAccount', lastActiveAccount);
  }

  if (!lastActiveAccount || !isV3(account)) {
    const lastAccount = await dispatch('getFirstPrivateAccount');

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
};

const getSettingsWithoutPermission = async () => {
  const settings = await userService.getSettingsSkipPermission();

  return settings;
};

const defineSettings = async ({ state, dispatch, commit, getters }) => {
  const { demoData } = getters;
  const settings = demoData ? state.settings : await dispatch('getSettings');
  const mergedSettings = settingsService.mergeSettings(settings);

  settingsService.setLocalSettings(mergedSettings);

  const newSettings = {
    ...settings,
    ...mergedSettings,
  };

  commit('setSettings', newSettings);
};

const defineSettingsWithoutPermission = async ({ dispatch, commit }) => {
  const settings = await dispatch('getSettingsWithoutPermission');
  const mergedSettings = settingsService.mergeSettings(settings);
  const newSettings = {
    ...settings,
    ...mergedSettings,
  };

  commit('setSettings', newSettings);
};

const setSettings = async (ctx, payload) => {
  settingsService.setLocalSettings(payload);
};

const updateSettings = async ({ state, commit, dispatch }, payload) => {
  commit('changeLoadingStatus', true);

  try {
    await dispatch('setSettings', payload);
    await dispatch('defineSettings');

    const { settings } = state;
    const settingsToSend = {
      activeAccount: settings.lastActiveAccount,
      activeNet: settings.net,
    };
    const answer = Answer.createOk({
      type: 'update',
      settings: settingsToSend,
    });

    commit('setBalance', null);

    bridgeMessenger.send(METHODS.CHANGE_SETTINGS_REQUEST, settingsToSend);
    accountChannel.put(answer);
  } catch (err) {
    throw new Error(i18n.t('global.somethingWrong'));
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const checkAccountExists = () => identityService.checkAccountExist();

const defineOnlyV3Accounts = async ({ dispatch, commit, getters }) => {
  if (getters.demoData) {
    await dispatch('changeAuthStatusByCode', 200);
    return;
  }

  try {
    const accounts = await userService.getV3Accounts();

    commit(
      'setAccounts',
      accounts.filter(account => isV3(account)).map(({ info }) => info),
    );
    await dispatch('changeAuthStatusByCode', 200);
  } catch (err) {
    commit('setAccounts', null);
    await dispatch('changeAuthStatusByCode', 401);
  }
};

const getAccount = async (ctx, address) => {
  const res = await userService.getAccount(address);

  return res;
};

const getFirstPrivateAccount = async ({ state, dispatch }) => {
  if (isEmpty(state.accounts)) {
    await dispatch('defineOnlyV3Accounts');
  }

  const { accounts } = state;

  return !accounts
    ? null
    : accounts.find(account => account.type !== 'PublicAccount') || null;
};

const waitAccountCreate = async ({ state }) => {
  await asyncCheckProperty(state, 'isAccountCreated');
};

const closeAccount = async () => {
  accountChannel.put(Answer.createOk({ type: 'close' }));
};

const getRecoveryIdentifier = async ({ state, commit }) => {
  commit('changeLoadingStatus', true);

  try {
    const identifier = await identityService.getRecoveryIdentifier(
      state.otpEmail,
    );

    commit('setRecoveryIdentifier', identifier);
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const recover = async ({ state, commit }, { seedPhrase }) => {
  commit('changeLoadingStatus', true);

  try {
    const signature = await signer.recover({
      seedPhrase,
      recoveryIdentifier: state.recoveryIdentifier,
    });

    const { success } = await identityService.recover(
      state.otpEmail,
      signature,
      state.authParams.redirectUrl,
    );

    commit('setSentStatus', true);

    return success;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const validateCustomServer = (ctx, serverUrl) =>
  modeService.validateIdentityServer(serverUrl);

const setupDemoData = async ({ commit }, demoData) => {
  if (!demoData || !demoData.v3KeyStore) {
    return;
  }

  const { address } = demoData.v3KeyStore;
  const accounts = [{ address }];

  commit('setDemoData', demoData);
  commit('setAccounts', accounts);
  commit('setSettings', {
    lastActiveAccount: address,
    net: demoData.activeNet,
  });
};

const signPermission = async (store, { password }) => {
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
};

const cancelSignPermission = () => {
  permissionChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
};

const cancelAllChannels = () => {
  permissionChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
  authChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
  accountChannel.put(Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER));
};

const waitLogin = async ({ dispatch }) => {
  await identityService.waitLogin();
  await dispatch('defineAuthStatus');
  // authChannel.put(Answer.createOk());
};

const defineAuthStatus = async ({ dispatch }) => {
  const status = await identityService.getAuthStatus();
  const settings = settingsService.getLocalSettings();

  if (status !== 200 && !isEmpty(settings)) {
    settingsService.clearLocalSettings();
  }

  await dispatch('changeAuthStatusByCode', status);
  return status;
};

const getAccountBalance = async (ctx, { address, net }) => {
  const { balance } = await cryptoDataService.getAccountBalance({
    network: net,
    address,
  });

  return balance;
};

const subscribeOnBalanceUpdates = ({ state, commit, dispatch }) => {
  const handler = () =>
    setTimeout(async () => {
      const address = get(state.settings, 'lastActiveAccount');
      const net = get(state.settings, 'net', 1);

      if (address) {
        try {
          const balance = await dispatch('getAccountBalance', { address, net });

          commit('setBalance', balance);
        } catch (err) {
          commit('setBalance', null);
        }
      }

      handler();
    }, 1500);

  handler();
};

const validatePassword = async (
  { commit, dispatch },
  { address, password },
) => {
  commit('changeLoadingStatus', true);

  const v3KeyStore = await dispatch('getAccount', address);

  try {
    await signer.validatePassword({
      v3KeyStore,
      password,
    });

    return true;
  } catch (err) {
    throw new Error(i18n.t('store.auth.passwordIncorrect'));
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const getSeedTemplateUrl = () => identityService.getSeedTemplateUrl();

const changeAuthStatusByCode = ({ commit, getters }, code) => {
  const { isAuthorized } = getters;
  commit('setAuthByCode', code);
  const isAuthorizedNew = getters.isAuthorized;
  if (isAuthorizedNew !== isAuthorized) {
    bridgeMessenger.send(METHODS.AUTH_STATUS, isAuthorizedNew);
  }
};

export default {
  auth,
  authWithGoogle,
  authWithGitHub,
  authWithOauth,
  changeAuthStatusByCode,
  createInitialWallet,
  setWalletCreated,
  checkAccountExists,
  grantPermissionsWithOauth,
  cancelAuth,
  confirmAuth,
  confirmAuthViaOtp,
  handleAuthRequest,
  defineSettings,
  getAccount,
  getFirstPrivateAccount,
  getSettings,
  defineOnlyV3Accounts,
  waitAccountCreate,
  waitLogin,
  setSettings,
  updateSettings,
  closeAccount,
  getRecoveryIdentifier,
  recover,
  validateCustomServer,
  defineAuthStatus,
  signPermission,
  cancelSignPermission,
  setupDemoData,
  cancelAllChannels,
  getConsentDetails,
  getAccountBalance,
  subscribeOnBalanceUpdates,
  checkOauthLoginRequirements,
  getSettingsWithoutPermission,
  defineSettingsWithoutPermission,
  validatePassword,
  createAccount,
  getSeedTemplateUrl,
};
