import identityService from '@/service/auth';

jest.mock('@/service/auth', () => {
  const {
    successResponse,
    getRecoveryIdentifierResponse,
    // eslint-disable-next-line global-require
  } = require('@unitFixtures/services/identity');

  return {
    getAuthChallenge: jest.fn(),
    setAuthPermission: jest.fn(),
    authWithGoogle: jest.fn(),
    authWithGitHub: jest.fn(),
    logout: jest.fn(),
    getAuthStatus: jest.fn(),
    waitLogin: jest.fn(),
    getRecoveryIdentifier: jest
      .fn()
      .mockResolvedValue(getRecoveryIdentifierResponse.message),
    sendOtpRecoverSms: jest.fn().mockResolvedValue(successResponse),
    disableOtpViaSms: jest.fn().mockResolvedValue(successResponse),
    disableOtp: jest.fn().mockResolvedValue(successResponse),
    getSeedTemplateUrl: jest.fn(),
  };
});

export default identityService;
