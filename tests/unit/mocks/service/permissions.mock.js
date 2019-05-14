jest.mock('@/service/permissions', () => ({
  getLoginSkipStatus: jest.fn(),
}));
