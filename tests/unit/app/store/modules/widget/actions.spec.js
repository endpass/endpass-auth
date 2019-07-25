import { METHODS, WALLET_TYPES, WIDGET_RESIZE_DURATION } from '@/constants';
import widgetActions from '@/store/modules/widget/actions';
import { hdv3, v3KeyStore, accountAddress } from '@unitFixtures/accounts';

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  sendAndWaitResponse: jest.fn(),
  send: jest.fn(),
}));

/* eslint-disable-next-line */
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

describe('widget actions', () => {
  let dispatch;
  let commit;

  beforeEach(() => {
    jest.clearAllMocks();

    dispatch = jest.fn();
    commit = jest.fn();
  });

  describe('initWidget', () => {
    it('should send init message and await response, then set mobile mode and position from request', async () => {
      const position = {
        top: '10px',
        left: '10px',
      };

      bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({
        isMobile: false,
        position,
      });

      await widgetActions.initWidget({ commit });

      expect(commit).toHaveBeenNthCalledWith(1, 'setMobileModeStatus', false);
      expect(commit).toHaveBeenNthCalledWith(2, 'setWidgetPosition', position);
    });
  });

  describe('openWidget', () => {
    it('should send and await open request and dispatch fit action', async () => {
      expect.assertions(2);

      await widgetActions.openWidget({ dispatch }, { widgetNode: 'foo' });

      expect(bridgeMessenger.sendAndWaitResponse).toBeCalledWith(
        METHODS.WIDGET_OPEN,
        {
          root: false,
        },
      );
      expect(dispatch).toBeCalledWith('fitWidget', 'foo');
    });
  });

  describe('closeWidget', () => {
    it('should send and await open request and dispatch fit action', async () => {
      expect.assertions(2);

      await widgetActions.closeWidget({ dispatch }, 'foo');

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.WIDGET_CLOSE);
      expect(dispatch).toBeCalledWith('fitWidget', 'foo');
    });
  });

  describe('openAccounts', () => {
    it('should open widget and then fit it', async () => {
      expect.assertions(1);

      await widgetActions.openAccounts({ dispatch }, 'foo');

      expect(dispatch).toHaveBeenNthCalledWith(1, 'openWidget', {
        widgetNode: 'foo',
      });
    });
  });

  describe('closeAccounts', () => {
    it('should just dispatch fit widget action', async () => {
      expect.assertions(1);

      await widgetActions.closeAccounts({ dispatch }, 'foo');

      expect(dispatch).toBeCalledWith('fitWidget', 'foo');
    });
  });

  describe('fitWidget', () => {
    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should send resize message to the bridge', async () => {
      expect.assertions(1);

      jest.useFakeTimers();

      await widgetActions.fitWidget(null, {
        clientHeight: 500,
      });

      jest.advanceTimersByTime(WIDGET_RESIZE_DURATION * 2);

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.WIDGET_FIT, {
        height: 500,
      });
    });
  });

  describe('unmountWidget', () => {
    it('should request widget unmounting', async () => {
      await widgetActions.unmountWidget();

      expect(bridgeMessenger.send).toBeCalledWith(METHODS.WIDGET_UNMOUNT);
    });
  });

  describe('createAccountFromWidget', () => {
    it('should create new wallet by given password and address', async () => {
      expect.assertions(8);

      const wallet = {
        v3KeystoreChildWallet: {
          address: '0x0',
        },
      };

      dispatch.mockResolvedValueOnce(true);
      dispatch.mockResolvedValueOnce(wallet);

      await widgetActions.createAccountFromWidget(
        { dispatch, commit },
        { address: accountAddress, password: 'pwd' },
      );

      expect(commit).toBeCalledTimes(3);
      expect(commit).toHaveBeenNthCalledWith(1, 'setWidgetLoadingStatus', true);
      expect(commit).toHaveBeenNthCalledWith(2, 'addAccount', {
        address: wallet.v3KeystoreChildWallet.address,
        type: WALLET_TYPES.STANDARD,
        index: 0,
      });
      expect(commit).toHaveBeenNthCalledWith(
        3,
        'setWidgetLoadingStatus',
        false,
      );
      expect(dispatch).toBeCalledTimes(3);
      expect(dispatch).toHaveBeenNthCalledWith(1, 'validatePassword', {
        address: accountAddress,
        password: 'pwd',
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, 'createNewWallet', {
        password: 'pwd',
      });
      expect(dispatch).toHaveBeenNthCalledWith(3, 'updateSettings', {
        lastActiveAccount: wallet.v3KeystoreChildWallet.address,
      });
    });

    it('should throw error if something went wrong', async () => {
      expect.assertions(5);

      const error = new Error('foo');

      dispatch.mockRejectedValueOnce(error);

      try {
        await widgetActions.createAccountFromWidget(
          { dispatch, commit },
          { address: accountAddress, password: 'pwd' },
        );
      } catch (err) {
        expect(err).toBe(error);
        expect(dispatch).toBeCalledTimes(1);
        expect(commit).toBeCalledTimes(2);
        expect(commit).toHaveBeenNthCalledWith(
          1,
          'setWidgetLoadingStatus',
          true,
        );
        expect(commit).toHaveBeenNthCalledWith(
          2,
          'setWidgetLoadingStatus',
          false,
        );
      }
    });
  });
});
