import { parseUrl } from '@/util/dom';
import Host from '@/class/Host';

const DEFAULT_ORIGIN = parseUrl(document.referrer).origin;

describe('Host', () => {
  const checkUrl = 'http://check.url';
  let host;

  beforeEach(() => {
    host = new Host();
  });

  it('should use default host', () => {
    expect(host.origin).toBe(DEFAULT_ORIGIN);
  });

  it('should use default host is set undefined', () => {
    host.origin = undefined;

    expect(host.origin).toBe(DEFAULT_ORIGIN);
  });

  it('should change origin', () => {
    host.origin = checkUrl;

    expect(host.origin).toBe(checkUrl);
  });

  it('should not change origin after first define', () => {
    host.origin = checkUrl;

    expect(host.origin).toBe(checkUrl);

    host.origin = 'http://next.url';

    expect(host.origin).toBe(checkUrl);
  });
});
