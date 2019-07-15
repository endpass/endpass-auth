import request from '@/class/singleton/request';

const cryptoDataBaseUrl = ENV.VUE_APP_CRYPTODATA_API_URL;

export default {
  async getAccountBalance({ network, address }) {
    const { balance } = await request.get(
      `${cryptoDataBaseUrl}/${network}/balance/${address}`,
    );

    return {
      balance,
    };
  },

  async getGasPrices(network) {
    const prices = await request.get(
      `${cryptoDataBaseUrl}/${network}/gas/price`,
    );

    return prices;
  },

  async getEtherPrice(currency = 'USD') {
    const price = await request.get(`${cryptoDataBaseUrl}/price`, {
      params: {
        from: 'ETH',
        to: currency,
      },
    });

    return price[currency];
  },
};
