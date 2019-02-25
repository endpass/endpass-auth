import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Bip39 from 'bip39';
import HDKey from 'ethereumjs-wallet/hdkey';
import Web3 from 'web3';
import { keystore } from '@endpass/utils';

import IdentityService from '@/service/identity';
import SettingsService from '@/service/settings';
import ModeService from '@/service/mode';
import { NETWORK_URL } from '@/constants';

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

    const type = get(res, 'challenge.challengeType');

    if (type === 'otp') {
      commit('setOtpEmail', email);
      commit('changeLoadingStatus', false);
    } else if (link) {
      commit('setSentStatus', true);
    }
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
    commit('changeLoadingStatus', false);
    throw err;
  }
};

const confirmAuth = ({ dispatch }, serverMode) => {
  dispatch('resolveMessage', {
    status: true,
    payload: serverMode,
  });
};

const cancelAuth = ({ dispatch }) => {
  dispatch('resolveMessage', {
    status: false,
    message: 'Auth was canceled by user!',
  });
};

const getSettings = async ({ dispatch, commit }) => {
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

  const mergedSettings = SettingsService.mergeSettings(settings);

  SettingsService.setLocalSettings(mergedSettings);

  commit('setSettings', {
    ...settings,
    ...mergedSettings,
  });

  return {
    ...settings,
    ...mergedSettings,
  };
};

const setSettings = async (ctx, payload) => {
  SettingsService.setLocalSettings(payload);
};

const updateSettings = async ({ commit, dispatch }, payload) => {
  commit('changeLoadingStatus', true);

  try {
    await dispatch('setSettings', payload);

    const res = await dispatch('getSettings');

    dispatch('resolveMessage', {
      status: true,
      type: 'update',
      payload: {
        activeAccount: res.lastActiveAccount,
        activeNet: res.net,
      },
    });
  } catch (err) {
    throw new Error('Something went wrong, try again later');
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const getAccounts = async ({ commit }) => {
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

const getOnlyV3Accounts = async ({ commit, dispatch }) => {
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
    await dispatch('getOnlyV3Accounts');
  }

  const { accounts } = state;

  return !accounts
    ? null
    : accounts.find(account => account.type !== 'PublicAccount') || null;
};

const awaitAuthConfirm = async ({ dispatch }) => {
  await IdentityService.awaitAuthConfirm();
  await dispatch('getOnlyV3Accounts');
};

const awaitAccountCreate = async ({ commit }) => {
  const res = await IdentityService.awaitAccountCreate();

  commit('setAccounts', res);
};

const openCreateAccountPage = async () => {
  window.open('https://wallet-dev.endpass.com/#/');
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

const closeAccount = async ({ dispatch }) => {
  dispatch('resolveMessage', {
    status: true,
    type: 'close',
  });
  dispatch('closeDialog');
};

const logout = async ({ dispatch, commit }) => {
  commit('changeLoadingStatus', true);

  try {
    await IdentityService.logout();

    dispatch('resolveMessage', {
      status: true,
      type: 'logout',
    });
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
    const web3 = new Web3(NETWORK_URL.ETH[0]);
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

export default {
  auth,
  authWithGoogle,
  authWithGitHub,
  cancelAuth,
  confirmAuth,
  confirmAuthViaOtp,
  handleAuthRequest,
  getSettings,
  getAccount,
  getAccounts,
  getFirstPrivateAccount,
  getOnlyV3Accounts,
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
};
