import { VuexModule, Action, Module } from 'vuex-class-modules';
import { accountsStore, coreStore } from '@/store';
import createController from '@/controllers/createController';
import { walletChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';

@Module({ generateMutationSetters: true })
class CheckController extends VuexModule {
  @Action
  async checkAccountExist() {
    const isExist = await accountsStore.checkAccountExists();
    return isExist;
  }

  @Action
  setExist(isExist) {
    walletChannel.put(
      Answer.createOk({
        isExist,
      }),
    );
  }

  @Action
  async cancelCheck() {
    await coreStore.logout();
    walletChannel.put(Answer.createFail());
  }
}

export default () => createController(CheckController);
