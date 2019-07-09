import cryptoDataService from '@/service/cryptoData';

const getGasPrice = async (ctx, network) => {
  const prices = await cryptoDataService.getGasPrice(network);

  return prices;
};

export default {
  getGasPrice,
};
