import identityService from '@/service/identity';

jest.mock('@/service/identity', () => {
  return {
    saveAccount: jest.fn(),
    saveAccountInfo: jest.fn(),
    backupSeed: jest.fn(),
    updateAccountSettings: jest.fn(),
    getOtpSettings: jest.fn(),
    defineAuthStatus: jest.fn(),
    checkRegularPassword: jest.fn(),
    auth: jest.fn(),
    otpAuth: jest.fn(),
    checkAccountExist: jest.fn(),
    getSettingsSkipPermission: jest.fn(),
    resetRegularPassword: jest.fn(),
    confirmResetRegularPassword: jest.fn(),
  };
});

export default identityService;
