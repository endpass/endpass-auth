import Web3 from 'web3';

jest.mock('web3', () => {
  const eth = {
    accounts: {
      sign: jest.fn().mockResolvedValue({}),
    },
    getCode: jest.fn().mockResolvedValue('0x'),
  };
  const mockWeb3 = jest.fn(() => ({
    eth,
  }));
  // Allows you to replace stubs of web3 instance methods in unit tests
  mockWeb3.eth = eth;

  return mockWeb3;
});

export default Web3;
