import identityService from '@/service/auth';

jest.mock('@/service/auth', () => {
  const {
    successResponse,
    getRecoveryIdentifierResponse,
    // eslint-disable-next-line global-require
  } = require('@unitFixtures/services/identity');

  const { AUTH_STATUS_CODE } = require('@/constants');

  return {
    getAuthChallenge: jest.fn().mockResolvedValue(successResponse),
    setAuthPermission: jest.fn(),
    authWithCode: jest.fn(),
    authWithGoogle: jest.fn(),
    logout: jest.fn(),
    getAuthStatus: jest
      .fn()
      .mockResolvedValue({ status: AUTH_STATUS_CODE.LOGGED_IN }),
    waitLogin: jest.fn(),
    getRecoveryIdentifier: jest
      .fn()
      .mockResolvedValue(getRecoveryIdentifierResponse.message),
    sendEmailCode: jest.fn(),
    sendOtpRecoverSms: jest.fn().mockResolvedValue(successResponse),
    disableOtpViaSms: jest.fn().mockResolvedValue(successResponse),
    disableOtp: jest.fn().mockResolvedValue(successResponse),
    getSeedTemplateUrl: jest.fn(),
  };
});

export default identityService;
