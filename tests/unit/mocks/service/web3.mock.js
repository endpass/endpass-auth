import web3Service from '@/service/web3';

jest.mock('@/service/web3', () => {
  const originalWeb3 = require.requireActual('web3');
  const { utils } = originalWeb3;

  return {
    web3: {
      utils,
      eth: {
        sendSignedTransaction: jest.fn(),
        getCode: jest.fn().mockResolvedValue('0x'),
      },
    },
    setWeb3Network: jest.fn(),
  };
});

export default web3Service;
