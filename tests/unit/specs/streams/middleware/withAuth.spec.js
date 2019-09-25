import withAuth from '@/streams/middleware/withAuth';
import { authChannel } from '@/class/singleton/channels';
import router from '@/router';
import Answer from '@/class/Answer';
import identityService from '@/service/identity';

jest.mock('@/class/singleton/channels', () => ({
  authChannel: {
    take: jest.fn(),
    put: jest.fn(),
  },
}));

describe('withAuth', () => {
  const options = {
    needAuth: true,
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

  it('should redirect to auth', async () => {
    expect.assertions(2);

    identityService.getAuthStatus.mockResolvedValueOnce(400);
    authChannel.take = jest.fn().mockResolvedValue({ status: true });

    await withAuth(options, action);

    expect(action.end).not.toBeCalled();
    expect(router.replace).toBeCalledWith(
      '/auth',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should redirect to auth and end stream', async () => {
    expect.assertions(3);

    identityService.getAuthStatus.mockResolvedValueOnce(400);

    authChannel.take = jest.fn().mockResolvedValue(Answer.createFail());

    await withAuth(options, action);

    expect(action.end).toBeCalled();
    expect(action.req.answer).toBeCalledWith(Answer.createFail());
    expect(router.replace).toBeCalledWith(
      '/auth',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should not redirect to auth', async () => {
    expect.assertions(3);

    identityService.getAuthStatus.mockResolvedValueOnce(200);
    authChannel.take = jest.fn().mockResolvedValue();

    await withAuth(options);

    expect(authChannel.take).not.toBeCalled();
    expect(authChannel.put).toBeCalledWith(Answer.createOk());
    expect(router.replace).not.toBeCalled();
  });
});
