// @ts-check
import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/class/ConnectError';
import { walletChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import i18n from '@/locales/i18n';
import userService from '@/service/user';
import identityService from '@/service/identity';
import { accountsStore as accountsStoreModule } from '@/store';
import { ENCRYPT_OPTIONS, WALLET_TYPES } from '@/constants';
import createController from '@/controllers/createController';

const { ERRORS } = ConnectError;

/**
 * @typedef { import("@/store/modules/AccountsModule").default } AccountsModule
 */

@Module({ generateMutationSetters: true })
class WalletController extends VuexModule {
  /**
   *
   * @param {import('vuex-class-modules').RegisterOptions} props
   * @param {object} params
   * @param {{accountsStore?: AccountsModule}} params.accountsStore
   */
  constructor(props, { accountsStore = accountsStoreModule }) {
    super(props);

    this.accountsStore = accountsStore;
  }

  /**
   *
   * @param {object} params
   * @param {string} params.password
   * @return {Promise<{v3KeystoreHdWallet: V3Keystore, encryptedSeed: string, v3KeystoreChildWallet: V3Keystore, seedKey: string, info: keystoreInfo}>}
   */
  @Action
  async generateWallet({ password }) {
    const { default: walletGen } = await import(
      /* webpackChunkName: "wallet-gen" */ '@endpass/utils/walletGen'
    );
    const {
      v3KeystoreHdWallet,
      v3KeystoreChildWallet,
      encryptedSeed,
      seedKey,
    } = await walletGen.createComplex(password, ENCRYPT_OPTIONS);
    const info = {
      address: v3KeystoreHdWallet.address,
      type: WALLET_TYPES.HD_MAIN,
      hidden: false,
    };
    return {
      v3KeystoreHdWallet,
      v3KeystoreChildWallet,
      encryptedSeed,
      seedKey,
      info,
    };
  }

  /**
   *
   * @param {object} params
   * @param {V3Keystore} params.v3KeystoreHdWallet
   * @param {keystoreInfo} params.info
   * @param {string} params.encryptedSeed
   * @param {V3Keystore} params.v3KeystoreChildWallet
   * @return {Promise<void>}
   */
  @Action
  async saveWallet({
    v3KeystoreHdWallet,
    info,
    encryptedSeed,
    v3KeystoreChildWallet,
  }) {
    await userService.setAccount(v3KeystoreHdWallet, info);
    await identityService.backupSeed(encryptedSeed);
    await userService.setAccount(v3KeystoreChildWallet);
    await identityService.updateAccountSettings(v3KeystoreChildWallet.address);

    // @ts-ignore
    await this.accountsStore.defineOnlyV3Accounts();
  }

  @Action
  cancelCreateWallet() {
    walletChannel.put(
      Answer.createFail(
        ERRORS.CREATE_WALLET,
        i18n.t('store.error.wallet.walletCreate'),
      ),
    );
  }

  /**
   *
   * @param {object?} payload
   */
  @Action
  createWalletFinish(payload) {
    walletChannel.put(Answer.createOk(payload));
  }
}

// @ts-ignore
export default params => createController(WalletController, params);
