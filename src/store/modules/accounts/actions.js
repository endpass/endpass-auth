import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isV3 from '@endpass/utils/isV3';

import signerService from '@/service/signer';
import identityService from '@/service/identity';
import settingsService from '@/service/settings';
import modeService from '@/service/mode';

import {
  accountChannel,
  authChannel,
  permissionChannel,
} from '@/class/singleton/channels';
import { Answer } from '@/class';
import { ORIGIN_HOST } from '@/constants';

const auth = async ({ state, dispatch }, { email, serverMode }) => {
  const { type, serverUrl } = serverMode;
  let redirectUrl = `${get(state, 'authParams.redirectUrl')}?mode=${type}`;

  if (serverUrl) {
    redirectUrl = `${redirectUrl}&serverUrl=${serverUrl}`;
  }

  const request = identityService.auth(email, redirectUrl);

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

const handleAuthRequest = async ({ commit }, { email, request, link }) => {
  commit('changeLoadingStatus', true);

  try {
    const res = await request;

    if (!res.success) throw new Error('Auth failed!');

    settingsService.clearLocalSettings();

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
    await identityService.otpAuth(email, code);
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
    const res = await identityService.getAccounts();
    const accounts = await Promise.all(
      res.map(address => identityService.getAccountInfo(address)),
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
    const res = await identityService.getAccounts();

    const accounts = await Promise.all(
      res
        .filter(address => !/^xpub/.test(address))
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

const awaitAccountCreate = async ({ commit }) => {
  const res = await identityService.awaitAccountCreate();

  commit('setAccounts', res);
};

const openCreateAccountPage = async () => {
  window.open(ENV.wallet.openUrl);
};

const awaitLogoutConfirm = async ({ commit }) => {
  commit('changeLoadingStatus', true);

  try {
    await identityService.awaitLogoutConfirm();
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
    await identityService.logout();
    settingsService.clearLocalSettings();
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

const awaitAuthConfirm = async ({ dispatch }) => {
  const waiter = new Promise(resolve => {
    const checker = async () => {
      const status = await identityService.getAuthStatus();
      if (status === 200 || status === 403) {
        resolve();
      } else {
        setTimeout(checker, 1500);
      }
    };

    checker();
  });
  await waiter;
  await dispatch('defineOnlyV3Accounts');
  authChannel.put(Answer.createOk());
};

const getAuthStatus = async ({ commit }) => {
  const status = await identityService.getAuthStatus();
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
