import withPermission from '@/streams/middleware/withPermission';
import { authChannel, permissionChannel } from '@/class/singleton/channels';
import router from '@/router';
import store from '@/store';
import Answer from '@/class/Answer';

jest.mock('@/store', () => {
  return {
    dispatch: jest.fn(),
    getters: { demoData: false },
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
    };
  });

  it('should redirect to permission', async () => {
    expect.assertions(2);

    store.dispatch = jest.fn().mockResolvedValue(403);
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
    expect.assertions(2);

    store.dispatch = jest.fn().mockResolvedValue(403);
    permissionChannel.take = jest.fn().mockResolvedValue({ status: false });

    await withPermission(options, action);

    expect(action.end).toBeCalled();
    expect(router.replace).toBeCalledWith(
      '/permission',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should not redirect to permission', async () => {
    expect.assertions(3);

    store.dispatch = jest.fn().mockResolvedValue(401);
    permissionChannel.take = jest.fn().mockResolvedValue();

    await withPermission(options);

    expect(permissionChannel.take).not.toBeCalled();
    expect(permissionChannel.put).toBeCalledWith(Answer.createOk());
    expect(router.replace).not.toBeCalled();
  });
});
