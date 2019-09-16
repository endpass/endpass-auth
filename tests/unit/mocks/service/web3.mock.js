import web3Service from '@/service/web3';

jest.mock('@/service/web3', () => {
  const originalWeb3Utils = require.requireActual('web3-utils');

  return {
    web3: {
      utils: originalWeb3Utils,
      eth: {
        sendSignedTransaction: jest.fn(),
        getCode: jest.fn().mockResolvedValue('0x'),
      },
    },
    setWeb3Network: jest.fn(),
  };
});

export default web3Service;
