import { parseUrl } from '@/util/dom';

const DEFAULT_ORIGIN = parseUrl(document.referrer).origin;

export default class Host {
  constructor() {
    this.value = DEFAULT_ORIGIN;
  }

  set origin(value) {
    if (Object.isFrozen(this)) return;

    const defineValue = value || DEFAULT_ORIGIN;
    this.value = parseUrl(defineValue).origin;

    Object.freeze(this);
  }

  get origin() {
    return this.value;
  }
}
