import coreMutations from '@/store/modules/core/mutations';

describe('core mutations', () => {
  describe('changeInitStatus', () => {
    it('should change init status', () => {
      const state = {
        inited: false,
      };

      coreMutations.changeInitStatus(state, true);

      expect(state.inited).toBe(true);
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
});
