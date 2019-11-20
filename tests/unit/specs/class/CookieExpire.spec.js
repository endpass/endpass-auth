import CookieExpireChecker from '@/class/CookieExpireChecker';

jest.useFakeTimers();

describe('CookieExpireChecker class', () => {
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
    const cookieExpireChecker = new CookieExpireChecker();
    cookieExpireChecker.onExpire(handler);

    expect(handler).not.toBeCalled();

    cookieExpireChecker.setExpireAt(expiredTime());
    cookieExpireChecker.startChecking();

    jest.runOnlyPendingTimers();

    expect(handler).toBeCalledTimes(1);
  });

  it('should emit event after set expired time', () => {
    const handler = jest.fn();
    const cookieExpireChecker = new CookieExpireChecker();
    cookieExpireChecker.onExpire(handler);

    cookieExpireChecker.setExpireAt(passTime());
    cookieExpireChecker.startChecking();

    expect(handler).not.toBeCalled();

    jest.runOnlyPendingTimers();

    cookieExpireChecker.setExpireAt(expiredTime());

    jest.advanceTimersByTime(1000000);

    expect(handler).toBeCalledTimes(1);
  });

  it('should stop checking', () => {
    const handler = jest.fn();
    const cookieExpireChecker = new CookieExpireChecker();
    cookieExpireChecker.onExpire(handler);

    cookieExpireChecker.setExpireAt(passTime());
    cookieExpireChecker.startChecking();

    jest.runOnlyPendingTimers();

    cookieExpireChecker.stopChecking();
    cookieExpireChecker.setExpireAt(expiredTime());

    jest.runOnlyPendingTimers();

    expect(handler).not.toBeCalled();
  });
});
