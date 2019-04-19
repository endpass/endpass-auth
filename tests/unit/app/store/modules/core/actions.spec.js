import { METHODS } from '@/constants';
import coreActions from '@/store/modules/core/actions';

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  send: jest.fn(),
  sendAndWaitResponse: jest.fn(),
  subscribe: jest.fn(),
}));
jest.mock('@/streams', () => ({
  applyDialogStream: jest.fn(),
}));

/* eslint-disable */
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { applyDialogStream } from '@/streams';
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
        source: 'dialog',
      });
    });

    it('should create broadcast subscribtion and sent ready message to the bridge', async () => {
      expect.assertions(2);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.READY_STATE_BRIDGE);
      expect(bridgeMessenger.subscribe).toBeCalledWith(
        METHODS.BROADCAST,
        expect.any(Function),
      );
    });

    it('should change indentity mode if it is defined', async () => {
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(commit).toBeCalledWith('changeIdentityMode', true);
    });

    it('should apply dialog stream if init message have return source proprty equals to dialog', async () => {
      expect.assertions(1);

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(applyDialogStream).toBeCalled();
    });

    it('should not do anything if called is not in dialog', async () => {
      expect.assertions(6);

      getters.isDialog = false;

      await coreActions.startBridge({ dispatch, commit, getters });

      expect(bridgeMessenger.sendAndWaitResponse).not.toBeCalled();
      expect(bridgeMessenger.send).not.toBeCalled();
      expect(bridgeMessenger.subscribe).not.toBeCalled();
      expect(dispatch).not.toBeCalled();
      expect(commit).not.toBeCalled();
      expect(applyDialogStream).not.toBeCalled();
    });
  });
});
