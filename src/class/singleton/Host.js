import { parseUrl } from '@/util/dom';

const DEFAULT_ORIGIN = parseUrl(document.referrer).origin;

class Host {
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

export { Host };

export default new Host();
