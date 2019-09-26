jest.mock('@/service/permissions', () => ({
  getLoginDetails: jest.fn(),
  login: jest.fn(),
}));
