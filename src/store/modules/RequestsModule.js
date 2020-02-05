import { VuexModule, Module, Mutation, Action } from 'vuex-class-modules';
import { hexToNumber } from 'web3-utils';
import i18n from '@/locales/i18n';
import { signChannel } from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import signer from '@/class/singleton/signer';
import web3 from '@/class/singleton/web3';

@Module({ generateMutationSetters: true })
class RequestsModule extends VuexModule {
  request = null;

  constructor(props, { sharedStore, accountsStore }) {
    super(props);
    this.sharedStore = sharedStore;
    this.accountsStore = accountsStore;
  }

  @Mutation
  setRequest(val) {
    this.request = val;
  }

  @Action
  async getNextNonce(address) {
    const nonce = await web3.call('eth_getTransactionCount', address);
    return hexToNumber(nonce).toString();
  }

  @Action
  async sendResponse(payload) {
    signChannel.put(Answer.createOk(payload));
    this.sharedStore.changeLoadingStatus(false);
  }

  @Action
  async processRequest({ password, transaction }) {
    this.sharedStore.changeLoadingStatus(true);

    const { address, request, net } = this.request;

    const v3KeyStore = await this.accountsStore.getAccount(address);

    try {
      const requestToSign = {
        ...request,
      };
      if (transaction) {
        const nonce = await this.getNextNonce(address);
        const transactionWithNonce = {
          ...transaction,
          nonce,
        };

        const { default: Transaction } = await import(
          /* webpackChunkName: "endpass-class-transaction" */ '@endpass/class/Transaction'
        );

        Object.assign(requestToSign, {
          params: [Transaction.getApiObject(transactionWithNonce)],
        });
      }

      const signResult = await signer.getSignedRequest({
        request: requestToSign,
        v3KeyStore,
        password,
        net,
      });

      await this.sendResponse({
        id: request.id,
        result: signResult,
        jsonrpc: request.jsonrpc,
      });
    } catch (err) {
      if (err.message.includes('message authentication code mismatch')) {
        throw new Error(i18n.t('store.requests.passIncorrect'));
      } else if (err.message.includes('gas price is too low')) {
        throw new Error(i18n.t('store.requests.gasTooLow'));
      } else {
        await this.sendResponse({
          id: request.id,
          result: [],
          error: err,
          jsonrpc: request.jsonrpc,
        });
      }
    } finally {
      this.sharedStore.changeLoadingStatus(false);
    }
  }

  @Action
  async recoverMessage(payload) {
    const { address, request, net } = payload;

    try {
      const account = await this.accountsStore.getAccount(address);
      const res = await signer.recoverMessage({ account, request, net });

      return {
        id: request.id,
        result: res,
        jsonrpc: request.jsonrpc,
      };
    } catch (err) {
      return {
        id: request.id,
        result: null,
        error: err,
        jsonrpc: request.jsonrpc,
      };
    }
  }

  @Action
  cancelRequest() {
    const { request } = this.request;

    this.sendResponse({
      id: request.id,
      error: 'canceled',
      result: [],
    });
  }
}

export default RequestsModule;
