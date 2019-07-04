import cryptoDataService from '@/service/cryptoData';

const getGasPrice = async ({ commit }, network) => {
  const prices = await cryptoDataService.getGasPrice(network);

  commit('setGasPrices', prices);
};

export default {
  getGasPrice,
};
