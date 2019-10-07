import withWallet from '@/streams/middleware/withWallet';
import { walletChannel } from '@/class/singleton/channels';
import router from '@/router';
import Answer from '@/class/Answer';
import identityService from '@/service/identity';

jest.mock('@/class/singleton/channels', () => ({
  walletChannel: {
    take: jest.fn(),
    put: jest.fn(),
  },
}));

describe('withWallet', () => {
  const options = {
    needWallet: true,
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

  it('should not any redirection, skip any routing', async () => {
    expect.assertions(2);
    identityService.checkAccountExist.mockResolvedValueOnce(true);
    walletChannel.take = jest.fn().mockResolvedValue({ status: true });

    await withWallet(options, action);

    expect(action.end).not.toBeCalled();
    expect(router.replace).not.toBeCalled();
  });

  it('should redirect to create wallet', async () => {
    expect.assertions(3);
    identityService.checkAccountExist.mockResolvedValueOnce(false);
    walletChannel.take = jest.fn().mockResolvedValue({ status: true });

    await withWallet(options, action);

    expect(action.end).not.toBeCalled();
    expect(router.replace).toBeCalledTimes(1);
    expect(router.replace).toBeCalledWith(
      '/wallet-create',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should redirect to create wallet and end stream', async () => {
    expect.assertions(4);

    identityService.checkAccountExist.mockResolvedValueOnce(false);
    walletChannel.take = jest.fn().mockResolvedValue(Answer.createFail());

    await withWallet(options, action);

    expect(action.end).toBeCalled();
    expect(action.req.answer).toBeCalledWith(Answer.createFail());
    expect(router.replace).toBeCalledTimes(1);
    expect(router.replace).toBeCalledWith(
      '/wallet-create',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should redirect to check exist and finish stream', async () => {
    expect.assertions(4);

    identityService.checkAccountExist.mockRejectedValueOnce('error');
    walletChannel.take = jest.fn().mockResolvedValue(Answer.createFail());

    await withWallet(options, action);

    expect(action.end).toBeCalled();
    expect(action.req.answer).toBeCalledWith(Answer.createFail());
    expect(router.replace).toBeCalledTimes(1);
    expect(router.replace).toBeCalledWith(
      '/wallet-create/error',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should redirect to check exist and skip', async () => {
    expect.assertions(3);

    identityService.checkAccountExist.mockRejectedValueOnce('error');
    walletChannel.take = jest
      .fn()
      .mockResolvedValue(Answer.createOk({ isExist: true }));

    await withWallet(options);

    expect(action.end).not.toBeCalled();
    expect(router.replace).toBeCalledTimes(1);
    expect(router.replace).toBeCalledWith(
      '/wallet-create/error',
      expect.any(Function),
      expect.any(Function),
    );
  });
});
