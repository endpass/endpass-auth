import Web3 from 'web3';
import walletGen from '@endpass/utils/walletGen';
import ConnectError from '@endpass/class/ConnectError';
import Network from '@endpass/class/Network';

import Wallet from '@/service/signer/Wallet';
import Signer from '@/service/signer';
import identityService from '@/service/identity';
import cryptoDataService from '@/service/cryptoData';
import permissionsService from '@/service/permissions';
import settingsService from '@/service/settings';
import accountsActions from '@/store/modules/accounts/actions';
import { getRecoveryIdentifierResponse } from '@unitFixtures/services/identity';
import { hdv3, v3KeyStore, accountAddress } from '@unitFixtures/accounts';
import {
  permissionChannel,
  accountChannel,
  authChannel,
} from '@/class/singleton/channels';
import Answer from '@/class/Answer';
import { IDENTITY_MODE, WALLET_TYPES } from '@/constants';

const { ERRORS } = ConnectError;

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
      expect.assertions(5);

      requestFunction.mockResolvedValueOnce({
        success: true,
      });
      const request = requestFunction();

      await accountsActions.handleAuthRequest(
        { commit },
        { email, request, link: true },
      );

      expect(commit).toBeCalledTimes(4);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'setOtpEmail', null);
      expect(commit).toHaveBeenNthCalledWith(3, 'setSentStatus', true);
      expect(commit).toHaveBeenNthCalledWith(4, 'changeLoadingStatus', false);
    });

    it('should set otp email if challenge type equals to otp', async () => {
      expect.assertions(5);

      requestFunction.mockResolvedValueOnce({
        success: true,
        challenge: {
          challengeType: 'otp',
        },
      });

      const request = requestFunction();
      await accountsActions.handleAuthRequest({ commit }, { email, request });

      expect(commit).toBeCalledTimes(4);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'setOtpEmail', email);
      expect(commit).toHaveBeenNthCalledWith(3, 'setSentStatus', false);
      expect(commit).toHaveBeenNthCalledWith(4, 'changeLoadingStatus', false);
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

  describe('mode to query', () => {
    const email = 'foo@bar.baz';
    const request = 'kek';
    const type = 'local';
    const serverMode = { type };
    const redirectUrl = 'redirectUrl';
    const state = {
      authParams: {
        redirectUrl,
      },
    };

    it('should call identityService.auth without mode in query url', async () => {
      expect.assertions(2);

      const resultUrl = `${redirectUrl}`;

      identityService.auth.mockReturnValueOnce(request);

      await accountsActions.auth(
        { state, dispatch },
        {
          email,
          serverMode: {
            type: IDENTITY_MODE.DEFAULT,
          },
        },
      );

      expect(identityService.auth).toBeCalledTimes(1);
      expect(identityService.auth).toBeCalledWith(email, resultUrl);
    });

    it('should call identityService.auth with correct mode in query url', async () => {
      expect.assertions(2);

      const resultUrl = `${redirectUrl}?mode=${type}`;

      identityService.auth.mockReturnValueOnce(request);

      await accountsActions.auth({ state, dispatch }, { email, serverMode });

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
        error: 'Authentication was canceled by user!',
        code: ERRORS.AUTH_CANCELED_BY_USER,
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

  describe('waitLogin', () => {
    it('should await auth confirm and then request accounts', async () => {
      expect.assertions(1);

      identityService.waitLogin.mockResolvedValueOnce(200);

      await accountsActions.waitLogin({ dispatch });

      expect(dispatch).toBeCalledWith('defineAuthStatus');
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

    it('should return default net', async () => {
      expect.assertions(1);

      identityService.getSettings.mockResolvedValueOnce({});

      const result = await accountsActions.getSettings({ dispatch });

      expect(result).toEqual({
        lastActiveAccount: undefined,
        net: Network.NET_ID.MAIN,
      });
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
      const fail = Answer.createFail(ERRORS.AUTH_CANCELED_BY_USER);
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

  describe('getAccountBalance', () => {
    it('should request account balance', async () => {
      expect.assertions(2);

      cryptoDataService.getAccountBalance.mockResolvedValueOnce({
        balance: '1000',
      });

      const payload = {
        address: accountAddress,
        net: 1,
      };
      const res = await accountsActions.getAccountBalance(null, payload);

      expect(cryptoDataService.getAccountBalance).toBeCalledWith({
        address: payload.address,
        network: payload.net,
      });
      expect(res).toBe('1000');
    });
  });

  describe('subscribeOnBalanceUpdates', () => {
    const settings = {
      lastActiveAccount: accountAddress,
      net: 1,
    };

    beforeAll(() => {
      jest.useFakeTimers();
    });

    it('should sets up interval with requesting current account balance', async () => {
      expect.assertions(2);

      const balance = '1000';

      dispatch.mockResolvedValueOnce(balance);
      accountsActions.subscribeOnBalanceUpdates({
        state: { settings },
        commit,
        dispatch,
      });

      expect(commit).not.toBeCalled();

      jest.advanceTimersByTime(1500);

      await global.flushPromises();

      expect(commit).toBeCalledWith('setBalance', balance);
    });

    it('should set null balance if error annears during requesting', async () => {
      expect.assertions(2);

      dispatch.mockRejectedValueOnce();
      accountsActions.subscribeOnBalanceUpdates({
        state: { settings },
        commit,
        dispatch,
      });

      expect(commit).not.toBeCalled();

      jest.advanceTimersByTime(1500);

      await global.flushPromises();

      expect(commit).toBeCalledWith('setBalance', null);
    });

    it('should not do anything if current account is empty', async () => {
      expect.assertions(1);

      accountsActions.subscribeOnBalanceUpdates({
        state: { settings: {} },
        commit,
        dispatch,
      });

      jest.advanceTimersByTime(1500);

      await global.flushPromises();

      expect(commit).not.toBeCalled();
    });
  });

  describe('checkOauthLoginRequirements', () => {
    it('should request oauth skip status with given challenge id', async () => {
      expect.assertions(2);
      const response = {
        skip: false,
      };
      permissionsService.getLoginDetails.mockResolvedValueOnce(response);
      const res = await accountsActions.checkOauthLoginRequirements(
        { commit },
        'foo',
      );
      expect(res).toEqual(response);
      expect(permissionsService.getLoginDetails).toBeCalledWith('foo');
    });

    it('should throw error if someting went wrong', async () => {
      expect.assertions(1);
      permissionsService.getLoginDetails.mockRejectedValueOnce();
      expect(
        accountsActions.checkOauthLoginRequirements({ commit }, 'foo'),
      ).rejects.toThrow();
    });
  });

  describe('createWallet', () => {
    it('should create and set accounts', async () => {
      walletGen.createComplex.mockResolvedValue({
        seedKey: 'seedKey',
        encryptedSeed: 'encryptedSeed',
        v3KeystoreHdWallet: hdv3,
        v3KeystoreChildWallet: v3KeyStore,
      });

      await accountsActions.createWallet({ commit }, { password: 'pwd' });

      expect(identityService.saveAccount).toBeCalledTimes(2);
      expect(identityService.saveAccount).toBeCalledWith(hdv3);
      expect(identityService.saveAccountInfo).toBeCalledWith(hdv3.address, {
        address: hdv3.address,
        type: WALLET_TYPES.HD_MAIN,
        hidden: false,
      });
      expect(identityService.backupSeed).toBeCalledWith('encryptedSeed');
      expect(identityService.saveAccount).toBeCalledWith(v3KeyStore);
      expect(identityService.updateAccountSettings).toBeCalledWith(
        v3KeyStore.address,
      );
    });
  });

  describe('getSettingsWithoutPermission', () => {
    it('should request settings from identity service without permission', async () => {
      expect.assertions(1);

      const payload = {
        foo: 'bar',
      };

      identityService.getSettingsSkipPermission.mockResolvedValueOnce(payload);

      const res = await accountsActions.getSettingsWithoutPermission();

      expect(res).toEqual(payload);
    });
  });

  describe('defineSettingsWithoutPermission', () => {
    it('should request settings without permission, merge them with local settings and set it to the state', async () => {
      expect.assertions(1);

      const settingsResponse = {
        foo: 'bar',
      };
      const localSettings = {
        bar: 'baz',
      };

      dispatch.mockResolvedValueOnce(settingsResponse);
      settingsService.mergeSettings.mockReturnValueOnce(localSettings);

      await accountsActions.defineSettingsWithoutPermission({
        dispatch,
        commit,
      });

      expect(commit).toBeCalledWith('setSettings', {
        foo: 'bar',
        bar: 'baz',
      });
    });
  });

  describe('validatePassword', () => {
    const address = '0x123';
    const password = '123';
    const v3 = {
      foo: 'bar',
    };

    it('should validate password of given account through signer service', async () => {
      expect.assertions(6);

      dispatch.mockResolvedValueOnce(v3);

      const validatorSpy = jest
        .spyOn(Signer, 'validatePassword')
        .mockResolvedValueOnce(true);

      const res = await accountsActions.validatePassword(
        { commit, dispatch },
        { address, password },
      );

      expect(res).toBe(true);
      expect(commit).toBeCalledTimes(2);
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
      expect(dispatch).toBeCalledWith('getAccount', address);
      expect(Signer.validatePassword).toBeCalledWith({
        v3KeyStore: v3,
        password,
      });
      validatorSpy.mockRestore();
    });

    it('should throw error is something goes wrong', async () => {
      expect.assertions(1);

      dispatch.mockRejectedValueOnce();

      const validatorSpy = jest
        .spyOn(Signer, 'validatePassword')
        .mockRejectedValueOnce();

      expect(
        accountsActions.validatePassword(
          { commit, dispatch },
          { address, password },
        ),
      ).rejects.toThrow(expect.any(Error));
      validatorSpy.mockRestore();
    });
  });
});
