// @ts-check
import { VuexModule, Module } from 'vuex-class-modules';
import cryptoDataService from '@/service/cryptoData';
import web3 from '@/class/singleton/web3';

@Module({ generateMutationSetters: true })
class GasPriceModule extends VuexModule {
  /**
   *
   * @param {string} network
   * @return {Promise<GasPrices>}
   */
  async getGasPrices(network) {
    const prices = await cryptoDataService.getGasPrices(network);

    return prices;
  }

  /**
   *
   * @param {string} address
   * @return {Promise<string>}
   */
  async getGasLimitByAddress(address) {
    const code = await web3.getCode(address);

    if (code === '0x') {
      return '21000';
    }

    return '200000';
  }

  /**
   *
   * @param {string} fiatCurrency
   * @return {Promise<string>}
   */
  async getEtherPrice(fiatCurrency) {
    const price = await cryptoDataService.getEtherPrice(fiatCurrency);

    return price;
  }
}

export default GasPriceModule;
