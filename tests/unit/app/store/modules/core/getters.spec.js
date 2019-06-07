import coreGetters from '@/store/modules/core/getters';

describe('core getters', () => {
  describe('isRateLimit', () => {
    it('should return true rate limit', () => {
      const state = {
        rateLimitTimeout: 10,
      };

      expect(coreGetters.isRateLimit(state)).toBe(true);
    });

    it('should return false rate limit', () => {
      const state = {
        rateLimitTimeout: 0,
      };

      expect(coreGetters.isRateLimit(state)).toBe(false);
    });
  });
});
