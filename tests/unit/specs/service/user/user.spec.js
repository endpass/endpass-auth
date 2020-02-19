import MockAdapter from 'axios-mock-adapter';
import http from '@/class/singleton/request/http';
import { CHALLENGE_TYPES } from '@/constants';

const userService = require.requireActual('@/service/user').default;

jest.mock('@/store', () => ({
  dispatch: jest.fn(), // mock store for http module
}));

describe('auth service', () => {
  const axiosMock = new MockAdapter(http);
  const identityBaseUrl = ENV.VUE_APP_IDENTITY_API_URL;

  afterEach(() => {
    axiosMock.reset();
  });

  describe('settings', () => {
    const url = `${identityBaseUrl}/settings`;

    it('should return sms otp', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, {
        smsCodeEnabled: true,
        otpEnabled: true,
      });
      const res = await userService.getSettings();

      expect(res).toEqual({
        smsCodeEnabled: true,
        otpEnabled: true,
        challengeType: CHALLENGE_TYPES.SMS_OTP,
      });
    });

    it('should return app otp', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, {
        otpEnabled: true,
      });
      const res = await userService.getSettings();

      expect(res).toEqual({
        otpEnabled: true,
        challengeType: CHALLENGE_TYPES.APP_OTP,
      });
    });

    it('should throw error on invalid request', async () => {
      expect.assertions(1);
      const message = 'Incorrect request';

      axiosMock.onGet(url).reply(500, {
        message,
      });

      try {
        await userService.getSettings();
      } catch (e) {
        expect(e.message).toBe('Request failed with status code 500');
      }
    });
  });

  describe('without permission settings', () => {
    const url = `${identityBaseUrl}/settings`;

    it('should return sms otp', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, {
        smsCodeEnabled: true,
        otpEnabled: true,
      });
      const res = await userService.getSettingsSkipPermission();

      expect(res).toEqual({
        smsCodeEnabled: true,
        otpEnabled: true,
        challengeType: CHALLENGE_TYPES.SMS_OTP,
      });
    });

    it('should return app otp', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, {
        otpEnabled: true,
      });
      const res = await userService.getSettingsSkipPermission();

      expect(res).toEqual({
        otpEnabled: true,
        challengeType: CHALLENGE_TYPES.APP_OTP,
      });
    });

    it('should throw error on invalid request', async () => {
      expect.assertions(1);
      const message = 'Incorrect request';

      axiosMock.onGet(url).reply(500, {
        message,
      });

      try {
        await userService.getSettingsSkipPermission();
      } catch (e) {
        expect(e.message).toBe('Request failed with status code 500');
      }
    });
  });
});
