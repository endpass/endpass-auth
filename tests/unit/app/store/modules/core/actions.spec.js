import { web3 } from '@/class/singleton';
import coreActions from '@/store/modules/core/actions';
import { Network } from '@endpass/class';

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
      expect.assertions(3);

      await coreActions.init({
        commit,
        dispatch,
      });

      expect(dispatch).toBeCalledWith('defineOnlyV3Accounts');
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
});
