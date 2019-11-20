// @ts-check
import EventEmitter from '@endpass/class/EventEmitter';

const EXPIRE_COOKIE_TIME_KEY = 'endpass--expired-time';
const EXPIRE_CHECK_TIMEOUT = 2000;

const EVENT_COOKIE_EXPIRED = 'cookie-expire';

export default class CookieExpire {
  constructor() {
    this.intervalId = undefined;
    this.emitter = new EventEmitter();
  }

  /**
   * @param {CallableFunction} cb
   */
  onExpire(cb) {
    this.emitter.on(EVENT_COOKIE_EXPIRED, cb);
  }

  /**
   * @param {number} expireAt
   */
  updateExpireAt(expireAt = 0) {
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
      const storedExpire = storedValue ? Number(storedValue[2]) || 0 : null;

      const now = new Date().getTime();
      if (!storedExpire || now > storedExpire) {
        this.stopChecking();
        this.emitter.emit(EVENT_COOKIE_EXPIRED);
      }
    }, EXPIRE_CHECK_TIMEOUT);
  }

  stopChecking() {
    window.clearInterval(this.intervalId);
  }
}
