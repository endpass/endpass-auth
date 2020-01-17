import withPermission from '@/streams/middleware/withPermission';
import { permissionChannel } from '@/class/singleton/channels';
import router from '@/router';
import Answer from '@/class/Answer';
import authService from '@/service/auth';
import { AUTH_STATUS_CODE } from '@/constants';

jest.mock('@/class/singleton/channels', () => ({
  permissionChannel: {
    take: jest.fn(),
    put: jest.fn(),
  },
}));

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
    authService.getAuthStatus.mockResolvedValueOnce({
      status: AUTH_STATUS_CODE.NEED_PERMISSION,
    });
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

    authService.getAuthStatus.mockResolvedValueOnce({
      status: AUTH_STATUS_CODE.NEED_PERMISSION,
    });
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

    authService.getAuthStatus.mockResolvedValueOnce({
      status: AUTH_STATUS_CODE.LOGGED_IN,
    });
    permissionChannel.take = jest.fn().mockResolvedValue();

    await withPermission(options);

    expect(permissionChannel.take).not.toBeCalled();
    expect(permissionChannel.put).toBeCalledWith(Answer.createOk());
    expect(router.replace).not.toBeCalled();
  });

  it('should not redirect to permission with isLogin', async () => {
    expect.assertions(3);

    authService.getAuthStatus.mockResolvedValueOnce({
      status: AUTH_STATUS_CODE.LOGOUT,
    });
    permissionChannel.take = jest.fn().mockResolvedValue();

    await withPermission(options);

    expect(permissionChannel.take).not.toBeCalled();
    expect(permissionChannel.put).toBeCalledWith(Answer.createOk());
    expect(router.replace).not.toBeCalled();
  });
});
