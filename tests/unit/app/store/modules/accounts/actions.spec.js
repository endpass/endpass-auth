import Web3 from 'web3';

import Wallet from '@/service/signer/Wallet';
import identityService from '@/service/identity';
import accountsActions from '@/store/modules/accounts/actions';
import { getRecoveryIdentifierResponse } from '@unitFixtures/services/identity';

import { v3KeyStore } from '@unitFixtures/accounts';
import {
  permissionChannel,
  accountChannel,
  authChannel,
} from '@/class/singleton/channels';
import Answer from '@/class/Answer';

describe('accounts actions', () => {
  let dispatch;
  let commit;

  accountChannel.put = jest.fn();
  authChannel.put = jest.fn();
  permissionChannel.put = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    dispatch = jest.fn();
    commit = jest.fn();
  });

  describe('handleAuthRequest', () => {
    const email = 'foo@bar.baz';
    const requestFunction = jest.fn();

    it('should auth user and change link status', async () => {
      expect.assertions(3);

      requestFunction.mockResolvedValueOnce({
        success: true,
      });
      const request = requestFunction();

      await accountsActions.handleAuthRequest(
        { commit },
        { email, request, link: true },
      );

      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'setSentStatus', true);
    });

    it('should set otp email if challenge type equals to otp', async () => {
      expect.assertions(4);

      requestFunction.mockResolvedValueOnce({
        success: true,
        challenge: {
          challengeType: 'otp',
        },
      });

      const request = requestFunction();
      await accountsActions.handleAuthRequest({ commit }, { email, request });

      expect(commit).toBeCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'setOtpEmail', email);
      expect(commit).toHaveBeenNthCalledWith(3, 'changeLoadingStatus', false);
    });

    it('should throw error if auth response is falsy', async () => {
      expect.assertions(4);

      requestFunction.mockResolvedValueOnce(false);
      const request = requestFunction();

      try {
        await accountsActions.handleAuthRequest({ commit }, { email, request });
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }

      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should throw error', async done => {
      expect.assertions(3);

      const error = new Error();

      requestFunction.mockRejectedValueOnce(error);
      const request = requestFunction();
      try {
        await accountsActions.handleAuthRequest({ commit }, { email, request });
      } catch (err) {
        done();
      }
      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });
  });

  describe('auth', () => {
    const email = 'foo@bar.baz';
    const request = 'kek';
    const type = 'local';
    const serverMode = { type };
    const serverUrl = 'serverUrl';
    const redirectUrl = 'redirectUrl';
    const state = {
      authParams: {
        redirectUrl,
      },
    };

    it('should call handleAuthRequest with correct params', async () => {
      expect.assertions(2);

      identityService.auth.mockReturnValueOnce(request);

      await accountsActions.auth({ state, dispatch }, { email, serverMode });

      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toHaveBeenNthCalledWith(1, 'handleAuthRequest', {
        email,
        request,
        link: true,
      });
    });

    it('should call identityService.auth with correct email', async () => {
      expect.assertions(2);

      const resultUrl = `${redirectUrl}?mode=${type}`;

      identityService.auth.mockReturnValueOnce(request);

      await accountsActions.auth({ state, dispatch }, { email, serverMode });

      expect(identityService.auth).toBeCalledTimes(1);
      expect(identityService.auth).toBeCalledWith(email, resultUrl);
    });

    it('should call identityService.auth with correct server url', async () => {
      expect.assertions(2);

      const resultUrl = `${redirectUrl}?mode=${type}&serverUrl=${serverUrl}`;

      identityService.auth.mockReturnValueOnce(request);

      await accountsActions.auth(
        { state, dispatch },
        {
          email,
          serverMode: { ...serverMode, serverUrl },
        },
      );

      expect(identityService.auth).toBeCalledTimes(1);
      expect(identityService.auth).toBeCalledWith(email, resultUrl);
    });
  });

  describe('authWithGoogle', () => {
    const email = 'foo@bar.baz';
    const request = 'kek';

    it('should call handleAuthRequest with correct params', async () => {
      expect.assertions(2);

      identityService.authWithGoogle.mockReturnValueOnce(request);
      await accountsActions.authWithGoogle({ dispatch }, { email });
      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toHaveBeenNthCalledWith(1, 'handleAuthRequest', {
        email,
        request,
      });
    });
  });

  describe('authWithGitHub', () => {
    const email = 'foo@bar.baz';

    it('should auth user and change link status', async () => {
      expect.assertions(3);

      identityService.authWithGitHub.mockResolvedValueOnce({
        success: true,
      });
      await accountsActions.authWithGitHub({ commit }, {});

      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should set otp email if challenge type equals to otp', async () => {
      expect.assertions(4);

      identityService.authWithGitHub.mockResolvedValueOnce({
        success: true,
        challenge: {
          challengeType: 'otp',
        },
        email,
      });

      await accountsActions.authWithGitHub({ commit }, {});

      expect(commit).toBeCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'setOtpEmail', email);
      expect(commit).toHaveBeenNthCalledWith(3, 'changeLoadingStatus', false);
    });

    it('should throw error if auth response is falsy', async done => {
      expect.assertions(3);

      identityService.authWithGitHub.mockResolvedValueOnce({
        success: false,
      });
      try {
        await accountsActions.authWithGitHub({ commit }, {});
      } catch (err) {
        done();
      }
      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should throw error', async done => {
      expect.assertions(3);

      const error = new Error();

      identityService.authWithGitHub.mockRejectedValueOnce(error);
      try {
        await accountsActions.authWithGitHub({ commit }, {});
      } catch (err) {
        done();
      }
      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });
  });

  describe('cancelAuth', () => {
    it('should resolve current message and close dialog', async () => {
      expect.assertions(1);

      await accountsActions.cancelAuth({ dispatch });

      expect(authChannel.put).toBeCalledWith({
        status: false,
        error: 'Auth was canceled by user!',
      });
    });
  });

  describe('confirmAuth', () => {
    it('should resolve current message and close dialog', async () => {
      expect.assertions(1);

      await accountsActions.confirmAuth({ dispatch });

      expect(authChannel.put).toBeCalledWith({
        status: true,
      });
    });
  });

  describe('getAccounts', () => {
    it('should request accounts, bypass xpub accounts and set it', async () => {
      expect.assertions(1);

      identityService.getAccounts.mockResolvedValueOnce(['0x0', '0x1', 'xpub']);
      identityService.getAccountInfo.mockImplementation(acc => ({
        address: acc,
        type: 'StandardAccount',
      }));

      await accountsActions.getAccounts({ commit });

      expect(commit).toBeCalledWith('setAccounts', [
        { address: '0x0', type: 'StandardAccount' },
        { address: '0x1', type: 'StandardAccount' },
      ]);
    });

    it('should set empty accounts on error', async () => {
      expect.assertions(1);

      identityService.getAccounts.mockRejectedValueOnce();

      await accountsActions.getAccounts({ commit });

      expect(commit).toBeCalledWith('setAccounts', null);
    });
  });

  describe('getAccount', () => {
    it('should request account and return it', async () => {
      expect.assertions(2);

      const account = {
        address: '0x0',
      };

      identityService.getAccount.mockResolvedValueOnce(account);

      const res = await accountsActions.getAccount(null, '0x0');

      expect(identityService.getAccount).toBeCalledWith('0x0');
      expect(res).toEqual(account);
    });
  });

  describe('awaitAuthConfirm', () => {
    it('should await auth confirm and then request accounts', async () => {
      expect.assertions(1);

      identityService.awaitAuthConfirm.mockResolvedValueOnce(200);

      await accountsActions.awaitAuthConfirm({ dispatch });

      expect(dispatch).toBeCalledWith('defineOnlyV3Accounts');
    });
  });

  describe('logout', () => {
    it('it should logout user with identity service', async () => {
      expect.assertions(5);

      identityService.logout.mockResolvedValueOnce();

      await accountsActions.logout({ dispatch, commit });

      expect(accountChannel.put).toBeCalledWith({
        status: true,
        payload: {
          type: 'logout',
        },
      });
      expect(commit).toBeCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'logout');
      expect(commit).toHaveBeenNthCalledWith(3, 'changeLoadingStatus', false);
    });

    it('it should throw error', async done => {
      expect.assertions(2);

      identityService.logout.mockRejectedValueOnce();

      try {
        await accountsActions.logout({ dispatch, commit });
      } catch (err) {
        done();
      }

      expect(commit).toBeCalledTimes(2);
      expect(dispatch).not.toBeCalled();
    });
  });

  describe('awaitLogoutConfirm', () => {
    it('should await logout confirm', async () => {
      expect.assertions(3);

      identityService.awaitLogoutConfirm.mockResolvedValueOnce();

      await accountsActions.awaitLogoutConfirm({ commit });

      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should throw error', async done => {
      expect.assertions(3);

      identityService.awaitLogoutConfirm.mockRejectedValueOnce();

      try {
        await accountsActions.awaitLogoutConfirm({ commit });
      } catch (err) {
        done();
      }

      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });
  });

  describe('getFirstPrivateAccount', () => {
    it('should returns first private account info from state', async () => {
      expect.assertions(1);

      const accounts = [
        {
          address: '0x0',
          type: 'StandardAccount',
        },
        {
          address: '0x1',
          type: 'PublicAccount',
        },
      ];
      const state = {
        accounts,
      };

      const res = await accountsActions.getFirstPrivateAccount({
        state,
        dispatch,
      });

      expect(res).toEqual(accounts[0]);
    });

    it('should returns null if there are no private accounts in state', async () => {
      expect.assertions(1);

      const accounts = [
        {
          address: '0x0',
          type: 'PublicAccount',
        },
        {
          address: '0x1',
          type: 'PublicAccount',
        },
      ];
      const state = {
        accounts,
      };

      const res = await accountsActions.getFirstPrivateAccount({
        state,
        dispatch,
      });

      expect(res).toBe(null);
    });

    it('should requests accounts if there are no accounts in the state', async () => {
      expect.assertions(1);

      const state = {
        accounts: null,
      };

      await accountsActions.getFirstPrivateAccount({
        state,
        dispatch,
      });

      expect(dispatch).toBeCalledWith('defineOnlyV3Accounts');
    });
  });

  describe('getRecoveryIdentifier', () => {
    const state = {
      otpEmail: 'email@email@com',
    };

    it('should get recovery identifier through the identity service', () => {
      accountsActions.getRecoveryIdentifier({ state, commit });

      expect(identityService.getRecoveryIdentifier).toHaveBeenCalledTimes(1);
      expect(identityService.getRecoveryIdentifier).toHaveBeenCalledWith(
        state.otpEmail,
      );
    });

    it('should set loading status', () => {
      accountsActions.getRecoveryIdentifier({ state, commit });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith('changeLoadingStatus', true);
    });

    it('should set recovery identifier', async () => {
      expect.assertions(3);

      await accountsActions.getRecoveryIdentifier({ state, commit });

      expect(commit).toHaveBeenCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(
        2,
        'setRecoveryIdentifier',
        getRecoveryIdentifierResponse.message,
      );
      expect(commit).toHaveBeenNthCalledWith(3, 'changeLoadingStatus', false);
    });

    it('should handle errors', async () => {
      expect.assertions(3);

      const error = new Error();

      identityService.getRecoveryIdentifier.mockRejectedValue(error);

      await expect(
        accountsActions.getRecoveryIdentifier({ state, commit }),
      ).rejects.toThrow(error);
      expect(commit).toHaveBeenCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });
  });

  describe('recover', () => {
    const seedPhrase = 'foo bar foo bar foo bar foo bar foo bar foo bar';
    const state = {
      authParams: {
        redirectUrl: 'https://localhost:8080',
      },
      otpEmail: 'email@email@com',
      recoveryIdentifier: getRecoveryIdentifierResponse.message,
    };

    it('should send recover request', async () => {
      expect.assertions(2);

      const signature = 'signature';

      Web3.eth.accounts.sign.mockResolvedValue({ signature });
      await accountsActions.recover({ state, commit }, { seedPhrase });

      expect(identityService.recover).toHaveBeenCalledTimes(1);
      expect(identityService.recover).toHaveBeenCalledWith(
        state.otpEmail,
        signature,
        state.authParams.redirectUrl,
      );
    });

    it('should set loading status', () => {
      accountsActions.recover({ state, commit }, { seedPhrase });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith('changeLoadingStatus', true);
    });

    it('should set sent and loading status', async () => {
      expect.assertions(3);

      await accountsActions.recover({ state, commit }, { seedPhrase });

      expect(commit).toHaveBeenCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(2, 'setSentStatus', true);
      expect(commit).toHaveBeenNthCalledWith(3, 'changeLoadingStatus', false);
    });

    it('should handle errors', async () => {
      expect.assertions(3);

      const error = new Error();

      identityService.recover.mockRejectedValue(error);

      await expect(
        accountsActions.recover({ state, commit }, { seedPhrase }),
      ).rejects.toThrow(error);
      expect(commit).toHaveBeenCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });
  });

  describe('change settings', () => {
    it('should change settings without demoData', async () => {
      expect.assertions(3);

      const getters = {};
      const state = {
        settings: {
          storeSettings: 'storeSettings',
        },
      };

      const settings = {
        lastActiveAccount: '123',
      };

      dispatch.mockResolvedValueOnce(settings);

      await accountsActions.defineSettings({
        state,
        dispatch,
        commit,
        getters,
      });

      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toHaveBeenNthCalledWith(1, 'getSettings');
      expect(commit).toHaveBeenCalledWith('setSettings', settings);
    });

    it('should change settings with demoData', async () => {
      expect.assertions(2);

      const settings = {
        lastActiveAccount: '123',
      };

      const state = {
        settings: { noData: 'noData' },
      };

      dispatch.mockResolvedValueOnce(settings);

      await accountsActions.defineSettings({
        state,
        dispatch,
        commit,
        getters: { demoData: {} },
      });

      expect(dispatch).toBeCalledTimes(0);
      expect(commit).toHaveBeenCalledWith('setSettings', state.settings);
    });
  });

  describe('demo mode', () => {
    const demoData = {
      v3KeyStore,
      activeNet: 3,
      password: '12345678',
    };

    it('should setup demo data', async () => {
      expect.assertions(4);

      await accountsActions.setupDemoData({ commit }, demoData);

      expect(commit).toBeCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(1, 'setDemoData', demoData);
      expect(commit).toHaveBeenNthCalledWith(2, 'setAccounts', [
        { address: v3KeyStore.address },
      ]);
      expect(commit).toHaveBeenNthCalledWith(3, 'setSettings', {
        lastActiveAccount: v3KeyStore.address,
        net: demoData.activeNet,
      });
    });
  });

  describe('signPermission', () => {
    it('should sign permission', async () => {
      expect.assertions(1);

      const password = 'secret';
      const ok = Answer.createOk();

      jest.spyOn(Wallet.prototype, 'sign').mockReturnValueOnce({
        signature: 'signature',
      });

      identityService.getAuthPermission.mockReturnValueOnce({
        keystore: v3KeyStore,
      });
      await accountsActions.signPermission({}, { password });

      expect(permissionChannel.put).toBeCalledWith(ok);
    });

    it('should cancel sign permission', async () => {
      const fail = Answer.createFail();
      accountsActions.cancelSignPermission();

      expect(permissionChannel.put).toBeCalledWith(fail);
    });
  });

  describe('defineAuthStatus', () => {
    it('should return 200 status', async () => {
      expect.assertions(3);

      identityService.getAuthStatus.mockReturnValueOnce(200);

      const status = await accountsActions.defineAuthStatus({ commit });
      expect(commit).toBeCalledTimes(1);
      expect(commit).toHaveBeenNthCalledWith(1, 'setAuthByCode', 200);
      expect(status).toBe(200);
    });

    it('should return 401 status', async () => {
      expect.assertions(3);

      identityService.getAuthStatus.mockReturnValueOnce(401);

      const status = await accountsActions.defineAuthStatus({ commit });
      expect(commit).toBeCalledTimes(1);
      expect(commit).toHaveBeenNthCalledWith(1, 'setAuthByCode', 401);
      expect(status).toBe(401);
    });
  });
});
