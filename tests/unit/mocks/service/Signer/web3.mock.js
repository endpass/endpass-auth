jest.mock('@endpass/web3/public-api', () => {
  class PublicApi {}
  const p = PublicApi.prototype;
  p.setNetwork = jest.fn();
  p.getBalance = jest.fn();
  p.getCode = jest.fn().mockResolvedValue('0x');

  const asyncIteratorMock = {};
  asyncIteratorMock[Symbol.asyncIterator] = async function* () {
    yield { result: '100000000000000' };
  };
  p.iterateBalance = jest.fn().mockImplementation(() => {
    return asyncIteratorMock;
  });

  return PublicApi;
});
