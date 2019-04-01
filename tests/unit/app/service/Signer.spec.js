import Signer from '@/service/signer';
import Wallet from '@/service/signer/Wallet';
import { ORIGIN_HOST } from '@/constants';

describe('Signer', () => {
  const password = 'secret';
  const passParams = {
    v3KeyStore: {
      address: 'address',
    },
    password,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSignedRequest', () => {
    it('should return signed transaction if request method is eth_sendTransaction', async () => {
      expect.assertions(2);

      const result = {
        result: 'signedTrx',
      };
      const spyon = jest.spyOn(Wallet.prototype, 'sendSignedTransaction');

      spyon.mockReturnValueOnce(result);

      const request = {
        method: 'eth_sendTransaction',
        transaction: 'transaction',
      };

      const res = await Signer.getSignedRequest({
        ...passParams,
        request,
      });

      expect(spyon).toBeCalledWith(request.transaction, password);

      expect(res).toBe(result);
    });

    it('should throw error when method is eth_signTypedData', async () => {
      expect.assertions(1);

      const request = {
        method: 'eth_signTypedData',
        transaction: 'transaction',
      };

      try {
        await Signer.getSignedRequest({
          ...passParams,
          request,
        });
      } catch (e) {
        const err = new Error('Sign typed data not supported yet!');
        expect(e).toEqual(err);
      }
    });

    it('should return signed request if request method is any other', async () => {
      expect.assertions(2);

      const result = {
        signature: 'signature',
      };

      const request = {
        method: 'anyOtherMethod',
        params: ['data'],
      };

      const spyon = jest.spyOn(Wallet.prototype, 'sign');

      spyon.mockReturnValueOnce(result);

      const res = await Signer.getSignedRequest({
        ...passParams,
        request,
      });

      expect(spyon).toBeCalledWith(request.params[0], password);
      expect(res).toBe(result.signature);
    });
  });

  describe('recoverMessage', () => {
    it('should recover message with correct arguments', async () => {
      expect.assertions(2);

      const request = {
        params: ['message', 'signature'],
      };
      const result = 'result';
      const spyon = jest.spyOn(Wallet.prototype, 'recover');
      spyon.mockReturnValueOnce(result);

      const res = await Signer.recoverMessage({ account: '', request });

      expect(spyon).toBeCalledWith(request.params[0], request.params[1]);
      expect(res).toBe(result);
    });
  });
});
