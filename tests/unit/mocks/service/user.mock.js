import userService from '@/service/user';

jest.mock('@/service/user', () => ({
  getAccounts: jest.fn(),
  setAccount: jest.fn(),
  setAccountInfo: jest.fn(),
  getAccount: jest.fn(),
  getV3Accounts: jest.fn(),
  getHDKey: jest.fn(),
  findNextWalletInHD: jest.fn(),
  getNextWalletFromHD: jest.fn(),
}));

export default userService;
