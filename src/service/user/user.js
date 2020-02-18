import get from 'lodash/get';
import keystoreHDKeyVerify from '@endpass/utils/keystoreHDKeyVerify';
import isV3 from '@endpass/utils/isV3';
import request from '@/class/singleton/request';
import requestSkipPermission from '@/class/singleton/request/requestSkipPermission';
import { WALLET_TYPES } from '@/constants';
import settingsAdapter from '@/service/user/settingsAdapter';

const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

export default {
  async getSettings() {
    const settings = await request.get(`${identityBaseUrl}/settings`);
    return settingsAdapter(settings);
  },

  setSettings(settings) {
    return request.post(`${identityBaseUrl}/settings`, settings);
  },

  async getSettingsSkipPermission() {
    const settings = await requestSkipPermission.get(
      `${identityBaseUrl}/settings`,
    );
    return settingsAdapter(settings);
  },

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
   * @param {v3Keystore} v3Keystore
   * @param {keystoreInfo | {}} info
   */
  async setAccount(v3Keystore, info = {}) {
    const { address } = v3Keystore;
    const infoForSave = {
      address,
      type: WALLET_TYPES.STANDARD,
      hidden: false,
      ...info,
    };

    await requestSkipPermission.post(
      `${identityBaseUrl}/account/${address}`,
      v3Keystore,
    );
    await this.setAccountInfo(address, infoForSave);
  },

  /**
   * Save the info for an account
   * @param {[type]} address
   * @param {[type]} info
   */
  setAccountInfo(address, info) {
    return requestSkipPermission.post(
      `${identityBaseUrl}/account/${address}/info`,
      info,
    );
  },

  // Returns the encrypted keystore for a single account
  async getAccount(address) {
    const [account, info] = await Promise.all([
      request.get(`${identityBaseUrl}/account/${address}`),
      request.get(`${identityBaseUrl}/account/${address}/info`),
    ]);

    if (!info.address) {
      Object.assign(info, {
        address,
      });
    }

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

    return allAccounts.filter(isV3);
  },

  /**
   * Returns the encrypted keystore for the user's HD wallet, if any
   * Right now, uses the first HD address found as a key
   * @returns {[type]}
   */
  async getHDKey() {
    const accounts = await this.getAccounts();

    const hdAddresses = accounts.filter(
      keystoreHDKeyVerify.isExtendedPublicKey,
    );

    if (hdAddresses.length === 0) {
      return null;
    }

    const hdAccounts = await Promise.all(hdAddresses.map(this.getAccount));

    const hdAccount =
      hdAccounts.find(
        account => get(account, 'info.type') === WALLET_TYPES.HD_MAIN,
      ) || hdAccounts.find(isV3);

    return hdAccount;
  },

  findNextWalletInHD({ hdWallet, addresses }) {
    const lowercaseAddresses = addresses.map(address => address.toLowerCase());
    let idx = addresses.length;
    let nextWallet = null;

    while (!nextWallet) {
      const wallet = hdWallet.deriveChild(idx).getWallet();
      const walletAddress = wallet.getChecksumAddressString().toLowerCase();

      if (lowercaseAddresses.includes(walletAddress)) {
        idx += 1;
      } else {
        nextWallet = wallet;
      }
    }

    return nextWallet;
  },

  async getNextWalletFromHD({ addresses, password }) {
    const v3KeyStore = await this.getHDKey();
    const { default: walletGen } = await import(
      /* webpackChunkName: "keystore-hd-wallet" */ '@endpass/utils/keystoreHDWallet'
    );

    const hdWallet = await walletGen.decryptHDWallet(password, v3KeyStore);

    return this.findNextWalletInHD({ hdWallet, addresses });
  },
};
