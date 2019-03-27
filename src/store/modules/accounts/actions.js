import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Bip39 from 'bip39';
import HDKey from 'ethereumjs-wallet/hdkey';
import Web3 from 'web3';
import { keystore } from '@endpass/utils';

import IdentityService from '@/service/identity';
import SettingsService from '@/service/settings';
import ModeService from '@/service/mode';
import { Network } from '@endpass/class';
import {
  accountChannel,
  authChannel,
  permissionChannel,
} from '@/class/singleton/channels';
import { Answer } from '@/class';

import Wallet from '@/class/Wallet';
import { ORIGIN_HOST } from '@/constants';

const auth = async ({ state, dispatch }, { email, serverMode }) => {
  const { type, serverUrl } = serverMode;
  let redirectUrl = `${get(state, 'authParams.redirectUrl')}?mode=${type}`;

  if (serverUrl) {
    redirectUrl = `${redirectUrl}&serverUrl=${serverUrl}`;
  }

  const request = IdentityService.auth(email, redirectUrl);

  await dispatch('handleAuthRequest', {
    request,
    email,
    link: true,
  });
};

const authWithGoogle = async ({ dispatch }, { email, idToken }) => {
  const request = IdentityService.authWithGoogle(idToken);

  await dispatch('handleAuthRequest', {
    request,
    email,
  });
};

const authWithGitHub = async ({ commit }, code) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await IdentityService.authWithGitHub(code);

    if (!res.success) throw new Error(res.message || 'Auth failed!');

    SettingsService.clearLocalSettings();

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

const handleAuthRequest = async ({ commit }, { email, request, link }) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await request;

    if (!res.success) throw new Error('Auth failed!');

    SettingsService.clearLocalSettings();

    const type = get(res, 'challenge.challengeType');
    if (type === 'otp') {
      commit('setOtpEmail', email);
      commit('changeLoadingStatus', false);
    } else if (link) {
      commit('setSentStatus', true);
    }

    // todo: add check status 403
    // replace('permission');
  } catch (err) {
    commit('changeLoadingStatus', false);
    throw err;
  }
};

