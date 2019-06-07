import MockAdapter from 'axios-mock-adapter';
import http from '@/class/singleton/http';
import store from '@/store';

jest.mock('@/store', () => ({
  dispatch: jest.fn(),
  commit: jest.fn(),
}));

describe('http', () => {
  const axiosMock = new MockAdapter(http);

  beforeAll(() => {
    window.history.replaceState = jest.fn();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  const url = 'check/check';

  describe('ban user', () => {
    it('should redirect to error page with banned message', async () => {
      expect.assertions(2);

      axiosMock.onGet(url).reply(config => {
        expect(config.url).toBe(url);

        return [423, 'ok'];
      });

      try {
        await http.get(url);
      } catch (e) {}

      expect(window.history.replaceState).toBeCalledWith(
        {},
        '',
        '/public/error?error=You%20are%20banned!&error_description=You%20were%20banned%20by%20the%20administration',
      );
    });
  });

  describe.skip('rate limit check', () => {
    it('should not start rate limit', async () => {
      expect.assertions(2);

      axiosMock.onGet(url).reply(config => {
        expect(config.url).toBe(url);

        return [200, 'ok'];
      });

      await http.get(url);

      expect(store.dispatch).not.toBeCalled();
    });

    it('should start rate limit', async () => {
      expect.assertions(2);

      axiosMock.onGet(url).reply(config => {
        expect(config.url).toBe(url);

        return [429, 'ok'];
      });

      try {
        await http.get(url);
      } catch (e) {}

      expect(store.commit).toBeCalledWith('setRateLimitTimeout', 59);
    });
  });
});
