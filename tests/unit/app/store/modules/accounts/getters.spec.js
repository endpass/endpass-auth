import accountsGetters from '@/store/modules/accounts/getters';

describe('accounts getters', () => {
  describe('addresses', () => {
    it('should return addresses of all current accounts in the state', () => {
      expect(
        accountsGetters.addresses({
          accounts: [
            {
              address: '0x0',
            },
            {
              address: '0x1',
            },
            {
              address: '0x2',
            },
          ],
        }),
      ).toEqual(['0x0', '0x1', '0x2']);
    });
  });
});
