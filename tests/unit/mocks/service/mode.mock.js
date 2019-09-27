jest.mock('@/service/mode', () => ({
  validateIdentityServer: jest.fn(),
}));
