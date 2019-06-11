jest.mock('@endpass/utils/walletGen', () => ({
  createComplex: jest.fn(),
}));
