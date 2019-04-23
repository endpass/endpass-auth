import { METHODS, DIRECTION } from '@/constants';
import coreActions from '@/store/modules/core/actions';

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  send: jest.fn(),
  sendAndWaitResponse: jest.fn(),
  subscribe: jest.fn(),
}));
jest.mock('@/streams', () => ({
  initDialogStream: jest.fn(),
}));

/* eslint-disable */
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { initDialogStream } from '@/streams';
import { address } from '@unitFixtures/accounts';
/* eslint-enable */

describe('core actions', () => {
  let dispatch;
  let commit;
  let getters;

  beforeEach(() => {
    jest.clearAllMocks();

    getters = {
      isDialog: jest.fn(() => true),
    };
    dispatch = jest.fn();
    commit = jest.fn();
  });

  describe('init', () => {
    it('should requests accounts and change init status', async () => {
      expect.assertions(3);

      await coreActions.init({
        commit,
        dispatch,
      });

      expect(dispatch).toBeCalledWith('defineAuthStatus');
      expect(dispatch).toBeCalledWith('startBridge');
      expect(commit).toBeCalledWith('changeInitStatus', true);
    });
  });

  describe('startBridge', () => {
    beforeEach(() => {
      bridgeMessenger.sendAndWaitResponse.mockResolvedValue({
        isIdentityMode: true,
        source: DIRECTION.AUTH,
      });
    });

    it('should create broadcast subscribtion and sent ready message to the bridge', async () => {
      expect.assertions(2);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.READY_STATE_BRIDGE);
      expect(dispatch).toBeCalledWith('subscribeOnBroadcasting');
    });

    it('should change indentity mode if it is defined', async () => {
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(commit).toBeCalledWith('changeIdentityMode', true);
    });

    it('should apply dialog stream if init message have return source proprty equals to dialog', async () => {
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(initDialogStream).toBeCalled();
    });

    it('should not do anything if called is not in dialog', async () => {
      expect.assertions(5);

      getters.isDialog = false;

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(bridgeMessenger.sendAndWaitResponse).not.toBeCalled();
      expect(bridgeMessenger.send).not.toBeCalled();
      expect(dispatch).not.toBeCalled();
      expect(commit).not.toBeCalled();
      expect(initDialogStream).not.toBeCalled();
    });
  });

  describe('logout', () => {
    it('should send logout request', async () => {
      expect.assertions(3);

      await coreActions.logout({ commit });

      expect(bridgeMessenger.sendAndWaitResponse).toBeCalledWith(
        METHODS.LOGOUT_REQUEST,
      );
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should throw an error if logout request failed', async done => {
      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({
        err: 'foo',
      });

      try {
        await coreActions.logout({ commit });
      } catch (err) {
        done();
      }
    });
  });

  describe('changeAccount', () => {
    it('should send change settings request', async () => {
      expect.assertions(3);

      await coreActions.changeAccount({ commit }, address);

      expect(bridgeMessenger.sendAndWaitResponse).toBeCalledWith(
        METHODS.CHANGE_SETTINGS_REQUEST,
        {
          address,
        },
      );
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should throw an error if change settings request failed', async done => {
      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({
        err: 'foo',
      });

      try {
        await coreActions.changeAccount({ commit });
      } catch (err) {
        done();
      }
    });
  });

  describe('subscribeOnBroadcasting', () => {
    it('should subscribe on broadcast messages', async () => {
      expect.assertions(2);

      await coreActions.subscribeOnBroadcasting({ commit, dispatch });

      expect(bridgeMessenger.subscribe).toHaveBeenNthCalledWith(
        1,
        METHODS.LOGOUT_RESPONSE,
        expect.any(Function),
      );
      expect(bridgeMessenger.subscribe).toHaveBeenNthCalledWith(
        2,
        METHODS.CHANGE_SETTINGS_RESPONSE,
        expect.any(Function),
      );
    });
  });
});
