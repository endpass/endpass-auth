import userService from '@/service/user';

jest.mock('@/service/user', () => {
  const { hdv3 } = require('@unitFixtures/accounts');

  return {
    getAccount: jest.fn().mockResolvedValue(hdv3),
    getAccounts: jest.fn(),
    getSettings: jest.fn().mockResolvedValue({
      lastActiveAccount: '0x0',
      net: 1,
    }),
    setSettings: jest.fn(),
    getSettingsSkipPermission: jest.fn(),
    setAccount: jest.fn(),
    setAccountInfo: jest.fn(),
    getV3Accounts: jest.fn().mockResolvedValue([hdv3]),
    getHDKey: jest.fn(),
    findNextWalletInHD: jest.fn(),
    getNextWalletFromHD: jest.fn(),
  };
});

export default userService;
