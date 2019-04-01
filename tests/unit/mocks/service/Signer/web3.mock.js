jest.mock('@/service/signer/web3', () => ({
  eth: {
    sendSignedTransaction: jest.fn(),
  },
  providers: {
    HttpProvider: jest.fn(),
  },
  setProvider: jest.fn(),
}));
