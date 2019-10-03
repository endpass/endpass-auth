import request from '@/class/singleton/request';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

export const login = async ({ password, challengeId }) =>
  request.post(`${identityBaseUrl}/oauth/login`, {
    challenge: challengeId,
    password,
  });

export const getLoginDetails = async challengeId =>
  request.get(`${identityBaseUrl}/oauth/login?challenge=${challengeId}`);

export const getConsentDetails = async consentChallenge =>
  request.get(`${identityBaseUrl}/oauth/consent/${consentChallenge}`);

export const grantPermissions = async ({ consentChallenge, scopesList }) =>
  request.post(`${identityBaseUrl}/oauth/consent`, {
    challenge: consentChallenge,
    grantScopes: scopesList,
  });

export const exchangeCodeToToken = async fields => {
  const formData = Object.keys(fields).reduce((form, key) => {
    form.append(key, fields[key]);
    return form;
  }, new FormData());

  const url = `${identityBaseUrl}/oauth/token`;

  const data = await request.post(url, formData);
  return data;
};

export default {
  login,
  grantPermissions,
  getConsentDetails,
  getLoginDetails,
  exchangeCodeToToken,
};
