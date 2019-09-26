jest.mock('@/service/permissions', () => ({
  getLoginDetails: jest.fn(),
  login: jest.fn(),
  getConsentDetails: jest.fn(),
  grantPermissions: jest.fn(),
}));
