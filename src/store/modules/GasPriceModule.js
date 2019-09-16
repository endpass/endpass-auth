// @ts-check
import { VuexModule, Module } from 'vuex-class-modules';
import cryptoDataService from '@/service/cryptoData';
import signerService from '@/service/signer';

@Module({ generateMutationSetters: true })
class GasPriceModule extends VuexModule {
  async getGasPrices(network) {
    const prices = await cryptoDataService.getGasPrices(network);

    return prices;
  }

  async getGasLimitByAddress(address) {
    const web3 = await signerService.getWeb3Instance();
    const code = await web3.eth.getCode(address);

    if (code === '0x') {
      return '21000';
    }

    return '200000';
  }

  async getEtherPrice(fiatCurrency) {
    const price = await cryptoDataService.getEtherPrice(fiatCurrency);

    return price;
  }
}

export default GasPriceModule;
