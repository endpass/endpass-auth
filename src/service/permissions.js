import request from '@/util/request';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

export const login = async ({ signature, challengeId }) =>
  request
    .post(`${identityBaseUrl}/oauth/login`, {
      challenge: challengeId,
      signature,
    })
    .then(res => {
      console.log('login res: ', res);
      return res;
    });

export const getConsentDetails = async consentChallenge => {
  return request.get(`${identityBaseUrl}/oauth/consent/${consentChallenge}`);
};

export const grantPermissions = async ({ consentChallenge, scopesList }) =>
  request
    .post(`${identityBaseUrl}/oauth/consent`, {
      challenge: consentChallenge,
      grantScopes: scopesList,
    })
    .then(res => {
      console.log('consent res: ', res);
      return res;
    });

export default {
  login,
  grantPermissions,
  getConsentDetails,
};
