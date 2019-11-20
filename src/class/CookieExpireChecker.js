// @ts-check
import EventEmitter from '@endpass/class/EventEmitter';

const EXPIRE_COOKIE_TIME_KEY = 'endpass-expired-time';
const EXPIRE_CHECK_TIMEOUT = 2000;

const EVENT_COOKIE_EXPIRED = 'cookie-expire';

export default class CookieExpireChecker {
  constructor() {
    this.intervalId = undefined;
    this.emitter = new EventEmitter();
  }

  /**
   * @param {Function} cb
   */
  onExpire(cb) {
    this.emitter.on(EVENT_COOKIE_EXPIRED, cb);
  }

  /**
   * @param {number} expireAt
   */
  setExpireAt(expireAt) {
    const value = expireAt * 1000;
    document.cookie = `${EXPIRE_COOKIE_TIME_KEY}=${value}`;
  }

  startChecking() {
    if (this.intervalId) {
      return;
    }
    this.intervalId = window.setInterval(() => {
      const storedValue = document.cookie.match(
        `(^|;) ?${EXPIRE_COOKIE_TIME_KEY}=([^;]*)(;|$)`,
      );
      const storedExpireAt = storedValue ? Number(storedValue[2]) || 0 : null;

      const now = new Date().getTime();
      if (!storedExpireAt || now > storedExpireAt) {
        this.stopChecking();
        this.emitter.emit(EVENT_COOKIE_EXPIRED);
      }
    }, EXPIRE_CHECK_TIMEOUT);
  }

  stopChecking() {
    window.clearInterval(this.intervalId);
  }
}
