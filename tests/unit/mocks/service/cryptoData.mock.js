import cryptoDataService from '@/service/cryptoData';

jest.mock('@/service/cryptoData', () => ({
  getAccountBalance: jest.fn().mockResolvedValue({
    balance: '100000000000000',
  }),

  getGasPrices: jest.fn().mockResolvedValue({
    low: 1,
    medium: 2,
    high: 3,
  }),

  getEtherPrice: jest.fn().mockResolvedValue(100),
}));

export default cryptoDataService;
