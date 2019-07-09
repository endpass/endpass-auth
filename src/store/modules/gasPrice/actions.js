import { web3 } from '@/service/web3';
import cryptoDataService from '@/service/cryptoData';

const getGasPrices = async (ctx, network) => {
  const prices = await cryptoDataService.getGasPrices(network);

  return prices;
};

const getGasLimitByAddress = async (ctx, address) => {
  const code = await web3.eth.getCode(address);

  if (code === '0x') {
    return '21000';
  }

  return '200000';
};

export default {
  getGasPrices,
  getGasLimitByAddress,
};
