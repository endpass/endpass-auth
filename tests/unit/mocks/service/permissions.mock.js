jest.mock('@/service/permissions', () => ({
  getLoginDetails: jest.fn(),
}));
