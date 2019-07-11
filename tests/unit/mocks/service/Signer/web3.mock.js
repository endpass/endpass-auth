jest.mock('@/service/web3', () => ({
  web3: {
    eth: {
      sendSignedTransaction: jest.fn(),
    },
    providers: {
      HttpProvider: jest.fn(),
    },
    setProvider: jest.fn(),
  },

  setWeb3Network: jest.fn(),
}));
