// @ts-check

import { parseUrl } from '@/util/dom';

/**
 * @typedef { (origin: string) => void } Callback
 */

export default class Host {
  constructor() {
    /** @type {string} */
    this.value = '';

    /** @type {Callback[]} */
    this.subscribers = [];
  }

  set origin(value) {
    if (Object.isFrozen(this)) return;

    const defineValue = value || document.referrer;
    this.value = parseUrl(defineValue).origin;

    this.subscribers.forEach(cb => {
      cb(this.value);
    });

    Object.freeze(this);
  }

  get origin() {
    return this.value;
  }

  /**
   * @param {Callback} cb
   */
  subscribe(cb) {
    this.subscribers.push(cb);
  }
}
