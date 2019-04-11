import request from '@/util/request';

const { url: identityBaseUrl } = ENV.identity;

export const login = async ({ signature, challengeId }) =>
  request
    .post(`${identityBaseUrl}/api/v1.1/oauth/login`, {
      challenge: challengeId,
      signature,
    })
    .then(res => {
      console.log('login res: ', res);
    });

export const grantPermissions = async ({ consentChallenge, scopes }) =>
  request
    .post(`${identityBaseUrl}/api/v1.1/oauth/consent`, {
      challenge: consentChallenge,
      grantScopes: scopes,
    })
    .then(res => {
      console.log('consent res: ', res);
    });

export default {
  login,
  grantPermissions,
};
