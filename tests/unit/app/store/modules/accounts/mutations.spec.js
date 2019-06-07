import { state as accountsState } from '@/store/modules/accounts';
import accountsMutations from '@/store/modules/accounts/mutations';

jest.mock('@/class/singleton/http', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('accounts mutations', () => {
  let state;

  beforeEach(() => {
    state = { ...accountsState };
  });

  describe('setAuthStatus', () => {
    it('should set auth status', () => {
      accountsMutations.setAuthStatus(state, true);

      expect(state.isLogin).toBe(true);
      expect(state.isPermission).toBe(true);
    });
  });

  describe('setAccounts', () => {
    it('should set accounts', () => {
      accountsMutations.setAccounts(state, ['0x0', '0x1']);

      expect(state.accounts).toEqual(['0x0', '0x1']);
    });
  });

  describe('setSentStatus', () => {
    it('should set link sent status', () => {
      accountsMutations.setSentStatus(state, true);

      expect(state.linkSent).toBe(true);
    });
  });

  describe('setRecoveryIidentifier', () => {
    it('should set recovery identifier', () => {
      const recoveryIdentifier = 'recovery identifier';

      accountsMutations.setRecoveryIdentifier(state, recoveryIdentifier);

      expect(state.recoveryIdentifier).toBe(recoveryIdentifier);
    });
  });

  describe('setDemoData', () => {
    const demoData = {
      field: 'field',
    };

    it('should set demo data', async () => {
      accountsMutations.setDemoData(state, demoData);

      expect(state.demoData).toBe(demoData);
    });
  });

  describe('setBalance', () => {
    it('should set given balance', () => {
      accountsMutations.setBalance(state, '1000');

      expect(state.balance).toBe('1000');
    });
  });

  describe('setAuthByCode', () => {
    it('should set correct status for 401', () => {
      accountsMutations.setAuthByCode(state, 401);

      expect(state.isLogin).toBe(false);
      expect(state.isPermission).toBe(false);
    });

    it('should set correct status for 403', () => {
      accountsMutations.setAuthByCode(state, 403);

      expect(state.isLogin).toBe(true);
      expect(state.isPermission).toBe(false);
    });

    it('should set correct status for 501', () => {
      accountsMutations.setAuthByCode(state, 501);

      expect(state.isLogin).toBe(false);
      expect(state.isPermission).toBe(false);
    });

    it('should set correct status for 200', () => {
      accountsMutations.setAuthByCode(state, 200);

      expect(state.isLogin).toBe(true);
      expect(state.isPermission).toBe(true);
    });
  });
});
