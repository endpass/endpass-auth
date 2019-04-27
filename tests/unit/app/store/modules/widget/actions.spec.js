import { METHODS, WIDGET_RESIZE_DURATION } from '@/constants';
import widgetActions from '@/store/modules/widget/actions';

jest.mock('@/class/singleton/bridgeMessenger', () => ({
  sendAndWaitResponse: jest.fn(),
  send: jest.fn(),
}));

/* eslint-disable-next-line */
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

describe('widget actions', () => {
  let dispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    dispatch = jest.fn();
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
});
