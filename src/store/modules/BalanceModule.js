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

  balanceIterator = null;

  get ethBalance() {
    if (!this.isBalanceLoading && this.balance) {
      return fromWei(this.balance);
    }
    return '0';
  }

  /**
   * @private
   * @param {object} params
   * @param {string} params.netId
   * @param {string} params.address
   * @return {Promise<void>}
   */
  checkNeededSubscribe({ address, netId }) {
    if (!this.isSubscribe || !address || !netId) {
      return false;
    }

    if (this.address === address && this.netId === netId) {
      return false;
    }

    return true;
  }

  unsubscribeBalanceUpdates() {
    if (!this.balanceIterator) {
      return;
    }
    this.balanceIterator.return();
    this.balanceIterator = null;
  }

  /**
   * @param {object} params
   * @param {string} params.netId
   * @param {string} params.address
   * @return {Promise<void>}
   */
  @Action
  async subscribeOnBalanceUpdates({ netId, address }) {
    if (!this.checkNeededSubscribe({ netId, address })) {
      return;
    }

    const web3 = await signer.getWeb3Instance();
    this.unsubscribeBalanceUpdates();

    this.isSubscribe = true;
    this.address = address;
    this.netId = netId;

    this.balanceIterator = web3.iterateBalance(this.address);

    this.isLoading = true;
    this.balance = null;
    for await (const { result, isNetworkChanged, error } of this
      .balanceIterator) {
      this.isLoading = false;
      if (isNetworkChanged || error) {
        break;
      }

      this.balance = result;
    }
  }
}

export default BalanceModule;
