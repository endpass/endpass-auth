import cryptoDataService from '@/service/cryptoData';

jest.mock('@/service/cryptoData', () => ({
  getAccountBalance: jest.fn().mockResolvedValue({
    balance: '100000000000000',
  }),

  getGasPrice: jest.fn().mockResolvedValue({
    low: 1,
    medium: 2,
    high: 3,
  }),
}));

export default cryptoDataService;
