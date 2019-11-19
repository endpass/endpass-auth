import get from 'lodash/get';
import request from '@/class/singleton/request';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const createTimeout = handler => setTimeout(handler, 1500);

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

const setAuthPermission = async (password, originHost) => {
  const res = await request.post(`${identityBaseUrl}/auth/permission`, {
    password,
    originHost,
  });
  return res;
};

const authWithCode = async ({
  email,
  code,
  password,
  isSignUp,
  challengeType = 'otp',
}) => {
  const url = isSignUp
    ? `${identityBaseUrl}/auth/signup`
    : `${identityBaseUrl}/auth/token`;

  const res = await request.post(url, {
    challengeType,
    email,
    code,
    password,
  });

  if (!res.success) throw new Error(res.message);

  return res;
};

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

/**
 * Send sms with code for disabling otp
 * @param {string} email
 * @returns {Promise<void>}
 */
const sendOtpRecoverSms = async email => {
  try {
    const res = await request.get(
      `${identityBaseUrl}/auth/recover?email=${encodeURIComponent(email)}`,
    );

    if (!res.success) throw new Error(res.message);

    return res;
  } catch (error) {
    const { response = {} } = error;
    const { status } = response;
    error.code = status;

    throw error;
  }
};

/**
 * Disable otp setting
 * @param {object} param
 * @param {string} param.email
 * @param {string} param.code
 * @returns {Promise<void>}
 */
const disableOtpViaSms = async ({ email, code }) => {
  const res = await request.post(`${identityBaseUrl}/auth/recover`, {
    email,
    code,
  });

  if (!res.success) throw new Error(res.message);

  return res;
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
  setAuthPermission,
  getAuthChallenge,
  authWithCode,
  authWithGoogle,
  authWithGitHub,
  sendEmailCode,
  logout,
  waitLogin,
  getRecoveryIdentifier,
  disableOtp,
  sendOtpRecoverSms,
  disableOtpViaSms,
  getSeedTemplateUrl,
};
