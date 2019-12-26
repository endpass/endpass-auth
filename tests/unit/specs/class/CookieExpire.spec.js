import CookieExpireChecker from '@/class/CookieExpireChecker';

jest.useFakeTimers();

describe('CookieExpireChecker class', () => {
  let handler;
  let cookieExpireChecker;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = jest.fn();
    cookieExpireChecker = new CookieExpireChecker();
    cookieExpireChecker.onExpire(handler);
  });

  const getUnixTime = () => {
    return new Date().getTime() / 1000;
  };

  const passTime = () => getUnixTime() + 10000;
  const expiredTime = () => getUnixTime() - 10000;

  it('should emit event with expired time', () => {
    expect(handler).not.toBeCalled();

    cookieExpireChecker.setExpireAt(expiredTime());
    cookieExpireChecker.startChecking();

    jest.runOnlyPendingTimers();

    expect(handler).toBeCalledTimes(1);
  });

  it('should not emit event if time not expired', () => {
    cookieExpireChecker.setExpireAt(passTime());
    cookieExpireChecker.startChecking();

    jest.runOnlyPendingTimers();

    expect(handler).not.toBeCalled();
  });

  it('should emit event after set expired time', () => {
    cookieExpireChecker.setExpireAt(passTime());
    cookieExpireChecker.startChecking();

    jest.runOnlyPendingTimers();

    expect(handler).not.toBeCalled();

    cookieExpireChecker.setExpireAt(expiredTime());

    jest.advanceTimersByTime(1000000);

    expect(handler).toBeCalled();
    expect(handler).toBeCalledTimes(1);
  });

  it('should pass checking and stop checking after', () => {
    cookieExpireChecker.setExpireAt(passTime());
    cookieExpireChecker.startChecking();

    jest.runOnlyPendingTimers();

    expect(handler).not.toBeCalled();

    cookieExpireChecker.stopChecking();
    cookieExpireChecker.setExpireAt(expiredTime());

    jest.runOnlyPendingTimers();

    expect(handler).not.toBeCalled();
  });
});
