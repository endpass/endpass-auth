// jest.mock('@/class/singleton/signer/web3', () => {
//   const originalWeb3Utils = require.requireActual('web3-utils');
//   return {
//     web3: {
//       utils: originalWeb3Utils,
//       eth: {
//         sendSignedTransaction: jest.fn(),
//         getCode: jest.fn().mockResolvedValue('0x'),
//       },
//       providers: {
//         HttpProvider: jest.fn(),
//       },
//       setProvider: jest.fn(),
//     },
//
//     setWeb3Network: jest.fn(),
//   };
// });

jest.mock('@endpass/web3/public-api', () => {
  class PublicApi {}
  const p = PublicApi.prototype;
  p.setNetwork = jest.fn();
  p.getBalance = jest.fn();
  p.getCode = jest.fn().mockResolvedValue('0x');

  const asyncIteratorMock = {};
  asyncIteratorMock[Symbol.asyncIterator] = async function*() {
    yield { result: '100000000000000' };
  };
  p.iterateBalance = jest.fn().mockImplementation(() => {
    return asyncIteratorMock;
  });

  return PublicApi;
  //
  // return {
  //   getBalance: jest.fn(),
  //
  //   web3: {
  //     eth: {
  //       sendSignedTransaction: jest.fn(),
  //       getCode: jest.fn().mockResolvedValue('0x'),
  //     },
  //     providers: {
  //       HttpProvider: jest.fn(),
  //     },
  //     setProvider: jest.fn(),
  //   },
  //
  //   setWeb3Network: jest.fn(),
  // };
});
