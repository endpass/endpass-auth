jest.mock('@/class/singleton/bridgeMessenger', () => ({
  sendAndWaitResponse: jest.fn().mockReturnValue({}),
  send: jest.fn(),
  subscribe: jest.fn(),
}));
