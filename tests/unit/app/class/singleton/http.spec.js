import MockAdapter from 'axios-mock-adapter';
import http from '@/class/singleton/http';
import store from '@/store';
import router from '@/router';

jest.mock('@/store', () => ({
  dispatch: jest.fn(),
  commit: jest.fn(),
}));

jest.useFakeTimers();

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

      jest.runOnlyPendingTimers();

      expect(router.replace).toBeCalledWith(
        '/public/error?error=You%20are%20banned!&error_description=You%20were%20banned%20by%20the%20administration',
      );
    });
  });

  describe('disable user', () => {
    it('should redirect to error page with disable message', async () => {
      expect.assertions(2);

      axiosMock.onGet(url).reply(config => {
        expect(config.url).toBe(url);

        return [410, 'ok'];
      });

      try {
        await http.get(url);
      } catch (e) {}

      jest.runOnlyPendingTimers();

      expect(router.replace).toBeCalledWith(
        '/public/error?error=Your%20account%20is%20disabled!&error_description=Your%20account%20was%20disabled%20by%20the%20Endpass%20administration',
      );
    });
  });

  describe('rate limit check', () => {
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
