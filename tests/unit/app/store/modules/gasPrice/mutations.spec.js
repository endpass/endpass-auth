import gasPriceMutations from '@/store/modules/gasPrice/mutations';

describe('gasPrice mutations', () => {
  describe('setGasPrices', () => {
    it('should set given gas prices', () => {
      const state = {
        gasPrices: null,
      };
      const gasPrices = {
        low: 1,
        medium: 2,
        high: 3,
      };

      gasPriceMutations.setGasPrices(state, gasPrices);

      expect(state.gasPrices).toEqual(gasPrices);
    });
  });
});
