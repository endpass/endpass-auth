import { VuexModule, Action, Module } from 'vuex-class-modules';
import ConnectError from '@endpass/class/ConnectError';
import createController from '@/controllers/createController';
import { walletChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import i18n from '@/locales/i18n';

const { ERRORS } = ConnectError;

@Module({ generateMutationSetters: true })
class WalletCreateController extends VuexModule {
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
  createWalletFinish() {
    walletChannel.put(Answer.createOk());
  }
}

export default () => createController(WalletCreateController);
