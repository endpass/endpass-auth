import CheckController from '@/components/screens/WalletExistCheck/CheckController';
import identityService from '@/service/identity';
import { walletChannel } from '@/class/singleton/channels';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';

describe('CheckController', () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = CheckController();
  });

  it('should return true is exist', async () => {
    expect.assertions(1);

    identityService.checkAccountExist.mockResolvedValue(true);

    const isExist = await controller.checkAccountExist();

    expect(isExist).toBe(true);
  });

  it('should return false is exist', async () => {
    expect.assertions(1);

    identityService.checkAccountExist.mockResolvedValueOnce(false);

    const isExist = await controller.checkAccountExist();

    expect(isExist).toBe(false);
  });

  it('should cancel checking', async () => {
    expect.assertions(1);

    bridgeMessenger.sendAndWaitResponse.mockResolvedValueOnce({});
    const handler = jest.fn();
    walletChannel.take().then(handler);

    await controller.cancelCheck();

    expect(handler).toBeCalledWith({
      status: false,
      code: undefined,
      error: undefined,
    });
  });

  it('should set exist', async () => {
    expect.assertions(1);

    const handler = jest.fn();
    walletChannel.take().then(handler);
    const isExist = false;

    await controller.setExist(isExist);

    expect(handler).toBeCalledWith({
      status: true,
      payload: { isExist },
    });
  });
});
