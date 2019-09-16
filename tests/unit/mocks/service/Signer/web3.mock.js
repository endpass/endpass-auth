jest.mock('@/service/web3', () => ({
  web3: {
    eth: {
      sendSignedTransaction: jest.fn(),
      getCode: jest.fn().mockResolvedValue('0x'),
    },
    providers: {
      HttpProvider: jest.fn(),
    },
    setProvider: jest.fn(),
  },

  setWeb3Network: jest.fn(),
}));
