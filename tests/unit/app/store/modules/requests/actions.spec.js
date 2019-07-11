import requestsActions from '@/store/modules/requests/actions';
import { signChannel } from '@/class/singleton/channels';
import Signer from '@/service/signer';
import {
  requestWithTransaction,
  transactionInEth,
} from '@unitFixtures/requests';

jest.mock('@/service/signer', () => ({
  recover: jest.fn(),
  signWallet: jest.fn(),
  recoverMessage: jest.fn(),
  getSignedRequest: jest.fn(),
}));

describe('requests actions', () => {
  const password = 'secret';
  let dispatch;
  let commit;
  let state;

  beforeEach(() => {
    jest.clearAllMocks();

    state = {
      request: {
        address: '0x0',
        request: {
          id: 1,
          params: ['foo', 'bar'],
          jsonrpc: '2.0',
        },
      },
    };
    dispatch = jest.fn();
    commit = jest.fn();
  });

  describe('processRequest', () => {
    const account = {
      address: '0x0',
    };
    const signResult = '0x0123';
    const getters = {};

    it('should process request with new wallet instance and send response', async () => {
      expect.assertions(4);

      Signer.getSignedRequest.mockResolvedValueOnce(signResult);

      dispatch.mockResolvedValueOnce(account);

      await requestsActions.processRequest(
        { state, commit, dispatch, getters },
        { password },
      );

      expect(dispatch).toBeCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        'getAccount',
        state.request.address,
      );
      expect(Signer.getSignedRequest).toHaveBeenCalledWith({
        password,
        request: state.request.request,
        v3KeyStore: {
          address: state.request.address,
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, 'sendResponse', {
        id: state.request.request.id,
        result: signResult,
        jsonrpc: state.request.request.jsonrpc,
      });
    });

    it('should send response with error if error was occured during processing request', async () => {
      expect.assertions(4);

      const error = new Error('foo');

      Signer.getSignedRequest.mockRejectedValueOnce(error);

      dispatch.mockResolvedValueOnce(account);

      await requestsActions.processRequest(
        { state, commit, dispatch, getters },
        { password },
      );

      expect(dispatch).toBeCalledTimes(2);
      expect(Signer.getSignedRequest).toHaveBeenCalledWith({
        password,
        request: state.request.request,
        v3KeyStore: {
          address: state.request.address,
        },
      });
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        'getAccount',
        state.request.address,
      );
      expect(dispatch).toHaveBeenNthCalledWith(2, 'sendResponse', {
        id: state.request.request.id,
        result: [],
        jsonrpc: state.request.request.jsonrpc,
        error,
      });
    });

    it('should process transaction if in passed in parameters', async () => {
      const nonce = 8;

      dispatch.mockImplementation(action => {
        if (action === 'getNextNonce') {
          return nonce;
        }
      });

      state = {
        request: requestWithTransaction,
      };

      await requestsActions.processRequest(
        { state, commit, dispatch, getters },
        {
          password,
          transaction: transactionInEth,
        },
      );

      expect(Signer.getSignedRequest.mock.calls[0][0].request).toMatchObject({
        params: [
          {
            to: requestWithTransaction.address,
            gasPrice: '0x1f4',
            gasLimit: '0x5208',
            value: '0xb1a2bc2ec50000',
            nonce: '0x8',
          },
        ],
      });
    });
  });

  describe('sendResponse', () => {
    const payload = {
      foo: 'bar',
    };

    it('should send response to opener and close dialog window', async () => {
      expect.assertions(2);

      signChannel.put = jest.fn();

      await requestsActions.sendResponse({ commit, dispatch }, payload);

      expect(commit).toBeCalledWith('changeLoadingStatus', false);
      expect(signChannel.put).toBeCalledWith({
        status: true,
        payload,
      });
    });
  });

  describe('cancelRequest', () => {
    it('should cancel current request', async () => {
      expect.assertions(1);

      await requestsActions.cancelRequest({ state, dispatch });

      expect(dispatch).toBeCalledWith('sendResponse', {
        id: state.request.request.id,
        result: [],
        error: 'canceled',
      });
    });
  });
});
