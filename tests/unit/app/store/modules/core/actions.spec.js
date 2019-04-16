import coreActions from '@/store/modules/core/actions';

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
});
