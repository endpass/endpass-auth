import gasPriceActions from '@/store/modules/gasPrice/actions';
import cryptoDataService from '@/service/cryptoData';

describe('gasPrice actions', () => {
  let commit;

  beforeEach(() => {
    jest.clearAllMocks();

    commit = jest.fn();
  });

  describe('getGasPrice', () => {
    it('should request gas prices and return it', async () => {
      expect.assertions(2);

      const network = '2';
      const gasPrices = {
        low: 1,
        medium: 2,
        high: 3,
      };

      const res = await gasPriceActions.getGasPrice({ commit }, network);

      expect(cryptoDataService.getGasPrice).toBeCalledWith(network);
      expect(res).toEqual(gasPrices);
    });
  });
});
