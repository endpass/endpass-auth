// @ts-check

import { parseUrl } from '@/util/dom';

export default class Host {
  constructor() {
    /** @type {string} */
    this.value = '';
  }

  set origin(value) {
    if (Object.isFrozen(this)) return;

    const defineValue = value || document.referrer;
    this.value = parseUrl(defineValue).origin;

    Object.freeze(this);
  }

  get origin() {
    return this.value;
  }
}
