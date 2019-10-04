import { VuexModule, Action, Module } from 'vuex-class-modules';
import createController from '@/controllers/createController';

import { ENCRYPT_OPTIONS, WALLET_TYPES } from '@/constants';
import userService from '@/service/user';
import identityService from '@/service/identity';
import { accountsStore as accountsStoreModule } from '@/store';

@Module({ generateMutationSetters: true })
class WalletController extends VuexModule {
  constructor(props, { accountsStore = accountsStoreModule }) {
    super(props);
    this.accountsStore = accountsStore;
  }

  @Action
  async createInitialWallet({ password }) {
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

    return seedKey;
  }
}

export default () => createController(WalletController);
