import request from '@/class/singleton/request';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

export const login = async ({ signature, challengeId }) =>
  request.post(`${identityBaseUrl}/oauth/login`, {
    challenge: challengeId,
    signature,
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

export default {
  login,
  grantPermissions,
  getConsentDetails,
  getLoginDetails,
};
