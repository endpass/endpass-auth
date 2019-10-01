import get from 'lodash/get';
import request from '@/class/singleton/request';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const createTimeout = handler => setTimeout(handler, 1500);

const getOtpSettings = () => request.get(`${identityBaseUrl}/settings/otp`);

const getAccountsSkipPermission = () =>
  requestSkipPermission.get(`${identityBaseUrl}/accounts`);

const checkAccountExist = async () => {
  let res = false;
  try {
    const list = await getAccountsSkipPermission();
    res = list.length !== 0;
  } catch (e) {}
  return res;
};

const getAuthChallenge = email => {
  return request
    .post(`${identityBaseUrl}/auth`, {
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

const signUp = ({ email, password }) =>
  request
    .post(`${identityBaseUrl}/auth/signup`, {
      email,
      password,
    })
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res;
    });

const auth = ({ email, code, password, challengeType = 'otp' }) =>
  request
    .post(`${identityBaseUrl}/auth/token`, {
      challengeType,
      email,
      code,
      password,
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
  requestSkipPermission.post(
    `${identityBaseUrl}/account/${account.address}`,
    account,
  );

const saveAccountInfo = (address, info) =>
  requestSkipPermission.post(
    `${identityBaseUrl}/account/${address}/info`,
    info,
  );

const backupSeed = encryptedSeed =>
  requestSkipPermission.post(`${identityBaseUrl}/user/seed`, {
    seed: encryptedSeed,
  });

const updateAccountSettings = address =>
  requestSkipPermission.post(`${identityBaseUrl}/settings`, {
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

const sendEmailCode = async email => {
  const { timeout } = await request.post(`${identityBaseUrl}/auth/code`, {
    email,
  });

  return timeout;
};

const resetRegularPassword = async ({
  password: newPassword,
  code: passwordResetToken,
}) => {
  const { success } = await request.post(
    `${identityBaseUrl}/regular-password/reset/confirm`,
    {
      passwordResetToken,
      newPassword,
    },
  );

  if (success) throw new Error('Success false');

  return success;
};

const checkRegularPassword = async email => {
  try {
    await request.post(`${identityBaseUrl}/regular-password/check`, { email });
    return true;
  } catch (error) {
    const isPasswordNotExist = get(error, ['response', 'status']) === 417;

    if (isPasswordNotExist) return false;

    throw error;
  }
};

const disableOtp = (email, signature, redirectUrl) =>
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

const getSeedTemplateUrl = () => `${identityBaseUrl}/auth/recover/template`;

export default {
  getAuthStatus,
  checkAccountExist,
  saveAccount,
  saveAccountInfo,
  backupSeed,
  updateAccountSettings,
  getAuthPermission,
  setAuthPermission,
  getAuthChallenge,
  signUp,
  auth,
  authWithGoogle,
  authWithGitHub,
  sendEmailCode,
  resetRegularPassword,
  checkRegularPassword,
  logout,
  waitLogin,
  getOtpSettings,
  getRecoveryIdentifier,
  disableOtp,
  getSeedTemplateUrl,
};
