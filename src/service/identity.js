import request from '@/util/request';
import get from 'lodash/get';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const createTimeout = handler => setTimeout(handler, 1500);

export const getSettings = () => request.get(`${identityBaseUrl}/settings`);

export const setSettings = settings =>
  request.post(`${identityBaseUrl}/settings`, settings);

export const getOtpSettings = () =>
  request.get(`${identityBaseUrl}/settings/otp`);

export const getAccountsSkipPermission = () =>
  request.getSkipPermission(`${identityBaseUrl}/accounts`);

export const getAccounts = () => request.get(`${identityBaseUrl}/accounts`);

export const getAccount = address =>
  request.get(`${identityBaseUrl}/account/${address}`);

export const getAccountInfo = address =>
  request.get(`${identityBaseUrl}/account/${address}/info`);

export const getAccountWithInfo = async address => {
  const [v3keystore, info] = await Promise.all([
    getAccount(address),
    getAccountInfo(address),
  ]);

  return { ...v3keystore, info };
};

export const checkAccountExist = async () => {
  let res = false;
  try {
    const list = await getAccountsSkipPermission();
    res = list.length !== 0;
  } catch (e) {}
  return res;
};

export const auth = (email, redirectUrl) => {
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

export const getAuthPermission = () =>
  request.get(`${identityBaseUrl}/auth/permission`);

export const setAuthPermission = signature =>
  request.post(`${identityBaseUrl}/auth/permission`, {
    signature,
  });

export const otpAuth = (email, code) =>
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

export const authWithGoogle = idToken =>
  request
    .get(`${identityBaseUrl}/auth/google?token=${encodeURIComponent(idToken)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    })
    .catch(err => {
      throw err.response.data;
    });

export const authWithGitHub = code =>
  request
    .get(`${identityBaseUrl}/auth/github?code=${encodeURIComponent(code)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    })
    .catch(err => {
      throw err.response.data;
    });

export const logout = () => request.post(`${identityBaseUrl}/logout`);

export const getAuthStatus = async () => {
  let res = 200;
  try {
    await request.get(`${identityBaseUrl}/auth/check`);
  } catch (e) {
    res = get(e, ['response', 'status']);
  }
  return res;
};

export const waitAccountCreate = () =>
  new Promise((resolve, reject) => {
    /* eslint-disable-next-line */
    const handler = async function() {
      try {
        const res = await getAccountsSkipPermission();

        if (res.filter(address => !/^xpub/.test(address)).length > 0) {
          return resolve(res);
        }

        createTimeout(handler);
      } catch (err) {
        return reject(err);
      }
    };

    createTimeout(handler);
  });

export const waitLogin = () =>
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

    createTimeout(handler);
  });

export const getRecoveryIdentifier = email =>
  request
    .get(`${identityBaseUrl}/auth/recover?email=${encodeURIComponent(email)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res.message;
    });

export const recover = (email, signature, redirectUrl) =>
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
  getSettings,
  getOtpSettings,
  getAccount,
  getAccounts,
  getAuthStatus,
  getAccountInfo,
  getAccountWithInfo,
  getAuthPermission,
  setAuthPermission,
  setSettings,
  checkAccountExist,
  auth,
  authWithGoogle,
  authWithGitHub,
  otpAuth,
  logout,
  waitAccountCreate,
  waitLogin,
  getRecoveryIdentifier,
  recover,
};
