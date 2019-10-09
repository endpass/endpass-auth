import identityService from '@/service/identity';

jest.mock('@/service/identity', () => {
  const {
    successResponse,
    getRecoveryIdentifierResponse,
  } = require('@unitFixtures/services/identity');

  return {
    saveAccount: jest.fn(),
    saveAccountInfo: jest.fn(),
    backupSeed: jest.fn(),
    updateAccountSettings: jest.fn(),
    getOtpSettings: jest.fn(),
    defineAuthStatus: jest.fn(),
    getAuthStatus: jest.fn(),
    getAuthChallenge: jest.fn(),
    checkRegularPassword: jest.fn(),
    auth: jest.fn(),
    authWithGoogle: jest.fn(),
    authWithGitHub: jest.fn(),
    getSeedTemplateUrl: jest.fn(),
    otpAuth: jest.fn(),
    logout: jest.fn(),
    checkAccountExist: jest.fn(),
    getRecoveryIdentifier: jest
      .fn()
      .mockResolvedValue(getRecoveryIdentifierResponse.message),
    disableOtp: jest.fn().mockResolvedValue(successResponse),
    setAuthPermission: jest.fn(),
    waitLogin: jest.fn(),

    getSettingsSkipPermission: jest.fn(),
  };
});

export default identityService;
