import get from 'lodash/get';
import keystoreHDKeyVerify from '@endpass/utils/keystoreHDKeyVerify';
import keystoreHDWallet from '@endpass/utils/keystoreHDWallet';
import request from '@/class/singleton/request';
import { Wallet } from '@/class';
import isV3 from '@endpass/utils/isV3';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;
const WALLET_TYPES = Wallet.getTypes();

export default {
  /**
   * Returns addresses of all of the user's accounts
   * @returns {[type]}
   */
  async getAccounts() {
    const addresses = await request.get(`${identityBaseUrl}/accounts`);

    return addresses;
  },

  /**
   * Saves the encrypted keystore for an account
   * @param {[type]} address
   * @param {Object} options.info
   * @param {...[type]} rest }
   */
  async setAccount(address, { info = {}, ...rest }) {
    const infoForSave = {
      address,
      type: WALLET_TYPES.STANDART,
      hidden: false,
      ...info,
    };

    await request.postSkipPermission(
      `${identityBaseUrl}/account/${address}`,
      rest,
    );
    await this.setAccountInfo(address, infoForSave);
  },

  /**
   * Save the info for an account
   * @param {[type]} address
   * @param {[type]} info
   */
  setAccountInfo(address, info) {
    return request.postSkipPermission(
      `${identityBaseUrl}/account/${address}/info`,
      info,
    );
  },

  // Returns the encrypted keystore for a single account
  async getAccount(address) {
    const [account, info] = await Promise.all([
      request.get(`${identityBaseUrl}/account/${address}`),
      request
        .get(`${identityBaseUrl}/account/${address}/info`)
        .catch(() => ({})),
    ]);

    return {
      ...account,
      address,
      info,
    };
  },

  // Returns encrypted keystores for all non HD accounts
  // TODO refactor to remove this method and only get accounts as needed
  async getV3Accounts() {
    const accounts = await this.getAccounts();
    const allAcc = accounts
      .filter(acc => !keystoreHDKeyVerify.isExtendedPublicKey(acc))
      .map(this.getAccount);
    const allAccounts = await Promise.all(allAcc);

    return allAccounts;
  },

  /**
   * Returns the encrypted keystore for the user's HD wallet, if any
   * Right now, uses the first HD address found as a key
   * @returns {[type]}
   */
  async getHDKey() {
    const accounts = await this.getAccounts();

    const hdAddresses = accounts.filter(acc =>
      keystoreHDKeyVerify.isExtendedPublicKey(acc),
    );

    if (hdAddresses.length === 0) {
      return null;
    }

    const hdAccounts = await Promise.all(
      hdAddresses.map(acc => this.getAccount(acc)),
    );

    const hdAccount =
      hdAccounts.find(
        account => get(account, 'info.type') === WALLET_TYPES.HD_MAIN,
      ) || hdAccounts.find(acc => isV3(acc));

    return hdAccount;
  },

  findNextWalletInHD({ hdWallet, addresses }) {
    let idx = addresses.length;
    let nextWallet = null;

    while (!nextWallet) {
      const wallet = hdWallet.deriveChild(idx).getWallet();

      if (addresses.includes(wallet.getAddress())) {
        idx += 1;
      } else {
        nextWallet = wallet;
      }
    }

    return nextWallet;
  },

  async getNextWalletFromHD({ addresses, password }) {
    const v3KeyStore = await this.getHDKey();
    const hdWallet = keystoreHDWallet.decryptHDWallet(password, v3KeyStore);

    return this.findNextWalletInHD({ hdWallet, addresses });
  },
};
