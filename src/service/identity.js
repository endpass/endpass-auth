import axios from 'axios';
import { ORIGIN_HOST } from '@/constants';
import get from 'lodash/get';

const { url: identityBaseUrl } = ENV.identity;

axios.defaults.headers.common['x-connect-lib-host'] = ORIGIN_HOST;

const createTimeout = handler => setTimeout(handler, 1500);

const request = {
  get: url =>
    axios
      .get(url, {
        withCredentials: true,
      })
      .then(({ data }) => data),

  post: (url, body) =>
    axios
      .post(url, body, {
        withCredentials: true,
      })
      .then(({ data }) => data),
};

export const getSettings = () =>
  request.get(`${identityBaseUrl}/api/v1.1/settings`);

export const setSettings = settings =>
  request.post(`${identityBaseUrl}/api/v1.1/settings`, settings);

export const getOtpSettings = () =>
  request.get(`${identityBaseUrl}/api/v1.1/settings/otp`);

export const getAccounts = () =>
  request.get(`${identityBaseUrl}/api/v1.1/accounts`);

export const getAccount = address =>
  request.get(`${identityBaseUrl}/api/v1.1/account/${address}`);

export const getAccountInfo = address =>
  request.get(`${identityBaseUrl}/api/v1.1/account/${address}/info`);

export const getAccountWithInfo = async address => {
  const [v3keystore, info] = await Promise.all([
    getAccount(address),
    getAccountInfo(address),
  ]);

  return { ...v3keystore, info };
};

export const auth = (email, redirectUrl) => {
  const requestUrl = redirectUrl
    ? `${identityBaseUrl}/api/v1.1/auth?redirect_uri=${encodeURIComponent(
        redirectUrl,
      )}`
    : `${identityBaseUrl}/api/v1.1/auth`;

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
  request.get(`${identityBaseUrl}/api/v1.1/auth/permission`);

export const setAuthPermission = signature => {
  return request.post(`${identityBaseUrl}/api/v1.1/auth/permission`, {
    signature,
  });
};

export const otpAuth = (email, code) =>
  request
    .post(`${identityBaseUrl}/api/v1.1/auth/token`, {
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
    .get(
      `${identityBaseUrl}/api/v1.1/auth/google?token=${encodeURIComponent(
        idToken,
      )}`,
    )
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    })
    .catch(err => {
      throw err.response.data;
    });

export const authWithGitHub = code =>
  request
    .get(
      `${identityBaseUrl}/api/v1.1/auth/github?code=${encodeURIComponent(
        code,
      )}`,
    )
    .then(res => {
      if (!res.success) throw new Error(res.message);
      return res;
    })
    .catch(err => {
      throw err.response.data;
    });

export const logout = () => request.post(`${identityBaseUrl}/api/v1.1/logout`);

export const getAuthStatus = async () => {
  let res = 200;
  try {
    await getAccounts();
  } catch (e) {
    res = get(e, ['response', 'status']);
  }
  return res;
};

export const awaitLogoutConfirm = () =>
  new Promise(resolve => {
    /* eslint-disable-next-line */
    const handler = async function() {
      try {
        await getAccounts();

        createTimeout(handler);
      } catch (err) {
        return resolve();
      }
    };

    createTimeout(handler);
  });

export const awaitAccountCreate = () =>
  new Promise((resolve, reject) => {
    /* eslint-disable-next-line */
    const handler = async function() {
      try {
        const res = await getAccounts();

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

export const awaitAuthConfirm = () =>
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
    .get(
      `${identityBaseUrl}/api/v1.1/auth/recover?email=${encodeURIComponent(
        email,
      )}`,
    )
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res.message;
    });

export const recover = (email, signature, redirectUrl) =>
  request
    .post(`${identityBaseUrl}/api/v1.1/auth/recover`, {
      email,
      signature,
      redirectUrl,
    })
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res;
    });

// TODO: impletent that
export const hydraLogin = async ({ signature, challengeId }) => {
  console.log(signature, challengeId);
};

// TODO: impletent that
export const hydraGrantPermissions = async ({ consentChallenge, scopes }) => {
  console.log(consentChallenge, scopes);
};

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
  auth,
  authWithGoogle,
  authWithGitHub,
  otpAuth,
  logout,
  awaitLogoutConfirm,
  awaitAccountCreate,
  awaitAuthConfirm,
  getRecoveryIdentifier,
  recover,
  hydraLogin,
  hydraGrantPermissions,
};
