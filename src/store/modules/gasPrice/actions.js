import signerService from '@/service/signer';
import cryptoDataService from '@/service/cryptoData';

const getGasPrices = async (ctx, network) => {
  const prices = await cryptoDataService.getGasPrices(network);

  return prices;
};

const getGasLimitByAddress = async (ctx, address) => {
  const web3 = await signerService.getWeb3Instance();
  const code = await web3.eth.getCode(address);

  if (code === '0x') {
    return '21000';
  }

  return '200000';
};

const getEtherPrice = async (ctx, fiatCurrency) => {
  const price = await cryptoDataService.getEtherPrice(fiatCurrency);

  return price;
};

export default {
  getGasPrices,
  getGasLimitByAddress,
  getEtherPrice,
};
