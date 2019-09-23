// @ts-check
import request from '@/class/singleton/request';

const cryptoDataBaseUrl = ENV.VUE_APP_CRYPTODATA_API_URL;

export default {
  /**
   * @param {object} props
   * @param {string} props.network
   * @param {string} props.address
   * @return {Promise<{balance: string}>}
   */
  async getAccountBalance({ network, address }) {
    const { balance } = await request.get(
      `${cryptoDataBaseUrl}/${network}/balance/${address}`,
    );

    return {
      balance,
    };
  },

  /**
   *
   * @param {string} network
   * @return {Promise<GasPrices>}
   */
  async getGasPrices(network) {
    const prices = await request.get(
      `${cryptoDataBaseUrl}/${network}/gas/price`,
    );

    return prices;
  },

  /**
   *
   * @param {string} currency
   * @return {Promise<string>}
   */
  async getEtherPrice(currency = 'USD') {
    const price = await request.get(
      `${cryptoDataBaseUrl}/price?from=ETH&to=${currency}`,
    );

    return price[currency];
  },
};
