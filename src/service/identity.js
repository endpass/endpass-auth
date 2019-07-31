import request from '@/class/singleton/request';
import get from 'lodash/get';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const createTimeout = handler => setTimeout(handler, 1500);

const getSettings = () => request.get(`${identityBaseUrl}/settings`);

const getSettingsSkipPermission = () =>
  request.getSkipPermission(`${identityBaseUrl}/settings`);

const setSettings = settings =>
  request.post(`${identityBaseUrl}/settings`, settings);

const getOtpSettings = () => request.get(`${identityBaseUrl}/settings/otp`);

const getAccountsSkipPermission = () =>
  request.getSkipPermission(`${identityBaseUrl}/accounts`);

const getAccounts = () => request.get(`${identityBaseUrl}/accounts`);

const getAccount = address =>
  request.get(`${identityBaseUrl}/account/${address}`);

const getAccountInfo = async address => {
  const ret = await request.get(`${identityBaseUrl}/account/${address}/info`);

  // TODO: check wallet address in info object
  if (!ret.address) {
    ret.address = address;
  }
  return ret;
};

const getAccountWithInfo = async address => {
  const [v3keystore, info] = await Promise.all([
    getAccount(address),
    getAccountInfo(address),
  ]);

  return { ...v3keystore, info };
};

const checkAccountExist = async () => {
  let res = false;
  try {
    const list = await getAccountsSkipPermission();
    res = list.length !== 0;
  } catch (e) {}
  return res;
};

const auth = (email, redirectUrl) => {
  const requestUrl = redirectUrl
    ? `${identityBaseUrl}/auth?redirect_uri=${encodeURIComponent(redirectUrl)}`
    : `${identityBaseUrl}/auth`;

  return request
    .post(requestUrl, {
      email,
    })
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res;
    });
};

const getAuthPermission = () =>
  request.get(`${identityBaseUrl}/auth/permission`);

const setAuthPermission = signature =>
  request.post(`${identityBaseUrl}/auth/permission`, {
    signature,
  });

const otpAuth = (email, code) =>
  request
    .post(`${identityBaseUrl}/auth/token`, {
      challengeType: 'otp',
      email,
      code,
    })
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res;
    });

const authWithGoogle = idToken =>
  request
    .get(`${identityBaseUrl}/auth/google?token=${encodeURIComponent(idToken)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    })
    .catch(err => {
      throw err.response.data;
    });

const authWithGitHub = code =>
  request
    .get(`${identityBaseUrl}/auth/github?code=${encodeURIComponent(code)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    })
    .catch(err => {
      throw err.response.data;
    });

const logout = () => request.post(`${identityBaseUrl}/logout`);

const getAuthStatus = async () => {
  let res = 200;
  try {
    await request.get(`${identityBaseUrl}/auth/check`);
  } catch (e) {
    res = get(e, ['response', 'status']);
  }
  return res;
};

// saveAccount,
//   saveAccountInfo,
//   backupSeed,

const saveAccount = account =>
  request.postSkipPermission(
    `${identityBaseUrl}/account/${account.address}`,
    account,
  );

const saveAccountInfo = (address, info) =>
  request.postSkipPermission(
    `${identityBaseUrl}/account/${address}/info`,
    info,
  );

const backupSeed = encryptedSeed =>
  request.postSkipPermission(`${identityBaseUrl}/user/seed`, {
    seed: encryptedSeed,
  });

const updateAccountSettings = address =>
  request.postSkipPermission(`${identityBaseUrl}/settings`, {
    lastActiveAccount: address,
  });

const waitLogin = () =>
  new Promise((resolve, reject) => {
    /* eslint-disable-next-line */
    const handler = async function() {
      try {
        const status = await getAuthStatus();

        if (status === 200 || status === 403) {
          return resolve(status);
        }

        createTimeout(handler);
      } catch (err) {
        return reject(err);
      }
    };

    return handler();
  });

const getRecoveryIdentifier = email =>
  request
    .get(`${identityBaseUrl}/auth/recover?email=${encodeURIComponent(email)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res.message;
    });

const recover = (email, signature, redirectUrl) =>
  request
    .post(`${identityBaseUrl}/auth/recover`, {
      email,
      signature,
      redirectUrl,
    })
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res;
    });

export default {
  getAccount,
  getAccounts,
  getAuthStatus,
  getAccountInfo,
  getAccountWithInfo,
  checkAccountExist,
  saveAccount,
  saveAccountInfo,
  backupSeed,
  updateAccountSettings,

  getAuthPermission,
  setAuthPermission,
  auth,
  authWithGoogle,
  authWithGitHub,
  otpAuth,
  logout,
  waitLogin,

  getSettings,
  getOtpSettings,
  setSettings,
  getSettingsSkipPermission,

  getRecoveryIdentifier,
  recover,
};
