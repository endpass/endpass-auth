import userService from '@/service/user';

jest.mock('@/service/user', () => ({
  getAccount: jest.fn(),
  getAccounts: jest.fn(),
  getSettings: jest.fn(),
  setSettings: jest.fn(),
  getSettingsSkipPermission: jest.fn(),
  setAccount: jest.fn(),
  setAccountInfo: jest.fn(),
  getV3Accounts: jest.fn(),
  getHDKey: jest.fn(),
  findNextWalletInHD: jest.fn(),
  getNextWalletFromHD: jest.fn(),
}));

export default userService;
