import { web3 } from '@/class/singleton';
import coreActions from '@/store/modules/core/actions';
import { Network, CrossWindowMessenger } from '@endpass/class';

describe('core actions', () => {
  let dispatch;
  let commit;

  beforeEach(() => {
    jest.clearAllMocks();

    dispatch = jest.fn();
    commit = jest.fn();
  });

  describe('init', () => {
    it('should requests accounts and change init status', async () => {
      expect.assertions(5);

      const router = {};
      await coreActions.init({
        commit,
        dispatch,
      }, router);

      expect(dispatch).toBeCalledWith('defineOnlyV3Accounts');
      expect(dispatch).toBeCalledWith('subscribeOnDialog', router);
      expect(dispatch).toBeCalledWith('subscribeOnBridge');
      expect(dispatch).toBeCalledWith('startBridge');
      expect(commit).toBeCalledWith('changeInitStatus', true);
    });
  });

  describe('setWeb3NetworkProvider', () => {
    it('should create provider with given network id', async () => {
      await coreActions.setWeb3NetworkProvider(null, 1);

      expect(web3.providers.HttpProvider).toBeCalledWith(
        Network.NETWORK_URL_HTTP[Network.NET_ID.MAIN][0],
      );
      expect(web3.setProvider).toBeCalled();
    });
  });

  describe('subscribeOnBridge', () => {
    it('should subscribe and start', () => {
      jest.spyOn(CrossWindowMessenger.prototype, 'subscribe');

      coreActions.subscribeOnBridge({
        commit,
        dispatch,
      });

      expect(CrossWindowMessenger.prototype.subscribe).toBeCalledTimes(6);
    });
  });

  describe('subscribeOnDialog', () => {
    it('should subscribe and setup', () => {
      jest.spyOn(CrossWindowMessenger.prototype, 'subscribe');

      coreActions.subscribeOnDialog({
        dispatch,
      });

      expect(CrossWindowMessenger.prototype.subscribe).toBeCalledTimes(2);
    });
  });
});
