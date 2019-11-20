import CookieExpire from '@/class/CookieExpire';

jest.useFakeTimers();

describe('CookieExpire class', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getUnixTime = () => {
    return new Date().getTime() / 1000;
  };

  const passTime = () => getUnixTime() + 10000;
  const expiredTime = () => getUnixTime() - 10000;

  it('should emit event with expired time', () => {
    const handler = jest.fn();
    const cookieExpire = new CookieExpire();
    cookieExpire.onExpire(handler);

    expect(handler).not.toBeCalled();

    cookieExpire.updateExpireAt(expiredTime());
    cookieExpire.startChecking();

    jest.runOnlyPendingTimers();

    expect(handler).toBeCalledTimes(1);
  });

  it('should emit event after set expired time', () => {
    const handler = jest.fn();
    const cookieExpire = new CookieExpire();
    cookieExpire.onExpire(handler);

    cookieExpire.updateExpireAt(passTime());
    cookieExpire.startChecking();

    expect(handler).not.toBeCalled();

    jest.runOnlyPendingTimers();

    cookieExpire.updateExpireAt(expiredTime());

    jest.advanceTimersByTime(1000000);

    expect(handler).toBeCalledTimes(1);
  });

  it('should stop checking', () => {
    const handler = jest.fn();
    const cookieExpire = new CookieExpire();
    cookieExpire.onExpire(handler);

    cookieExpire.updateExpireAt(passTime());
    cookieExpire.startChecking();

    jest.runOnlyPendingTimers();

    cookieExpire.stopChecking();
    cookieExpire.updateExpireAt(expiredTime());

    jest.runOnlyPendingTimers();

    expect(handler).not.toBeCalled();
  });
});
