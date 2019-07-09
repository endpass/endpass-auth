import i18n from '@/locales/i18n';
import { Transaction } from '@endpass/class';
import { signChannel } from '@/class/singleton/channels';
import { Answer } from '@/class';
import { web3 } from '@/service/web3';
import signerService from '@/service/signer';

const getNextNonce = async (ctx, address) => {
  const nonce = await web3.eth.getTransactionCount(address);

  return nonce;
};

const sendResponse = async ({ commit }, payload) => {
  signChannel.put(Answer.createOk(payload));
  commit('changeLoadingStatus', false);
};

const processRequest = async (
  { state, commit, dispatch, getters },
  { password, transaction },
) => {
  commit('changeLoadingStatus', true);

  const { address, request, net } = state.request;
  const { demoData } = getters;
  let v3KeyStore;

  if (demoData) {
    // eslint-disable-next-line
    v3KeyStore = demoData.v3KeyStore;
  } else {
    v3KeyStore = await dispatch('getAccount', address);
  }

  try {
    const requestToSign = {
      ...request,
    };

    if (transaction) {
      const nonce = await dispatch('getNextNonce', address);
      const transactionWithNonce = {
        ...transaction,
        nonce,
      };

      Object.assign(requestToSign, {
        params: [Transaction.getApiObject(transactionWithNonce)],
      });
    }

    const signResult = await signerService.getSignedRequest({
      request: requestToSign,
      v3KeyStore,
      password,
      net,
    });

    dispatch('sendResponse', {
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
      dispatch('sendResponse', {
        id: request.id,
        result: [],
        error: err,
        jsonrpc: request.jsonrpc,
      });
    }
  } finally {
    commit('changeLoadingStatus', false);
  }
};

const recoverMessage = async ({ dispatch }, payload) => {
  const { address, request, net } = payload;

  try {
    const account = await dispatch('getAccount', address);
    const res = await signerService.recoverMessage({ account, request, net });

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
};

const cancelRequest = ({ state, dispatch }) => {
  const { request } = state.request;

  dispatch('sendResponse', {
    id: request.id,
    error: 'canceled',
    result: [],
  });
};

export default {
  getNextNonce,
  processRequest,
  recoverMessage,
  sendResponse,
  cancelRequest,
};
