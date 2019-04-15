import request from '@/util/request';

const cryptoDataBaseUrl = ENV.VUE_APP_CRYPTODATA_API_URL;

export default {
  async getAccountBalance({ network, address }) {
    const { data } = await request.get(
      `${cryptoDataBaseUrl}/${network}/balance/${address}`,
    );

    return {
      balance: data.balance,
    };
  },
};
