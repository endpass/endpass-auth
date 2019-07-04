import gasPriceGetters from '@/store/modules/gasPrice/getters';

describe('gasPrice getters', () => {
  describe('labeledGasPricesList', () => {
    it('should return labeled list of objects with current gas prices', () => {
      const state = {
        gasPrices: {
          low: 1,
          medium: 2,
          high: 3,
        },
      };
      const res = gasPriceGetters.labeledGasPricesList(state);

      expect(res).toEqual([
        {
          label: '1 gwei',
          value: '0.000000001',
        },
        {
          label: '2 gwei',
          value: '0.000000002',
        },
        {
          label: '3 gwei',
          value: '0.000000003',
        },
      ]);
    });
  });
});
