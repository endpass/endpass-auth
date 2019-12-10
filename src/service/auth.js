// @ts-check
import get from 'lodash/get';
import request from '@/class/singleton/request';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

const TIMEOUT_DEFAULT = 1500;

/**
 * @param {Function} handler
 * @return {number}
 */
const createTimeout = handler => setTimeout(handler, TIMEOUT_DEFAULT);

/**
 * @param {string} email
 * @return {Promise<any>}
 */
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

/**
 * @param {string} password
 * @param {string} originHost
 * @return {Promise<any>}
 */
const setAuthPermission = async (password, originHost) => {
  const res = await request.post(`${identityBaseUrl}/auth/permission`, {
    password,
    originHost,
  });
  return res;
};

/**
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.code
 * @param {string} params.password
 * @param {boolean} params.isSignUp
 * @param {string} params.challengeType
 * @return {Promise<any>}
 */
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

/**
 * @param {string} idToken
 * @return {Promise<any>}
 */
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

/**
 * @param {string} code
 * @return {Promise<any>}
 */
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

/**
 * @return {Promise<{expiresAt: number, status: number}>}
 */
const getAuthStatus = async () => {
  try {
    const { expiresAt } = await request.get(`${identityBaseUrl}/auth/check`);
    return {
      status: 200,
      expiresAt,
    };
  } catch (e) {
    const status = get(e, ['response', 'status']);
    return {
      status,
      expiresAt: 0,
    };
  }
};

/**
 * @return {Promise<number>}
 */
const waitLogin = () =>
  new Promise((resolve, reject) => {
    /* eslint-disable-next-line */
    const handler = async function() {
      try {
        const { status } = await getAuthStatus();

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

/**
 * @param {string} email
 * @return {Promise<string>}
 */
const getRecoveryIdentifier = email =>
  request
    .get(`${identityBaseUrl}/auth/recover?email=${encodeURIComponent(email)}`)
    .then(res => {
      if (!res.success) throw new Error(res.message);

      return res.message;
    });

/**
 * @param {string} email
 * @return {Promise<number>}
 */
const sendEmailCode = async email => {
  const { timeout } = await request.post(`${identityBaseUrl}/auth/code`, {
    email,
  });

  return timeout;
};

/**
 * Send sms with code for disabling otp
 * @param {string} email
 * @returns {Promise<any>}
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
 * @returns {Promise<any>}
 */
const disableOtpViaSms = async ({ email, code }) => {
  const res = await request.post(`${identityBaseUrl}/auth/recover`, {
    email,
    code,
  });

  if (!res.success) throw new Error(res.message);

  return res;
};

/**
 * @return {string}
 */
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
  sendOtpRecoverSms,
  disableOtpViaSms,
  getSeedTemplateUrl,
};
