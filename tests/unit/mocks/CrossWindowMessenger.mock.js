jest.mock('@/class/singleton/bridgeMessenger', () => ({
  sendAndWaitResponse: jest.fn(),
  send: jest.fn(),
  subscribe: jest.fn(),
}));
