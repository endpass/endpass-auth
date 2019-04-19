import withPermission from '@/streams/middleware/withPermission';
import { permissionChannel } from '@/class/singleton/channels';
import router from '@/router';
import store from '@/store';
import Answer from '@/class/Answer';

jest.mock('@/store', () => {
  return {
    dispatch: jest.fn(),
    getters: { demoData: false },
    state: {
      accounts: {
        isPermission: false,
        isLogin: true,
      },
    },
  };
});

jest.mock('@/class/singleton/channels', () => {
  return {
    permissionChannel: {
      take: jest.fn(),
      put: jest.fn(),
    },
  };
});

describe('withPermission', () => {
  const options = {
    needPermission: true,
  };

  let action;

  beforeEach(() => {
    jest.clearAllMocks();
    action = {
      end: jest.fn(),
      req: {
        answer: jest.fn(),
      },
    };
  });

  it('should redirect to permission', async () => {
    expect.assertions(2);

    store.state.accounts.isPermission = false;
    permissionChannel.take = jest.fn().mockResolvedValue({ status: true });

    await withPermission(options, action);

    expect(action.end).not.toBeCalled();
    expect(router.replace).toBeCalledWith(
      '/permission',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should redirect to permission and end stream', async () => {
    expect.assertions(3);

    store.state.accounts.isPermission = false;
    permissionChannel.take = jest.fn().mockResolvedValue(Answer.createFail());

    await withPermission(options, action);

    expect(action.end).toBeCalled();
    expect(action.req.answer).toBeCalledWith(Answer.createFail());
    expect(router.replace).toBeCalledWith(
      '/permission',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should not redirect to permission', async () => {
    expect.assertions(3);

    store.state.accounts.isPermission = true;
    permissionChannel.take = jest.fn().mockResolvedValue();

    await withPermission(options);

    expect(permissionChannel.take).not.toBeCalled();
    expect(permissionChannel.put).toBeCalledWith(Answer.createOk());
    expect(router.replace).not.toBeCalled();
  });

  it('should not redirect to permission with isLogin', async () => {
    expect.assertions(3);

    store.state.accounts.isPermission = false;
    store.state.accounts.isLogin = false;
    permissionChannel.take = jest.fn().mockResolvedValue();

    await withPermission(options);

    expect(permissionChannel.take).not.toBeCalled();
    expect(permissionChannel.put).toBeCalledWith(Answer.createOk());
    expect(router.replace).not.toBeCalled();
  });
});
