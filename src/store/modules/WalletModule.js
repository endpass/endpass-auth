import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/class/ConnectError';
import { walletChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import i18n from '@/locales/i18n';
import userService from '@/service/user';
import identityService from '@/service/identity';
import { accountsStore as accountsStoreModule } from '@/store';
import { ENCRYPT_OPTIONS, WALLET_TYPES } from '@/constants';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class WalletModule extends VuexModule {
  constructor(props, { accountsStore = accountsStoreModule }) {
    super(props);
    this.accountsStore = accountsStore;
  }

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

  @Action
  async saveWallet({
    v3KeystoreHdWallet,
    info,
    encryptedSeed,
    v3KeystoreChildWallet,
  }) {
    await userService.setAccount(v3KeystoreHdWallet.address, {
      ...v3KeystoreHdWallet,
      info,
    });
    await identityService.backupSeed(encryptedSeed);
    await userService.setAccount(
      v3KeystoreChildWallet.address,
      v3KeystoreChildWallet,
    );
    await identityService.updateAccountSettings(v3KeystoreChildWallet.address);

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

  @Action
  createWalletFinish(payload) {
    walletChannel.put(Answer.createOk(payload));
  }
}

export default WalletModule;
