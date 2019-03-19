import Wallet from '@/class/Wallet';
import { Network } from '@endpass/class';
import syncChannel from '@/class/singleton/syncChannel';
import { Answer } from '@/class';

const sendResponse = async ({ commit }, payload) => {
  syncChannel.put(Answer.createOk(payload));
  commit('changeLoadingStatus', false);
};

const processRequest = async (
  { state, commit, dispatch, getters },
  password,
) => {
  commit('changeLoadingStatus', true);

  const { address, request, net = Network.NET_ID.MAIN } = state.request;

  // eslint-disable-next-line
  const demoData = getters.demoData;

  let v3KeyStore;
  if (demoData) {
    // eslint-disable-next-line
    v3KeyStore = demoData.v3KeyStore;
  } else {
    v3KeyStore = await dispatch('getAccount', address);
  }

  const wallet = new Wallet(v3KeyStore);

  try {
    await dispatch('setWeb3NetworkProvider', net);
    const signResult = await dispatch('getSignedRequest', { wallet, password });

    dispatch('sendResponse', {
      id: request.id,
      result: signResult,
      jsonrpc: request.jsonrpc,
    });
  } catch (err) {
    console.log(err.message);

    if (err.message.includes('message authentication code mismatch')) {
      commit('changeLoadingStatus', false);

      throw new Error('You have enter incorrect password');
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
  const { address, request } = payload;

  try {
    const account = await dispatch('getAccount', address);
    const wallet = new Wallet(account);
    const res = await wallet.recover(request.params[0], request.params[1]);

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

const getSignedRequest = async ({ state, dispatch }, payload) => {
  const { method } = state.request;

  switch (method) {
    case 'eth_sendTransaction':
      return dispatch('getSignedTransaction', payload);
    case 'eth_signTypedData':
      return dispatch('getSignedTypedDataRequest', payload);
    default:
      return dispatch('getSignedPlainRequest', payload);
  }
};

const getSignedTransaction = async ({ state }, { password, wallet }) => {
  const { request } = state.request;
  const res = await wallet.sendSignedTransaction(request.transaction, password);

  return res;
};

const getSignedTypedDataRequest = async () => {
  // const wallet = rootGetters['accounts/wallet'];
  // const request = getters.currentRequest;
  throw new Error('Sign typed data not supported yet!');
};

const getSignedPlainRequest = async ({ state }, { password, wallet }) => {
  const { request } = state.request;
  let res;
  const passParams = request.params[0];
  if (request.method === 'eth_sendTransaction') {
    res = await wallet.sendSignedTransaction(passParams, password);
  } else {
    const singRes = await wallet.sign(passParams, password);
    res = singRes.signature;
  }

  return res;
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
  processRequest,
  recoverMessage,
  sendResponse,
  getSignedRequest,
  getSignedTypedDataRequest,
  getSignedTransaction,
  getSignedPlainRequest,
  cancelRequest,
};
