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

export const grantPermissions = async ({ consentChallenge, scopes }) =>
  request
    .post(`${identityBaseUrl}/oauth/consent`, {
      challenge: consentChallenge,
      grantScopes: scopes,
    })
    .then(res => {
      console.log('consent res: ', res);
      return res;
    });

export default {
  login,
  grantPermissions,
};
