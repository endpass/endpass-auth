import { METHODS, DIRECTION } from '@/constants';
import coreActions from '@/store/modules/core/actions';

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  send: jest.fn(),
  sendAndWaitResponse: jest.fn(),
  subscribe: jest.fn(),
}));
jest.mock('@/streams', () => ({
  initDialogStream: jest.fn(),
  initWidgetStream: jest.fn(),
  initCoreStream: jest.fn(),
}));

/* eslint-disable */
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { initDialogStream, initWidgetStream, initCoreStream } from '@/streams';
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
      expect.assertions(2);

      await coreActions.init({
        commit,
        dispatch,
      });

      expect(dispatch).toBeCalledWith('defineAuthStatus');
      expect(dispatch).toBeCalledWith('startBridge');
    });
  });

  describe('initDialog', () => {
    it('should init dialog stream', async () => {
      expect.assertions(2);

      const state = {
        inited: false,
      };

      await coreActions.initDialog({ state, commit });

      expect(initDialogStream).toBeCalled();
      expect(commit).toBeCalledWith('changeInitStatus', true);
    });

    it('should not do anything if inited is truthy', async () => {
      expect.assertions(2);

      const state = {
        inited: true,
      };

      await coreActions.initDialog({ state, commit });

      expect(initDialogStream).not.toBeCalled();
      expect(commit).not.toBeCalled();
    });
  });

  describe('initWidget', () => {
    it('should init widget stream', async () => {
      expect.assertions(2);

      const state = {
        inited: false,
      };

      await coreActions.initWidget({ state, commit });

      expect(initWidgetStream).toBeCalled();
      expect(commit).toBeCalledWith('changeInitStatus', true);
    });

    it('should not do anything if inited is truthy', async () => {
      expect.assertions(2);

      const state = {
        inited: true,
      };

      await coreActions.initWidget({ state, commit });

      expect(initWidgetStream).not.toBeCalled();
      expect(commit).not.toBeCalled();
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
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.READY_STATE_BRIDGE);
    });

    it('should change indentity mode if it is defined', async () => {
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(commit).toBeCalledWith('changeIdentityMode', true);
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

    it('should init core stream', async () => {
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(initCoreStream).toBeCalled();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      bridgeMessenger.sendAndWaitResponse = jest.fn().mockResolvedValue({});
    });

    it('should send logout request', async () => {
      expect.assertions(3);

      await coreActions.logout({ commit });

      expect(bridgeMessenger.sendAndWaitResponse).toBeCalledWith(
        METHODS.LOGOUT_REQUEST,
      );
      expect(commit).toHaveBeenNthCalledWith(1, 'changeLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'changeLoadingStatus', false);
    });

    it('should throw an error if logout request failed', () => {
      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({
        error: 'foo',
      });

      expect(coreActions.logout({ commit })).rejects.toThrow('foo');
    });

    it('should close dialog if source equals to dialog', async () => {
      expect.assertions(1);

      await coreActions.logout({ commit }, DIRECTION.AUTH);

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
    });

    it('should close widget if source equals to widget', async () => {
      expect.assertions(1);

      await coreActions.logout({ commit }, DIRECTION.WIDGET);

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.WIDGET_UNMOUNT);
    });

    it('should not close anything if source is empty', async () => {
      expect.assertions(1);

      await coreActions.logout({ commit });

      expect(bridgeMessenger.send).not.toBeCalled();
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

    it('should throw an error if change settings request failed', () => {
      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({
        error: 'foo',
      });

      expect(coreActions.changeAccount({ commit })).rejects.toThrow('foo');
    });
  });
});