const confirmAuthViaOtp = async ({ commit }, { email, code }) => {
  commit('changeLoadingStatus', true);

  try {
    await IdentityService.otpAuth(email, code);
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const confirmAuth = ({}, serverMode) => {
  authChannel.put(Answer.createOk(serverMode));
};

const cancelAuth = () => {
  authChannel.put(Answer.createFail('Auth was canceled by user!'));
};

const getSettings = async ({ dispatch }) => {
  const settings = await IdentityService.getSettings();
  const { lastActiveAccount } = settings;
  let account = null;

  if (lastActiveAccount) {
    account = await dispatch('getAccount', lastActiveAccount);
  }

  if (!lastActiveAccount || !keystore.isV3(account)) {
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

  const mergedSettings = SettingsService.mergeSettings(settings);

  SettingsService.setLocalSettings(mergedSettings);

  const newSettings = {
    ...settings,
    ...mergedSettings,
  };

  commit('setSettings', newSettings);
};

const setSettings = async (ctx, payload) => {
  SettingsService.setLocalSettings(payload);
};

const updateSettings = async ({ state, commit, dispatch }, payload) => {
  commit('changeLoadingStatus', true);

  try {
    await dispatch('setSettings', payload);

    await dispatch('defineSettings');
    const { settings } = state;

    const answer = Answer.createOk({
      type: 'update',
      settings: {
        activeAccount: settings.lastActiveAccount,
        activeNet: settings.net,
      },
    });
    accountChannel.put(answer);
  } catch (err) {
    throw new Error('Something went wrong, try again later');
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const getAccounts = async ({ commit }) => {
  // TODO: check `getAccounts` usages
  try {
    const res = await IdentityService.getAccounts();
    const accounts = await Promise.all(
      res.map(address => IdentityService.getAccountInfo(address)),
    );

    commit(
      'setAccounts',
      accounts.filter(account => !/^xpub/.test(account.address)),
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
    const res = await IdentityService.getAccounts();

    const accounts = await Promise.all(
      res
        .filter(address => !/^xpub/.test(address))
        .map(address => IdentityService.getAccountWithInfo(address)),
    );

    commit(
      'setAccounts',
      accounts
        .filter(account => keystore.isV3(account))
        .map(({ info }) => info),
    );
    commit('setAuthStatus', true);
  } catch (err) {
    commit('setAccounts', null);
    commit('setAuthStatus', false);
  }
};

const getAccount = async (ctx, address) => {
  const res = await IdentityService.getAccount(address);

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

const awaitAccountCreate = async ({ commit }) => {
  const res = await IdentityService.awaitAccountCreate();

  commit('setAccounts', res);
};

const openCreateAccountPage = async () => {
  window.open(ENV.wallet.openUrl);
};

const awaitLogoutConfirm = async ({ commit }) => {
  commit('changeLoadingStatus', true);

  try {
    await IdentityService.awaitLogoutConfirm();
  } catch (err) {
    throw err;
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const closeAccount = async () => {
  accountChannel.put(Answer.createOk({ type: 'close' }));
};

const logout = async ({ commit }) => {
  commit('changeLoadingStatus', true);

  try {
    await IdentityService.logout();
    SettingsService.clearLocalSettings();
    commit('logout');

    accountChannel.put(
      Answer.createOk({
        type: 'logout',
      }),
    );
  } catch (err) {
    console.error(err);

    throw new Error('Something went wrong, try again later');
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const getRecoveryIdentifier = async ({ state, commit }) => {
  commit('changeLoadingStatus', true);

  try {
    const identifier = await IdentityService.getRecoveryIdentifier(
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
    const seed = Bip39.mnemonicToSeed(seedPhrase);
    const hdKey = HDKey.fromMasterSeed(seed);
    const hdWallet = hdKey.derivePath(ENV.hdKeyMnemonic.path);
    const wallet = hdWallet.deriveChild(0).getWallet();
    const privateKey = Web3.utils.bytesToHex(wallet.getPrivateKey());
    const web3 = new Web3(Network.NETWORK_URL_HTTP[Network.NET_ID.MAIN][0]);
    const { signature } = await web3.eth.accounts.sign(
      state.recoveryIdentifier,
      privateKey,
    );
    const { success } = await IdentityService.recover(
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
  ModeService.validateIdentityServer(serverUrl);

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
  const res = await IdentityService.getAuthPermission();
  const wallet = new Wallet(res.keystore);
  const singRes = await wallet.sign(ORIGIN_HOST, password);
  await IdentityService.setAuthPermission(singRes.signature);
  permissionChannel.put(Answer.createOk());
};

const cancelSignPermission = () => {
  permissionChannel.put(Answer.createFail());
};

const awaitAuthConfirm = async ({ dispatch }) => {
  const waiter = new Promise(resolve => {
    let timerId;

    const checker = async () => {
      const status = await IdentityService.getAuthStatus();
      if (status === 200 || status === 403) {
        resolve();
      } else {
        timerId = setTimeout(checker, 1500);
      }
    };

    checker();
  });
  await waiter;
  await dispatch('defineOnlyV3Accounts');
  authChannel.put(Answer.createOk());
};

const getAuthStatus = async ({ commit }) => {
  const status = await IdentityService.getAuthStatus();
  const isAuthority = status === 200;
  commit('setAuthStatus', isAuthority);
  return status;
};

export default {
  auth,
  authWithGoogle,
  authWithGitHub,
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
  awaitAccountCreate,
  awaitAuthConfirm,
  awaitLogoutConfirm,
  setSettings,
  updateSettings,
  logout,
  closeAccount,
  getRecoveryIdentifier,
  recover,
  validateCustomServer,

  getAuthStatus,
  signPermission,
  cancelSignPermission,
  setupDemoData,
};
