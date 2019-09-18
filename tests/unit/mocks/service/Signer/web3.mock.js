jest.mock('@/class/singleton/signer/web3', () => {
  const originalWeb3Utils = require.requireActual('web3-utils');
  return {
    web3: {
      utils: originalWeb3Utils,
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
  };
});
