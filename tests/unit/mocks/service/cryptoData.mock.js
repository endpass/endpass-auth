import cryptoDataService from '@/service/cryptoData';

jest.mock('@/service/cryptoData', () => ({
  getAccountBalance: jest.fn().mockResolvedValue({
    balance: '100000000000000',
  }),
}));

export default cryptoDataService;
