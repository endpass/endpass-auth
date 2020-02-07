import { VuexModule, Module, Action } from 'vuex-class-modules';
import { fromWei } from 'web3-utils';
import signer from '@/class/singleton/signer';

@Module({ generateMutationSetters: true })
class BalanceModule extends VuexModule {
  isLoading = true;

  isSubscribe = false;

  address = null;

  balance = null;

  netId = null;

  iterator = null;

  get ethBalance() {
    if (!this.isBalanceLoading && this.balance) {
      return fromWei(this.balance);
    }
    return '0';
  }

  terminateIterator() {
    if (!this.iterator) {
      return;
    }
    this.iterator.return();
    this.iterator = null;
  }

  @Action
  async subscribeOnBalanceUpdates({ netId, address }) {
    const web3 = await signer.getWeb3Instance();

    this.isSubscribe = true;
    this.address = address;
    this.netId = netId;

    this.terminateIterator();

    this.iterator = web3.iterateBalance(this.address);

    this.isLoading = true;
    this.balance = null;
    for await (const { result, isNetworkChanged, error } of this.iterator) {
      this.isLoading = false;
      if (isNetworkChanged || error) {
        break;
      }

      this.balance = result;
    }
  }

  @Action
  async handleChangeAddress({ address, netId }) {
    if (!this.isSubscribe || !address || !netId) {
      return;
    }

    if (this.address === address && this.netId === netId) {
      return;
    }

    this.terminateIterator();
    this.subscribeOnBalanceUpdates({ address, netId });
  }
}

export default BalanceModule;
