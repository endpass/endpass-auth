import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  successResponse,
  errorResponse,
  getRecoveryIdentifierResponse,
} from '@unitFixtures/services/identity';
import identityService from '../../../../src/service/identity';

jest.unmock('@/service/identity');

describe('identity service', () => {
  const axiosMock = new MockAdapter(axios);
  const { url: identityBaseUrl } = ENV.identity;

  afterEach(() => {
    axiosMock.reset();
  });

  describe('getRecoveryIdentifier', () => {
    const email = 'email+test@email.com';
    const url = `${identityBaseUrl}/api/v1.1/auth/recover?email=${encodeURIComponent(email)}`;

    it('should make correct request', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(config => {
        expect(config.url).toBe(url);

        return [200, getRecoveryIdentifierResponse];
      });

      await identityService.getRecoveryIdentifier(email);
    });

    it('should handle successfull GET /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, getRecoveryIdentifierResponse);

      const received = await identityService.getRecoveryIdentifier(email);

      expect(received).toEqual(getRecoveryIdentifierResponse.message);
    });

    it('should handle successfull GET /auth/recover request with error message', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, errorResponse);

      await expect(
        identityService.getRecoveryIdentifier(email),
      ).rejects.toThrow(expect.any(Error));
    });

    it('should handle rejected GET /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(500);

      await expect(
        identityService.getRecoveryIdentifier(email),
      ).rejects.toThrow(expect.any(Error));
    });
  });

  describe('recover', () => {
    const email = 'email+test@email.com';
    const signature = 'signature';
    const url = `${identityBaseUrl}/api/v1.1/auth/recover`;

    it('should make correct request', async () => {
      expect.assertions(2);

      axiosMock.onPost(url).reply(config => {
        expect(config.url).toBe(url);
        expect(config.data).toBe(JSON.stringify({ email, signature }));

        return [200, getRecoveryIdentifierResponse];
      });

      await identityService.recover(email, signature);
    });

    it('should handle successfull POST /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(200, successResponse);

      const received = await identityService.recover(email, signature);

      expect(received).toEqual(successResponse);
    });

    it('should handle successfull POST /auth/recover request with error message', async () => {
      expect.assertions(1);

      axiosMock.onGet(url).reply(200, errorResponse);

      await expect(
        identityService.recover(email, signature),
      ).rejects.toThrow(expect.any(Error));
    });

    it('should handle rejected POST /auth/recover request', async () => {
      expect.assertions(1);

      axiosMock.onPost(url).reply(500);

      await expect(
        identityService.recover(email, signature),
      ).rejects.toThrow(expect.any(Error));
    });
  });
});
