import MockAdapter from 'axios-mock-adapter';
import {
  successResponse,
  errorResponse,
  getRecoveryIdentifierResponse,
} from '@unitFixtures/services/identity';
import http from '@/class/singleton/request/http';
import { AUTH_STATUS_CODE, CHALLENGE_TYPES } from '@/constants';

const authService = require.requireActual('@/service/auth').default;

jest.mock('@/store', () => ({
  dispatch: jest.fn(), // mock store for http module
}));

describe('auth service', () => {
  const axiosMock = new MockAdapter(http);
  const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

  afterEach(() => {
    axiosMock.reset();
  });

  describe('getRecoveryIdentifier', () => {
    const email = 'email+test@email.com';
    const url = `${identityBaseUrl}/auth/recover?email=${encodeURIComponent(
      email,
    )}`;

    it('should make correct request', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(config => {
        expect(config.url).toBe(url);

        return [200, getRecoveryIdentifierResponse];
      });

      await authService.getRecoveryIdentifier(email);
    });

    it('should handle successfull GET /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, getRecoveryIdentifierResponse);

      const received = await authService.getRecoveryIdentifier(email);

      expect(received).toEqual(getRecoveryIdentifierResponse.message);
    });

    it('should handle successfull GET /auth/recover request with error message', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, errorResponse);

      await expect(authService.getRecoveryIdentifier(email)).rejects.toThrow(
        expect.any(Error),
      );
    });

    it('should handle rejected GET /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(500);

      await expect(authService.getRecoveryIdentifier(email)).rejects.toThrow(
        expect.any(Error),
      );
    });
  });

  describe('recover', () => {
    const email = 'email+test@email.com';
    const code = '123123';
    const url = `${identityBaseUrl}/auth/recover`;

    it('should make correct request', async () => {
      expect.assertions(2);

      axiosMock.onPost(url).reply(config => {
        expect(config.url).toBe(url);
        expect(config.data).toBe(JSON.stringify({ email, code }));

        return [200, getRecoveryIdentifierResponse];
      });

      await authService.disableOtpViaSms({ email, code });
    });

    it('should handle successfull POST /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(200, successResponse);

      const received = await authService.disableOtpViaSms({
        email,
        code,
      });

      expect(received).toEqual(successResponse);
    });

    it('should handle successfull POST /auth/recover request with error message', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, errorResponse);

      await expect(
        authService.disableOtpViaSms({ email, code }),
      ).rejects.toThrow(expect.any(Error));
    });

    it('should handle rejected POST /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(500);

      await expect(
        authService.disableOtpViaSms({ email, code }),
      ).rejects.toThrow(expect.any(Error));
    });
  });

  describe('getAuthStatus', () => {
    const url = `${identityBaseUrl}/auth/check`;

    it('should return 200 OK', async () => {
      expect.assertions(1);
      const expiresAt = 123;
      const hash = 'hash';

      axiosMock.onGet(url).reply(200, { expiresAt, hash });
      const res = await authService.getAuthStatus();

      expect(res).toEqual({
        status: AUTH_STATUS_CODE.LOGGED_IN,
        hash,
        expiresAt,
      });
    });

    it('should return not failed result ', async () => {
      expect.assertions(1);

      const hash = 'hash';
      const expiresAt = 123;

      axiosMock.onGet(url).reply(444, {
        hash,
        expiresAt,
      });
      const res = await authService.getAuthStatus();

      expect(res).toEqual({
        status: AUTH_STATUS_CODE.NOT_LOGGED,
        hash,
        expiresAt,
      });
    });

    it('should return failed result ', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(401);
      const res = await authService.getAuthStatus();

      expect(res).toEqual({
        status: AUTH_STATUS_CODE.NOT_LOGGED,
        hash: '',
        expiresAt: 0,
      });
    });
  });

  describe('authWithGoogle', () => {
    const url = `${identityBaseUrl}/auth/google`;
    const token = '123';

    it('should return 200 OK', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(200, {
        success: true,
        challenge: {
          challengeType: 'otp',
        },
      });
      const res = await authService.authWithGoogle(token);

      expect(res).toEqual({
        success: true,
        challenge: {
          challengeType: CHALLENGE_TYPES.APP_OTP,
        },
      });
    });

    it('should throw error on invalid request', async () => {
      expect.assertions(1);
      const message = 'Incorrect request';

      axiosMock.onPost(url).reply(500, {
        message,
      });

      try {
        await authService.authWithGoogle(token);
      } catch (e) {
        expect(e.message).toBe(message);
      }
    });
  });

  describe('authWithGithub', () => {
    const url = `${identityBaseUrl}/auth/github`;
    const code = '123';

    it('should return 200 OK for app otp', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(200, {
        success: true,
        challenge: {
          challengeType: 'otp',
        },
      });
      const res = await authService.authWithGitHub(code);

      expect(res).toEqual({
        success: true,
        challenge: {
          challengeType: CHALLENGE_TYPES.APP_OTP,
        },
      });
    });

    it('should return 200 OK for sms otp', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(200, {
        success: true,
        challenge: {
          challengeType: 'sms',
        },
      });
      const res = await authService.authWithGitHub(code);

      expect(res).toEqual({
        success: true,
        challenge: {
          challengeType: CHALLENGE_TYPES.SMS_OTP,
        },
      });
    });

    it('should throw error on invalid request', async () => {
      expect.assertions(1);
      const message = 'Incorrect request';

      axiosMock.onPost(url).reply(500, {
        message,
      });

      try {
        await authService.authWithGitHub(code);
      } catch (e) {
        expect(e.message).toBe(message);
      }
    });
  });
});
