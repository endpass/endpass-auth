import createStore from '@/store/createStore';
import createStoreModule from '@/store/createStoreModule';
import GasPriceModule from '@/store/modules/GasPriceModule';
import cryptoDataService from '@/service/cryptoData';

describe('GasPrice module', () => {
  let gasPrice;

  beforeEach(() => {
    jest.clearAllMocks();
    const store = createStore();
    const createModule = createStoreModule(store);
    gasPrice = createModule(GasPriceModule, 'gasPrice');
  });

  describe('getGasPrices', () => {
    it('should request gas prices and return it', async () => {
      expect.assertions(2);

      const network = '2';
      const gasPrices = {
        low: 1,
        medium: 2,
        high: 3,
      };

      const res = await gasPrice.getGasPrices(network);

      expect(cryptoDataService.getGasPrices).toBeCalledWith(network);
      expect(res).toEqual(gasPrices);
    });
  });

  describe('getEtherPrice', () => {
    it('should requests ether price by given fiat currency', async () => {
      expect.assertions(1);

      await gasPrice.getEtherPrice('USD');

      expect(cryptoDataService.getEtherPrice).toBeCalledWith('USD');
    });
  });
});
