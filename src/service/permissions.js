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

export const getLoginDetails = async () => {
  // TODO: await server api and move to new method

  const [permissionRes, settings] = await Promise.all([
    request.get(`${identityBaseUrl}/auth/permission`),
    request.getSkipPermission(`${identityBaseUrl}/settings`),
  ]);

  return {
    v3Keystore: permissionRes.keystore,
    email: settings.email,
  };
};

export const getConsentDetails = async consentChallenge =>
  request.get(`${identityBaseUrl}/oauth/consent/${consentChallenge}`);

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

export const getLoginSkipStatus = async challengeId =>
  request.get(`${identityBaseUrl}/oauth/login?challenge=${challengeId}`);

export default {
  login,
  grantPermissions,
  getConsentDetails,
  getLoginDetails,
  getLoginSkipStatus,
};
