import coreMutations from '@/store/modules/core/mutations';

describe('core mutations', () => {
  describe('changeInitStatus', () => {
    it('should change init status', () => {
      const state = {
        isInited: false,
      };

      coreMutations.changeInitStatus(state, true);

      expect(state.isInited).toBe(true);
    });
  });

  describe('changeLoadingStatus', () => {
    it('should change loading status', () => {
      const state = {
        loading: false,
      };

      coreMutations.changeLoadingStatus(state, true);

      expect(state.loading).toBe(true);
    });
  });

  describe('changeIdentityMode', () => {
    it('should change identity mode', () => {
      const state = {
        isIdentityMode: false,
      };

      coreMutations.changeIdentityMode(state, true);

      expect(state.isIdentityMode).toBe(true);
    });
  });

  describe('rateLimit', () => {
    it('should set rate limit value and flag to true', () => {
      const state = {
        rateLimitTimeout: 0,
      };

      coreMutations.setRateLimitTimeout(state, 10);

      expect(state.rateLimitTimeout).toBe(10);
    });

    it('should set rate limit value and flag to false', () => {
      const state = {
        rateLimitTimeout: 10,
      };

      coreMutations.setRateLimitTimeout(state, 0);

      expect(state.rateLimitTimeout).toBe(0);
    });
  });
});
