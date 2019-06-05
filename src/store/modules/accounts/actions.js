import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isV3 from '@endpass/utils/isV3';
import mapToQueryString from '@endpass/utils/mapToQueryString';
import signerService from '@/service/signer';
import identityService from '@/service/identity';
import permissionsService from '@/service/permissions';
import settingsService from '@/service/settings';
import modeService from '@/service/mode';
import cryptoDataService from '@/service/cryptoData';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import asyncCheckProperty from '@endpass/utils/asyncCheckProperty';

import {
  accountChannel,
  authChannel,
  permissionChannel,
} from '@/class/singleton/channels';
import { Answer } from '@/class';
import {
  ENCRYPT_OPTIONS,
  WALLET_TYPES,
  IDENTITY_MODE,
  METHODS,
  ORIGIN_HOST,
} from '@/constants';
import filterXpub from '@/util/filterXpub';

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

    if (!res.success) throw new Error(res.message || 'Auth failed!');

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

    const { signature } = await signerService.signDataWithAccount({
      account: keystore,
      data: email,
      password,
    });

    res = await permissionsService.login({
      challengeId,
      signature,
    });
  } catch (err) {
    console.error(err);
    throw new Error('Password is incorrect');
  }
  return res;
};

const checkOauthLoginRequirements = async ({ commit }, challengeId) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await permissionsService.getLoginDetails(challengeId);

    return res;
  } catch (err) {
    throw new Error('Failed to check Oauth login status');
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const createWallet = async ({ commit }, { password }) => {
  const mod = await import('@endpass/utils/walletGen');
  const walletGen = mod.default;

  const {
    seedKey,
    encryptedSeed,
    v3KeystoreHdWallet,
    v3KeystoreChildWallet,
  } = await walletGen.createComplex(password, ENCRYPT_OPTIONS);

  const info = {
    address: v3KeystoreHdWallet.address,
    type: WALLET_TYPES.HD_MAIN,
    hidden: false,
  };

  await identityService.saveAccount(v3KeystoreHdWallet);
  await identityService.saveAccountInfo(v3KeystoreHdWallet.address, info);
  await identityService.backupSeed(encryptedSeed);

  await identityService.saveAccount(v3KeystoreChildWallet);
  await identityService.updateAccountSettings(v3KeystoreChildWallet.address);

  commit('setAccounts', [v3KeystoreChildWallet.address]);

  return seedKey;
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

    if (!res.success) throw new Error('Auth failed!');

    settingsService.clearLocalSettings();

    const type = get(res, 'challenge.challengeType');

    commit('setOtpEmail', type === 'otp' ? email : null);
    commit('setSentStatus', !!link);
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const confirmAuthViaOtp = async ({ commit }, { email, code }) => {
  commit('changeLoadingStatus', true);

  try {
    await identityService.otpAuth(email, code);
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const confirmAuth = (ctx, serverMode) => {
  authChannel.put(Answer.createOk(serverMode));
};

const cancelAuth = () => {
  authChannel.put(Answer.createFail('Auth was canceled by user!'));
};

const getSettings = async ({ dispatch }) => {
  const settings = await identityService.getSettings();
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
    throw new Error('Something went wrong, try again later');
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const checkAccountExists = () => identityService.checkAccountExist();

const getAccounts = async ({ commit }) => {
  // TODO: check `getAccounts` usages
  try {
    const res = await identityService.getAccounts();
    const accounts = await Promise.all(
      res.map(address => identityService.getAccountInfo(address)),
    );

    commit(
      'setAccounts',
      accounts.filter(account => filterXpub(account.address)),
    );
    commit('setAuthStatus', true);
  } catch (err) {
    commit('setAccounts', null);
    commit('setAuthStatus', false);
  }
};

const defineOnlyV3Accounts = async ({ commit, getters }) => {
  if (getters.demoData) {
    commit('setAuthStatus', true);
    return;
  }

  try {
    const res = await identityService.getAccounts();

    const accounts = await Promise.all(
      res
        .filter(filterXpub)
        .map(address => identityService.getAccountWithInfo(address)),
    );

    commit(
      'setAccounts',
      accounts.filter(account => isV3(account)).map(({ info }) => info),
    );
    commit('setAuthStatus', true);
  } catch (err) {
    commit('setAccounts', null);
    commit('setAuthStatus', false);
  }
};

const getAccount = async (ctx, address) => {
  const res = await identityService.getAccount(address);

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

const openCreateAccountPage = async () => {
  window.open(`${ENV.VUE_APP_WALLET_URL}?closeAfterCreateWallet=true`);
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
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const recover = async ({ state, commit }, { seedPhrase }) => {
  commit('changeLoadingStatus', true);

  try {
    const signature = await signerService.recover({
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
  } catch (err) {
    throw err;
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
  const signature = await signerService.getSignedRequest({
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
  permissionChannel.put(Answer.createFail());
};

const waitLogin = async ({ dispatch }) => {
  await identityService.waitLogin();
  await dispatch('defineAuthStatus');
  // authChannel.put(Answer.createOk());
};

const defineAuthStatus = async ({ commit }) => {
  const status = await identityService.getAuthStatus();
  commit('setAuthByCode', status);
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

export default {
  auth,
  authWithGoogle,
  authWithGitHub,
  authWithOauth,
  createWallet,
  setWalletCreated,
  checkAccountExists,
  grantPermissionsWithOauth,
  cancelAuth,
  confirmAuth,
  confirmAuthViaOtp,
  handleAuthRequest,
  defineSettings,
  getAccount,
  getAccounts,
  getFirstPrivateAccount,
  getSettings,
  defineOnlyV3Accounts,
  openCreateAccountPage,
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
  getConsentDetails,
  getAccountBalance,
  subscribeOnBalanceUpdates,
  checkOauthLoginRequirements,
};
